import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { MaterialSurface } from "@/components/MaterialSurface";
import { Screen } from "@/components/Screen";
import { SkeletonBlock } from "@/components/StateViews";
import { colors, fontWeights, radii, spacing, typography } from "@/constants/theme";
import { businessManagementService } from "@/services/businessManagementService";

type Overview = Awaited<ReturnType<typeof businessManagementService.getBusinessOverview>>;

const actions = [
  { title: "Business profile", subtitle: "Edit customer-facing details", icon: "storefront-outline" },
  { title: "Services & products", subtitle: "Manage prices and offerings", icon: "pricetags-outline" },
  { title: "Bookings", subtitle: "Accept, reject, and update status", icon: "calendar-outline" },
  { title: "Availability", subtitle: "Set hours and lead times", icon: "time-outline" },
  { title: "Reviews", subtitle: "Read customer feedback", icon: "star-outline" },
  { title: "Verification", subtitle: "Track documents and approval", icon: "shield-checkmark-outline" }
] as const;

export default function BusinessDashboardScreen() {
  const [overview, setOverview] = useState<Overview | undefined>();

  useEffect(() => {
    businessManagementService.getBusinessOverview().then(setOverview);
  }, []);

  return (
    <Screen>
      <View style={styles.topBar}>
        <IconButton icon="chevron-back" onPress={() => router.back()} />
        <Button title="Personal" variant="secondary" icon="person-outline" onPress={() => router.push("/profile")} />
      </View>

      <Text style={styles.title}>Your business</Text>
      <Text style={styles.subtitle}>Manage your Hermes presence without leaving your personal account.</Text>

      <MaterialSurface variant="darkGlass" radius="xl" style={styles.hero}>
        {!overview ? (
          <>
            <SkeletonBlock style={styles.heroSkeletonTitle} />
            <SkeletonBlock style={styles.heroSkeletonLine} />
          </>
        ) : (
          <>
            <Text style={styles.heroKicker}>Beta business mode</Text>
            <Text style={styles.heroTitle}>{overview.businessName}</Text>
            <Text style={styles.heroCopy}>{overview.nextAction}</Text>
            <View style={styles.metricRow}>
              <Metric label="Today" value={String(overview.bookingsToday)} />
              <Metric label="Pending" value={String(overview.pendingBookings)} />
              <Metric label="Offerings" value={String(overview.services)} />
            </View>
          </>
        )}
      </MaterialSurface>

      <View style={styles.actionGrid}>
        {actions.map((action) => (
          <AnimatedPressable key={action.title} haptic="selection" onPress={() => action.title === "Verification" ? router.push("/business/verification") : undefined} contentStyle={styles.action}>
            <View style={styles.actionIcon}>
              <Ionicons name={action.icon} size={20} color={colors.primaryDark} />
            </View>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
          </AnimatedPressable>
        ))}
      </View>
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl
  },
  title: {
    color: colors.text,
    fontSize: 31,
    fontWeight: fontWeights.semibold
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
    marginTop: spacing.sm
  },
  hero: {
    marginTop: spacing.xl,
    padding: spacing.xl
  },
  heroKicker: {
    color: "#BFDBFE",
    fontSize: typography.tiny,
    fontWeight: fontWeights.semibold,
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: fontWeights.semibold,
    marginTop: spacing.sm
  },
  heroCopy: {
    color: "#DBEAFE",
    fontSize: typography.small,
    lineHeight: 20,
    marginTop: spacing.xs
  },
  metricRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xl
  },
  metric: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: radii.lg,
    flex: 1,
    padding: spacing.md
  },
  metricValue: {
    color: colors.white,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold
  },
  metricLabel: {
    color: "#BFDBFE",
    fontSize: typography.tiny,
    marginTop: spacing.xs
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.xl
  },
  action: {
    backgroundColor: colors.glassStrong,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: 1,
    minHeight: 142,
    padding: spacing.lg,
    width: "47%"
  },
  actionIcon: {
    alignItems: "center",
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.lg,
    height: 42,
    justifyContent: "center",
    marginBottom: spacing.md,
    width: 42
  },
  actionTitle: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  actionSubtitle: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    lineHeight: 17,
    marginTop: spacing.xs
  },
  heroSkeletonTitle: {
    height: 22,
    width: "62%"
  },
  heroSkeletonLine: {
    height: 12,
    marginTop: spacing.md,
    width: "44%"
  }
});
