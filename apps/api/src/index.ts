declare const Bun: any

import { Hono } from 'hono'
import { z } from 'zod'
import { callGemini } from './services/gemini'

const app = new Hono()

// Schema de la request para /generate-roadmap
const generateRoadmapSchema = z.object({
  topic: z.string().min(3)
})

app.post('/generate-roadmap', async (c) => {
  try {
    const body = await c.req.json()
    const parsed = generateRoadmapSchema.parse(body)

    // payload genérico para Gemini
    const payload = {
      model: process.env.GEMINI_MODEL ?? 'gemini-lite',
      input: {
        prompt: `Genera un roadmap de aprendizaje por módulos para el tema: ${parsed.topic}. Devuélvelo en JSON con 'modules': [{title, summary, resources}]`,
        max_output_tokens: 800
      }
    }

    // Llamada a Gemini
    const gResp = await callGemini(payload)

    // Si la respuesta es texto o estructura distinta, parsea/valídala aquí antes de devolver.
    return c.json({ fromGemini: gResp })
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message :  String(error) }, 400)
  }
})

// En lugar de app.fire(), usa Bun.serve con app.fetch:
Bun.serve({
  port: 3000,
  fetch: app.fetch,
})

console.log('🚀 Servidor escuchando en http://localhost:3000')