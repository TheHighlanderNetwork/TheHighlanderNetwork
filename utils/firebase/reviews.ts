import { db } from "./firebase.ts";

export type Review = {
  class: string;
  review: string;
  reviewee: string;
  reviewer: string;
  type: number;
};

const collection = "reviews";

export async function createReview(data: Review) {
  const docRef = db.collection(collection).doc();
  await docRef.set(data);
  return { id: docRef.id, ...data };
}

export async function getReview(id: string) {
  const doc = await db.collection(collection).doc(id).get();
  if (!doc.exists) throw new Error("Review not found");
  return { id: doc.id, ...doc.data() as Review };
}

export async function updateReview(id: string, data: Partial<Review>) {
  await db.collection(collection).doc(id).update(data);
  return { id, ...data };
}

export async function deleteReview(id: string) {
  await db.collection(collection).doc(id).delete();
  return { message: `Review ${id} deleted` };
}
