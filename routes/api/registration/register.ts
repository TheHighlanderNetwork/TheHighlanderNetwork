import { firestoreSetDocument } from "../firebase.ts";

const addStudent = async (rmail: string): Promise<void> => {
  try {
    // Validate the email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@ucr\.edu$/;
    if (!emailRegex.test(rmail)) {
      throw new Error("Invalid email format. Only `.ucr.edu` emails are allowed.");
    }

    // Generate a unique document ID for the student
    const studentId = crypto.randomUUID();

    // Update or add the document in the "students" collection
    const result = await firestoreSetDocument("students", studentId, {
      rmail, // Field name matches your current database
    });

    console.log("Student added successfully:", result);
  } catch (error) {
    console.error("Error adding student:", error.message);
  }
};

// Test the function
addStudent("anna@ucr.edu");






