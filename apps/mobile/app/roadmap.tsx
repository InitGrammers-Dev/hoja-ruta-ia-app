import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  LayoutAnimation,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// Ocultamos el header nativo para quitar espacio arriba
export const unstable_settings = {
  headerShown: false,
};

function Header({ title }: { title: string }) {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.headerSafeArea, isDark && styles.headerSafeAreaDark]}
    >
      <View style={[styles.headerContainer, isDark && styles.headerContainerDark]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDark ? "#fff" : "#000"}
          />
        </Pressable>
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
          {title}
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default function RoadmapScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const roadmap = params.roadmap ? JSON.parse(params.roadmap as string) : {};
  const modules = roadmap?.content?.modules ?? [];
  const title = roadmap?.topic ?? "Roadmap";

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleModule = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  if (!modules.length) {
    return (
      <SafeAreaView
        edges={["top", "bottom"]}
        style={[styles.emptyContainer, isDark && { backgroundColor: "#000" }]}
      >
        <Header title={title} />
        <View style={styles.emptyContent}>
          <Text style={{ color: isDark ? "#fff" : "#000" }}>
            No hay módulos para mostrar
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[styles.container, isDark && styles.containerDark]}
    >
      <Header title={title} />
      <FlatList
        data={modules}
        keyExtractor={(item: any, idx) => `${item.title ?? "module"}-${idx}`}
        contentContainerStyle={{ paddingTop: 60, paddingHorizontal: 16 }}
        renderItem={({ item, index }) => {
          const expanded = expandedIndex === index;
          return (
            <View style={[styles.card, isDark && styles.cardDark]}>
              <Pressable
                onPress={() => toggleModule(index)}
                style={({ pressed }) => [styles.header, pressed && { opacity: 0.7 }]}
              >
                <Text style={[styles.title, isDark && styles.titleDark]}>
                  {item.title}
                </Text>
                <Ionicons
                  name={expanded ? "chevron-down" : "chevron-forward"}
                  size={20}
                  color={isDark ? "#ccc" : "#555"}
                />
              </Pressable>

              {expanded && (
                <>
                  <Text style={[styles.summary, isDark && styles.summaryDark]}>
                    {item.summary}
                  </Text>
                  {item.resources?.map((r: any, i: number) => (
                    <Pressable
                      key={i}
                      style={({ pressed }) => [
                        styles.linkButton,
                        isDark && styles.linkButtonDark,
                        pressed && { opacity: 0.9 },
                      ]}
                      onPress={() =>
                        router.push({
                          pathname: "/webview",
                          params: { url: r.url, title: r.title },
                        })
                      }
                    >
                      <Text style={[styles.linkText, isDark && styles.linkTextDark]}>
                        📘 {r.title}
                      </Text>
                    </Pressable>
                  ))}
                </>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  containerDark: { backgroundColor: "#000" },

  emptyContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerSafeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f9f9f9",
    zIndex: 10,
  },
  headerSafeAreaDark: {
    backgroundColor: "#222",
  },
  headerContainer: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerContainerDark: {
    borderBottomColor: "#333",
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  headerTitleDark: {
    color: "#fff",
  },

  card: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 14,
  },
  cardDark: {
    backgroundColor: "#1c1c1e",
    borderColor: "#333",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  title: {
    fontWeight: "700",
    fontSize: 17,
    color: "#222",
    flex: 1,
    paddingRight: 8,
  },
  titleDark: {
    color: "#fff",
  },

  summary: {
    color: "#444",
    marginBottom: 10,
  },
  summaryDark: {
    color: "#ccc",
  },

  linkButton: {
    backgroundColor: "#e6f0ff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  linkButtonDark: {
    backgroundColor: "#2a2a2e",
  },

  linkText: {
    color: "#0057b8",
    fontWeight: "600",
  },
  linkTextDark: {
    color: "#89b4fa",
  },
});
