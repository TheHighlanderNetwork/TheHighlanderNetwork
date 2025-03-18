import { Handlers } from "$fresh/server.ts";

const FIREBASE_AUTH_URL = "https://identitytoolkit.googleapis.com/v1/accounts:lookup";
const FIREBASE_API_KEY = Deno.env.get("FIREBASE_API_KEY");

export const handler: Handlers = {
  async POST(req) {
    try {
      const { idToken } = await req.json();

      // ✅ Validate input
      if (!idToken) {
        return new Response(
          JSON.stringify({ error: "❌ ID Token is required" }),
          { status: 400 }
        );
      }

      // ✅ Verify token using Firebase Auth REST API
      const response = await fetch(`${FIREBASE_AUTH_URL}?key=${FIREBASE_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "❌ Invalid authentication token");
      }

      // ✅ Successfully verified user
      return new Response(
        JSON.stringify({
          success: true,
          user: data.users[0], // Firebase returns an array of users
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error: unknown) {
      return new Response(
        JSON.stringify({ success: false, error: (error as Error).message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
};
