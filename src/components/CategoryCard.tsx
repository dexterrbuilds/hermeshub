import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { colors, fontWeights, radii, shadows, spacing, typography } from "@/constants/theme";
import { Category } from "@/types/marketplace";

type CategoryCardProps = {
  category: Category;
  onPress: () => void;
  compact?: boolean;
};

export function CategoryCard({ category, onPress, compact = false }: CategoryCardProps) {
  const tint = tintByCategory[category.id] ?? colors.surfaceBlue;

  return (
    <AnimatedPressable
      onPress={onPress}
      haptic="selection"
      contentStyle={[styles.card, compact && styles.compact]}
    >
      <View style={[styles.iconWrap, { backgroundColor: tint }]}>
        <Ionicons name={category.icon as keyof typeof Ionicons.glyphMap} size={20} color={colors.primary} />
      </View>
      <Text style={styles.name} numberOfLines={1}>{category.name}</Text>
      {!compact ? <Text style={styles.description} numberOfLines={2}>{category.description}</Text> : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.64)",
    borderColor: "rgba(226, 232, 240, 0.58)",
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing.lg,
    width: "48%",
    ...shadows.soft
  },
  compact: {
    alignItems: "center",
    minHeight: 82,
    paddingHorizontal: spacing.md,
    width: 82
  },
  iconWrap: {
    alignItems: "center",
    borderColor: "rgba(255, 255, 255, 0.74)",
    borderRadius: radii.lg,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    marginBottom: spacing.sm,
    width: 44
  },
  name: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold,
    textAlign: "center"
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    lineHeight: 17,
    marginTop: spacing.xs
  }
});

const tintByCategory: Record<string, string> = {
  beauty: "#FDF2F8",
  food: "#FFF7ED",
  home: "#EFF6FF",
  repairs: "#F5F3FF",
  fashion: "#FDF2F8",
  events: "#F0F9FF",
  cleaning: "#ECFDF5",
  tech: "#EEF2FF",
  wellness: "#F0FDFA",
  learning: "#F8FAFC",
  automotive: "#FEF3C7",
  more: "#F1F5F9"
};
