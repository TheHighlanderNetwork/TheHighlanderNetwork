import {
  createBusiness,
  deleteBusiness,
  getBusiness,
  updateBusiness,
} from "../businesses.ts";
import { db } from "../firebase.ts";
import { GeoPoint } from "npm:firebase-admin/firestore";

Deno.test("Business CRUD Operations", async (t) => {
  let businessId: string;

  await t.step("Create Business", async () => {
    const business = await createBusiness({
      name: "Tech Store",
      description: "Sells gadgets",
      email: "contact@techstore.com",
      images: ["image1.jpg"],
      location: new GeoPoint(37.7749, -122.4194),
      type: 1,
    });
    businessId = business.id;
    console.assert(businessId != null, "Business ID should exist");
  });

  await t.step("Get Business", async () => {
    const business = await getBusiness(businessId);
    console.assert(business.id === businessId, "Retrieved correct business");
  });

  await t.step("Update Business", async () => {
    await updateBusiness(businessId, { type: 2 });
    console.assert(
      (await getBusiness(businessId)).type === 2,
      "Business type updated",
    );
  });

  await t.step("Delete Business", async () => {
    await deleteBusiness(businessId);

    let threwNotFound = false;
    try {
      await getBusiness(businessId);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        threwNotFound = true;
        console.assert(
          error.message === "Business not found",
          "Proper error on delete",
        );
      } else {
        throw error;
      }
    }

    console.assert(threwNotFound, "getBusiness should throw NotFound error");
  });

  await db.terminate();
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Tell deno tests to stfu for 1 second
});
