declare const Bun: any

import { Hono } from 'hono'
import { z } from 'zod'
import { callGemini } from './services/gemini'
import { saveRoadmap } from '@hoja-ruta-ia/db';
import type { RoadmapContent } from '@hoja-ruta-ia/db';
import 'dotenv/config'; // cargar variables de entorno .env

const app = new Hono()

// Schema de la request para /generate-roadmap
const generateRoadmapSchema = z.object({
  topic: z.string().min(3)
})

app.post('/generate-roadmap', async (c) => {
  try {
    const rawText = await c.req.text();

    if (!rawText) {
      throw new Error('El body está vacío');
    }

    const body = JSON.parse(rawText);
    const { topic } = generateRoadmapSchema.parse(body);

    const prompt = `
      Genera un roadmap de aprendizaje estructurado por módulos para el tema: "${topic}".
      Cada módulo debe contener:
        - title: título del módulo
        - summary: breve descripción del contenido del módulo
        - resources: una lista de recursos recomendados con la siguiente estructura:
          [
            {
              "type": "article | book | video | course | tutorial | dataset | documentation | repo | tool | podcast | blog",
              "title": "string",
              "url": "string (opcional si aplica)",
              "description": "string (breve descripción del recurso)"
            }
          ]
      Devuélvelo estrictamente en formato JSON con la forma:
      {
        "modules": [ { "title": "...", "summary": "...", "resources": [ ... ] } ]
      }
    `;

    const roadmapJson = await callGemini(prompt);
    // Validar el formato que devuelve Gemini (opcional pero recomendable)
    const content: RoadmapContent = roadmapJson;

    // Guardar en la base de datos
    const savedRoadmap = await saveRoadmap(topic, content);

    return c.json({
      success: true,
      data: savedRoadmap,
    });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error) }, 400);
  }
});

Bun.serve({
  port: 3000,
  fetch: app.fetch,
});

console.log("🚀 Servidor escuchando en http://localhost:3000");

const serverApp = app;
export { serverApp };