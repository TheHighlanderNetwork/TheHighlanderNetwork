import { auth, db } from "../firebase.ts";
import { addDoc, collection, Timestamp } from "firestore";

export type Review = {
  reviewee: string;
  review: string;
  reviewer: string;
  rating: number;
  type: number;
  class: string;
  time: Timestamp;
};

export async function createReview(
  reviewee: string,
  review: string,
  rating: number,
  type: number,
  course: string = "",
): Promise<boolean> {
  try {
    // Reference to the "reviews" collection
    const reviewsCollection = collection(db, "reviews");

    // Create a new document in the "reviews" collection
    await addDoc(reviewsCollection, {
      reviewee,
      review,
      reviewer: auth.currentUser.uid,
      rating,
      type,
      course,
      time: Timestamp.now(), // Store current timestamp
    });

    console.log("Review successfully added!");
    return true;
  } catch (error) {
    console.error("Error adding review:", error);
    return false;
  }
}
