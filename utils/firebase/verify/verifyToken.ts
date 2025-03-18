export async function verifyUserToken(idToken: string) {
  console.log("Verifying Token:", idToken);
  try {
    const response = await fetch("/api/login/verifyIdToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get the raw response text (may be HTML or plain text)
      console.error("Error response from server:", errorText);
      throw new Error(errorText);
    }

    const data = await response.json();
    console.log(data);
    console.log("Verified token successfully");
    return true;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
}
