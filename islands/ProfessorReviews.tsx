/** @jsxImportSource preact */
"use client";
import { useEffect, useState } from "preact/hooks";

const FIREBASE_AUTH_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:lookup";
const FIREBASE_FIRESTORE_URL =
  "https://firestore.googleapis.com/v1/projects/thehighlandernetwork/databases/(default)/documents/professors";
const FIREBASE_API_KEY = Deno.env.get("FIREBASE_API_KEY");

export default function ProfessorReviews() {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    // ✅ Retrieve user data from localStorage on first load
    const savedUser = localStorage.getItem("firebaseUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    async function checkAuthStatus() {
      const idToken = localStorage.getItem("firebaseIdToken"); // ✅ Retrieve auth token
      if (!idToken) {
        console.error("❌ User is not authenticated.");
        setUser(null);
        return;
      }

      try {
        // ✅ Verify token with Firebase Auth REST API
        const response = await fetch(`${FIREBASE_AUTH_URL}?key=${FIREBASE_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || "Invalid authentication token");
        }

        // ✅ Store user data persistently
        setUser(data.users[0]);
        localStorage.setItem("firebaseUser", JSON.stringify(data.users[0]));

        // ✅ Ensure professors are fetched only after authentication
        fetchProfessors(idToken);
      } catch (error) {
        console.error("❌ Authentication error:", error);
        localStorage.removeItem("firebaseIdToken"); // Remove invalid token
        localStorage.removeItem("firebaseUser");
        setUser(null);
      }
    }

    checkAuthStatus(); // ✅ Always run authentication check on page load
  }, []); // ✅ Runs only on initial load

  async function fetchProfessors(idToken) {
    if (!idToken) {
      console.error("❌ No authentication token found. Cannot fetch professors.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(FIREBASE_FIRESTORE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`, // ✅ Include auth token
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
      localStorage.setItem("professors", JSON.stringify(professorsList)); // ✅ Store in cache
    } catch (error) {
      console.error("❌ Error fetching professors:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return <p>❌ You must be logged in to view this page.</p>;
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Professors</h1>
      <ul>
        {professors.map((prof) => (
          <li key={prof.id}>
            {prof.name} - {prof.department}
          </li>
        ))}
      </ul>
    </div>
  );
}
