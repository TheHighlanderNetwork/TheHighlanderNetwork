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

export async function createProfessor(data: Professor) {
  const { netid, ...professorData } = data;
  const docRef = db.collection(collection).doc(netid);
  await docRef.set(professorData);
  return { id: netid, ...professorData };
}

async function verifyAuthToken(
  req: Request,
): Promise<{ user: DecodedIdToken | null; error: string | null }> {
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
  async POST(req) {
    const { user, error } = await verifyAuthToken(req);
    if (error || !user) {
      return new Response(JSON.stringify({ error: error || "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const body = await req.json();

      if (!body.netid || !body.name || !body.department || !body.classes) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const result = await createProfessor(body);
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
