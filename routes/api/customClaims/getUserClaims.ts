import { cert, initializeApp } from "npm:firebase-admin/app";
import { getAuth } from "npm:firebase-admin/auth";

// Load Firebase credentials
const FIREBASE_CREDENTIALS = JSON.parse(
  Deno.env.get("FIREBASE_SERVICE_ACCOUNT") || "{}",
);
initializeApp({ credential: cert(FIREBASE_CREDENTIALS) });

const auth = getAuth();

async function getUserClaims(uid: string) {
  const user = await auth.getUser(uid);
  console.log("Custom Claims:", user.customClaims);
}

getUserClaims("kLwjp4lZxPgR5UJgZ4nerSqT7xS2");
