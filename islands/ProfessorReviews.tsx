/** @jsxImportSource preact */
"use client";
import { useEffect, useState, useRef } from "preact/hooks";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase.ts";

const FIREBASE_FIRESTORE_URL =
  "https://firestore.googleapis.com/v1/projects/thehighlandernetwork/databases/(default)/documents/professors";

export default function ProfessorReviews() {
  const [professors, setProfessors] = useState(() => {
    // ✅ Load from localStorage on first render
    const cachedProfessors = localStorage.getItem("cachedProfessors");
    return cachedProfessors ? JSON.parse(cachedProfessors) : [];
  });
  const [loading, setLoading] = useState(professors.length === 0); // Avoid loading if cache exists
  const [user, setUser] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log("✅ User is logged in:", firebaseUser);
        setUser(firebaseUser);
        
        // ✅ Only fetch professors if not in cache
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

      // ✅ Save to localStorage to prevent redundant Firestore reads
      localStorage.setItem("cachedProfessors", JSON.stringify(professorsList));

      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 500);
    } catch (error) {
      console.error("❌ Error fetching professors:", error);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Professors</h1>

      {loading ? (
        <p className="text-lg text-gray-600">Loading...</p>
      ) : (
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[500px]">
          <ul className="space-y-4">
            {professors.map((prof, index) => (
              <li
                key={prof.id}
                ref={index === professors.length - 1 ? listRef : null}
                className="p-4 bg-gray-50 border-l-4 border-blue-500 rounded-lg shadow-sm"
              >
                <h3 className="font-semibold text-lg text-gray-900">{prof.name}</h3>
                <p className="text-gray-600">{prof.department}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
