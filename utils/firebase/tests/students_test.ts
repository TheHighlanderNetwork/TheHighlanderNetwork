import {
  createStudent,
  deleteStudent,
  getStudent,
  updateStudent,
} from "../students.ts";
import { db } from "../firebase.ts";

Deno.test("Student CRUD Operations", async (t) => {
  let studentId: string;

  await t.step("Create Student", async () => {
    const student = await createStudent({
      clubCount: 2,
      rmail: "student@example.com",
    });
    studentId = student.id;
    console.assert(studentId != null, "Student ID should exist");
  });

  await t.step("Get Student", async () => {
    const student = await getStudent(studentId);
    console.assert(student.id === studentId, "Retrieved correct student");
  });

  await t.step("Update Student", async () => {
    await updateStudent(studentId, { clubCount: 3 });
    console.assert(
      (await getStudent(studentId)).clubCount === 3,
      "Student club count updated",
    );
  });

  await t.step("Delete Student", async () => {
    await deleteStudent(studentId);

    let threwNotFound = false;
    try {
      await getStudent(studentId);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        threwNotFound = true;
        console.assert(
          error.message === "Business not found",
          "Proper error on delete",
        );
      } else {
        throw error;
      }
    }

    console.assert(threwNotFound, "getBusiness should throw NotFound error");
  });

  await db.terminate();
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Tell deno tests to stfu for 1 second
});
