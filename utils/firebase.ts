// utils/firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { cert, initializeApp as initializeAdminApp, getApps as getAdminApps, getApp as getAdminApp } from "npm:firebase-admin/app";
import { getFirestore } from "npm:firebase-admin/firestore";
import "jsr:@std/dotenv/load";

const isDeno = typeof Deno !== "undefined" && Deno.env;

let db;
if (isDeno) {
  if (!getAdminApps().length) { 
    const FIREBASE_CREDENTIALS = JSON.parse(Deno.env.get("FIREBASE_SERVICE_ACCOUNT") || "{}");
    const adminApp = initializeAdminApp({ credential: cert(FIREBASE_CREDENTIALS) });
    db = getFirestore(adminApp);
  } else {
    db = getFirestore(getAdminApp()); 
  }
}


const firebaseConfig = {
  apiKey: isDeno ? Deno.env.get("FIREBASE_API_KEY") : "AIzaSyCvXS7B_Xd04q__oLg5BEiPKsgmNYrdn2A",
  authDomain: isDeno ? Deno.env.get("FIREBASE_AUTH_DOMAIN") : "thehighlandernetwork.firebaseapp.com",
  projectId: isDeno ? Deno.env.get("FIREBASE_PROJECT_ID") : "thehighlandernetwork",
  storageBucket: isDeno ? Deno.env.get("FIREBASE_STORAGE_BUCKET") : "thehighlandernetwork.appspot.com",
  messagingSenderId: isDeno ? Deno.env.get("FIREBASE_MESSAGING_SENDER_ID") : "236202663343",
  appId: isDeno ? Deno.env.get("FIREBASE_APP_ID") : "1:236202663343:web:43c2500c8e488af4d7235a",
};

console.log("Initializing Client Side Firebase App...");
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);

} else {
  app = getApp();
}

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
