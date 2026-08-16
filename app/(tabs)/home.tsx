import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/auth/AuthContext";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { BottomSheet } from "@/components/BottomSheet";
import { Button } from "@/components/Button";
import { CategoryCard } from "@/components/CategoryCard";
import { MaterialSurface } from "@/components/MaterialSurface";
import { Screen } from "@/components/Screen";
import { SearchBar } from "@/components/SearchBar";
import { SectionHeader } from "@/components/SectionHeader";
import { CategorySkeletonList, ContentFade, SkeletonList } from "@/components/StateViews";
import { VendorCard } from "@/components/VendorCard";
import { colors, fontWeights, radii, shadows, spacing, typography } from "@/constants/theme";
import { marketplaceService } from "@/services/marketplaceService";
import { useMarketplaceState } from "@/state/MarketplaceState";
import { Category, Vendor } from "@/types/marketplace";
import { useResponsive } from "@/utils/responsive";

const rotatingPrompts = [
  "What are you looking for?",
  "Barber near me",
  "Birthday cake in Akobo",
  "Photographer in Ibadan",
  "Makeup artist nearby",
  "Phone repair near Dugbe"
];

export default function HomeScreen() {
  const { isDesktop, isTablet, vendorColumns } = useResponsive();
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [trustVendor, setTrustVendor] = useState<Vendor | undefined>();
  const { savedVendorIds, toggleSavedVendor, addRecentSearch, recentlyViewed } = useMarketplaceState();
  const { profile } = useAuth();

  const loadHome = async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    const [categoryItems, vendorItems] = await Promise.all([
      marketplaceService.getCategories(),
      marketplaceService.getNearbyVendors()
    ]);
    setCategories(categoryItems);
    setVendors(vendorItems);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    void loadHome();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setPromptIndex((current) => (current + 1) % rotatingPrompts.length), 3000);
    return () => clearInterval(timer);
  }, []);

  const submitSearch = () => {
    const nextQuery = query || "barber near me";
    addRecentSearch(nextQuery);
    router.push({ pathname: "/search", params: { q: nextQuery } });
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <Screen refreshing={refreshing} onRefresh={() => void loadHome(true)}>
      <View style={[styles.header, isDesktop && styles.desktopHeader]}>
        <View>
          <Text style={styles.greeting}>{greeting}{profile?.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={15} color={colors.primary} />
            <Text style={styles.locationText}>{profile?.defaultArea ?? "Bodija"}, Ibadan</Text>
          </View>
        </View>
        <Pressable style={styles.avatarButton} onPress={() => router.push("/profile")}>
          <Text style={styles.avatarText}>{profile?.fullName?.[0]?.toUpperCase() ?? "H"}</Text>
        </Pressable>
      </View>

      <MaterialSurface variant="darkGlass" radius="xl" style={[styles.heroPanel, isDesktop && styles.desktopHeroPanel]}>
        <Text style={styles.heroEyebrow}>Ibadan local marketplace</Text>
        <Text style={[styles.heroTitle, isDesktop && styles.desktopHeroTitle]}>Whatever you need, find it nearby.</Text>
        <Text style={styles.heroCopy}>Discover trusted businesses, skilled professionals, services and local makers around you.</Text>
      </MaterialSurface>

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder={rotatingPrompts[promptIndex]}
        onSubmit={submitSearch}
        onFilterPress={() => router.push("/search")}
      />

      <View style={styles.popularSearches}>
        {["Barber", "Birthday cake", "Photographer", "Phone repair", "Laundry pickup"].map((item) => (
          <AnimatedPressable key={item} haptic="selection" onPress={() => {
            addRecentSearch(item);
            router.push({ pathname: "/search", params: { q: item } });
          }} contentStyle={styles.searchPill}>
            <Text style={styles.searchPillText}>{item}</Text>
          </AnimatedPressable>
        ))}
      </View>

      <SectionHeader title="What do you need?" actionLabel="More" onAction={() => router.push("/categories")} />
      {loading ? (
        <CategorySkeletonList />
      ) : isDesktop ? (
        <ContentFade>
          <View style={styles.desktopCategoryGrid}>
            {categories.slice(0, 8).map((item) => (
              <CategoryCard
                key={item.id}
                category={item}
                compact
                onPress={() => router.push({ pathname: "/nearby", params: { category: item.id, title: item.name } })}
              />
            ))}
          </View>
        </ContentFade>
      ) : (
        <ContentFade>
          <FlatList
            data={categories.slice(0, 8)}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
            renderItem={({ item }) => (
              <CategoryCard
                category={item}
                compact
                onPress={() => router.push({ pathname: "/nearby", params: { category: item.id, title: item.name } })}
              />
            )}
          />
        </ContentFade>
      )}

      <View style={[isDesktop && styles.desktopMainLayout]}>
        <View style={[isDesktop && styles.desktopMainColumn]}>
          <SectionHeader
            title="Top rated near you"
            subtitle="Local businesses with strong reviews and recent activity."
            actionLabel="See all"
            onAction={() => router.push("/nearby")}
          />
          {loading ? (
            <SkeletonList count={isTablet ? 6 : 3} />
          ) : (
            <ContentFade>
              <View style={[isTablet && styles.vendorGrid]}>
                {vendors.slice(0, isDesktop ? 6 : 4).map((vendor) => (
                  <View key={vendor.id} style={[isTablet && { width: `${100 / (isDesktop ? Math.min(vendorColumns, 3) : 2)}%`, paddingRight: spacing.lg }]}>
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
          )}

          <SectionHeader title="Available today" />
          {loading ? (
            <SkeletonList count={isDesktop ? 3 : 2} compact={!isDesktop} />
          ) : isDesktop ? (
            <ContentFade>
              <View style={styles.vendorGrid}>
                {vendors.slice(4).map((item) => (
                  <View key={item.id} style={{ width: "33.333%", paddingRight: spacing.lg }}>
                    <VendorCard
                      vendor={item}
                      saved={savedVendorIds.includes(item.id)}
                      onSavePress={() => toggleSavedVendor(item.id)}
                      onTrustPress={() => setTrustVendor(item)}
                      onPress={() => router.push(`/vendor/${item.id}`)}
                    />
                  </View>
                ))}
              </View>
            </ContentFade>
          ) : (
            <ContentFade>
              <FlatList
                data={vendors.slice(4)}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <VendorCard
                    compact
                    vendor={item}
                    saved={savedVendorIds.includes(item.id)}
                    onSavePress={() => toggleSavedVendor(item.id)}
                    onTrustPress={() => setTrustVendor(item)}
                    onPress={() => router.push(`/vendor/${item.id}`)}
                  />
                )}
              />
            </ContentFade>
          )}
        </View>

        {isDesktop ? (
          <View style={styles.desktopSidebar}>
            <View style={styles.sidebarPanel}>
              <Text style={styles.sidebarTitle}>Active booking</Text>
              <Text style={styles.sidebarBody}>Naya Cakes & Treats is preparing your order.</Text>
              <Button title="Track order" variant="secondary" onPress={() => router.push("/order/tracking")} />
            </View>
            <View style={styles.sidebarPanel}>
              <Text style={styles.sidebarTitle}>Popular searches</Text>
              {["Barber Bodija", "Birthday cake Akobo", "Photographer Jericho", "Laptop repair Dugbe"].map((item) => (
                <AnimatedPressable key={item} haptic="selection" onPress={() => router.push({ pathname: "/search", params: { q: item } })} contentStyle={styles.sidebarLink}>
                  <Text style={styles.sidebarLinkText}>{item}</Text>
                </AnimatedPressable>
              ))}
            </View>
            {recentlyViewed.length ? (
              <View style={styles.sidebarPanel}>
                <Text style={styles.sidebarTitle}>Recently viewed</Text>
                {recentlyViewed.slice(0, 3).map((vendor) => (
                  <AnimatedPressable key={vendor.id} onPress={() => router.push(`/vendor/${vendor.id}`)} contentStyle={styles.sidebarVendor}>
                    <Text style={styles.sidebarVendorName}>{vendor.businessName}</Text>
                    <Text style={styles.sidebarBody}>{vendor.area} · {vendor.rating.toFixed(1)}</Text>
                  </AnimatedPressable>
                ))}
              </View>
            ) : null}
          </View>
        ) : recentlyViewed.length ? (
          <>
            <SectionHeader title="Recently viewed" />
            <FlatList
              data={recentlyViewed}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <VendorCard compact vendor={item} saved={savedVendorIds.includes(item.id)} onSavePress={() => toggleSavedVendor(item.id)} onTrustPress={() => setTrustVendor(item)} onPress={() => router.push(`/vendor/${item.id}`)} />
              )}
            />
          </>
        ) : null}
      </View>

      <Pressable style={styles.feedback} onPress={() => router.push("/profile")}>
        <View style={styles.feedbackIcon}>
          <Ionicons name="chatbubble-ellipses-outline" size={19} color={colors.primary} />
        </View>
        <View style={styles.feedbackCopy}>
          <Text style={styles.feedbackTitle}>Help shape Hermes Hub</Text>
          <Text style={styles.feedbackText}>Share what would make local booking feel easier during the Ibadan beta.</Text>
        </View>
      </Pressable>

      <BottomSheet visible={Boolean(trustVendor)} title="How Hermes Trust works" onClose={() => setTrustVendor(undefined)}>
        <Text style={styles.sheetCopy}>Hermes Trust helps you compare businesses using verification, reviews, completed bookings, and response reliability.</Text>
        {trustVendor ? (
          <View style={styles.trustRows}>
            {[
              "Identity verified",
              "Business details checked",
              `${trustVendor.completedJobs} completed jobs`,
              trustVendor.responseTime
            ].map((item) => (
              <View key={item} style={styles.trustRow}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text style={styles.trustRowText}>{item}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg
  },
  desktopHeader: {
    marginTop: spacing.xl
  },
  greeting: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold
  },
  locationRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.xs
  },
  locationText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: fontWeights.medium
  },
  avatarButton: {
    alignItems: "center",
    backgroundColor: colors.navy,
    borderRadius: radii.pill,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  avatarText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: fontWeights.semibold
  },
  heroPanel: {
    marginBottom: spacing.lg,
    padding: spacing.xl
  },
  desktopHeroPanel: {
    padding: spacing.xxxl
  },
  heroEyebrow: {
    color: "#BFDBFE",
    fontSize: typography.tiny,
    fontWeight: fontWeights.semibold,
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: fontWeights.semibold,
    lineHeight: 32,
    marginTop: spacing.sm
  },
  desktopHeroTitle: {
    fontSize: 34,
    lineHeight: 40
  },
  heroCopy: {
    color: "#DBEAFE",
    fontSize: typography.small,
    lineHeight: 20,
    marginTop: spacing.sm,
    maxWidth: 280
  },
  popularSearches: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  searchPill: {
    backgroundColor: colors.glassStrong,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  searchPillText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: fontWeights.medium
  },
  categoryList: {
    gap: spacing.md,
    paddingRight: spacing.xl
  },
  desktopCategoryGrid: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl
  },
  desktopMainLayout: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.xxxl
  },
  desktopMainColumn: {
    flex: 1
  },
  vendorGrid: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  desktopSidebar: {
    gap: spacing.lg,
    paddingTop: spacing.xxxl,
    width: 320
  },
  sidebarPanel: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    ...shadows.soft
  },
  sidebarTitle: {
    color: colors.text,
    fontSize: typography.cardTitle,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.sm
  },
  sidebarBody: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 20,
    marginBottom: spacing.md
  },
  sidebarLink: {
    borderRadius: radii.md,
    paddingVertical: spacing.sm
  },
  sidebarLinkText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  sidebarVendor: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingVertical: spacing.md
  },
  sidebarVendorName: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  feedback: {
    alignItems: "center",
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.lg,
    flexDirection: "row",
    marginTop: spacing.xl,
    padding: spacing.lg
  },
  feedbackIcon: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    height: 42,
    justifyContent: "center",
    marginRight: spacing.md,
    width: 42
  },
  feedbackCopy: {
    flex: 1
  },
  feedbackTitle: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: fontWeights.semibold
  },
  feedbackText: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 19,
    marginTop: spacing.xs
  },
  sheetCopy: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
    marginBottom: spacing.lg
  },
  trustRows: {
    gap: spacing.md
  },
  trustRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  trustRowText: {
    color: colors.text,
    flex: 1,
    fontSize: typography.small,
    fontWeight: fontWeights.medium
  }
});
