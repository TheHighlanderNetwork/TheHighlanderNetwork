import { cert, initializeApp } from "npm:firebase-admin/app";
import { getAuth } from "npm:firebase-admin/auth";
import { auth, db } from "../firebase.ts";
import { Handlers } from "$fresh/server.ts";

async function setUserClaims(uid: string, claims: Record<string, unknown>) {
    try {
        await auth.setCustomUserClaims(uid, claims);
        console.log(`Custom claims set for user: ${uid}`, claims);
    } catch (error) {
        console.error("Error setting custom claims:", error);
    }
}

export const handler: Handlers = {
  async POST(req) {
    try {
      const { uid } = await req.json(); // Only accept UID, no role from frontend

      // Fetch user details
      const userRecord = await auth.getUser(uid);
      const email = userRecord.email || "";

      let newRole = "business"; // Role for non-students

      // Set role to student for @ucr.edu emails
      if (email?.endsWith("@ucr.edu")) {
        newRole = "student";
      }

      // Assign admin role only if email is an admin email
      const adminDoc = await db.collection("admins").get();
      adminDoc.forEach((doc) => {
        if (email == doc.data().email) {
          newRole = "admin";
        }
      });

      // Set custom claim securely
      await setUserClaims(uid, { role: newRole });

      return new Response(JSON.stringify({ success: true, message: `Role ${role} assigned` }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};


setUserClaims("kLwjp4lZxPgR5UJgZ4nerSqT7xS2", { role: "admin" });
