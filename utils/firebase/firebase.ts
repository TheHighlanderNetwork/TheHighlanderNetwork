import { cert, initializeApp } from "npm:firebase-admin/app";
import { getFirestore } from "npm:firebase-admin/firestore";
import "jsr:@std/dotenv/load";

const FIREBASE_CREDENTIALS = JSON.parse(
  Deno.env.get("FIREBASE_SERVICE_ACCOUNT") || "{}",
);
const app = initializeApp({ credential: cert(FIREBASE_CREDENTIALS) });
export const db = getFirestore(app);
