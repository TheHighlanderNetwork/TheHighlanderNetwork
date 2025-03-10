import { auth, db } from "../firebaseAdmin.ts";
import { Handlers } from "$fresh/server.ts";

async function setUserClaims(uid: string, claims: Record<string, unknown>) {
    try {
        // Set claim in Firebase
        await auth.setCustomUserClaims(uid, claims);
        console.log(`Custom claims set for user: ${uid}`, claims);
    } catch (error) {
        console.error("Error setting custom claims:", error);
    }
}

export const handler: Handlers = {
  // Automatically sets a user's role
  async POST(req) {
    try {
      console.log("Received request to assign role...");
      const { uid } = await req.json(); // Only accept UID

      // Return error if no uid is included 
      if (!uid) {
        return new Response(
          JSON.stringify({ success: false, error: "UID is required" }),
          { status: 400 }
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
      adminDoc.forEach((doc) => {
        if (email == doc.data().email) {
          newRole = "admin";
        }
      });

      // Set custom claim securely
      await setUserClaims(uid, { role: newRole });

      return new Response(JSON.stringify({ success: true, message: `Role ${newRole} assigned` }), {
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


// setUserClaims("kLwjp4lZxPgR5UJgZ4nerSqT7xS2", { role: "admin" });
