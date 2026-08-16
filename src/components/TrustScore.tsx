import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Badge } from "@/components/Badge";
import { colors, fontWeights, radii, shadows, spacing, typography } from "@/constants/theme";
import { Vendor } from "@/types/marketplace";

type TrustScoreProps = {
  vendor: Vendor;
};

export function TrustScore({ vendor }: TrustScoreProps) {
  const items = [
    ["Identity verified", vendor.trustBreakdown.identityVerified],
    ["Completed bookings", vendor.trustBreakdown.completedOrders],
    ["Response reliability", vendor.trustBreakdown.responseRate],
    ["Repeat customers", vendor.trustBreakdown.repeatCustomers]
  ] as const;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Hermes Trust Score</Text>
          <Text style={styles.score}>{vendor.trustScore} / 100</Text>
        </View>
        <Badge label="Verified on Hermes" tone="green" icon="checkmark-circle" />
      </View>
      <Text style={styles.help}>
        Hermes Trust helps you compare businesses using verification, reviews, reliability, and recent activity.
      </Text>
      <View style={styles.checkList}>
        {items.map(([label, value]) => (
          <View key={label} style={styles.item}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text style={styles.itemLabel}>{label}</Text>
            <Text style={styles.itemValue}>{value}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    ...shadows.soft
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  eyebrow: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: fontWeights.medium
  },
  score: {
    color: colors.text,
    fontSize: 28,
    fontWeight: fontWeights.semibold,
    marginTop: spacing.xs
  },
  help: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 20,
    marginTop: spacing.md
  },
  checkList: {
    gap: spacing.md,
    marginTop: spacing.lg
  },
  item: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  itemValue: {
    color: colors.primaryDark,
    fontSize: typography.small,
    marginLeft: "auto",
    fontWeight: fontWeights.semibold
  },
  itemLabel: {
    color: colors.text,
    flex: 1,
    fontSize: typography.small,
    fontWeight: fontWeights.medium
  }
});
