//utils/firebase.ts
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


const isDeno = typeof Deno !== "undefined" && Deno.env;

const firebaseConfig = {
  apiKey: isDeno ? Deno.env.get("FIREBASE_API_KEY") : "AIzaSyB1wxxSiuMSXjS19e5ZVyhUQnjqLydcL0I",
  authDomain: isDeno ? Deno.env.get("FIREBASE_AUTH_DOMAIN") : "thehighlandernetwork.firebaseapp.com",
  projectId: isDeno ? Deno.env.get("FIREBASE_PROJECT_ID") : "thehighlandernetwork",
  storageBucket: isDeno ? Deno.env.get("FIREBASE_STORAGE_BUCKET") : "thehighlandernetwork.appspot.com",
  messagingSenderId: isDeno ? Deno.env.get("FIREBASE_MESSAGING_SENDER_ID") : "236202663343",
  appId: isDeno ? Deno.env.get("FIREBASE_APP_ID") : "1:236202663343:web:43c2500c8e488af4d7235a",
};


const app = initializeApp(firebaseConfig, "highlandernetwork");
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
