"use client";
import { FormEvent } from "preact/compat";

export default function BusinessSignUpForm() {
  const handleBusinessFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("username") as string;
    const password = formData.get("password") as string;
    // Replace with your Firebase sign-up logic.
    console.log("Business Sign Up", { email, password });
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
        className="w-full px-4 py-2 bg-yellow text-white rounded-md text-sm font-medium"
      >
        Sign Up with Username & Password
      </button>
    </form>
  );
}
