"use client";

export default function HeaderSignUpButton() {
  const handleHeaderSignUp = () => {
    console.log("Header Sign Up clicked");
  };

  return (
    <button
      onClick={handleHeaderSignUp}
      type="button"
      className="px-4 py-2 bg-yellow text-white rounded-md text-sm font-medium"
    >
      Sign Up
    </button>
  );
}
