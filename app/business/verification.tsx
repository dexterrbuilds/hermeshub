import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { MaterialSurface } from "@/components/MaterialSurface";
import { Screen } from "@/components/Screen";
import { SkeletonBlock } from "@/components/StateViews";
import { colors, fontWeights, radii, spacing, typography } from "@/constants/theme";
import { businessVerificationService } from "@/services/businessVerificationService";

type VerificationStatus = Awaited<ReturnType<typeof businessVerificationService.getVerificationStatus>>;

export default function BusinessVerificationScreen() {
  const [status, setStatus] = useState<VerificationStatus | undefined>();

  useEffect(() => {
    businessVerificationService.getVerificationStatus().then(setStatus);
  }, []);

  return (
    <Screen>
      <View style={styles.topBar}>
        <IconButton icon="chevron-back" onPress={() => router.back()} />
      </View>
      <Text style={styles.title}>Business status</Text>
      <Text style={styles.subtitle}>Track your setup and Hermes verification from one place.</Text>

      {!status ? (
        <MaterialSurface variant="elevated" radius="xl" style={styles.statusCard}>
          <SkeletonBlock style={styles.statusIconSkeleton} />
          <SkeletonBlock style={styles.statusTitleSkeleton} />
          <SkeletonBlock style={styles.statusLineSkeleton} />
          <SkeletonBlock style={styles.statusLineShortSkeleton} />
        </MaterialSurface>
      ) : (
        <MaterialSurface variant="elevated" radius="xl" style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Ionicons name={status.status === "approved" ? "checkmark" : "shield-checkmark-outline"} size={28} color={status.status === "approved" ? colors.white : colors.primaryDark} />
          </View>
          <Text style={styles.statusTitle}>{status.title}</Text>
          <Text style={styles.statusMessage}>{status.message}</Text>
          <View style={styles.timeline}>
            {["Draft", "Submitted", "Under review", "Approved"].map((item, index) => (
              <View key={item} style={styles.timelineRow}>
                <View style={[styles.timelineDot, index <= activeIndex(status.status) && styles.timelineDotActive]} />
                <Text style={[styles.timelineText, index <= activeIndex(status.status) && styles.timelineTextActive]}>{item}</Text>
              </View>
            ))}
          </View>
          <Button
            title={status.status === "approved" ? "Manage business" : "Continue setup"}
            onPress={() => router.push(status.status === "approved" ? "/business/dashboard" : "/business/onboarding")}
          />
        </MaterialSurface>
      )}
    </Screen>
  );
}

function activeIndex(status: string) {
  if (status === "approved") return 3;
  if (status === "under_review") return 2;
  if (status === "submitted") return 1;
  return 0;
}

const styles = StyleSheet.create({
  topBar: {
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
  statusCard: {
    alignItems: "center",
    marginTop: spacing.xl,
    padding: spacing.xl
  },
  statusIcon: {
    alignItems: "center",
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.xl,
    height: 72,
    justifyContent: "center",
    marginBottom: spacing.lg,
    width: 72
  },
  statusTitle: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold,
    textAlign: "center"
  },
  statusMessage: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
    marginTop: spacing.sm,
    textAlign: "center"
  },
  timeline: {
    alignSelf: "stretch",
    marginVertical: spacing.xl
  },
  timelineRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 38
  },
  timelineDot: {
    backgroundColor: colors.borderStrong,
    borderRadius: radii.pill,
    height: 11,
    width: 11
  },
  timelineDotActive: {
    backgroundColor: colors.primary
  },
  timelineText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: fontWeights.medium
  },
  timelineTextActive: {
    color: colors.text,
    fontWeight: fontWeights.semibold
  },
  statusIconSkeleton: {
    borderRadius: radii.xl,
    height: 72,
    marginBottom: spacing.lg,
    width: 72
  },
  statusTitleSkeleton: {
    height: 18,
    width: "58%"
  },
  statusLineSkeleton: {
    height: 12,
    marginTop: spacing.md,
    width: "78%"
  },
  statusLineShortSkeleton: {
    height: 12,
    marginTop: spacing.sm,
    width: "52%"
  }
});
