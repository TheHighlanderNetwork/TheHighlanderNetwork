import { db } from "../firebaseAdmin.ts";
import { Handlers } from "$fresh/server.ts";
import { autoSetRole } from "../customClaims/setUserClaims.ts";
import { verifyIdToken } from "../login/verifyIdToken.ts";

export async function deleteBusiness(uid: string, businessRef: string) {
  console.log("retrieve club doc");
  const businessSnapshot = await db.collection("clubs").doc(businessRef).get();
  const businessData = businessSnapshot.data();
  if (!businessData) {
    throw new Error("Club does not exist.");
  }
  if (businessData.uid != uid) {
    throw new Error("User is not the owner of this club");
  }
  // Fetch reviews for the club
  const reviewsSnapshot = await db.collection("reviews").where(
    "reviewee",
    "==",
    businessRef,
  ).where("type", "==", 4).get();
  const deletePromises = reviewsSnapshot.docs.map((doc) => doc.ref.delete());

  // Wait for all deletions to complete
  console.log("Deleting all reviews for business ", businessRef, "...");
  await Promise.all(deletePromises);

  console.log("Deleting club ", businessRef, "...");
  await businessSnapshot.ref.delete();
}

export const handler: Handlers = {
  // Handler to delete a club business ref is the DocID of the business in firebase
  async POST(req) {
    try {
      const { idToken, businessRef } = await req.json();

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

      if (decodedToken.role != "business") {
        throw new Error("Must be a student to delete a business");
      }

      console.log("Verified token: ", decodedToken);

      await deleteBusiness(decodedToken.uid, businessRef);

      return new Response(
        JSON.stringify({
          success: true,
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
