import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { FadeImage } from "@/components/FadeImage";
import { colors, fontWeights, radii, shadows, spacing, typography } from "@/constants/theme";
import { Service } from "@/types/marketplace";
import { formatCurrency } from "@/utils/format";

type ServiceCardProps = {
  service: Service;
  onPress: () => void;
  selected?: boolean;
  style?: ViewStyle;
};

export function ServiceCard({ service, onPress, selected = false, style }: ServiceCardProps) {
  return (
    <AnimatedPressable onPress={onPress} haptic="selection" contentStyle={[styles.card, selected && styles.selected, style]}>
      <FadeImage uri={service.image} style={styles.image} fallbackIcon={service.type === "delivery" ? "bag-handle-outline" : "calendar-outline"} />
      <View style={styles.body}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{service.description}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.price}>From {formatCurrency(service.price)}</Text>
          <Text style={styles.duration}>{service.duration}</Text>
        </View>
      </View>
      <View style={styles.select}>
        <Text style={styles.selectText}>{selected ? "Selected" : "Select"}</Text>
        <Ionicons name="chevron-forward" size={15} color={selected ? colors.white : colors.primary} />
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    flexDirection: "row",
    marginBottom: spacing.md,
    padding: spacing.md,
    ...shadows.soft
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceBlue
  },
  image: {
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.md,
    height: 68,
    width: 68
  },
  body: {
    flex: 1,
    marginHorizontal: spacing.md
  },
  name: {
    color: colors.text,
    fontSize: typography.cardTitle,
    fontWeight: fontWeights.semibold
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 19,
    marginTop: spacing.xs
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm
  },
  price: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  duration: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    fontWeight: fontWeights.medium
  },
  select: {
    alignItems: "center",
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.pill,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  selectText: {
    color: colors.primary,
    fontSize: typography.tiny,
    fontWeight: fontWeights.semibold
  }
});
