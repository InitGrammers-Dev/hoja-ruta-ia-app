import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function RoadmapScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const roadmap = params.roadmap ? JSON.parse(params.roadmap as string) : [];
  const modules = roadmap?.content?.modules ?? [];

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleModule = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  if (!modules.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No hay módulos para mostrar</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={modules}
        keyExtractor={(item: any, idx) => `${item.title ?? "module"}-${idx}`}
        renderItem={({ item, index }) => {
          const expanded = expandedIndex === index;
          return (
            <View style={styles.card}>
              <TouchableOpacity onPress={() => toggleModule(index)}>
                <Text style={styles.title}>
                  {item.title} {expanded ? "▼" : "▶"}
                </Text>
              </TouchableOpacity>
              {expanded && (
                <>
                  <Text style={styles.summary}>{item.summary}</Text>
                  {item.resources?.map((r: any, i: number) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.linkButton}
                      onPress={() => router.push({ pathname: '/webview', params: { url: r.url, title: r.title } })}
                    >
                      <Text style={styles.linkText}>📘 {r.title}</Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "700",
    marginBottom: 6,
    fontSize: 18,
  },
  summary: {
    marginBottom: 8,
    color: "#333",
  },
  linkButton: {
    backgroundColor: "#f0f8ff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  linkText: {
    color: "#0057b8",
    fontWeight: "600",
    fontSize: 15,
  },
});
