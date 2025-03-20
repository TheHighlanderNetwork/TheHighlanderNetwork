import { db } from "../../../routes/api/firebaseAdmin.ts";
import { GeoPoint } from "npm:firebase-admin/firestore";

export type Business = {
  description: string;
  email: string;
  images: string[];
  location: GeoPoint;
  name: string;
  type: number;
};

const collection = "businesses";

export async function createBusiness(data: Business) {
  const docRef = db.collection(collection).doc();
  const all_entries = db.collection("all_entries").doc(collection);
  await docRef.set(data);

  await all_entries.update({ [docRef.id]: data.name });
  return { id: docRef.id, ...data };
}

export async function getBusiness(id: string) {
  const doc = await db.collection(collection).doc(id).get();
  if (!doc.exists) throw new Deno.errors.NotFound("Business not found");
  return { id: doc.id, ...doc.data() as Business };
}

export async function updateBusiness(id: string, data: Partial<Business>) {
  await db.collection(collection).doc(id).update(data);
  return { id, ...data };
}

export async function deleteBusiness(id: string) {
  await db.collection(collection).doc(id).delete();
  return { message: `Business ${id} deleted` };
}
