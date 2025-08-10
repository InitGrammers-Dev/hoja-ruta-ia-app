import { serverApp as app } from "../index";
import { serve } from "bun";
import type { RoadmapResponse } from "../types/roadmap";

let server: ReturnType<typeof Bun.serve>;

beforeAll(() => {
  server = serve({
    port: 4001,
    fetch: app.fetch,
  });
});

afterAll(() => {
  server.stop();
});

test("debe devolver un roadmap real (sin mocks)", async () => {
  const res = await fetch("http://localhost:4001/generate-roadmap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic: "React" }),
  });

  expect(res.status).toBe(200);

  const json = (await res.json()) as { roadmap: RoadmapResponse };

  // Comprobaciones básicas
  expect(json.roadmap).toBeDefined();
  expect(Array.isArray(json.roadmap.modules)).toBe(true);
  expect(json.roadmap.modules.length).toBeGreaterThan(0);

  // Validar estructura de cada módulo
  for (const module of json.roadmap.modules) {
    expect(typeof module.title).toBe("string");
    expect(typeof module.summary).toBe("string");
    expect(Array.isArray(module.resources)).toBe(true);

    // Validar estructura de cada recurso dentro del módulo
    for (const resource of module.resources) {
      expect(typeof resource.type).toBe("string");
      expect(typeof resource.title).toBe("string");
      expect(typeof resource.description).toBe("string");

      if (resource.url !== undefined) {
        expect(typeof resource.url).toBe("string");
      }
    }
  }
}, 30000);
