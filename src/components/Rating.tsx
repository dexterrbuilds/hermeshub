import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, fontWeights, spacing, typography } from "@/constants/theme";

type RatingProps = {
  rating: number;
  reviewCount?: number;
  compact?: boolean;
};

export function Rating({ rating, reviewCount, compact = false }: RatingProps) {
  return (
    <View style={styles.row}>
      <Ionicons name="star" size={compact ? 13 : 15} color={colors.warning} />
      <Text style={[styles.text, compact && styles.compactText]}>
        {rating.toFixed(1)}
        {reviewCount !== undefined ? ` (${reviewCount})` : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row"
  },
  text: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold,
    marginLeft: spacing.xs
  },
  compactText: {
    color: colors.textMuted,
    fontSize: typography.tiny
  }
});
