import { db } from "./client";
import { roadmaps } from "./schema";
import { desc } from "drizzle-orm";

export type RoadmapContent = {
  modules: Array<{
    title: string;
    summary: string;
    resources: Array<{
      type: string;
      title: string;
      description: string;
      url?: string;
    }>;
  }>;
};

async function generateNextId(): Promise<string> {
  try {
    const lastRow = await db.query.roadmaps.findMany({
      columns: { id: true },
      orderBy: [desc(roadmaps.id)],
      limit: 1,
    });

    const lastId = lastRow[0]?.id ?? "HRIA-0000";
    const match = lastId.match(/HRIA-(\d+)/);
    const lastNumber = match?.[1] ? parseInt(match[1], 10) : 0;
    const nextNumber = lastNumber + 1;

    return `HRIA-${nextNumber.toString().padStart(4, "0")}`;
  } catch (error) {
    console.error("❌ Error al generar el siguiente ID:", error);
    throw error;
  }
}

export async function saveRoadmap(topic: string, content: RoadmapContent) {
  const id = await generateNextId();

  const [result] = await db.insert(roadmaps).values({
    id,
    topic,
    content,
  }).returning();

  return result;
}

export async function getRoadmapById(id: string) {
  const roadmap = await db.query.roadmaps.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });

  return roadmap || null;
}
