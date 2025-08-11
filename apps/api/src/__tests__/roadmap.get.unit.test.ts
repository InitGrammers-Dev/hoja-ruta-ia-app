import { serverApp as app } from "../index";
import { serve } from "bun";
import * as dbService from "@hoja-ruta-ia/db";
import type { Roadmap } from "../types/roadmap";

let server: ReturnType<typeof Bun.serve>;

beforeAll(() => {
  jest.spyOn(dbService, "getRoadmapById").mockImplementation(async (id: string) => {
    return {
      id,
      topic: "Mock Topic",
      content: { modules: [] },
      createdAt: new Date().toISOString(),
    } as any;
  });

  server = serve({
    port: 4002,
    fetch: app.fetch,
  });
});

afterAll(() => {
  server.stop();
  jest.restoreAllMocks();
});

test("GET /roadmaps/:id devuelve roadmap mockeado", async () => {
  const id = "HRIA-0001";
  const res = await fetch(`http://localhost:4002/roadmaps/${id}`);
  const json = await res.json() as {
    success: boolean;
    data: Roadmap;
  };

  expect(res.status).toBe(200);
  expect(json.success).toBe(true);
  expect(json.data).toBeDefined();
  expect(json.data.id).toBe(id);
});
