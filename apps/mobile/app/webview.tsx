import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useColorScheme,
} from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// Oculta el header automático
export const unstable_settings = {
  headerShown: false,
};

export default function WebviewScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const url = params.url as string;
  const title = params.title as string;

  if (!url) {
    return (
      <View style={[styles.center, isDark && { backgroundColor: "#000" }]}>
        <Text style={{ color: isDark ? "#fff" : "#000" }}>
          No se encontró la URL para mostrar.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[styles.container, isDark && styles.containerDark]}
    >
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDark ? "#fff" : "#000"}
          />
        </Pressable>
        <Text style={[styles.title, isDark && styles.titleDark]}>
          {title ?? "Contenido"}
        </Text>
      </View>
      <WebView source={{ uri: url }} style={styles.webview} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  containerDark: {
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  headerDark: {
    borderBottomColor: "#333",
    backgroundColor: "#1c1c1e",
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
  },
  titleDark: {
    color: "#fff",
  },
});
