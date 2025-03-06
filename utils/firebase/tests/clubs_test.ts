import { createClub, deleteClub, getClub, updateClub } from "../clubs.ts";
import { db } from "../firebase.ts";

Deno.test("Club CRUD Operations", async (t) => {
  let clubId: string;

  await t.step("Create Club", async () => {
    const club = await createClub({
      name: "Chess Club",
      description: "For chess lovers",
      email: "chess@club.com",
      images: ["chess1.jpg"],
      location: "Library Room 101",
    });
    clubId = club.id;
    console.assert(clubId != null, "Club ID should exist");
  });

  await t.step("Get Club", async () => {
    const club = await getClub(clubId);
    console.assert(club.id === clubId, "Retrieved correct club");
  });

  await t.step("Update Club", async () => {
    await updateClub(clubId, { description: "Updated description" });
    console.assert(
      (await getClub(clubId)).description === "Updated description",
      "Club description updated",
    );
  });

  await t.step("Delete Club", async () => {
    await deleteClub(clubId);
    try {
      await getClub(clubId);
      console.assert(false, "Club should be deleted");
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        console.assert(
          error.message === "Club not found",
          "Proper error on delete",
        );
      } else {
        throw error;
      }
    }
  });

  await db.terminate();
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Tell deno tests to stfu for 1 second
});
