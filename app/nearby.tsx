import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "@/components/AppHeader";
import { BottomSheet } from "@/components/BottomSheet";
import { ContentFade, EmptyState, SkeletonList } from "@/components/StateViews";
import { Screen } from "@/components/Screen";
import { VendorCard } from "@/components/VendorCard";
import { colors, fontWeights, radii, spacing, typography } from "@/constants/theme";
import { marketplaceService } from "@/services/marketplaceService";
import { locationService } from "@/services/locationService";
import { useMarketplaceState } from "@/state/MarketplaceState";
import { CategoryId, Vendor } from "@/types/marketplace";
import { useResponsive } from "@/utils/responsive";

const filters = ["Nearest", "Top rated", "Verified", "Delivery"];

export default function NearbyScreen() {
  const params = useLocalSearchParams<{ category?: CategoryId; title?: string }>();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filter, setFilter] = useState("Nearest");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [trustVendor, setTrustVendor] = useState<Vendor | undefined>();
  const { savedVendorIds, toggleSavedVendor } = useMarketplaceState();
  const { isTablet, isDesktop, vendorColumns } = useResponsive();

  const loadNearby = async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    const current = !params.category ? await locationService.getCurrentLocation().catch(() => ({ status: "unavailable" as const })) : undefined;
    const items = params.category
      ? await marketplaceService.getVendorsByCategory(params.category)
      : current?.status === "granted"
        ? await marketplaceService.getNearbyVendorsByLocation(current.latitude, current.longitude, 10)
        : await marketplaceService.getNearbyVendors();
    setVendors(items);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    void loadNearby();
  }, [params.category]);

  const visibleVendors = useMemo(() => {
    const list = [...vendors];
    if (filter === "Top rated") return list.sort((a, b) => b.rating - a.rating);
    if (filter === "Verified") return list.filter((vendor) => vendor.verified);
    if (filter === "Delivery") return list.filter((vendor) => vendor.deliveryAvailable);
    return list.sort((a, b) => a.distanceKm - b.distanceKm);
  }, [filter, vendors]);

  return (
    <Screen refreshing={refreshing} onRefresh={() => void loadNearby(true)}>
      <AppHeader
        leftIcon="chevron-back"
        onLeftPress={() => router.back()}
        title={params.title ?? "Nearby businesses"}
        subtitle="Compare trusted businesses and professionals by location, rating, availability, and fit."
      />
      <View style={styles.filters}>
        {filters.map((item) => (
          <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}>
            <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>
      {loading ? (
        <SkeletonList count={isTablet ? 6 : 4} />
      ) : visibleVendors.length ? (
        <ContentFade>
          <View style={[isTablet && styles.vendorGrid]}>
            {visibleVendors.map((vendor) => (
              <View key={vendor.id} style={[isTablet && { width: `${100 / (isDesktop ? vendorColumns : 2)}%`, paddingRight: spacing.lg }]}>
                <VendorCard
                  vendor={vendor}
                  saved={savedVendorIds.includes(vendor.id)}
                  onSavePress={() => toggleSavedVendor(vendor.id)}
                  onTrustPress={() => setTrustVendor(vendor)}
                  onPress={() => router.push(`/vendor/${vendor.id}`)}
                />
              </View>
            ))}
          </View>
        </ContentFade>
      ) : (
        <EmptyState title="No businesses match this filter" message="Try a different filter or explore more categories." actionLabel="Explore" onAction={() => router.push("/search")} />
      )}
      <BottomSheet visible={Boolean(trustVendor)} title="Hermes Trust" onClose={() => setTrustVendor(undefined)}>
        <Text style={styles.sheetCopy}>Trust is based on verification, reviews, reliability, and completed bookings on Hermes Hub.</Text>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.xl
  },
  vendorGrid: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  filter: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  filterActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  filterText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  filterTextActive: {
    color: colors.white
  },
  sheetCopy: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23
  }
});
