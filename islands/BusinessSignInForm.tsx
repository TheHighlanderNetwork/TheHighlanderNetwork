"use client";
import type { JSX } from "preact";

export default function BusinessSignInForm() {
  const handleBusinessFormSubmit = (
    e: JSX.TargetedEvent<HTMLFormElement, Event>,
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("username") as string;
    const password = formData.get("password") as string;
    // Replace with your actual Firebase sign-in logic if needed.
    console.log("Business Sign In", { email, password });
  };

  return (
    <form onSubmit={handleBusinessFormSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        name="username"
        placeholder="Username"
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
        Sign In with Username & Password
      </button>
    </form>
  );
}
