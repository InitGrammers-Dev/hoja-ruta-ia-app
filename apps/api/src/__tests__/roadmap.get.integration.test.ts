import { serverApp as app } from "../index";
import type { Roadmap } from "../types/roadmap";
import { serve } from "bun";

let server: ReturnType<typeof Bun.serve>;

beforeAll(() => {
  server = serve({
    port: 4003,
    fetch: app.fetch,
  });
});

afterAll(() => {
  server.stop();
});

test("integration: crear roadmap y obtenerlo por id", async () => {
  // Crear roadmap
  const postRes = await fetch("http://localhost:4003/generate-roadmap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic: "Integration Test Topic" }),
  });

  expect(postRes.status).toBe(200);

  const postJson = await postRes.json() as {
    success: boolean;
    data: Roadmap;
  };

  const created = postJson.data;
  expect(created).toBeDefined();
  expect(created.id).toBeDefined();

  // Obtener por ID
  const getRes = await fetch(`http://localhost:4003/roadmaps/${created.id}`);
  expect(getRes.status).toBe(200);

  const getJson = await getRes.json() as {
    success: boolean;
    data: Roadmap;
  };

  expect(getJson.success).toBe(true);
  expect(getJson.data.id).toBe(created.id);
}, 60000);
