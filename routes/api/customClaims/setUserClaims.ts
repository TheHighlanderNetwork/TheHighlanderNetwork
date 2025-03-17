import { auth, db } from "../firebaseAdmin.ts";
import { Handlers } from "$fresh/server.ts";
import { QueryDocumentSnapshot } from "npm:firebase-admin/firestore"

async function setUserClaims(uid: string, claims: Record<string, unknown>) {
  try {
    // Set claim in Firebase
    await auth.setCustomUserClaims(uid, claims);
    console.log(`Custom claims set for user: ${uid}`, claims);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred", error);
    }
  }
}

export const handler: Handlers = {
  // Automatically sets a user's role
  async POST(req) {
    try {
      const { uid } = await req.json(); // Only accept UID

      console.log("Received request to assign role to user: ", uid);

      // Return error if no uid is included
      if (!uid) {
        return new Response(
          JSON.stringify({ success: false, error: "UID is required" }),
          { status: 400 },
        );
      }

      // Fetch user details from Firebase
      console.log("Retrieving user record...");
      const userRecord = await auth.getUser(uid);
      console.log("Retrieved");
      const email = userRecord.email || "";

      let newRole = "business"; // Role for non-students

      // Set role to student for @ucr.edu emails
      if (email?.endsWith("@ucr.edu")) {
        newRole = "student";
      }

      // Assign admin role only if email is an admin email
      console.log("Checking admin doc...");
      const adminDoc = await db.collection("admins").get();
      console.log("Received admin doc...");
      adminDoc.forEach((doc: QueryDocumentSnapshot) => {
        console.log(doc.data());
        if (email == doc.data().email) {
          newRole = "admin";
        }
      });

      // Set custom claim securely
      await setUserClaims(uid, { role: newRole });

      return new Response(
        JSON.stringify({ success: true, message: `Role ${newRole} assigned` }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, error: error }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }
  },
};

// setUserClaims("kLwjp4lZxPgR5UJgZ4nerSqT7xS2", { role: "admin" });
