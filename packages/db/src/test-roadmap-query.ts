// test-roadmap-query.ts

import dotenv from "dotenv";
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { desc } from "drizzle-orm";
import { roadmaps } from "./schema"; // Asegúrate que esta ruta sea correcta
import { schema } from "./schema";

// Crear conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Inicializar Drizzle con el esquema
const db = drizzle(pool, { schema });

async function testQuery() {
  try {
    const result = await db.query.roadmaps.findMany({
      columns: { id: true },
      orderBy: [desc(roadmaps.id)],
      limit: 1,
    });

    console.log("✅ Resultado de la consulta:", result);
  } catch (error: any) {
    console.error("❌ Error al ejecutar la consulta:");
    console.error(error.message);
  } finally {
    await pool.end(); // Cierra la conexión al final
  }
}

// Ejecutar la función de prueba
testQuery();
