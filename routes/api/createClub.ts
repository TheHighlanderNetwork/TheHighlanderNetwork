import { createClub } from "../../utils/firebase/clubs.ts";
import { auth, db } from "./firebaseAdmin.ts";
import { Handlers } from "$fresh/server.ts";
import { fetchMatchedData } from "../../utils/firebase/docRetrieval/retrieve.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const { uid, name, description, images, location } = await req.json();

      if (!uid) {
        return new Response(
          JSON.stringify({ success: false, error: "User ID is required" }),
          { status: 400 },
        );
      }

      const user = await auth.getUser(uid);
      const customClaims = user.customClaims ?? {};

      console.log(`Checking club limit for UID: ${uid}`);

      const userClubs = await fetchMatchedData("clubs", { uid });

      if (userClubs.length >= 5) {
        await auth.setCustomUserClaims(uid, {
          ...customClaims, //Preserves existing claims
          clubLimitReached: true,
        });

        return new Response(
          JSON.stringify({
            success: false,
            error: "Club limit reached (5 max)",
          }),
          { status: 403 },
        );
      }

      const newClub = await createClub({
        name,
        description,
        images,
        location,
        uid,
      });

      return new Response(
        JSON.stringify({ success: true, id: newClub.id }),
        { status: 201 },
      );
    } catch (error) {
      console.error("Error in club creation:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : "Unexpected error",
        }),
        { status: 500 },
      );
    }
  },
};
