"use client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase.ts";
import { useEffect, useState } from "preact/hooks";

type FirebaseUser = {
  displayName?: string | null;
};

export default function ProfessorRequestForm() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user: FirebaseUser | null) => {
        setIsSignedIn(!!user);
      },
    );
    return () => unsubscribe();
  }, []);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!isSignedIn) {
      alert("You must be signed in to submit a professor.");
      return;
    }
    alert("Form submitted successfully!");
  };

  const buttonText = isSignedIn ? "Submit" : "Log In to Submit";

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
        {buttonText}
      </button>
    </form>
  );
}
