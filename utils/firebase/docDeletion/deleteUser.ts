import { fetchMatchedDataSnapshot } from "../docRetrieval/retrieve.ts";
import { deleteDoc, doc, QueryDocumentSnapshot } from "firestore";
import { auth, db } from "../../firebase.ts";
import { deleteUser } from "firebase/auth";
export async function deleteUserData() {
  try {
    const user = auth.currentUser;
    console.log(user);
    console.log("retrieve reviews doc");
    const reviewsSnapshot = await fetchMatchedDataSnapshot("reviews", {
      reviewer: user.uid,
    });
    console.log("retrieve clubs doc");
    const clubsSnapshot = await fetchMatchedDataSnapshot("clubs", {
      clubOwner: user.uid,
    });
    console.log("retrieve businesses doc");
    const businessSnapshot = await fetchMatchedDataSnapshot("businesses", {
      businessOwner: user.uid,
    });

    console.log("Deleting user reviews, clubs, and businesses.");
    const deletePromises = [
      ...reviewsSnapshot.docs.map((document: QueryDocumentSnapshot) =>
        deleteDoc(doc(db, "reviews", document.id))
      ),
      ...clubsSnapshot.docs.map((document: QueryDocumentSnapshot) =>
        deleteDoc(doc(db, "clubs", document.id))
      ),
      ...businessSnapshot.docs.map((document: QueryDocumentSnapshot) =>
        deleteDoc(doc(db, "businesses", document.id))
      ),
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
