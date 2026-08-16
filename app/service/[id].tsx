import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { FadeImage } from "@/components/FadeImage";
import { IconButton } from "@/components/IconButton";
import { EmptyState, SkeletonList } from "@/components/StateViews";
import { Screen } from "@/components/Screen";
import { colors, fontWeights, radii, shadows, spacing, typography } from "@/constants/theme";
import { marketplaceService } from "@/services/marketplaceService";
import { Service, Vendor } from "@/types/marketplace";
import { formatCurrency } from "@/utils/format";

export default function ServiceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [service, setService] = useState<Service | undefined>();
  const [vendor, setVendor] = useState<Vendor | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    marketplaceService.getServiceById(id).then((item) => {
      setService(item);
      if (item) marketplaceService.getVendorById(item.vendorId).then(setVendor);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <Screen>
        <SkeletonList count={2} />
      </Screen>
    );
  }

  if (!service) {
    return (
      <Screen>
        <EmptyState title="Service unavailable" message="This service may have been removed from the beta catalog." actionLabel="Explore businesses" onAction={() => router.push("/search")} />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <View style={styles.coverWrap}>
        <FadeImage uri={service.image} style={styles.cover} fallbackIcon={service.type === "delivery" ? "bag-handle-outline" : "calendar-outline"} />
        <View style={styles.coverOverlay} />
        <View style={styles.floatingNav}>
          <IconButton icon="chevron-back" onPress={() => router.back()} backgroundColor={colors.white} />
        </View>
      </View>
      <View style={styles.content}>
        <Badge label={service.type === "delivery" ? "Order" : "Booking"} tone="blue" icon={service.type === "delivery" ? "bag-handle-outline" : "calendar-outline"} />
        <Text style={styles.vendor}>{vendor?.businessName}</Text>
        <Text style={styles.title}>{service.name}</Text>
        <Text style={styles.description}>{service.description}</Text>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Price</Text>
            <Text style={styles.summaryValue}>From {formatCurrency(service.price)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Time</Text>
            <Text style={styles.summaryValue}>{service.duration}</Text>
          </View>
        </View>

        <View style={styles.note}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.success} />
          <Text style={styles.noteText}>You will review date, location, notes, and total before confirming.</Text>
        </View>

        <Button title="Continue" icon="arrow-forward-outline" onPress={() => router.push({ pathname: "/cart", params: { serviceId: service.id } })} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cover: {
    backgroundColor: colors.surfaceBlue,
    height: 260,
    width: "100%"
  },
  coverWrap: {
    position: "relative"
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.12)"
  },
  floatingNav: {
    left: 20,
    position: "absolute",
    top: spacing.lg
  },
  content: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    marginTop: -spacing.xl,
    padding: 20
  },
  vendor: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold,
    marginTop: spacing.lg
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: fontWeights.semibold,
    lineHeight: 36,
    marginTop: spacing.xs
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
    marginTop: spacing.md
  },
  summary: {
    flexDirection: "row",
    gap: spacing.md,
    marginVertical: spacing.xxl
  },
  summaryItem: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    flex: 1,
    padding: spacing.lg,
    ...shadows.soft
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    fontWeight: fontWeights.medium
  },
  summaryValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.semibold,
    marginTop: spacing.xs
  },
  note: {
    alignItems: "flex-start",
    backgroundColor: colors.successSoft,
    borderRadius: radii.lg,
    flexDirection: "row",
    marginBottom: spacing.xxl,
    padding: spacing.lg
  },
  noteText: {
    color: colors.text,
    flex: 1,
    fontSize: typography.small,
    lineHeight: 20,
    marginLeft: spacing.md
  }
});
