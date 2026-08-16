import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { FadeImage } from "@/components/FadeImage";
import { FadeInView } from "@/components/FadeInView";
import { SkeletonBlock } from "@/components/StateViews";
import { colors, fontWeights, motion, radii, shadows, spacing, typography } from "@/constants/theme";
import { businessService } from "@/services/businessService";
import { Vendor } from "@/types/marketplace";
import { getBusinessCardCopy } from "@/utils/businessCopy";
import { selectionFeedback } from "@/utils/feedback";
import { useResponsive } from "@/utils/responsive";

const demoExamples = [
  { query: "phone repair near Dugbe", vendorId: "dugbe-pixelfix" },
  { query: "birthday cake in Akobo", vendorId: "akobo-sweetcrumbs" },
  { query: "barber near Bodija", vendorId: "bodija-fade-form" },
  { query: "makeup artist nearby", vendorId: "ringroad-glowbytara" },
  { query: "laundry pickup near UI", vendorId: "ui-campus-cleanwash" }
];

export function MarketplaceDemo() {
  const { width } = useWindowDimensions();
  const { isDesktop } = useResponsive();
  const scrollRef = useRef<ScrollView>(null);
  const pauseUntilRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iconScale = useRef(new Animated.Value(1)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const [searching, setSearching] = useState(false);

  const demoVendors = useMemo(
    () => businessService.getDemoBusinesses(demoExamples.map((item) => item.vendorId)),
    []
  );
  const activeExample = demoExamples[activeIndex % demoExamples.length];
  const activeVendor = demoVendors[activeIndex % demoVendors.length];
  const mobileCardWidth = Math.min(width - spacing.huge * 2, 310);
  const cardWidth = isDesktop ? 292 : mobileCardWidth;
  const snapStep = cardWidth + spacing.md;

  const pauseAuto = () => {
    pauseUntilRef.current = Date.now() + 7200;
  };

  const runSearch = (nextIndex = activeIndex, shouldScroll = true) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSearching(true);
    Animated.sequence([
      Animated.spring(iconScale, { toValue: 1.12, useNativeDriver: true, ...motion.spring }),
      Animated.spring(iconScale, { toValue: 1, useNativeDriver: true, ...motion.spring })
    ]).start();
    timeoutRef.current = setTimeout(() => {
      setActiveIndex(nextIndex);
      setSearching(false);
      if (shouldScroll && !isDesktop) {
        scrollRef.current?.scrollTo({ x: nextIndex * snapStep, animated: true });
      }
    }, 460);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      runSearch((activeIndex + 1) % demoExamples.length);
    }, 3800);
    return () => {
      clearInterval(timer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeIndex, isDesktop, snapStep]);

  const handleManualIndex = (index: number) => {
    pauseAuto();
    void selectionFeedback();
    runSearch(index, false);
  };

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / snapStep);
    const clamped = Math.max(0, Math.min(nextIndex, demoExamples.length - 1));
    if (clamped !== activeIndex) handleManualIndex(clamped);
  };

  const handleTapSearch = () => {
    pauseAuto();
    runSearch(activeIndex, false);
  };

  const handleTapFilter = () => {
    pauseAuto();
    runSearch((activeIndex + 1) % demoExamples.length);
  };

  return (
    <View style={[styles.stage, isDesktop && styles.desktopStage]}>
      <AnimatedPressable onPress={handleTapSearch} haptic="selection" contentStyle={styles.searchCard}>
        <Animated.View style={{ transform: [{ scale: iconScale }] }}>
          <Ionicons name={searching ? "sync" : "search-outline"} size={19} color={colors.primary} />
        </Animated.View>
        <FadeInView key={`${activeExample.query}-${searching ? "loading" : "ready"}`} distance={6} duration={motion.normal} style={styles.searchTextWrap}>
          <Text style={styles.searchText}>{activeExample.query}</Text>
        </FadeInView>
        <AnimatedPressable onPress={handleTapFilter} haptic="selection" contentStyle={styles.filterButton}>
          <Ionicons name="options-outline" size={15} color={colors.white} />
        </AnimatedPressable>
      </AnimatedPressable>

      <View style={[styles.resultSurface, isDesktop && styles.desktopResultSurface]}>
        <View style={styles.surfaceHeader}>
          <Text style={styles.surfaceLabel}>{searching ? "Searching Ibadan" : "Results near you"}</Text>
          <Text style={styles.surfaceCount}>{searching ? "Finding matches" : "5 businesses"}</Text>
        </View>

        {searching ? (
          <DemoSkeleton isDesktop={isDesktop} />
        ) : isDesktop ? (
          <View style={styles.desktopGrid}>
            {demoVendors.slice(0, 3).map((vendor, index) => (
              <DemoResultCard
                key={vendor.id}
                vendor={vendor}
                active={index === activeIndex % 3}
                width={index === 0 ? 316 : 236}
                onPress={() => {
                  pauseAuto();
                  router.push("/signup");
                }}
              />
            ))}
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={snapStep}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
            onScrollBeginDrag={pauseAuto}
            onMomentumScrollEnd={handleMomentumEnd}
          >
            {demoVendors.map((vendor, index) => (
              <DemoResultCard
                key={vendor.id}
                vendor={vendor}
                active={index === activeIndex}
                width={cardWidth}
                onPress={() => {
                  pauseAuto();
                  router.push("/signup");
                }}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

function DemoResultCard({ vendor, active, width, onPress }: { vendor: Vendor; active: boolean; width: number; onPress: () => void }) {
  const copy = getBusinessCardCopy(vendor);

  return (
    <FadeInView key={`${vendor.id}-${active ? "active" : "rest"}`} distance={active ? 10 : 4} duration={motion.normal}>
      <AnimatedPressable
        onPress={onPress}
        haptic="selection"
        contentStyle={[
          styles.resultCard,
          { width },
          active ? styles.resultCardActive : styles.resultCardQuiet
        ]}
      >
        <FadeImage uri={vendor.image} style={styles.resultImage} fallbackIcon="briefcase-outline" />
        <View style={styles.resultBody}>
          <View style={styles.resultNameRow}>
            <Text style={styles.resultName} numberOfLines={1}>{vendor.businessName}</Text>
            {vendor.verified ? <Ionicons name="checkmark-circle" size={15} color={colors.success} /> : null}
          </View>
          <Text style={styles.resultMeta} numberOfLines={1}>{vendor.category} · {vendor.area} · {vendor.distanceKm.toFixed(1)} km</Text>
          <View style={styles.resultFooter}>
            <Text style={styles.resultPrice} numberOfLines={1}>{copy.priceLine}</Text>
            <View style={styles.ratingInline}>
              <Ionicons name="star" size={13} color={colors.warning} />
              <Text style={styles.ratingText}>{vendor.rating.toFixed(1)} ({vendor.reviewCount})</Text>
            </View>
          </View>
          <Text style={styles.availabilityLine} numberOfLines={1}>{copy.availabilityLine}</Text>
        </View>
      </AnimatedPressable>
    </FadeInView>
  );
}

function DemoSkeleton({ isDesktop }: { isDesktop: boolean }) {
  return (
    <View style={isDesktop ? styles.desktopGrid : styles.skeletonMobile}>
      {Array.from({ length: isDesktop ? 3 : 1 }).map((_, index) => (
        <View key={index} style={[styles.skeletonCard, isDesktop && { width: index === 0 ? 316 : 236 }]}>
          <SkeletonBlock style={styles.skeletonImage} />
          <View style={styles.skeletonBody}>
            <SkeletonBlock style={styles.skeletonLineLarge} />
            <SkeletonBlock style={styles.skeletonLineMedium} />
            <View style={styles.skeletonRow}>
              <SkeletonBlock style={styles.skeletonPill} />
              <SkeletonBlock style={styles.skeletonPillSmall} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    marginTop: spacing.xl
  },
  desktopStage: {
    marginTop: 0
  },
  searchCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 58,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    ...shadows.floating
  },
  searchTextWrap: {
    flex: 1
  },
  searchText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.medium
  },
  filterButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  resultSurface: {
    backgroundColor: colors.surfaceBlue,
    borderColor: "rgba(37, 99, 235, 0.10)",
    borderRadius: radii.xl,
    borderWidth: 1,
    marginTop: spacing.xl,
    overflow: "hidden",
    paddingVertical: spacing.lg
  },
  desktopResultSurface: {
    padding: spacing.xl
  },
  surfaceHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg
  },
  surfaceLabel: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  surfaceCount: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    fontWeight: fontWeights.medium
  },
  carouselContent: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md
  },
  desktopGrid: {
    alignItems: "stretch",
    flexDirection: "row",
    gap: spacing.md,
    paddingTop: spacing.md
  },
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: "hidden",
    ...shadows.card
  },
  resultCardActive: {
    opacity: 1,
    transform: [{ scale: 1 }]
  },
  resultCardQuiet: {
    opacity: 0.68,
    transform: [{ scale: 0.94 }]
  },
  resultImage: {
    backgroundColor: colors.surfaceSoft,
    height: 168,
    width: "100%"
  },
  resultBody: {
    padding: spacing.lg
  },
  resultNameRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs
  },
  resultName: {
    color: colors.text,
    flex: 1,
    fontSize: typography.cardTitle,
    fontWeight: fontWeights.semibold
  },
  resultMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: spacing.xs
  },
  resultFooter: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
    marginTop: spacing.md
  },
  resultPrice: {
    color: colors.primaryDark,
    flex: 1,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  ratingInline: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs
  },
  ratingText: {
    color: colors.text,
    fontSize: typography.tiny,
    fontWeight: fontWeights.semibold
  },
  availabilityLine: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    marginTop: spacing.sm
  },
  skeletonMobile: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md
  },
  skeletonCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: "hidden",
    ...shadows.soft
  },
  skeletonImage: {
    height: 168,
    width: "100%"
  },
  skeletonBody: {
    padding: spacing.lg
  },
  skeletonLineLarge: {
    height: 14,
    width: "70%"
  },
  skeletonLineMedium: {
    height: 12,
    marginTop: spacing.md,
    width: "88%"
  },
  skeletonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg
  },
  skeletonPill: {
    height: 13,
    width: "44%"
  },
  skeletonPillSmall: {
    height: 13,
    width: "28%"
  }
});
