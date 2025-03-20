import { auth } from "../firebaseAdmin.ts";
import { Handlers } from "$fresh/server.ts";
import { autoSetRole } from "../customClaims/setUserClaims.ts";

export async function verifyIdToken(idToken: string) {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    console.log("Token is valid. User ID:", decodedToken.uid);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Unauthorized access");
  }
}

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

      const decodedToken = await verifyIdToken(idToken);

      // Assign role if user doesnt have a role
      if (!decodedToken.role) {
        try {
          decodedToken.role = await autoSetRole(decodedToken.uid);
        } catch (error) {
          console.error("Error assigning role:", error);
        }
      }

      console.log("Verified token: ", decodedToken);
      return new Response(
        JSON.stringify({
          success: true,
          verifiedToken: decodedToken,
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
