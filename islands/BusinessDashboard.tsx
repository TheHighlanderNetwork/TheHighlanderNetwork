/** @jsxImportSource preact */
"use client";
import { useEffect, useState } from "preact/hooks";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase.ts";

export default function BusinessDashboard() {
  const [user, setUser] = useState(null);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleFileUpload = (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages([...images, ...newImages]);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h1 className="text-lg font-bold text-yellow-600">
          The Highlander <span className="text-blue-600">Network</span>
        </h1>
        <nav className="mt-6">
          <ul className="space-y-4 text-gray-700">
            <li className="font-semibold">Profile Management</li>
            <li>Reviews</li>
            <li>Analytics</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Business Account Dashboard</h2>
          <div className="flex items-center space-x-4">
            <span className="font-medium">Business Name</span>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Profile</h3>
          </div>

          <div className="flex items-center space-x-4 mt-4">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm">logo</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-gray-700">Organization Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter organization name"
              />
            </div>

            <div>
              <label className="block text-gray-700">Description</label>
              <textarea
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter a brief description"
              >
              </textarea>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-gray-700">Images</label>
              <div className="border-dashed border-2 border-gray-300 rounded-md p-6 text-center">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="fileUpload"
                  onChange={handleFileUpload}
                />
                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer flex flex-col items-center text-gray-600"
                >
                  <span className="text-lg">+</span>
                  <span className="mt-2">Drag or Upload here</span>
                </label>
              </div>
            </div>

            {/* Saved Photos Section */}
            <div>
              <h3 className="block text-gray-700 mb-2">Saved Photos</h3>
              <div className="flex space-x-2">
                {images.length > 0
                  ? (
                    images.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt="Uploaded"
                        className="w-24 h-24 rounded-md object-cover"
                      />
                    ))
                  )
                  : (
                    <>
                      <div className="w-24 h-24 bg-gray-300 rounded-md"></div>
                      <div className="w-24 h-24 bg-gray-300 rounded-md"></div>
                      <div className="w-24 h-24 bg-gray-300 rounded-md"></div>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
