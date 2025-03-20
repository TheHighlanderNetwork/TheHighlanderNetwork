import {
  deleteProfessor,
  getProfessor,
  updateProfessor,
} from "../../../routes/api/db/professors/[netid].ts";
import { createProfessor } from "../../../routes/api/db/professors/index.ts";
import { db } from "../../../routes/api/firebaseAdmin.ts";

Deno.test("Professor CRUD Operations", async (t) => {
  let professorId: string;

  await t.step("Create Professor", async () => {
    const professor = await createProfessor({
      netid: "testid420",
      name: "Dr. Smith",
      department: "Science",
      classes: ["000"],
    });
    professorId = professor.id;
    console.assert(professorId != null, "Professor ID should exist");
  });

  await t.step("Get Professor", async () => {
    const professor = await getProfessor(professorId);
    console.assert(professor.id === professorId, "Retrieved correct professor");
  });

  await t.step("Update Professor", async () => {
    await updateProfessor({ netid: professorId, department: "Math" });
    console.assert(
      (await getProfessor(professorId)).department == "Math",
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
          error.message === "Professor not found",
          "Proper error on delete",
        );
      } else {
        throw error;
      }
    }

    console.assert(threwNotFound, "getProfessor should throw NotFound error");
  });
  await db.terminate();
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Tell deno tests to stfu for 1 second
});
