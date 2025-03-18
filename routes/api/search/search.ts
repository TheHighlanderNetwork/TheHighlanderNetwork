import { db } from "../firebaseAdmin.ts";
import { Handlers } from "$fresh/server.ts";
// Import Fuse.js (if using a module-based environment, install with npm/yarn first)
import Fuse from "fuse";
import { DocumentData } from "npm:firebase-admin/firestore";

async function _searchTest() {
  console.time("Retrieve entries doc");
  const entries_collection = await db.collection("all_entries").doc("courses")
    .get();
  console.timeEnd("Retrieve entries doc");

  console.time("Retrieve prof doc");
  const prof_doc = await db.collection("all_entries").doc("professors").get();
  console.timeEnd("Retrieve prof doc");
  // const entries: Record<string, DocumentData> = {};
  const courseData = entries_collection.data();
  const profData = prof_doc.data();
  // for (const doc of entries_collection.docs) {
  //   entries[doc.id] = doc.data()
  // }
  if (!courseData) {
    console.log("Failed to retrieve all entries");
    return;
  }
  if (!profData) {
    console.log("Failed to retrieve all entries");
    return;
  }
  const formattedCourses = Object.keys(courseData).map((id) => ({
    id: id, // Store the ID as 'id'
    courseCode: courseData[id], // Store the course code
  }));

  // Setup Fuse.js
  const options = {
    keys: ["courseCode"], // Search these fields
    threshold: 0.3, // Lower = stricter matches, Higher = fuzzier matches
    includeScore: true,
  };
  const fuse = new Fuse(formattedCourses, options);

  // Measure Search Time
  const searchQuery = "cs10c"; // Example search
  console.time("Fuse.js Search");
  const results = fuse.search(searchQuery);
  console.timeEnd("Fuse.js Search");

  // Log Results
  console.log(`Found ${results.length} results`);
  console.log(results.slice(0, 5)); // Show first 5 results

  const formattedProfs = Object.keys(profData).map((id) => ({
    id: id, // Store the ID as 'id'
    name: profData[id], // Store the course code
  }));

  // Setup Fuse.js
  const options2 = {
    keys: ["name"], // Search these fields
    threshold: 0.3, // Lower = stricter matches, Higher = fuzzier matches
    includeScore: true,
  };
  const fuse2 = new Fuse(formattedProfs, options2);

  // Measure Search Time
  const searchQuery2 = "pat"; // Example search
  console.time("Fuse.js Search");
  const results2 = fuse2.search(searchQuery2);
  console.timeEnd("Fuse.js Search");

  // Log Results
  console.log(`Found ${results2.length} results`);
  // console.log(results2.slice(0, 5)); // Show first 5 results

  const docIds = results.slice(0, 5).map((result: { item: { id: string } }) =>
    result.item.id
  );
  const docRefs = docIds.map((docId: string) =>
    db.collection("courses").doc(docId)
  );

  // Retrieve all documents using getAll()
  console.time("Retrieve data for top 5 results");
  const snapshot = await db.getAll(...docRefs);
  console.timeEnd("Retrieve data for top 5 results");
  // Process the retrieved documents
  snapshot.forEach((doc) => {
    if (doc.exists) {
      console.log(`Document ID: ${doc.id}`);
      console.log("Document Data:", doc.data());
    } else {
      console.log(`No such document for ID: ${doc.id}`);
    }
  });
}

export const handler: Handlers = {
  async GET(req) {
    try {
      const { query, filter } = await req.json();

      if (!query) {
        return new Response(JSON.stringify({ error: "Query is required" }), {
          status: 400,
        });
      }

      // Uses a bit field to add filtering rules
      const filterBitfield = filter ?? 0b1111;

      // Determine which collections to search
      const collections: string[] = [];
      if (filterBitfield & 0b1000) collections.push("professors");
      if (filterBitfield & 0b0100) collections.push("courses");
      if (filterBitfield & 0b0010) collections.push("businesses");
      if (filterBitfield & 0b0001) collections.push("clubs");

      console.log("Searching in:", collections);

      const results: Record<string, DocumentData> = {};

      // Query each selected collection in Firebase
      for (const collection of collections) {
        const docRef = db.collection("all_entries").doc(collection);
        const docSnap = await docRef.get();

        if (!docSnap.exists) continue;

        // Filter entries locally by name containing the search query
        const allEntries = docSnap.data();
        if (!allEntries) {
          continue;
        }
        results[collection] = allEntries;
      }

      return new Response(JSON.stringify(results), { status: 200 });
    } catch (error) {
      if (error instanceof Error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, error: error }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }
  },
};

// searchTest();
