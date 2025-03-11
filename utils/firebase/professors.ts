import { db } from "./firebase.ts";

export type Professor = {
  name: string;
  classes: string[];
};

const collection = "professors";

export async function createProfessor(data: Professor) {
  const docRef = db.collection(collection).doc();
  await docRef.set(data);
  return { id: docRef.id, ...data };
}

export async function getProfessor(id: string) {
  const doc = await db.collection(collection).doc(id).get();
  if (!doc.exists) throw new Deno.errors.NotFound("Professor not found");
  return { id: doc.id, ...doc.data() as Professor };
}

export async function updateProfessor(id: string, data: Partial<Professor>) {
  await db.collection(collection).doc(id).update(data);
  return { id, ...data };
}

export async function deleteProfessor(id: string) {
  await db.collection(collection).doc(id).delete();
  return { message: `Professor ${id} deleted` };
}
