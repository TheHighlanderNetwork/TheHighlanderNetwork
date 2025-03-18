import "https://deno.land/x/dotenv@v3.2.2/mod.ts";

const FIREBASE_AUTH_URL = "https://identitytoolkit.googleapis.com/v1/accounts:lookup";
const FIREBASE_API_KEY = Deno.env.get("FIREBASE_API_KEY");

if (!FIREBASE_API_KEY) {
  throw new Error("❌ Missing FIREBASE_API_KEY in environment variables.");
}

/**
 * Get Firebase user claims via REST API
 */
export async function getUserClaims(idToken: string) {
  const response = await fetch(`${FIREBASE_AUTH_URL}?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to get user claims");
  }

  return data.users[0]; // Returns user details & claims
}

console.log("✅ Firebase Authentication REST API is Ready");
