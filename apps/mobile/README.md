# App móvil — apps/mobile

App móvil en **React Native + Expo** para:

- Generar hojas de ruta con IA (Gemini)
- Ver listado de roadmaps
- Navegar por módulos y recursos

---

## 📱 Pantallas

- `Home` → ingreso del tema y botón generar
- `Explore` → lista de roadmaps existentes
- `Roadmap` → módulos y recursos detallados

---

## 🗂️ Estructura

```
apps/mobile/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx      # Home
│   |   └── explore.tsx    # Lista roadmaps
│   ├── roadmap.tsx        # Detalle
│   └── webview.tsx        # Ver contenido web en la app
├── src/
│   ├── api/index.ts
...
```

---

## ⚙️ Configuración de API

Archivo: `src/api/index.ts`

```ts
const LOCAL_IP = "http://192.168.100.27:3000";
const LOCALHOST = Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";
const API_BASE = process.env.API_URL ?? (Platform.OS === "android" || Platform.OS === "ios" ? LOCAL_IP : LOCALHOST);
```

Asegúrate de poner su IP local real si usas celular físico.

## 🚀 Ejecutar la app

```bash
cd apps/mobile
npm install
expo start
```

- **Android:** usa `10.0.2.2:3000`
- **iOS/Web:** usa `localhost:3000`
- **Celular:** IP local real

## 📡 Ejemplos de uso
```ts
// Generar roadmap
const roadmap = await generateRoadmap("React");

// Listar roadmaps
const items = await fetchRoadmaps();

// Obtener uno por ID
const item = await fetchRoadmapById("HRIA-xxxxx");
```