import { serverApp as app } from "../index";
import { serve } from "bun";
import type { Roadmap } from "../types/roadmap";

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

  const json = await res.json() as { success: boolean; data: Roadmap };

  const roadmap = json.data;

  expect(roadmap).toBeDefined();
  expect(Array.isArray(roadmap.content.modules)).toBe(true);
  expect(roadmap.content.modules.length).toBeGreaterThan(0);

  for (const module of roadmap.content.modules) {
    expect(typeof module.title).toBe("string");
    expect(typeof module.summary).toBe("string");
    expect(Array.isArray(module.resources)).toBe(true);

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
