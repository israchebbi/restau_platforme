import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Index() {
  const [status, setStatus] = useState("Checking the server…");

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(`Server says: ${data.status}`))
      .catch(() => setStatus("Cannot reach the server"));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant Platform</Text>
      <Text style={styles.status}>{status}</Text>
      <Text style={styles.url}>{API_URL}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    padding: 24,
  },
  title: { fontSize: 28, fontWeight: "700", color: "#ea580c" },
  status: { marginTop: 16, fontSize: 16, color: "#334155" },
  url: { marginTop: 8, fontSize: 12, color: "#94a3b8" },
});