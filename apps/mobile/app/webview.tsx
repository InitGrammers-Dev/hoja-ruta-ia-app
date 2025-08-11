import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";

export default function WebviewScreen() {
  const params = useLocalSearchParams();
  const url = params.url as string;

  if (!url) {
    return (
      <View style={styles.center}>
        <Text>No se encontró la URL para mostrar.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView source={{ uri: url }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
