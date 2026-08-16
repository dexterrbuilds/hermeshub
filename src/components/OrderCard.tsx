import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { Badge } from "@/components/Badge";
import { FadeImage } from "@/components/FadeImage";
import { colors, fontWeights, radii, shadows, spacing, typography } from "@/constants/theme";
import { Order } from "@/types/marketplace";
import { formatCurrency } from "@/utils/format";

const statusCopy: Record<Order["status"], { label: string; tone: "blue" | "green" | "amber" | "neutral" }> = {
  requested: { label: "Requested", tone: "amber" },
  confirmed: { label: "Confirmed", tone: "blue" },
  "in-progress": { label: "In progress", tone: "blue" },
  arriving: { label: "On the way", tone: "blue" },
  completed: { label: "Completed", tone: "green" }
};

type OrderCardProps = {
  order: Order;
  onPress: () => void;
};

export function OrderCard({ order, onPress }: OrderCardProps) {
  const status = statusCopy[order.status];

  return (
    <AnimatedPressable onPress={onPress} haptic="selection" contentStyle={styles.card}>
      <View style={styles.header}>
        {order.vendorImage ? (
          <FadeImage uri={order.vendorImage} style={styles.image} fallbackIcon="receipt-outline" />
        ) : (
          <View style={styles.iconWrap}>
            <Ionicons name={order.kind === "delivery" ? "bag-handle-outline" : "calendar-outline"} size={20} color={colors.primary} />
          </View>
        )}
        <View style={styles.titleWrap}>
          <Text style={styles.vendor}>{order.vendorName}</Text>
          <Text style={styles.service}>{order.serviceName}</Text>
        </View>
        <Badge label={status.label} tone={status.tone} />
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{order.status === "completed" ? "Completed" : order.eta}</Text>
        <Text style={styles.amount}>{formatCurrency(order.total)}</Text>
      </View>
      {order.status !== "completed" ? (
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      ) : null}
      <View style={styles.footer}>
        <Text style={styles.next}>{order.nextAction}</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    ...shadows.soft
  },
  header: {
    alignItems: "center",
    flexDirection: "row"
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.pill,
    height: 44,
    justifyContent: "center",
    marginRight: spacing.md,
    width: 44
  },
  image: {
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.md,
    height: 52,
    marginRight: spacing.md,
    width: 52
  },
  titleWrap: {
    flex: 1,
    paddingRight: spacing.sm
  },
  vendor: {
    color: colors.text,
    fontSize: typography.cardTitle,
    fontWeight: fontWeights.semibold
  },
  service: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: spacing.xs
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg
  },
  meta: {
    color: colors.textMuted,
    fontSize: typography.small
  },
  amount: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  footer: {
    alignItems: "center",
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingTop: spacing.md
  },
  progressTrack: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.pill,
    height: 6,
    marginTop: spacing.md,
    overflow: "hidden"
  },
  progressFill: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    height: 6,
    width: "58%"
  },
  next: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  }
});
