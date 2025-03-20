/** @jsxImportSource preact */
"use client";
import { useState, useEffect } from "preact/hooks";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase.ts";

export default function ClubCreationForm() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    organizationName: "",
    highlanderLink: "",
    description: "",
  });
  const [logo, setLogo] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<string>(""); // ✅ Fix: Define status state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
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
      setStatus("❌ User not authenticated");
      return;
    }
  
    setStatus("⏳ Creating club...");
    try {
      const response = await fetch("/api/createClub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          name: formData.organizationName,
          description: formData.description,
          images: images,
          location: "TBD",
        }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        setStatus("✅ Club created successfully!");
        setFormData({ organizationName: "", highlanderLink: "", description: "" });
        setLogo(null);
        setImages([]);
      } else {
        throw new Error(data.error || "Unknown error occurred.");
      }
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : "Unexpected error"}`);
    }
  };
  
  

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <p className="text-red-500 text-lg font-semibold">
          X:/ You must be logged in to create a club.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full">
      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-2xl pb-10">
        <h2 className="text-2xl font-bold mb-6">Club Creation</h2>

        {/* Display Status Messages */}
        {status && <p className="text-center text-lg font-medium">{status}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Logo Upload */}
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              <div className="w-24 h-24 border-2 border-gray-300 flex items-center justify-center rounded-full">
                {logo ? (
                  <img src={logo} alt="Club Logo" className="rounded-full w-full h-full" />
                ) : (
                  <span className="text-gray-500">Insert Logo</span>
                )}
              </div>
            </label>
          </div>

          {/* Organization Name */}
          <div>
            <label className="block text-gray-700">Organization Name</label>
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onInput={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter club name"
              required
            />
          </div>

          {/* Highlander Link */}
          <div>
            <label className="block text-gray-700">Highlander Link</label>
            <input
              type="text"
              name="highlanderLink"
              value={formData.highlanderLink}
              onInput={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter Highlander Link"
              required
            />
          </div>

          {/* Description */}
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

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700">Images</label>
            <div className="border-dashed border-2 border-gray-300 rounded-md p-6 text-center">
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              <p className="text-gray-500">Drag or Upload here</p>
            </div>
          </div>

          {/* Image Previews */}
          <div className="mt-4 flex gap-4">
            {images.length > 0
              ? images.map((src, index) => (
                  <img key={index} src={src} className="w-24 h-24 bg-gray-300 rounded-md" />
                ))
              : [1, 2, 3].map((_, index) => (
                  <div key={index} className="w-24 h-24 bg-gray-300 rounded-md"></div>
                ))}
          </div>

          {/* Submit Button (Centered) */}
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
