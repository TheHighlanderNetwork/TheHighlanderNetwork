import { db } from "../firebase.ts";

export type Student = {
  clubCount: number;
  rmail: string;
};

const collection = "students";

export async function createStudent(data: Student) {
  const docRef = db.collection(collection).doc();
  await docRef.set(data);
  return { id: docRef.id, ...data };
}

export async function getStudent(id: string) {
  const doc = await db.collection(collection).doc(id).get();
  if (!doc.exists) throw new Deno.errors.NotFound("Student not found");
  return { id: doc.id, ...doc.data() as Student };
}

export async function updateStudent(id: string, data: Partial<Student>) {
  await db.collection(collection).doc(id).update(data);
  return { id, ...data };
}

export async function deleteStudent(id: string) {
  await db.collection(collection).doc(id).delete();
  return { message: `Student ${id} deleted` };
}
