"use client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase.ts";
import { useEffect, useState } from "preact/hooks";

type FirebaseUser = {
  displayName?: string | null;
};

export default function UsernameHeader() {
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user: FirebaseUser | null) => {
        if (user) {
          setUsername(user.displayName ?? "Guest");
        } else {
          setUsername("Guest");
        }
      },
    );
    return () => unsubscribe();
  }, []);

  return <div className="text-gray-800 font-medium">{username}</div>;
}
