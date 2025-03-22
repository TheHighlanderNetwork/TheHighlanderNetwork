"use client";
import { useState } from "preact/hooks";
import type { JSX } from "preact";
import { auth } from "../utils/firebase.ts";
import { signInWithEmailAndPassword } from "firebase/auth";
import { verifyUserToken } from "../utils/firebase/verify/verifyToken.ts";

export default function BusinessSignInForm() {
  const [message, setMessage] = useState("");

  async function handleBusinessFormSubmit(
    e: JSX.TargetedEvent<HTMLFormElement, Event>,
  ) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const token = await userCredential.user.getIdToken();

      if (!await verifyUserToken(token)) {
        await auth.signOut();
        throw new Error("Invalid token.");
      }

      setMessage(`Successfully signed in: ${userCredential.user.email}`);

      globalThis.location.href = "../";
    } catch (error) {
      setMessage(`Login failed: ${(error as Error).message}`);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleBusinessFormSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          placeholder="Email"
          className="px-4 py-2 border rounded-md"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="px-4 py-2 border rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue text-white rounded-md text-sm font-medium"
        >
          Sign In with Email & Password
        </button>
      </form>

      {message && <p className="text-red-500 text-sm">{message}</p>}
    </div>
  );
}
