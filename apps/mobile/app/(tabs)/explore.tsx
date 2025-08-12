import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchRoadmaps, fetchRoadmapById } from "@/src/api";

export default function ExploreTab() {
  const [items, setItems] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchRoadmaps();
      setItems(Array.isArray(data) ? data : data.data ?? []);
    } catch (err: any) {
      console.warn("Error listRoadmaps:", err.message ?? err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const openRoadmap = async (item: any) => {
    try {
      if (item.content || item.modules) {
        const roadmapObj = item.content ? item : { content: item };
        router.push({
          pathname: "/roadmap",
          params: { roadmap: JSON.stringify(roadmapObj) },
        });
        return;
      }

      if (item.id) {
        const fetched = await fetchRoadmapById(item.id);
        const roadmapData = fetched.data ?? fetched;
        const roadmapObj = roadmapData.content
          ? roadmapData
          : { content: roadmapData };

        router.push({
          pathname: "/roadmap",
          params: { roadmap: JSON.stringify(roadmapObj) },
        });
      } else {
        console.warn("Item no contiene id ni content", item);
      }
    } catch (err: any) {
      console.warn("Error al abrir roadmap:", err.message ?? err);
    }
  };

  if (loading && items.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]} edges={['top', 'left', 'right']}>
      <FlatList
        data={items}
        keyExtractor={(it, idx) => `${it.id ?? it.topic ?? idx}`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            android_ripple={{ color: isDark ? "#333" : "#ccc" }}
            style={({ pressed }) => [
              styles.item,
              isDark && styles.itemDark,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() => openRoadmap(item)}
          >
            <View style={styles.itemHeader}>
              <Text style={[styles.title, isDark && styles.titleDark]}>
                {item.topic ?? item.id ?? "Sin título"}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={isDark ? "#ccc" : "#555"} />
            </View>
            {item.createdAt ? (
              <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
                Creado: {new Date(item.createdAt).toLocaleString()}
              </Text>
            ) : null}
          </Pressable>
        )}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text>No hay roadmaps generados todavía.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  safeAreaDark: {
    backgroundColor: "#000",
  },
  listContent: {
    padding: 12,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemDark: {
    backgroundColor: "#1c1c1e",
    borderColor: "#333",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 17,
    color: "#333",
    flexShrink: 1,
  },
  titleDark: {
    color: "#fff",
  },
  subtitle: {
    color: "#777",
    marginTop: 8,
    fontSize: 12,
  },
  subtitleDark: {
    color: "#aaa",
  },
});
