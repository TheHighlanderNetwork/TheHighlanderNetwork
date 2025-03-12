"use client";
import { useEffect, useState } from "preact/hooks";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase.ts";

type FirebaseUser = {
  displayName?: string | null;
};

export default function UsernameHeader() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        setUser(firebaseUser);
      },
    );
    return () => unsubscribe();
  }, []);

  function handleLogout() {
    signOut(auth).catch((err: unknown) => {
      console.error("Sign out error:", err);
    });
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => (globalThis.location.href = "/login")}
          className="bg-blue text-white rounded-md px-4 py-2 text-sm font-medium"
        >
          Log In
        </button>
        <button
          type="button"
          onClick={() => (globalThis.location.href = "/signup")}
          className="bg-yellow text-white rounded-md px-4 py-2 text-sm font-medium"
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => setMenuOpen(false)}
    >
      <button
        type="button"
        className="text-gray-800 font-medium cursor-pointer bg-white px-4 py-2 rounded-md"
      >
        {user.displayName ?? "Guest"}
      </button>
      {menuOpen && (
        <div className="absolute top-full right-0 bg-white border rounded-md shadow-md w-48 py-2 z-50">
          <button
            type="button"
            onClick={() => (globalThis.location.href = "/settings")}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-grey-light"
          >
            User Settings
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-grey-light"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
