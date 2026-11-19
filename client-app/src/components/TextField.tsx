import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { TextInputProps } from "react-native";
import { colors } from "../theme";

export default function TextField({
  label,
  secure = false,
  ...props
}: TextInputProps & { label: string; secure?: boolean }) {
  const [hidden, setHidden] = useState(secure);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TextInput
          {...props}
          secureTextEntry={secure && hidden}
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        {secure && (
          <Pressable onPress={() => setHidden((value) => !value)} hitSlop={8}>
            <Text style={styles.toggle}>{hidden ? "Show" : "Hide"}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 14, fontWeight: "500", color: colors.text },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: colors.text },
  toggle: { color: colors.primary, fontWeight: "600", marginLeft: 8 },
});