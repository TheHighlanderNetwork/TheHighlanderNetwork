import { createClub } from "../../utils/firebase/clubs.ts";
import { auth, db } from "./firebaseAdmin.ts";
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const { uid, name, description, images, location, email } = await req
        .json();

      if (!uid) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "User ID is required",
          }),
          { status: 400 },
        );
      }

      const user = await auth.getUser(uid);

      if (user.customClaims?.clubLimitReached) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Club limit reached (5 max)",
          }),
          { status: 403 },
        );
      }

      const clubsRef = db.collection("clubs");
      const snapshot = await clubsRef.where("uid", "==", uid).get();
      const clubCount = snapshot.size;

      if (clubCount >= 5) {
        await auth.setCustomUserClaims(uid, {
          ...user.customClaims,
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
        email,
      });

      return new Response(JSON.stringify({ success: true, id: newClub.id }), {
        status: 201,
      });
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
