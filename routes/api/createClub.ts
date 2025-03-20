import { createClub } from "../../utils/firebase/clubs.ts";
import { db, auth } from "./firebaseAdmin.ts";
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

      // Retrieve user and check if the club limit flag is set
      const user = await auth.getUser(uid);

      const userClubs = await fetchMatchedData("clubs", { uid });

      console.log(`Clubs found for user ${uid}: ${userClubs.length}`);

      // If user already has 5+ clubs, set Firebase Auth flag
      if (userClubs.length >= 5) {
        await auth.setCustomUserClaims(uid, { ...user.customClaims, clubLimitReached: true });
        return new Response(
          JSON.stringify({ success: false, error: "Club limit reached (5 max)" }),
          { status: 403 },
        );
      }

      // Create the club with UID instead of email
      const newClub = await createClub({ name, description, images, location, uid });

      return new Response(
        JSON.stringify({ success: true, id: newClub.id }),
        { status: 201 },
      );

    } catch (error) {
      console.error("Error in club creation:", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500 },
      );
    }
  },
};
