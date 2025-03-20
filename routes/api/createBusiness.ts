import { createBusiness } from "../../utils/firebase/businesses.ts";
import { auth } from "./firebaseAdmin.ts";
import { Handlers } from "$fresh/server.ts";
import { GeoPoint } from "npm:firebase-admin/firestore";

export const handler: Handlers = {
  async POST(req) {
    try {
      const { uid, name, description, images, location } = await req.json();

      if (!uid || !name || !description || !images || !location) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing required fields" }),
          { status: 400 }
        );
      }

      await auth.getUser(uid); //User exits

      //Converts the location to GeoPoint before storing
      const locationGeoPoint = new GeoPoint(location.latitude, location.longitude);

      const newBusiness = await createBusiness({
        name,
        description,
        images,
        location: locationGeoPoint,
        uid,
      });

      return new Response(JSON.stringify({ success: true, id: newBusiness.id }), {
        status: 201,
      });

    } catch (error: unknown) {
      return new Response(
        JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unexpected error" }),
        { status: 500 }
      );
    }
  },
};
