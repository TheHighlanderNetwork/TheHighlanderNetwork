import { cert, initializeApp } from "npm:firebase-admin/app";
import { getAuth } from "npm:firebase-admin/auth";

// Load Firebase credentials

const auth = getAuth();

async function setUserClaims(uid: string, claims: Record<string, unknown>) {
  try {
    await auth.setCustomUserClaims(uid, claims);
    console.log(`Custom claims set for user: ${uid}`, claims);
  } catch (error) {
    console.error("Error setting custom claims:", error);
  }
}

setUserClaims("kLwjp4lZxPgR5UJgZ4nerSqT7xS2", { role: "admin" });
