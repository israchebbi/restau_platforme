import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import Screen from "../../components/Screen";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { getErrorMessage } from "../../api/client";
import { useAuthStore } from "../../store/auth";
import { colors } from "../../theme";

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.includes("@")) {
      setError("Enter a valid email");
      return;
    }
    if (!password) {
      setError("Enter your password");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.brand}>Restaurant Platform</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to order your favorite food.</Text>
      </View>

      <View style={styles.form}>
        {error !== "" && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secure
          autoCapitalize="none"
          autoComplete="password"
        />

        <Button title="Sign in" onPress={handleSubmit} loading={loading} />

        <Text style={styles.footer}>
          New here?{" "}
          <Link href="/register" style={styles.link}>
            Create an account
          </Link>
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 28 },
  brand: { fontSize: 16, fontWeight: "700", color: colors.primary },
  title: { fontSize: 30, fontWeight: "700", color: colors.text, marginTop: 12 },
  subtitle: { fontSize: 16, color: colors.muted, marginTop: 6 },
  form: { gap: 16 },
  errorBox: {
    backgroundColor: colors.dangerBg,
    borderRadius: 12,
    padding: 12,
  },
  errorText: { color: colors.danger, fontSize: 14 },
  footer: { textAlign: "center", color: colors.muted, fontSize: 14 },
  link: { color: colors.primary, fontWeight: "600" },
});