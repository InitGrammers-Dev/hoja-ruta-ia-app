import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { fetchRoadmaps, fetchRoadmapById } from "@/src/api";

export default function ExploreTab() {
  const [items, setItems] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const router = useRouter();

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
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <FlatList
        data={items}
        keyExtractor={(it, idx) => `${it.id ?? it.topic ?? idx}`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => openRoadmap(item)}>
            <View style={styles.itemHeader}>
              <Text style={styles.title}>{item.topic ?? item.id ?? "Sin título"}</Text>
              <Text style={styles.arrow}>➡️</Text>
            </View>
            {item.createdAt ? (
              <Text style={styles.subtitle}>
                Creado: {new Date(item.createdAt).toLocaleString()}
              </Text>
            ) : null}
          </TouchableOpacity>
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
  arrow: {
    fontSize: 18,
  },
  subtitle: {
    color: "#777",
    marginTop: 8,
    fontSize: 12,
  },
});
