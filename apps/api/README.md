# Backend — apps/api

API construida con **Bun** y **Hono** que:

- Genera hojas de ruta utilizando Gemini (IA).
- Valida datos mediante Zod.
- Persiste la información en PostgreSQL usando Drizzle ORM.

---

## 🌐 Endpoints

Base: `http://localhost:3000`

### 🟢 POST `/generate-roadmap`

Generar y guaradr un roadmap

**Request**
```json
{
  "topic": "React"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "HRIA-uuid",
    "topic": "React",
    "content": { "modules": [...] },
    "createdAt": "2025-08-11T..."
  }
}
```

### 🔵 GET `/roadmaps`

Lista todos los roadmaps.

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": "HRIA-uuid",
      "topic": "React",
      "createdAt": "...",
      "content": { "modules": [...] }
    }
  ]
}
```

### 🔵 GET `/roadmaps/:id`

Devuelve un roadmap por su ID.

---

## ⚙️ Variables de entorno

```yaml
GEMINI_API_KEY=tu_api_key_gemini  
DATABASE_URL=postgresql://usuario:password@localhost:5432/hoja_ruta_dev
```

---

## 🗂️ Archivos clave

- `src/index.ts` — rutas API
- `src/services/gemini.ts` — llamada a Gemini
- `src/__test__/` — tests unitarios

---

## 🧱 Drizzle ORM

- **Esquema:** `packages/db/src/schema.ts`
- **Repositorio:** `roadmap-repo.ts`

### Migraciones

```bash
cd packages/db  
npx drizzle-kit generate --config drizzle.config.ts  
npx drizzle-kit migrate --config drizzle.config.ts
```

---

## 🧪 Tests

```bash
cd apps/api  
bun test
```

- Los tests unitarios mockean Gemini  
- Los tests de integración requieren API KEY  