import {
  createProfessor,
  deleteProfessor,
  getProfessor,
  updateProfessor,
} from "../professors.ts";
import { db } from "../firebase.ts";

Deno.test("Professor CRUD Operations", async (t) => {
  let professorId: string;

  await t.step("Create Professor", async () => {
    const professor = await createProfessor({
      name: "Dr. Smith",
      classes: ["CS101"],
    });
    professorId = professor.id;
    console.assert(professorId != null, "Professor ID should exist");
  });

  await t.step("Get Professor", async () => {
    const professor = await getProfessor(professorId);
    console.assert(professor.id === professorId, "Retrieved correct professor");
  });

  await t.step("Update Professor", async () => {
    await updateProfessor(professorId, { classes: ["CS102"] });
    console.assert(
      (await getProfessor(professorId)).classes.includes("CS102"),
      "Classes updated",
    );
  });

  await t.step("Delete Professor", async () => {
    await deleteProfessor(professorId);

    let threwNotFound = false;
    try {
      await getProfessor(professorId);
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
