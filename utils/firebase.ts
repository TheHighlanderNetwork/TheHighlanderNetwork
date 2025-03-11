//utils/firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: Deno.env.get("FIREBASE_API_KEY"),
  authDomain: Deno.env.get("FIREBASE_AUTH_DOMAIN"),
  projectId: Deno.env.get("FIREBASE_PROJECT_ID"),
  storageBucket: Deno.env.get("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: Deno.env.get("FIREBASE_MESSAGING_SENDER_ID"),
  appId: Deno.env.get("FIREBASE_APP_ID"),
};

console.log("Initializing Client Side Firebase App...");
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig, "highlandernetwork");
  console.log("Firebase Client App initialized");
} else {
  app = getApp(); // Reuse existing app instance
  console.log("Firebase app reused");
}
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
