export const loginHandler = async (req: Request): Promise<Response> => {
  try {
    // Parse the request body
    const { rmail } = await req.json();

    // Validate input
    if (!rmail) {
      return new Response(
        JSON.stringify({ error: "rmail is required" }),
        { status: 400 },
      );
    }

    // Validate `rmail` format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@ucr\.edu$/;
    if (!emailRegex.test(rmail)) {
      return new Response(
        JSON.stringify({
          error: "Invalid email format. Only `.ucr.edu` emails are allowed.",
        }),
        { status: 400 },
      );
    }

    // Fetch all student documents
    const collection = "students";
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/thehighlandernetwork/databases/(default)/documents/${collection}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    const data = await response.json();

    if (!response.ok || !data.documents) {
      return new Response(
        JSON.stringify({ error: "Failed to retrieve student data" }),
        { status: 500 },
      );
    }

    // Filter manually for the matching rmail
    const user = data.documents.find((doc: tgvf) =>
      doc.fields.rmail.stringValue === rmail
    );

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 },
      );
    }

    // Return success response with user data
    return new Response(
      JSON.stringify({ message: "Login successful", user }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error during login:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

/**
 * Test function to simulate a login request with a given email.
 */
const testLoginHandler = async (email: string) => {
  if (!email) {
    console.error("Error: Email is required.");
    return;
  }

  const mockRequest = new Request("http://localhost/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rmail: email }),
  });

  console.log("Testing loginHandler with email:", email);

  // Call loginHandler with the mock request
  const response = await loginHandler(mockRequest);

  // Log the response
  const responseBody = await response.json();
  console.log("Response:", response.status, responseBody);
};

// Example usage: Call testLoginHandler with a specific email
await testLoginHandler("anna@ucr.edu");
