import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { MaterialSurface } from "@/components/MaterialSurface";
import { colors, fontWeights, layout, radii, shadows, spacing, typography } from "@/constants/theme";

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onFilterPress?: () => void;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = "What service do you need?",
  onSubmit,
  onFilterPress
}: SearchBarProps) {
  return (
    <MaterialSurface variant="elevated" radius="xl" style={styles.container}>
      <Ionicons name="search-outline" size={20} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSubtle}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        style={styles.input}
      />
      {onFilterPress ? (
        <Pressable onPress={onFilterPress} style={({ pressed }) => [styles.filter, pressed && styles.filterPressed]} hitSlop={8}>
          <Ionicons name="options-outline" size={17} color={colors.primaryDark} />
        </Pressable>
      ) : null}
    </MaterialSurface>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 60,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    ...shadows.ambient
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
    fontWeight: fontWeights.regular,
    marginLeft: spacing.sm,
    minHeight: layout.inputHeight
  },
  filter: {
    alignItems: "center",
    backgroundColor: colors.glassBlue,
    borderColor: "rgba(37, 99, 235, 0.12)",
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  filterPressed: {
    opacity: 0.76,
    transform: [{ scale: 0.96 }]
  }
});
