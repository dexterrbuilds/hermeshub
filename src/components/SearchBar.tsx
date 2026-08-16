import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
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
    <View style={styles.container}>
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
        <Pressable onPress={onFilterPress} style={styles.filter} hitSlop={8}>
          <Ionicons name="options-outline" size={18} color={colors.white} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 58,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    ...shadows.soft
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
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    height: 40,
    justifyContent: "center",
    width: 40
  }
});
