//utils/firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firestore";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const isDeno = typeof Deno !== "undefined" && Deno.env;

const firebaseConfig = {
  apiKey: isDeno
    ? Deno.env.get("FIREBASE_API_KEY")
    : "AIzaSyCvXS7B_Xd04q__oLg5BEiPKsgmNYrdn2A",
  authDomain: isDeno
    ? Deno.env.get("FIREBASE_AUTH_DOMAIN")
    : "thehighlandernetwork.firebaseapp.com",
  projectId: isDeno
    ? Deno.env.get("FIREBASE_PROJECT_ID")
    : "thehighlandernetwork",
  storageBucket: isDeno
    ? Deno.env.get("FIREBASE_STORAGE_BUCKET")
    : "thehighlandernetwork.appspot.com",
  messagingSenderId: isDeno
    ? Deno.env.get("FIREBASE_MESSAGING_SENDER_ID")
    : "236202663343",
  appId: isDeno
    ? Deno.env.get("FIREBASE_APP_ID")
    : "1:236202663343:web:43c2500c8e488af4d7235a",
};

console.log("Initializing Client Side Firebase App...");
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig, {
    experimentalForceLongPolling: true,
    useFetchStreams: false,
  });
  console.log("Firebase Client App initialized");
} else {
  app = getApp(); // Reuse existing app instance
  console.log("Firebase app reused");
}



const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);


setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Auth persistence is enabled"))
  .catch((error) => console.error("Error setting auth persistence:", error));


export { auth, db, provider };


