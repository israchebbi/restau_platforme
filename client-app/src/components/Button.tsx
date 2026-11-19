import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme";

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline";
}) {
  const primary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      style={({ pressed }) => [
        styles.base,
        primary ? styles.primary : styles.outline,
        (pressed || loading || disabled) && styles.dimmed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={primary ? "#ffffff" : colors.primary} />
      ) : (
        <Text
          style={[styles.text, primary ? styles.textPrimary : styles.textOutline]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: colors.primary },
  outline: { borderWidth: 1, borderColor: colors.primary },
  dimmed: { opacity: 0.7 },
  text: { fontSize: 16, fontWeight: "600" },
  textPrimary: { color: "#ffffff" },
  textOutline: { color: colors.primary },
});