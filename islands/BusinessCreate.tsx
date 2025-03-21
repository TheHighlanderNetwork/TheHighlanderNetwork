/** @jsxImportSource preact */
"use client";
import { useEffect, useState } from "preact/hooks";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../utils/firebase.ts";

export default function BusinessCreateForm() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
  });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [logo, setLogo] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: User | null) => {
        setUser(firebaseUser);
      },
    );

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error fetching location:", error),
        { enableHighAccuracy: true },
      );
    }

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleLogoUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      const file = target.files[0];
      setLogo(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);
      setImages([...images, ...files.map((file) => URL.createObjectURL(file))]);
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!user) {
      setStatus("User not authenticated");
      return;
    }

    //Convert location to Firestore GeoPoint format
    const finalLocation = location
      ? { latitude: location.lat, longitude: location.lng }
      : { latitude: 0, longitude: 0 };

    try {
      const response = await fetch("/api/createBusiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          name: formData.businessName,
          location: finalLocation,
          description: formData.description,
          images,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("Business created successfully!");
        setFormData({ businessName: "", description: "" });
        setLogo(null);
        setImages([]);
      } else {
        throw new Error(data.error || "Unknown error occurred.");
      }
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : "Unexpected error"}`,
      );
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <p className="text-red-500 text-lg font-semibold">
          You must be logged in to create a business.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full">
      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-2xl pb-10">
        <h2 className="text-2xl font-bold mb-6">Business Creation</h2>

        {status && <p className="text-center text-lg font-medium">{status}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div className="w-24 h-24 border-2 border-gray-300 flex items-center justify-center rounded-full">
                {logo
                  ? (
                    <img
                      src={logo}
                      alt="Business Logo"
                      className="rounded-full w-full h-full"
                    />
                  )
                  : <span className="text-gray-500">Insert Logo</span>}
              </div>
            </label>
          </div>

          <div>
            <label className="block text-gray-700">Business Name</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onInput={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter business name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onInput={handleInputChange}
              className="w-full px-4 py-2 border rounded-md h-32"
              placeholder="Enter a brief description"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Images</label>
            <div className="border-dashed border-2 border-gray-300 rounded-md p-6 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-gray-500">Drag or Upload here</p>
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            {images.length > 0
              ? images.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  className="w-24 h-24 bg-gray-300 rounded-md"
                />
              ))
              : [1, 2, 3].map((_, index) => (
                <div key={index} className="w-24 h-24 bg-gray-300 rounded-md">
                </div>
              ))}
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-[#FFC107] text-black font-bold px-6 py-2 rounded-md hover:bg-[#FFD54F] transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
