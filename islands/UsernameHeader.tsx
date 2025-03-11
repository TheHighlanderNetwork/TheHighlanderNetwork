"use client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase.ts";
import { useEffect, useState } from "preact/hooks";

export default function UsernameHeader() {
  const [username, setUsername] = useState<string>("Signed Out");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName ?? "Signed Out");
      } else {
        setUsername("Signed Out");
      }
    });
    return () => unsubscribe();
  }, []);

  return <div className="text-gray-800 font-medium">{username}</div>;
}
