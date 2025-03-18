import { db } from "./firebase.ts";
import { getFirestore, collection, getDocs } from "https://esm.sh/firebase/firestore";

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

export async function getAllProfessors() {
  console.log("🟠 Fetching professors from Firestore...");

  try {
    const firestore = getFirestore(db); // Get Firestore instance
    const profsCollection = collection(firestore, "professors"); // Reference collection
    const snapshot = await getDocs(profsCollection); // Get documents

    if (snapshot.empty) {
      console.warn("⚠️ No professors found in Firestore");
      return [];
    }

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || "Unknown Professor",
      department: doc.data().department || "No department available",
    }));

    console.log("✅ Firestore Data Fetched:", data);
    return data;
  } catch (error) {
    console.error("❌ Firestore Fetch Error:", error);
    return [];
  }
}
