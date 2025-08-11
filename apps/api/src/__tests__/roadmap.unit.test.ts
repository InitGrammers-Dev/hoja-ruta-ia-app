import { serverApp as app } from "../index";
import { serve } from "bun";
import type { RoadmapResponse } from "../types/roadmap";
import * as geminiService from "../services/gemini";
import * as dbService from "@hoja-ruta-ia/db";

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

  jest.spyOn(dbService, "saveRoadmap").mockImplementation(async (topic, content) => {
    return {
      id: "HRIA-0001",
      topic,
      content,
      createdAt: new Date().toISOString(),
    } as any;
  });

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

  const json = await res.json() as { success: boolean; data: any };

  expect(res.status).toBe(200);
  expect(dbService.saveRoadmap).toHaveBeenCalledTimes(1);
  expect(json.data).toBeDefined();
  expect(json.data.id).toBe("HRIA-0001");
});
