import { db } from "./firebase.ts";

export type Club = {
  description: string;
  email: string;
  images: string[];
  location: string;
  name: string;
};

const collection = "clubs";

export async function createClub(data: Club) {
  const docRef = db.collection(collection).doc();
  await docRef.set(data);
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
  await db.collection(collection).doc(id).delete();
  return { message: `Club ${id} deleted` };
}
