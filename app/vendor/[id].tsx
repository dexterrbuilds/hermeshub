import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { Badge } from "@/components/Badge";
import { BottomSheet } from "@/components/BottomSheet";
import { Button } from "@/components/Button";
import { FadeImage } from "@/components/FadeImage";
import { IconButton } from "@/components/IconButton";
import { ContentFade, EmptyState, VendorProfileSkeleton } from "@/components/StateViews";
import { Rating } from "@/components/Rating";
import { ReviewCard } from "@/components/ReviewCard";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { TrustScore } from "@/components/TrustScore";
import { colors, fontWeights, radii, shadows, spacing, typography } from "@/constants/theme";
import { marketplaceService } from "@/services/marketplaceService";
import { useMarketplaceState } from "@/state/MarketplaceState";
import { Review, Service, Vendor } from "@/types/marketplace";
import { formatCurrency } from "@/utils/format";
import { useResponsive } from "@/utils/responsive";

export default function VendorProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [vendor, setVendor] = useState<Vendor | undefined>();
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [trustOpen, setTrustOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const { isDesktop, gutter, maxContentWidth } = useResponsive();
  const { savedVendorIds, toggleSavedVendor, addRecentlyViewed } = useMarketplaceState();

  useEffect(() => {
    if (!id) return;
    Promise.all([
      marketplaceService.getVendorById(id),
      marketplaceService.getVendorServices(id),
      marketplaceService.getVendorReviews(id)
    ]).then(([vendorItem, serviceItems, reviewItems]) => {
      setVendor(vendorItem);
      setServices(serviceItems);
      setReviews(reviewItems);
      setLoading(false);
      if (vendorItem) addRecentlyViewed(vendorItem.id);
    });
  }, [addRecentlyViewed, id]);

  if (loading) {
    return (
      <Screen padded={false}>
        <VendorProfileSkeleton />
      </Screen>
    );
  }

  if (!vendor) {
    return (
      <Screen>
        <EmptyState title="Business not found" message="This listing may no longer be available in the beta." actionLabel="Explore businesses" onAction={() => router.push("/search")} />
      </Screen>
    );
  }

  const primaryService = services[0];

  const saved = savedVendorIds.includes(vendor.id);

  return (
    <View style={styles.root}>
      <Screen padded={false} bottomInset={false}>
      <View style={styles.coverWrap}>
        <FadeImage uri={vendor.image} style={[styles.cover, isDesktop && styles.desktopCover]} fallbackIcon="briefcase-outline" />
        <View style={styles.coverOverlay} />
        <View style={styles.floatingNav}>
          <IconButton icon="chevron-back" onPress={() => router.back()} backgroundColor={colors.white} />
          <IconButton icon={saved ? "heart" : "heart-outline"} onPress={() => toggleSavedVendor(vendor.id)} color={saved ? colors.danger : colors.text} backgroundColor={colors.white} />
        </View>
        <AnimatedPressable onPress={() => setTrustOpen(true)} contentStyle={styles.coverBadge} haptic="selection">
          <Ionicons name="shield-checkmark" size={15} color={colors.success} />
          <Text style={styles.coverBadgeText}>{vendor.trustScore} Hermes Trust</Text>
        </AnimatedPressable>
      </View>
      <ContentFade>
        <View style={[styles.content, isDesktop && styles.desktopContent, isDesktop && { maxWidth: maxContentWidth, paddingHorizontal: gutter }]}>
        <View style={[isDesktop && styles.desktopProfileLayout]}>
        <View style={[isDesktop && styles.desktopMainColumn]}>
        <View style={styles.hero}>
          <View style={styles.titleBlock}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{vendor.businessName}</Text>
              {vendor.verified ? <Ionicons name="checkmark-circle" size={19} color={colors.success} /> : null}
            </View>
            <Text style={styles.meta}>{vendor.category} · {vendor.area}</Text>
            <View style={styles.quickMeta}>
              <Rating rating={vendor.rating} reviewCount={vendor.reviewCount} />
              <Text style={styles.dot}>.</Text>
              <Text style={styles.distance}>{vendor.distanceKm.toFixed(1)} km away</Text>
            </View>
          </View>
        </View>

        <Text style={styles.tagline}>{vendor.tagline}</Text>

        <View style={styles.actionRow}>
          <Button
            title={primaryService?.type === "delivery" ? "Order now" : "Book service"}
            icon="calendar-outline"
            onPress={() => primaryService ? router.push(`/service/${primaryService.id}`) : undefined}
            disabled={!primaryService}
            style={styles.primaryAction}
          />
          <Button title="Call" icon="call-outline" variant="secondary" onPress={() => undefined} style={styles.secondaryAction} />
        </View>

        <View style={styles.snapshot}>
          <View style={styles.snapshotItem}>
            <Text style={styles.snapshotValue}>From {formatCurrency(vendor.startingPrice)}</Text>
            <Text style={styles.snapshotLabel}>Starting price</Text>
          </View>
          <View style={styles.snapshotItem}>
            <Text style={styles.snapshotValue}>{vendor.availability}</Text>
            <Text style={styles.snapshotLabel}>{vendor.responseTime}</Text>
          </View>
        </View>

        <SectionHeader title="Services" subtitle="Choose what you need. You can add details before checkout." />
        {services.length ? (
          services.map((service) => (
            <ServiceCard key={service.id} service={service} onPress={() => router.push(`/service/${service.id}`)} />
          ))
        ) : (
          <EmptyState title="No services listed" message="This business has not added bookable services yet." icon="list-outline" />
        )}

        <SectionHeader title="Trust" />
        <AnimatedPressable onPress={() => setTrustOpen(true)} haptic="selection">
          <TrustScore vendor={vendor} />
        </AnimatedPressable>

        <SectionHeader title="About" />
        <View style={styles.plainSection}>
          <Text style={styles.description}>{vendor.description}</Text>
          <View style={styles.badgeRow}>
            <Badge label={`${vendor.completedJobs} completed bookings`} tone="neutral" />
            <Badge label={`${vendor.serviceRadiusKm} km service radius`} tone="neutral" />
          </View>
        </View>

        <SectionHeader title="Location" />
        <View style={styles.locationCard}>
          <Ionicons name="location-outline" size={20} color={colors.primary} />
          <View style={styles.locationCopy}>
            <Text style={styles.locationTitle}>{vendor.address}</Text>
            <Text style={styles.locationMeta}>{vendor.hours}</Text>
            <Text style={styles.locationMeta}>{vendor.deliveryOptions.join(" · ")}</Text>
          </View>
        </View>

        <SectionHeader title="Reviews" actionLabel="See all" onAction={() => router.push({ pathname: "/order/reviews", params: { vendorId: vendor.id } })} />
        {reviews.length ? reviews.slice(0, 2).map((review) => <ReviewCard key={review.id} review={review} />) : (
          <EmptyState title="No reviews yet" message="Reviews from completed bookings will appear here." icon="star-outline" />
        )}
        <View style={{ height: 108 + insets.bottom }} />
        </View>
        {isDesktop ? (
          <View style={styles.desktopBookingPanel}>
            <Text style={styles.panelEyebrow}>Starting from</Text>
            <Text style={styles.panelPrice}>{formatCurrency(vendor.startingPrice)}</Text>
            <Text style={styles.panelCopy}>{vendor.availability}</Text>
            <Button
              title={primaryService?.type === "delivery" ? "Order now" : "Book service"}
              icon="calendar-outline"
              disabled={!primaryService}
              onPress={() => primaryService ? router.push(`/service/${primaryService.id}`) : undefined}
            />
            <View style={styles.panelDivider} />
            <Text style={styles.panelTitle}>Trusted on Hermes</Text>
            <Text style={styles.panelCopy}>{vendor.trustScore} / 100 trust score</Text>
            <Text style={styles.panelCopy}>{vendor.responseTime}</Text>
            <Button title="How trust works" variant="secondary" onPress={() => setTrustOpen(true)} />
          </View>
        ) : null}
        </View>
      </View>
      </ContentFade>
    </Screen>
    {!isDesktop ? <View style={[styles.stickyCta, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      <View>
        <Text style={styles.stickyLabel}>Starting from</Text>
        <Text style={styles.stickyPrice}>{formatCurrency(vendor.startingPrice)}</Text>
      </View>
      <Button
        title={primaryService?.type === "delivery" ? "Order now" : "Book service"}
        icon="calendar-outline"
        disabled={!primaryService}
        onPress={() => primaryService ? router.push(`/service/${primaryService.id}`) : undefined}
        style={styles.stickyButton}
      />
    </View> : null}
    <BottomSheet visible={trustOpen} title="Trusted on Hermes" onClose={() => setTrustOpen(false)}>
      <Text style={styles.sheetCopy}>Hermes Trust helps you compare businesses using verification, reviews, completed bookings, and reliability. It is a helpful signal, not a safety guarantee.</Text>
      {[
        "Identity verified",
        "Business details verified",
        `${vendor.completedJobs} completed bookings`,
        vendor.responseTime
      ].map((item) => (
        <View key={item} style={styles.sheetRow}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
          <Text style={styles.sheetRowText}>{item}</Text>
        </View>
      ))}
    </BottomSheet>
  </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1
  },
  cover: {
    backgroundColor: colors.surfaceBlue,
    height: 286,
    width: "100%"
  },
  desktopCover: {
    height: 380
  },
  coverWrap: {
    position: "relative"
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.16)"
  },
  floatingNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    left: 20,
    position: "absolute",
    right: 20,
    top: spacing.lg
  },
  coverBadge: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    bottom: spacing.lg,
    flexDirection: "row",
    gap: spacing.xs,
    left: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    position: "absolute",
    ...shadows.soft
  },
  coverBadgeText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  content: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    marginTop: -spacing.xl,
    paddingHorizontal: 20,
    paddingTop: spacing.xl
  },
  desktopContent: {
    alignSelf: "center",
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    width: "100%"
  },
  desktopProfileLayout: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.xxxl
  },
  desktopMainColumn: {
    flex: 1,
    maxWidth: 760
  },
  hero: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  titleBlock: {
    flex: 1,
    paddingRight: spacing.md
  },
  nameRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs
  },
  name: {
    color: colors.text,
    flexShrink: 1,
    fontSize: 28,
    fontWeight: fontWeights.semibold
  },
  meta: {
    color: colors.textMuted,
    fontSize: typography.body,
    marginTop: spacing.xs
  },
  quickMeta: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: spacing.sm
  },
  dot: {
    color: colors.textSubtle,
    marginHorizontal: spacing.sm
  },
  distance: {
    color: colors.textMuted,
    fontSize: typography.small
  },
  tagline: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.lg
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl
  },
  primaryAction: {
    flex: 1
  },
  secondaryAction: {
    minWidth: 96
  },
  snapshot: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl
  },
  snapshotItem: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    flex: 1,
    padding: spacing.lg,
    ...shadows.soft
  },
  snapshotValue: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  snapshotLabel: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    lineHeight: 17,
    marginTop: spacing.xs
  },
  plainSection: {
    gap: spacing.md
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  locationCard: {
    alignItems: "flex-start",
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    flexDirection: "row",
    padding: spacing.lg,
    ...shadows.soft
  },
  locationCopy: {
    flex: 1,
    marginLeft: spacing.md
  },
  locationTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.semibold
  },
  locationMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 19,
    marginTop: spacing.xs
  },
  stickyCta: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: "row",
    gap: spacing.md,
    left: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    position: "absolute",
    right: 0,
    ...shadows.floating
  },
  stickyLabel: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    fontWeight: fontWeights.medium
  },
  stickyPrice: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.semibold,
    marginTop: spacing.xs
  },
  stickyButton: {
    flex: 1
  },
  desktopBookingPanel: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    gap: spacing.md,
    padding: spacing.xl,
    width: 340,
    ...shadows.floating
  },
  panelEyebrow: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    fontWeight: fontWeights.semibold,
    textTransform: "uppercase"
  },
  panelPrice: {
    color: colors.text,
    fontSize: 28,
    fontWeight: fontWeights.semibold
  },
  panelTitle: {
    color: colors.text,
    fontSize: typography.cardTitle,
    fontWeight: fontWeights.semibold
  },
  panelCopy: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 20
  },
  panelDivider: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: spacing.sm
  },
  sheetCopy: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
    marginBottom: spacing.lg
  },
  sheetRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  sheetRowText: {
    color: colors.text,
    flex: 1,
    fontSize: typography.small,
    fontWeight: fontWeights.medium
  }
});
