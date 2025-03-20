/** @jsxImportSource preact */
"use client";
import { useEffect, useRef, useState } from "preact/hooks";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase.ts";
import { retrieveDocument } from "../utils/firebase/docRetrieval/retrieve.ts";

export default function ProfessorReviews() {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("User logged in:", firebaseUser);
        setUser(firebaseUser);

        // Fetches professors only if the list is empty
        if (professors.length === 0) {
          fetchProfessors();
        }
      } else {
        console.warn("User is not authenticated");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [professors]); // no unneccessary re-fetching

  async function fetchProfessors() {
    try {
      console.log("Fetching professor data from 'all_entries/professors'...");
      setLoading(true);

      // retrieving the single document from `all_entries/professors`
      const document = await retrieveDocument("all_entries", "professors");

      if (!document) {
        console.warn("No professor data found.");
        setLoading(false);
        return;
      }

      // converting document fields into a structured list
      const professorsList = Object.entries(document).map((
        [key, value],
        index,
      ) => ({
        id: `prof-${key}`,
        name: value || "Unnamed Professor",
        department: "Unknown Department",
      }));

      console.log("All Professors fetched XD:", professorsList);
      setProfessors(professorsList);
    } catch (error) {
      console.error("Aww, you couldn't fetch professors:", error);
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white shadow-lg p-6 rounded-md ml-6 overflow-y-auto max-h-[600px]">
        <h2 className="text-xl font-bold mb-6">Professors</h2>

        {loading
          ? <p className="text-lg text-gray-600">Loading...</p>
          : (
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
