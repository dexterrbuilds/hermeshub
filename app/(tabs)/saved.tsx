import { router } from "expo-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ContentFade, EmptyState, SkeletonList } from "@/components/StateViews";
import { Screen } from "@/components/Screen";
import { VendorCard } from "@/components/VendorCard";
import { marketplaceService } from "@/services/marketplaceService";
import { useMarketplaceState } from "@/state/MarketplaceState";
import { Vendor } from "@/types/marketplace";

export default function SavedScreen() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { savedVendorIds, toggleSavedVendor } = useMarketplaceState();

  const loadSaved = async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    const items = await marketplaceService.getNearbyVendors();
    setVendors(items.filter((vendor) => savedVendorIds.includes(vendor.id)));
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    void loadSaved();
  }, [savedVendorIds]);

  return (
    <Screen refreshing={refreshing} onRefresh={() => void loadSaved(true)}>
      <AppHeader title="Saved" subtitle="Keep trusted businesses close for the next time you need them." />
      {loading ? (
        <SkeletonList count={3} />
      ) : vendors.length ? (
        <ContentFade>
          {vendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} saved onSavePress={() => toggleSavedVendor(vendor.id)} onPress={() => router.push(`/vendor/${vendor.id}`)} />
          ))}
        </ContentFade>
      ) : (
        <EmptyState
          title="No saved businesses yet"
          message="Save businesses you trust so you can find them quickly later."
          actionLabel="Explore businesses"
          onAction={() => router.push("/search")}
          icon="heart-outline"
        />
      )}
    </Screen>
  );
}
