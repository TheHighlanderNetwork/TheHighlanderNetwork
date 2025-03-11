import { auth } from "../firebaseAdmin.ts";

async function getUserClaims(uid: string): Promise<Record<string, unknown>> {
  try {
    // Retrieve custom claims from Firebase
    const user = await auth.getUser(uid);
    console.log("Custom Claims:", user.customClaims);
    return user.customClaims;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred", error);
    }
    return {};
  }
}

getUserClaims("kLwjp4lZxPgR5UJgZ4nerSqT7xS2");
