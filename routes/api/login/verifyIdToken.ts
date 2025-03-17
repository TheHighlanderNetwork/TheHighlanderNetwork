// import { auth } from "../firebaseAdmin.ts";
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  // Handler to verify an ID token
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

      const response = await auth.verifyIdToken(idToken);

      return new Response(
        JSON.stringify({
          success: true,
          message: `Verified token: ${idToken}`,
        }),
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
