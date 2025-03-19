import { db } from "../../firebase.ts";
import { collection, doc, getDoc, getDocs } from "firestore";
import { DocumentData } from "npm:firebase-admin/firestore";

// Retrieves all documents from a given collection
export async function retrieveAllDocuments(
  collec: string,
): Promise<DocumentData[]> {
  try {
    console.log("Fetching data");
    console.time("Retrieved all entries");
    // Retrieve document from
    const querySnapshot = await getDocs(collection(db, collec));
    console.timeEnd("Retrieved all entries");

    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error while retrieving document data: ", error.message);
      return Promise.reject(error);
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}

// Retrieves a specific docID from a given collection
export async function retrieveDocument(
  collec: string,
  docID: string,
): Promise<DocumentData> {
  try {
    console.log("Fetching data");

    console.time("Retrieve document");
    const docRef = doc(db, collec, docID); // "yourCollection" is the collection name
    const docSnapshot = await getDoc(docRef);
    console.timeEnd("Retrieve document");

    // console.log(docSnapshot.data());

    return docSnapshot.data();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error while retrieving document data: ", error.message);
      return Promise.reject(error);
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}
