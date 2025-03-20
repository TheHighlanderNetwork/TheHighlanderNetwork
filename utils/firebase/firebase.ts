import { cert, initializeApp, getApps, getApp } from "npm:firebase-admin/app";
import { getFirestore } from "npm:firebase-admin/firestore";
import "jsr:@std/dotenv/load";

//Ensures that Firebase Admin SDK is only initialized once
if (!getApps().length) {
  initializeApp({ credential: cert(JSON.parse(Deno.env.get("FIREBASE_SERVICE_ACCOUNT") || "{}")) });
}

export const db = getFirestore(getApp()); 
