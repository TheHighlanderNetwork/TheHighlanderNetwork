"use client";
import type { JSX } from "preact";
import { auth } from "../utils/firebase.ts";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function BusinessSignUpForm() {
  async function handleBusinessFormSubmit(
    e: JSX.TargetedEvent<HTMLFormElement, Event>,
  ) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const messageEl = document.getElementById("message");

    if (!email || !password) {
      if (messageEl) messageEl.innerText = "Please fill out all fields.";
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      console.log("Creation success:", user.email);

      if (messageEl) {
        messageEl.innerText = `User Created: ${user.email}`;
      }

      await assignUserRole(user.uid);

      globalThis.location.href = "../";
    } catch (error) {
      console.error("Account Creation failed:", error);
      if (messageEl) {
        messageEl.innerText = `Failed to create new user (${
          (error as Error).message
        })`;
      }
    }
  }

  async function assignUserRole(uid: string) {
    console.log("Assigning role to UID:", uid);
    try {
      const response = await fetch("/api/customClaims/setUserClaims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });

      if (!response.ok) {
        console.error(`Server responded with status ${response.status}`);
        const errorText = await response.text();
        console.error("Error response from server:", errorText);
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log("Role assigned successfully:", data);
    } catch (error) {
      console.error("Error assigning role:", error);
    }
  }

  return (
    <form onSubmit={handleBusinessFormSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        name="email"
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
        className="w-full px-4 py-2 bg-yellow-500 text-white rounded-md text-sm font-medium"
      >
        Sign Up with Email & Password
      </button>
      <p id="message" className="text-sm text-red-500"></p>
    </form>
  );
}