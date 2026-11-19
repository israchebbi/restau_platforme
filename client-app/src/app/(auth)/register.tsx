import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import Screen from "../../components/Screen";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { getErrorMessage } from "../../api/client";
import { useAuthStore } from "../../store/auth";
import { colors } from "../../theme";

export default function Register() {
  const register = useAuthStore((state) => state.register);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(): string {
    if (name.trim().length < 2) return "Enter your name";
    if (!email.includes("@")) return "Enter a valid email";
    if (phone.trim().length < 8) return "Enter a valid phone number";
    if (password.length < 6) return "Your password needs at least 6 characters";
    if (password !== confirm) return "The passwords do not match";
    return "";
  }

  async function handleSubmit() {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
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
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>It only takes a minute.</Text>
      </View>

      <View style={styles.form}>
        {error !== "" && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TextField
          label="Full name"
          value={name}
          onChangeText={setName}
          autoComplete="name"
        />
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
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoComplete="tel"
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secure
          autoCapitalize="none"
        />
        <TextField
          label="Confirm password"
          value={confirm}
          onChangeText={setConfirm}
          secure
          autoCapitalize="none"
        />

        <Button title="Create account" onPress={handleSubmit} loading={loading} />

        <Text style={styles.footer}>
          Already have an account?{" "}
          <Link href="/login" style={styles.link}>
            Sign in
          </Link>
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 24 },
  brand: { fontSize: 16, fontWeight: "700", color: colors.primary },
  title: { fontSize: 30, fontWeight: "700", color: colors.text, marginTop: 12 },
  subtitle: { fontSize: 16, color: colors.muted, marginTop: 6 },
  form: { gap: 14 },
  errorBox: {
    backgroundColor: colors.dangerBg,
    borderRadius: 12,
    padding: 12,
  },
  errorText: { color: colors.danger, fontSize: 14 },
  footer: { textAlign: "center", color: colors.muted, fontSize: 14 },
  link: { color: colors.primary, fontWeight: "600" },
});