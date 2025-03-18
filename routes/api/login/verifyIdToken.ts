import { Handlers } from "$fresh/server.ts";

const FIREBASE_AUTH_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:lookup";
const FIREBASE_API_KEY = Deno.env.get("FIREBASE_API_KEY");

if (!FIREBASE_API_KEY) {
  throw new Error("❌ Missing FIREBASE_API_KEY in environment variables.");
}

export const handler: Handlers = {
  async POST(req) {
    try {
      const { idToken } = await req.json();

      // Validate input
      if (!idToken) {
        return new Response(
          JSON.stringify({ error: "ID Token is required" }),
          { status: 400 },
        );
      }

      // ✅ Verify ID token using Firebase REST API
      const response = await fetch(`${FIREBASE_AUTH_URL}?key=${FIREBASE_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (!response.ok) {
        return new Response(
          JSON.stringify({ success: false, error: data.error?.message || "Invalid ID Token" }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Token verified successfully",
          user: data.users[0], // ✅ Returns user info from Firebase
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    } catch (error: unknown) {
      return new Response(
        JSON.stringify({ success: false, error: error instanceof Error ? error.message : error }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
};
