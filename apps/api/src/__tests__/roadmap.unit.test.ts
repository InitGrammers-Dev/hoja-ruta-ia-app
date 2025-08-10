import { serverApp as app } from "../index";
import { serve } from "bun";
import type { RoadmapResponse } from "../types/roadmap";
import * as geminiService from "../services/gemini";

let server: ReturnType<typeof Bun.serve>;

beforeAll(() => {
  jest.spyOn(geminiService, "callGemini").mockImplementation(async () => ({
    modules: [
      {
        title: "Módulo Mock",
        summary: "Resumen Mock",
        resources: [{ type: "article", title: "Mock Resource", description: "Mock desc" }],
      },
    ],
  } satisfies RoadmapResponse));

  server = serve({
    port: 4000,
    fetch: app.fetch,
  });
});

afterAll(() => {
  server.stop();
  jest.restoreAllMocks();
});

test("debe devolver un roadmap válido (mock)", async () => {
  const res = await fetch("http://localhost:4000/generate-roadmap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic: "React" }),
  });

  const json = await res.json() as { roadmap: RoadmapResponse };

  expect(res.status).toBe(200);
  expect(json.roadmap.modules).toBeDefined();
  expect(Array.isArray(json.roadmap.modules)).toBe(true);
});
