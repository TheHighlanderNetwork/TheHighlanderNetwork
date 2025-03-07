import { serve } from "https://deno.land/std@0.179.0/http/server.ts";

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (url.pathname === "/") {
    try {
      const html = await Deno.readTextFile("index.html");
      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
    } catch (error) {
      console.error("❌ Error reading index.html:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  return new Response("Not Found", { status: 404 });
}

console.log("✅ Server running at http://localhost:8000");
serve((req) => handler(req), { port: 8000 });
