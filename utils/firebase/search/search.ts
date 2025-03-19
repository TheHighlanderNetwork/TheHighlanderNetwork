import Fuse from "fuse";
import { DocumentData } from "npm:firebase-admin/firestore";
import { retrieveDocument } from "../docRetrieval/retrieve.ts";

// Searches the given documents with the query using Fuse
export function search(
  entryData: DocumentData,
  query: string,
): Promise<
  { item: { id: string; name: string; type: number }; score: number }[]
> {
  try {
    // Check if query is empty, return all results if empty
    // Omitted to reduce number of reads
    // if (!query.trim()) {
    //   return Promise.resolve(
    //     Object.keys(entryData).map((id) => ({
    //       item: {
    //         id: id, // Store the ID as 'id'
    //         name: String(entryData[id][0]), // Store the name
    //         type: entryData[id][1],
    //       },
    //       score: 0,
    //     })),
    //   );
    // }

    // Format DocumentData to search with Fuse
    const formattedCourses = Object.keys(entryData).map((id) => ({
      id: id, // Store the ID as 'id'
      name: entryData[id][0], // Store the name
      type: entryData[id][1],
    }));

    // console.log("Search data: ", formattedCourses);
    // Setup Fuse.js
    const options = {
      keys: ["name"], // Search by name
      threshold: 0.3,
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

// Retrives the full information of all search results
export async function retrieveDocFromSearch(
  searchResult: {
    item: { id: string; name: string; type: number };
    score: number;
  }[],
): Promise<DocumentData[]> {
  try {
    const allData: DocumentData[] = [];

    for (const result of searchResult) {
      const currDoc = await retrieveDocument(
        getCollectionFromType(result.item.type),
        result.item.id,
      );
      if (!currDoc) {
        console.log(`Document with ID ${result.item.id} does not exist.`);
        continue;
      }
      allData.push(currDoc);
    }
    return allData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error while retrieving document data: ", error.message);
      return Promise.reject(error);
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}

// Helper function to add typing to searches
function transformDocumentData(
  docData: DocumentData,
  collection: string,
): DocumentData {
  return Object.fromEntries(
    Object.entries(docData).map((
      [key, value],
    ) => [key, [value, getEntryType(collection)]]),
  );
}

// Convert docID to type value used for filtering search results
function getEntryType(collection: string): number {
  if (collection === "professors") {
    return 1;
  } else if (collection === "courses") {
    return 2;
  } else if (collection === "businesses") {
    return 3;
  } else if (collection === "clubs") {
    return 4;
  }
  return -1;
}

// Convert type back to collection for retrieving information from search results
function getCollectionFromType(type: number): string {
  if (type === 1) {
    return "professors";
  } else if (type === 2) {
    return "courses";
  } else if (type === 3) {
    return "businesses";
  } else if (type === 4) {
    return "clubs";
  }
  return "none";
}

// Takes in a bitstream of length 4 to represent the filtering. professors: 0b1000, courses: 0b0100, businesses: 0b0010, clubs: 0b0001
export async function userSearch(
  filter: number,
  query: string,
): Promise<
  { item: { id: string; name: string; type: number }; score: number }[]
> {
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
      allData = { ...allData, ...transformDocumentData(currDoc, doc) };
    }

    return search(allData, query);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error while performing user search: ", error.message);
      return Promise.reject(error);
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}
