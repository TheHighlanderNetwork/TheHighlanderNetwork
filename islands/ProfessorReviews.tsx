/** @jsxImportSource preact */
"use client";
import { useEffect, useState, useRef } from "preact/hooks";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase.ts";

const FIREBASE_FIRESTORE_URL =
  "https://firestore.googleapis.com/v1/projects/thehighlandernetwork/databases/(default)/documents/professors";

export default function ProfessorReviews() {
  const [professors, setProfessors] = useState(() => {
    const cachedProfessors = localStorage.getItem("cachedProfessors");
    return cachedProfessors ? JSON.parse(cachedProfessors) : [];
  });
  const [loading, setLoading] = useState(professors.length === 0);
  const [user, setUser] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log("✅ User is logged in:", firebaseUser);
        setUser(firebaseUser);
        if (!localStorage.getItem("cachedProfessors")) {
          fetchProfessors(firebaseUser);
        }
      } else {
        console.warn("❌ User is not authenticated");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  async function fetchProfessors(firebaseUser) {
    if (!firebaseUser) {
      console.error("❌ No authenticated user found. Cannot fetch professors.");
      return;
    }

    setLoading(true);
    try {
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch(FIREBASE_FIRESTORE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to fetch professors");
      }

      const professorsList = data.documents.map((doc) => ({
        id: doc.name.split("/").pop(),
        name: doc.fields.name.stringValue,
        department: doc.fields.department.stringValue,
      }));

      console.log("✅ Professors fetched:", professorsList);
      setProfessors(professorsList);

      localStorage.setItem("cachedProfessors", JSON.stringify(professorsList));

      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 500);
    } catch (error) {
      console.error(" Error fetching professors:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <p className="text-red-500 text-lg font-semibold">
          ❌ You must be logged in to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 p-6">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-lg p-6 rounded-md max-h-[600px] overflow-auto">
      <h2 className="text-xl font-bold mb-6">Name</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Professor"
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Categories</label>
          <select className="w-full px-4 py-2 border rounded-md">
            <option value="">All</option>
            <option value="humanities">Humanities</option>
            <option value="sciences">Sciences</option>
            <option value="engineering">Engineering</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 font-medium">Sorting</label>
          <select className="w-full px-4 py-2 border rounded-md">
            <option value="alphabetical">Alphabetical</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white shadow-lg p-6 rounded-md ml-6 overflow-y-auto max-h-[600px]">
        <h2 className="text-xl font-bold mb-6">Name</h2>

        {loading ? (
          <p className="text-lg text-gray-600">Loading...</p>
        ) : (
          <div className="flex flex-col gap-6">
            {professors.map((prof, index) => (
              <div
                key={prof.id}
                ref={index === professors.length - 1 ? listRef : null}
                className="flex gap-4 items-start"
              >
                <div className="w-20 h-20 bg-gray-300 rounded-md" />
                <div>
                  <h3 className="font-bold text-lg">{prof.name}</h3>
                  <p className="text-gray-600">{prof.department}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
