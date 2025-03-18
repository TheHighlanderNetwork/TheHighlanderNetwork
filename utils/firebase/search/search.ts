import Fuse from "fuse";
import { db } from "../../firebase.ts";
import { collection, doc, getDoc, getDocs } from "firestore";
import { DocumentData } from "npm:firebase-admin/firestore";

export async function retrieveAllDocuments(collec: string) {
  try {
    console.log("Fetching data");
    console.time("Retrieved all entries");
    // Retrieve document from
    const querySnapshot = await getDocs(collection(db, collec));
    console.timeEnd("Retrieved all entries");

    console.log(querySnapshot);
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error while retrieving document data: ", error.message);
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}

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

    console.log(docSnapshot.data());

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

export function search(
  entryData: DocumentData,
  query: string,
): Promise<{ item: { id: string; name: string }; score: number }[]> {
  try {
    // Check if query is empty, return all results if empty
    if (!query.trim()) {
      return Promise.resolve(
        Object.keys(entryData).map((id) => ({
          item: {
            id: id, // Store the ID as 'id'
            name: String(entryData[id]), // Store the name
          },
          score: 0,
        })),
      );
    }
    const formattedCourses = Object.keys(entryData).map((id) => ({
      id: id, // Store the ID as 'id'
      name: entryData[id], // Store the code
    }));
    console.log("Search data: ", formattedCourses);
    // Setup Fuse.js
    const options = {
      keys: ["name"], // Search these fields
      threshold: 0.3, // Lower = stricter matches, Higher = fuzzier matches
      includeScore: true,
    };
    const fuse = new Fuse(formattedCourses, options);
    console.time("Fuse.js Search");
    const results = fuse.search(query);
    console.timeEnd("Fuse.js Search");
    console.log("fuse results:", results);
    return results;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error while searching document data: ", error.message);
      return Promise.reject(error);
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}

// Takes in a bitstream of length 4 to represent the filtering. 0001: courses, 0010: professors, 0100: businesses 1000: clubs
export async function userSearch(
  filter: number,
  query: string,
): Promise<{ item: { id: string; name: string }; score: number }> {
  try {
    if (filter < 0 || filter > 15) {
      throw new Error("The bitField must be a 4-bit value (between 0 and 15)");
    }
    const collections: string[] = [];
    if (filter & 0b1000) collections.push("professors");
    if (filter & 0b0100) collections.push("courses");
    if (filter & 0b0010) collections.push("businesses");
    if (filter & 0b0001) collections.push("clubs");

    let allData: DocumentData = {};
    for (const doc of collections) {
      const currDoc = await retrieveDocument("all_entries", doc);
      if (!currDoc) {
        console.log(`Document with ID ${doc} does not exist.`);
        continue;
      }
      allData = { ...allData, ...currDoc };
    }

    return search(allData, query);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error while performing user search: ", error.message);
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}
