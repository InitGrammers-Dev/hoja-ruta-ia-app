# 🗺️ Hoja de Ruta IA — Monorepo

Generador de **hojas de ruta de aprendizaje** usando IA.  
Monorepo con backend (Bun + Hono + Gemini), persistencia (Drizzle + Postgres) y app móvil (React Native + Expo).

---

## 🧩 Arquitectura del Proyecto (Diagrama UML)

Este diagrama muestra la interacción entre los módulos del sistema y la estructura general del monorepo.

![Diagrama de arquitectura](./docs/diagram-uml.svg)

## 📂 Estructura del repositorio

Esta estructura refleja la organización del monorepo, el cual separa las responsabilidades entre las aplicaciones (`apps/`), los paquetes (`packages/`) y configuraciones generales.

```
hoja-ruta-ia-app/
├── apps/               # Aplicaciones principales
│   ├── api/            # Backend API con tests, servicios y configuración
│   └── mobile/         # App móvil con componentes, API y configuraciones
├── packages/           # Paquetes compartidos y reutilizables
│   ├── db/             # Acceso y esquema de base de datos
│   └── shared/         # Tipos y utilidades compartidas
├── docs/               # Documentación del proyecto
├── README.md           # Documento principal del proyecto
├── package.json        # Dependencias y scripts raíz
└── .gitignore          # Archivos ignorados por Git
```

## 🚀 Tecnologías principales

- **Backend:** Bun, Hono, Zod, @google/genai (Gemini), Drizzle  
- **Base de datos:** PostgreSQL  
- **ORM:** Drizzle + drizzle-kit  
- **Móvil:** React Native + Expo + expo-router  
- **Monorepo:** npm workspaces  
- **Testing:** bun test (estilo Jest)  
- **Lenguaje:** TypeScript  

---

## ⚡ Quick Start (local)

### Requisitos

- Node / Bun  
- PostgreSQL  
- Expo CLI  

### Pasos para iniciar

1. **Clonar y configurar proyecto**
```bash
git clone https://github.com/IA-Code-App/hoja-ruta-ia-app.git
cd hoja-ruta-ia-app
npm install
```

2. **Crear DB y configurar `.env`**

Crear la base de datos PostgreSQL y configurar las variables de entorno necesarias para el proyecto.

**Archivo `.env`**

```yaml
GEMINI_API_KEY=tu_clave_gemini
DATABASE_URL=postgresql://usuario:password@localhost:5432/hoja_ruta_dev
```

3. **Migraciones**

Generar y aplicar las migraciones en la base de datos usando Drizzle.

```bash
cd packages/db
npx drizzle-kit generate --config drizzle.config.ts
npx drizzle-kit migrate --config drizzle.config.ts
```

4. **Levantar el backend**

Instalar dependencias y ejecutar el servidor backend.

```bash
cd apps/api
bun install
bun run src/index.ts
```

5. **Ejecutar app móvil**

Instalar dependencias y levantar la aplicación móvil con Expo.

```bash
cd apps/mobile
npm install
expo start
```

- **Notas para Android:** usar `http://10.0.2.2:3000`
- **Para iOS/Web:** usar `http://localhost:3000`
- **Dispositivo físico:** usar la IP local de su PC

__________

### 🧪 Testing

Ejecutar los tests en el backend:

```bash
cd apps/api
bun test
```

Los tests unitarios mockean Gemini, mientras que los tests de integración requieren la API KEY.


### 🧬 Flujo Git recomendado

```bash
git checkout -b feature/mi-feature
# realizar cambios...
git add .
git commit -m "feat(api): agregar endpoint X"
git push -u origin feature/mi-feature
```
Luego crear un Pull Request, hacer revisión y merge.

### 🧭 Dónde mirar el código

- **Backend:** `apps/api/src/`
- **Base de datos:** `packages/db/src/`
- **App móvil:** `apps/mobile/app/`, `apps/mobile/src/api/`
