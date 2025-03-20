import { db } from "../../firebase.ts";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  QuerySnapshot,
  where,
} from "firestore";
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
    const docRef = doc(db, collec, docID);
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

// Queries a collection for documents that have fields equal to the filters
export async function fetchMatchedData(
  collectionName: string,
  filters: Record<string, unknown>,
): Promise<DocumentData[]> {
  try {
    const queryRef = collection(db, collectionName);
    let q = queryRef; // Base query

    // Iterate over each key in filters and apply where() conditions
    Object.entries(filters).forEach(([key, value]) => {
      q = query(q, where(key, "==", value));
    });

    // Execute the query
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return results;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error while retrieving document data: ", error.message);
      return [];
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}

// Queries a collection for documents that have fields equal to the filters, returns the full snapshot instead of the document data
export async function fetchMatchedDataSnapshot(
  collectionName: string,
  filters: Record<string, unknown>,
): Promise<QuerySnapshot> {
  try {
    const queryRef = collection(db, collectionName);
    let q = queryRef; // Base query

    // Iterate over each key in filters and apply where() conditions
    Object.entries(filters).forEach(([key, value]) => {
      q = query(q, where(key, "==", value));
    });

    // Execute the query
    const querySnapshot = await getDocs(q);

    return querySnapshot;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error while retrieving document data: ", error.message);
      return new QuerySnapshot();
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}
