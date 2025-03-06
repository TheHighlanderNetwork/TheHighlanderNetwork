import {
  createReview,
  deleteReview,
  getReview,
  updateReview,
} from "../reviews.ts";
import { db } from "../firebase.ts";

Deno.test("Review CRUD Operations", async (t) => {
  let reviewId: string;

  await t.step("Create Review", async () => {
    const review = await createReview({
      class: "CS101",
      review: "Great course!",
      reviewee: "Dr. Smith",
      reviewer: "John Doe",
      type: 5,
    });
    reviewId = review.id;
    console.assert(reviewId != null, "Review ID should exist");
  });

  await t.step("Get Review", async () => {
    const review = await getReview(reviewId);
    console.assert(review.id === reviewId, "Retrieved correct review");
  });

  await t.step("Update Review", async () => {
    await updateReview(reviewId, { review: "Updated review" });
    console.assert(
      (await getReview(reviewId)).review === "Updated review",
      "Review text updated",
    );
  });

  await t.step("Delete Review", async () => {
    await deleteReview(reviewId);
    try {
      await getReview(reviewId);
      console.assert(false, "Review should be deleted");
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        console.assert(
          error.message === "Review not found",
          "Proper error on delete",
        );
      } else {
        throw error;
      }
    }
  });

  await db.terminate();
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Tell deno tests to stfu for 1 second
});
