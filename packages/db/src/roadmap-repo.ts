import { v4 as uuidv4 } from 'uuid';
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
  return `HRIA-${uuidv4()}`;
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

export async function getRoadmaps() {
  const roadmapsList = await db.query.roadmaps.findMany({
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  });

  return roadmapsList;
}
