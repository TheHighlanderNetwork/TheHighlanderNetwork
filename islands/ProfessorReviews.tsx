"use client";
import { useEffect, useState } from "preact/hooks";
import { getAllProfessors } from "../utils/firebase/professors.ts";


type Professor = {
  id: string;
  name: string;
  department?: string;
};

export default function ProfessorList() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfessors() {
      try {
        const profList = await getAllProfessors();
        console.log("Professors fetched:", profList); // Debugging log
        setProfessors(profList);
      } catch (error) {
        console.error("Error fetching professors:", error);
      }
      setLoading(false);
    }
    fetchProfessors();
  }, []);

  return (
    <div className="flex flex-col items-center px-8 pb-8">
      <h1 className="text-2xl font-bold mb-6">Professors</h1>

      {/* Professors Container */}
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 overflow-y-auto max-h-[600px]">
        {loading ? (
          <p className="text-gray-500 text-center">Loading professors...</p>
        ) : professors.length === 0 ? (
          <p className="text-gray-500 text-center">No professors found.</p>
        ) : (
          <ul className="space-y-4">
            {professors.map((prof) => (
              <li
                key={prof.id}
                className="flex flex-col bg-gray-50 p-4 rounded-lg shadow-sm border hover:bg-gray-100 transition"
              >
                <h3 className="text-lg font-semibold">{prof.name}</h3>
                <p className="text-gray-600">
                  {prof.department && prof.department.trim() !== ""
                    ? prof.department
                    : "No department available"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
