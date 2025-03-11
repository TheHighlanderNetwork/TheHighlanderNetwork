"use client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase.ts";
import { useEffect, useState } from "preact/hooks";

export default function ProfessorRequestForm() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = (e: Event) => {
    if (!isSignedIn) {
      e.preventDefault();
      alert("You must be signed in to submit a professor.");
    }
    // Otherwise, allow form submission
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <input
        type="text"
        name="professorName"
        placeholder="Professor Name"
        className="px-4 py-2 border rounded-md w-full"
        required
      />
      <button
        type="submit"
        disabled={!isSignedIn}
        className={`bg-blue text-white rounded-md px-4 py-2 text-sm font-medium w-full ${
          !isSignedIn ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Submit
      </button>
      {!isSignedIn && (
        <p className="text-red-500 text-sm">
          You must be signed in to submit a professor.
        </p>
      )}
    </form>
  );
}
