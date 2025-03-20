import { fetchMatchedDataSnapshot } from "../docRetrieval/retrieve.ts";
import { deleteDoc, doc, QueryDocumentSnapshot } from "firestore";
import { auth, db } from "../../firebase.ts";
import { deleteUser } from "firebase/auth";
export async function deleteUserData() {
  try {
    const user = auth.currentUser;
    console.log(user);
    console.log("retrieve reviews doc");
    if (!user) {
      throw new Error("No user found.");
    }
    if (!user.uid) {
      throw new Error("No uid found.");
    }
    const reviewsSnapshot = await fetchMatchedDataSnapshot("reviews", {
      reviewer: user.uid,
    });
    console.log("retrieve clubs doc");
    const clubsSnapshot = await fetchMatchedDataSnapshot("clubs", {
      uid: user.uid,
    });
    console.log("retrieve businesses doc");
    const businessSnapshot = await fetchMatchedDataSnapshot("businesses", {
      uid: user.uid,
    });
    const idToken = await user.getIdToken();
    console.log("Id token: ", idToken);
    console.log("Deleting user reviews, clubs, and businesses.");
    const deletePromises = [
      ...reviewsSnapshot.docs.map((document: QueryDocumentSnapshot) =>
        deleteDoc(doc(db, "reviews", document.id))
      ),
      ...clubsSnapshot.docs.map(async (document) => {
        try {
          const response = await fetch("/api/deletion/clubDeletion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idToken: idToken,
              clubRef: document.id,
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to delete business: ${document.id}`);
          }

          console.log(`Successfully deleted: ${document.id}`);
        } catch (error) {
          console.error("Error deleting document:", error);
        }
      }),
      ...businessSnapshot.docs.map(async (document) => {
        try {
          const response = await fetch("/api/deletion/businessDeletion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idToken: idToken,
              businessRef: document.id,
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to delete business: ${document.id}`);
          }

          console.log(`Successfully deleted: ${document.id}`);
        } catch (error) {
          console.error("Error deleting document:", error);
        }
      }),
    ];

    console.log(deletePromises);
    await Promise.all(deletePromises);
    console.log("Deleted user reviews and clubs.");
    await deleteUser(user);
    console.log("Deleted user.");

    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting user:", error);
    } else {
      console.error("Unknown error occurred while deleting user:", error);
      throw error;
    }
  }
}
