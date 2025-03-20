import { auth } from "../firebaseAdmin.ts";
import { Handlers } from "$fresh/server.ts";

export async function getUserClaims(
  uid: string,
): Promise<Record<string, unknown> | undefined> {
  try {
    // Retrieve custom claims from Firebase
    console.time("Retrieving user from UID");
    const user = await auth.getUser(uid);
    console.timeEnd("Retrieving user from UID");
    console.log("Custom Claims:", user.customClaims);
    return user.customClaims;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred", error);
    }
    return {};
  }
}

export const handler: Handlers = {
  // Retrieve a user's role
  async GET(req) {
    try {
      const { uid } = await req.json(); // Only accept UID

      console.log("Received request to retrieve role for user: ", uid);

      // Return error if no uid is included
      if (!uid) {
        return new Response(
          JSON.stringify({ success: false, error: "UID is required" }),
          { status: 400 },
        );
      }

      const role = await getUserClaims(uid);

      return new Response(
        JSON.stringify({ success: true, role: role }),
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
