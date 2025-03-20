import { auth } from "../firebaseAdmin.ts";

export async function updateNumClubs(uid: string, numclubs: number) {
  try {
    // Retrieve existing claims
    const user = await auth.getUser(uid);
    const currentClaims = user.customClaims || {};

    // If the user has reached the limit, set a flag
    const clubLimitReached = numclubs >= 5;

    await auth.setCustomUserClaims(uid, {
      ...currentClaims,
      numclubs,
      clubLimitReached, // ✅ Set flag when reaching the limit
    });

    console.log(`✅ Updated numclubs for UID ${uid}: ${numclubs}, Limit Reached: ${clubLimitReached}`);
    return { success: true };
  } catch (error) {
    console.error("🚨 Error updating numclubs:", error);
    throw new Error("Failed to update numclubs.");
  }
}
