import { db } from "../../../routes/api/firebaseAdmin.ts";
import { FieldValue } from "npm:firebase-admin/firestore";

export type Club = {
  description: string;
  uid: string;
  images: string[];
  location: string;
  name: string;
};

const collection = "clubs";

export async function createClub(data: Club) {
  const docRef = db.collection(collection).doc();
  const all_entries = db.collection("all_entries").doc(collection);
  await docRef.set(data);

  await all_entries.update({ [docRef.id]: data.name });
  return { id: docRef.id, ...data };
}

export async function getClub(id: string) {
  const doc = await db.collection(collection).doc(id).get();
  if (!doc.exists) throw new Deno.errors.NotFound("Club not found");
  return { id: doc.id, ...doc.data() as Club };
}

export async function updateClub(id: string, data: Partial<Club>) {
  await db.collection(collection).doc(id).update(data);
  return { id, ...data };
}

export async function deleteClub(id: string) {
  const all_entries = db.collection("all_entries").doc(collection);
  await db.collection(collection).doc(id).delete();
  await all_entries.update({
    [id]: FieldValue.delete(),
  });

  return { message: `Club ${id} deleted` };
}
