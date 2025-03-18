import "https://deno.land/x/dotenv@v3.2.2/mod.ts";

import { cert, getApp, getApps, initializeApp } from "npm:firebase-admin/app";
import { getAuth } from "npm:firebase-admin/auth";
import { getFirestore } from "npm:firebase-admin/firestore";

const FIREBASE_FIRESTORE_URL =
  `https://firestore.googleapis.com/v1/projects/thehighlandernetwork/databases/(default)/documents`;

export const firestoreSetDocument = async <T extends Record<string, unknown>>(
  collection: string,
  documentId: string,
  data: T,
): Promise<unknown> => {
  const formattedData = {
    fields: Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (typeof value === "string") {
          return [key, { stringValue: value }];
        } else if (value instanceof Date || typeof value === "number") {
          return [key, { timestampValue: new Date(value).toISOString() }];
        } else {
          throw new Error(`Unsupported data type for key: ${key}`);
        }
      }),
    ),
  };

  const response = await fetch(
    `${FIREBASE_FIRESTORE_URL}/${collection}/${documentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    },
  );

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(
      responseData.error?.message || "Failed to update document in Firestore",
    );
  }

  return responseData;
};

/**
 * Firebase Firestore - Get Document
 */
export const firestoreGetDocument = async (
  collection: string,
  documentId: string,
): Promise<unknown> => {
  const response = await fetch(
    `${FIREBASE_FIRESTORE_URL}/${collection}/${documentId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.error?.message || "Failed to get document from Firestore",
    );
  }
  return data;
};

// Check if Firebase has already been initialized

console.log("Initializing Firebase Admin App...");
let adminApp;
// Only initialize if it is uninitialized to avoid creating duplicate instances
if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert(
      JSON.parse(Deno.env.get("FIREBASE_SERVICE_ACCOUNT") || "{}"),
    ),
  });
  console.log("Firebase Admin initialized");
} else {
  adminApp = getApp(); // Reuse existing app instance
  console.log("Firebase app reused");
}

// Export Firebase services for reuse
export const auth = getAuth(adminApp);
export const db = getFirestore(adminApp);