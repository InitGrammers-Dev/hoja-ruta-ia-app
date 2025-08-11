import { Platform } from "react-native";

// Si estás en Android emulador, usá 10.0.2.2 (emulador)
// Si estás en iOS simulador, usá localhost
// Si estás en dispositivo físico, poné la IP local de tu PC acá abajo:
const LOCAL_IP = "http://192.168.100.27:3000";

const LOCALHOST = Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

const API_BASE =
  process.env.API_URL ??
  (Platform.OS === "android" || Platform.OS === "ios" ? LOCAL_IP : LOCALHOST);

export async function generateRoadmap(topic: string) {
  const res = await fetch(`${API_BASE}/generate-roadmap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Error generando roadmap");
  return json.data ?? json.roadmap;
}

export async function fetchRoadmaps() {
  const res = await fetch(`${API_BASE}/roadmaps`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Error obteniendo roadmaps");
  return json.data ?? json;
}

export async function fetchRoadmapById(id: string) {
  const res = await fetch(`${API_BASE}/roadmaps/${encodeURIComponent(id)}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Error obteniendo roadmap");
  return json.data ?? json;
}
