import { cert, initializeApp } from "npm:firebase-admin/app";
import { getAuth } from "npm:firebase-admin/auth";
import { auth, db } from "../firebase.ts";

async function getUserClaims(uid: string) {
  try {
    const user = await auth.getUser(uid);
    console.log("Custom Claims:", user.customClaims);
    return user.customClaims;
  } catch (error) {
    console.error("Error while retrieving custom claims", error);
  }
}

getUserClaims("kLwjp4lZxPgR5UJgZ4nerSqT7xS2");
