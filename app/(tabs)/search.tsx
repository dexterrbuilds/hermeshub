import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { BottomSheet } from "@/components/BottomSheet";
import { Button } from "@/components/Button";
import { CategoryCard } from "@/components/CategoryCard";
import { MaterialSurface } from "@/components/MaterialSurface";
import { CategorySkeletonList, ContentFade, EmptyState, SkeletonList } from "@/components/StateViews";
import { Screen } from "@/components/Screen";
import { SearchBar } from "@/components/SearchBar";
import { VendorCard } from "@/components/VendorCard";
import { colors, fontWeights, radii, spacing, typography } from "@/constants/theme";
import { marketplaceService } from "@/services/marketplaceService";
import { useMarketplaceState } from "@/state/MarketplaceState";
import { Category, Vendor } from "@/types/marketplace";
import { useResponsive } from "@/utils/responsive";

const suggestions = [
  "barber near me",
  "birthday cake in Akobo",
  "photographer in Ibadan",
  "phone repair Dugbe",
  "laundry pickup near UI",
  "makeup artist nearby"
];
const filters = ["Verified only", "Available now", "Delivery available", "Top rated", "Under 3 km"];
const quickFilters = ["Nearby", "Top rated", "Verified", "Available today"];

export default function SearchScreen() {
  const { isDesktop, isTablet, vendorColumns } = useResponsive();
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(params.q ?? "");
  const [results, setResults] = useState<Vendor[]>([]);
  const [categoryItems, setCategoryItems] = useState<Category[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [trustVendor, setTrustVendor] = useState<Vendor | undefined>();
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["Verified only"]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { recentSearches, clearRecentSearches, addRecentSearch, savedVendorIds, toggleSavedVendor } = useMarketplaceState();

  const loadResults = async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    const items = await marketplaceService.searchVendors(query);
    setResults(items);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => void loadResults(), 180);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    marketplaceService.getCategories().then(setCategoryItems);
  }, []);

  const filteredResults = useMemo(() => {
    return results.filter((vendor) => {
      if (selectedFilters.includes("Verified only") && !vendor.verified) return false;
      if (selectedFilters.includes("Delivery available") && !vendor.deliveryAvailable) return false;
      if (selectedFilters.includes("Top rated") && vendor.rating < 4.6) return false;
      if (selectedFilters.includes("Under 3 km") && vendor.distanceKm > 3) return false;
      if (selectedFilters.includes("Nearby") && vendor.distanceKm > 3) return false;
      if (selectedFilters.includes("Available today") && !vendor.availability.toLowerCase().includes("today") && !vendor.availability.toLowerCase().includes("open")) return false;
      if (selectedFilters.includes("Available now") && !vendor.availability.toLowerCase().includes("open")) return false;
      return true;
    });
  }, [results, selectedFilters]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((current) =>
      current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter]
    );
  };

  const chooseQuery = (value: string) => {
    setQuery(value);
    addRecentSearch(value);
  };

  return (
    <Screen refreshing={refreshing} onRefresh={() => void loadResults(true)}>
      <View style={styles.exploreHeader}>
        <Text style={styles.exploreTitle}>Explore</Text>
        <Text style={styles.exploreSubtitle}>Find trusted businesses, makers, and services around Ibadan.</Text>
      </View>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="What are you looking for?"
        onFilterPress={isDesktop ? undefined : () => setFilterOpen(true)}
      />

      {!query ? (
        <>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Recent searches</Text>
            {recentSearches.length ? (
              <Pressable onPress={clearRecentSearches} hitSlop={10}>
                <Text style={styles.clearText}>Clear</Text>
              </Pressable>
            ) : null}
          </View>
          <View style={styles.suggestionPanel}>
            {(recentSearches.length ? recentSearches : suggestions).map((suggestion) => (
              <AnimatedPressable key={suggestion} onPress={() => chooseQuery(suggestion)} contentStyle={styles.suggestionRow} haptic="selection">
                <View style={styles.suggestionIcon}>
                  <Ionicons name="time-outline" size={16} color={colors.primaryDark} />
                </View>
                <View style={styles.suggestionCopy}>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                  <Text style={styles.suggestionMeta}>Search around Ibadan</Text>
                </View>
                <Ionicons name="arrow-up-outline" size={15} color={colors.textSubtle} style={styles.suggestionArrow} />
              </AnimatedPressable>
            ))}
          </View>

          <Text style={styles.label}>Browse by category</Text>
          {loading ? <CategorySkeletonList /> : (
            <FlatList
              data={categoryItems.slice(0, 6)}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
              renderItem={({ item }) => (
                <CategoryCard
                  compact
                  category={item}
                  onPress={() => chooseQuery(item.name)}
                />
              )}
            />
          )}
        </>
      ) : null}

      {!isDesktop ? <FlatList
        data={quickFilters}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickFilterList}
        renderItem={({ item }) => {
          const selected = item === "Verified" ? selectedFilters.includes("Verified only") : selectedFilters.includes(item);
          return (
            <AnimatedPressable
              onPress={() => item === "Verified" ? toggleFilter("Verified only") : toggleFilter(item)}
              contentStyle={[styles.quickFilter, selected && styles.quickFilterSelected]}
              haptic="selection"
            >
              {selected ? <Text style={styles.checkMark}>✓</Text> : null}
              <Text style={[styles.quickFilterText, selected && styles.quickFilterTextSelected]}>{item}</Text>
            </AnimatedPressable>
          );
        }}
      /> : null}

      <View style={[isDesktop && styles.desktopSearchLayout]}>
        {isDesktop ? (
          <MaterialSurface variant="elevated" radius="xl" style={styles.filterSidebar}>
            <Text style={styles.sidebarTitle}>Filters</Text>
            {filters.map((filter) => {
              const selected = selectedFilters.includes(filter);
              return (
                <AnimatedPressable key={filter} haptic="selection" onPress={() => toggleFilter(filter)} contentStyle={[styles.desktopFilterRow, selected && styles.desktopFilterSelected]}>
                  <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{filter}</Text>
                </AnimatedPressable>
              );
            })}
            <Button title="Reset filters" variant="secondary" onPress={() => setSelectedFilters([])} />
          </MaterialSurface>
        ) : null}

        <View style={[isDesktop && styles.resultsColumn]}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>{query ? `${filteredResults.length} results` : "Recommended nearby"}</Text>
            <Text style={styles.resultMeta}>Bodija area</Text>
          </View>

          {loading ? (
            <SkeletonList count={isTablet ? 6 : 3} />
          ) : filteredResults.length ? (
            <ContentFade>
              <View style={[isTablet && styles.resultsGrid]}>
                {filteredResults.map((vendor) => (
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
            <EmptyState
              title="No matching businesses"
              message="Try a broader search, remove a filter, or explore another category nearby."
              actionLabel="Clear filters"
              onAction={() => setSelectedFilters([])}
            />
          )}
        </View>
      </View>

      <BottomSheet visible={filterOpen} title="Filter results" onClose={() => setFilterOpen(false)}>
        <View style={styles.filterList}>
          {filters.map((filter) => {
            const selected = selectedFilters.includes(filter);
            return (
              <AnimatedPressable key={filter} onPress={() => toggleFilter(filter)} contentStyle={[styles.filterRow, selected && styles.filterSelected]} haptic="selection">
                <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{filter}</Text>
              </AnimatedPressable>
            );
          })}
        </View>
        <View style={styles.sheetActions}>
          <Button title="Reset" variant="secondary" onPress={() => setSelectedFilters([])} style={styles.sheetButton} />
          <Button title="Show results" onPress={() => setFilterOpen(false)} style={styles.sheetButton} />
        </View>
      </BottomSheet>

      <BottomSheet visible={Boolean(trustVendor)} title="Verified on Hermes" onClose={() => setTrustVendor(undefined)}>
        <Text style={styles.sheetCopy}>Hermes Trust combines identity checks, business details, review quality, completed bookings, and response reliability.</Text>
        {trustVendor ? <Text style={styles.sheetScore}>{trustVendor.trustScore} / 100 trust score</Text> : null}
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  exploreHeader: {
    marginBottom: spacing.lg,
    marginTop: spacing.xs
  },
  exploreTitle: {
    color: colors.text,
    fontSize: 34,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0,
    lineHeight: 39
  },
  exploreSubtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
    marginTop: spacing.sm,
    maxWidth: 560
  },
  label: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold,
    marginTop: spacing.xl
  },
  labelRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xl
  },
  clearText: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  suggestionPanel: {
    marginTop: spacing.xs
  },
  suggestionRow: {
    alignItems: "center",
    borderBottomColor: "rgba(226, 232, 240, 0.82)",
    borderBottomWidth: 1,
    flexDirection: "row",
    minHeight: 58,
    paddingVertical: spacing.sm
  },
  suggestionIcon: {
    alignItems: "center",
    backgroundColor: colors.glassBlue,
    borderRadius: radii.pill,
    height: 34,
    justifyContent: "center",
    marginRight: spacing.md,
    width: 34
  },
  suggestionCopy: {
    flex: 1
  },
  suggestionText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.medium
  },
  suggestionMeta: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    marginTop: spacing.xs
  },
  suggestionArrow: {
    transform: [{ rotate: "45deg" }]
  },
  categoryList: {
    gap: spacing.md,
    paddingRight: spacing.xl
  },
  quickFilterList: {
    gap: spacing.sm,
    paddingVertical: spacing.xl
  },
  quickFilter: {
    alignItems: "center",
    backgroundColor: colors.glassStrong,
    borderColor: "rgba(226, 232, 240, 0.82)",
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 34,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs
  },
  quickFilterSelected: {
    backgroundColor: colors.navy,
    borderColor: colors.navy
  },
  quickFilterText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  quickFilterTextSelected: {
    color: colors.white
  },
  checkMark: {
    color: colors.white,
    fontSize: typography.tiny,
    fontWeight: fontWeights.semibold
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  chipText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: fontWeights.medium
  },
  resultHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    marginTop: spacing.xxxl
  },
  desktopSearchLayout: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.xxxl,
    marginTop: spacing.xl
  },
  filterSidebar: {
    gap: spacing.sm,
    padding: spacing.xl,
    width: 280
  },
  sidebarTitle: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.sm
  },
  desktopFilterRow: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.md,
    padding: spacing.md
  },
  desktopFilterSelected: {
    backgroundColor: colors.surfaceBlue
  },
  resultsColumn: {
    flex: 1
  },
  resultsGrid: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  resultTitle: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold
  },
  resultMeta: {
    color: colors.textMuted,
    fontSize: typography.small
  },
  filterList: {
    gap: spacing.sm,
    marginBottom: spacing.xl
  },
  filterRow: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.md,
    padding: spacing.lg
  },
  filterSelected: {
    backgroundColor: colors.surfaceBlue
  },
  filterText: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: fontWeights.medium
  },
  filterTextSelected: {
    color: colors.primary,
    fontWeight: fontWeights.semibold
  },
  sheetActions: {
    flexDirection: "row",
    gap: spacing.md
  },
  sheetButton: {
    flex: 1
  },
  sheetCopy: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23
  },
  sheetScore: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold,
    marginTop: spacing.lg
  }
});
