import { auth, db } from "../../firebaseAdmin.ts";
import { Handlers } from "$fresh/server.ts";
import { DecodedIdToken } from "npm:firebase-admin/lib/auth/token-verifier.js";

export type Professor = {
  netid: string;
  name: string;
  classes: string[];
  department: string;
};

const collection = "professors";

export async function getProfessor(id: string) {
  const doc = await db.collection(collection).doc(id).get();
  if (!doc.exists) throw new Deno.errors.NotFound("Professor not found");

  return { id: doc.id, ...doc.data() as Omit<Professor, "netid"> };
}

export async function updateProfessor(data: Partial<Professor>) {
  const { netid, ...updateData } = data;
  await db.collection(collection).doc(netid || "").update(updateData);
  return { netid, ...updateData };
}

export async function deleteProfessor(id: string) {
  await db.collection(collection).doc(id).delete();
  return { message: `Professor ${id} deleted` };
}

async function verifyAuthToken(
  req: Request,
): Promise<{ user: DecodedIdToken; error: string | null }> {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { user: null, error: "No valid authorization header" };
    }

    const token = authHeader.split("Bearer ")[1];
    if (!token) {
      return { user: null, error: "No token provided" };
    }

    const decodedToken = await auth.verifyIdToken(token);
    return { user: decodedToken, error: null };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Auth verification failed:", error.message);
      return { user: null, error: error.message };
    } else {
      return { user: null, error: `${error}` };
    }
  }
}

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { netid } = ctx.params;

    try {
      const professor = await getProfessor(netid);
      return new Response(JSON.stringify(professor), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return new Response(JSON.stringify({ error: "Professor not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },

  async PUT(req, ctx) {
    const { user, error } = await verifyAuthToken(req);
    if (error || !user) {
      return new Response(JSON.stringify({ error: error || "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { netid } = ctx.params;

    try {
      const body = await req.json();
      if (!body.name && !body.department) {
        return new Response(
          JSON.stringify({ error: "No valid fields to update" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const updateData: Partial<Professor> = {};
      updateData.netid = netid;
      if (body.name) updateData.name = body.name;
      if (body.department) updateData.department = body.department;
      if (body.classes) updateData.classes = body.classes;

      const result = await updateProfessor(updateData);
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return new Response(JSON.stringify({ error: "Professor not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },

  async DELETE(req, ctx) {
    const { user, error } = await verifyAuthToken(req);
    if (error || !user) {
      return new Response(JSON.stringify({ error: error || "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { netid } = ctx.params;

    try {
      const result = await deleteProfessor(netid);
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
