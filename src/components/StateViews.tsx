import { Ionicons } from "@expo/vector-icons";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { Button } from "@/components/Button";
import { colors, fontWeights, radii, shadows, spacing, typography } from "@/constants/theme";

type EmptyStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function EmptyState({ title, message, actionLabel, onAction, icon = "search-outline" }: EmptyStateProps) {
  return (
    <AnimatedPressable haptic="selection" contentStyle={styles.state}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={28} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} variant="secondary" style={styles.action} />
      ) : null}
    </AnimatedPressable>
  );
}

export function ErrorState({
  title = "Couldn't load this",
  message,
  onRetry,
  retrying = false
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
  retrying?: boolean;
}) {
  return (
    <View style={styles.state}>
      <View style={[styles.iconWrap, styles.errorWrap]}>
        <Ionicons name="warning-outline" size={28} color={colors.danger} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <Button title="Try again" loading={retrying} onPress={onRetry} variant="secondary" style={styles.action} /> : null}
    </View>
  );
}

export function SuccessState({
  title,
  message,
  actionLabel,
  onAction
}: {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}) {
  const scale = useRef(new Animated.Value(0.82)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 7, tension: 90 }),
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true })
    ]).start();
  }, [opacity, scale]);

  return (
    <Animated.View style={[styles.state, { opacity }]}>
      <Animated.View style={[styles.successWrap, { transform: [{ scale }] }]}>
        <Ionicons name="checkmark" size={32} color={colors.white} />
      </Animated.View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Button title={actionLabel} onPress={onAction} style={styles.action} />
    </Animated.View>
  );
}

export function SkeletonBlock({ style }: { style?: StyleProp<ViewStyle> }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1450,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true
      })
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-140, 420]
  });

  return (
    <View style={[styles.skeletonBase, style]}>
      <Animated.View style={[styles.shimmerBand, { transform: [{ translateX }, { rotate: "12deg" }] }]} />
    </View>
  );
}

export function ContentFade({ children }: { children: ReactNode }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [opacity]);

  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
}

export function VendorCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.skeletonCard, compact && styles.skeletonCompact]}>
      <SkeletonBlock style={[styles.skeletonImage, compact && styles.skeletonCompactImage]} />
      <View style={styles.skeletonBody}>
        <SkeletonBlock style={styles.skeletonLineWide} />
        <SkeletonBlock style={styles.skeletonLine} />
        <View style={styles.skeletonFooter}>
          <SkeletonBlock style={styles.skeletonTiny} />
          <SkeletonBlock style={styles.skeletonTinyRight} />
        </View>
      </View>
    </View>
  );
}

export function SkeletonList({ count = 3, compact = false }: { count?: number; compact?: boolean }) {
  return (
    <View style={compact ? styles.skeletonHorizontal : undefined}>
      {Array.from({ length: count }).map((_, index) => (
        <VendorCardSkeleton key={index} compact={compact} />
      ))}
    </View>
  );
}

export function VendorListSkeleton({ count = 3, compact = false }: { count?: number; compact?: boolean }) {
  return <SkeletonList count={count} compact={compact} />;
}

export function SearchResultSkeleton({ count = 3 }: { count?: number }) {
  return <SkeletonList count={count} />;
}

export function CategorySkeletonList() {
  return (
    <View style={styles.categorySkeletonRow}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.categorySkeleton}>
          <SkeletonBlock style={styles.categoryIconSkeleton} />
          <SkeletonBlock style={styles.categoryLineSkeleton} />
        </View>
      ))}
    </View>
  );
}

export function VendorProfileSkeleton() {
  return (
    <View>
      <SkeletonBlock style={styles.profileHeroSkeleton} />
      <View style={styles.profileBodySkeleton}>
        <SkeletonBlock style={styles.profileTitleSkeleton} />
        <SkeletonBlock style={styles.profileMetaSkeleton} />
        <SkeletonBlock style={styles.profileActionSkeleton} />
        <VendorCardSkeleton />
        <VendorCardSkeleton />
      </View>
    </View>
  );
}

export function OrderSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.orderSkeleton}>
          <SkeletonBlock style={styles.orderAvatarSkeleton} />
          <View style={styles.orderBodySkeleton}>
            <SkeletonBlock style={styles.orderLineWide} />
            <SkeletonBlock style={styles.orderLine} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function ServiceSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.serviceSkeleton}>
          <View style={styles.serviceSkeletonBody}>
            <SkeletonBlock style={styles.serviceLineWide} />
            <SkeletonBlock style={styles.serviceLine} />
            <SkeletonBlock style={styles.serviceLineShort} />
          </View>
          <SkeletonBlock style={styles.serviceButtonSkeleton} />
        </View>
      ))}
    </View>
  );
}

export function ReviewSkeleton({ count = 2 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.reviewSkeleton}>
          <View style={styles.reviewHeaderSkeleton}>
            <SkeletonBlock style={styles.reviewAvatarSkeleton} />
            <View style={styles.reviewNameSkeleton}>
              <SkeletonBlock style={styles.reviewLineWide} />
              <SkeletonBlock style={styles.reviewLineShort} />
            </View>
          </View>
          <SkeletonBlock style={styles.reviewTextSkeleton} />
          <SkeletonBlock style={styles.reviewTextShortSkeleton} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  state: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.huge
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.xl,
    height: 64,
    justifyContent: "center",
    marginBottom: spacing.lg,
    width: 64
  },
  errorWrap: {
    backgroundColor: colors.dangerSoft
  },
  successWrap: {
    alignItems: "center",
    backgroundColor: colors.success,
    borderRadius: radii.xl,
    height: 72,
    justifyContent: "center",
    marginBottom: spacing.lg,
    width: 72
  },
  title: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold,
    textAlign: "center"
  },
  message: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
    textAlign: "center"
  },
  action: {
    marginTop: spacing.xl,
    minWidth: 180
  },
  skeletonBase: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.md,
    overflow: "hidden"
  },
  shimmerBand: {
    backgroundColor: "rgba(255, 255, 255, 0.58)",
    bottom: -16,
    position: "absolute",
    top: -16,
    width: 72
  },
  skeletonCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadows.soft
  },
  skeletonCompact: {
    marginRight: spacing.md,
    width: 292
  },
  skeletonHorizontal: {
    flexDirection: "row"
  },
  skeletonImage: {
    height: 172,
    width: "100%"
  },
  skeletonCompactImage: {
    height: 154
  },
  skeletonBody: {
    justifyContent: "center",
    padding: spacing.lg
  },
  skeletonLineWide: {
    height: 14,
    width: "74%"
  },
  skeletonLine: {
    height: 11,
    marginTop: spacing.md,
    width: "55%"
  },
  skeletonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md
  },
  skeletonTiny: {
    height: 10,
    width: "36%"
  },
  skeletonTinyRight: {
    height: 10,
    width: "28%"
  },
  categorySkeletonRow: {
    flexDirection: "row",
    gap: spacing.md
  },
  categorySkeleton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    width: 86,
    ...shadows.soft
  },
  categoryIconSkeleton: {
    borderRadius: radii.pill,
    height: 42,
    width: 42
  },
  categoryLineSkeleton: {
    height: 10,
    marginTop: spacing.sm,
    width: 48
  },
  profileHeroSkeleton: {
    borderRadius: 0,
    height: 286,
    width: "100%"
  },
  profileBodySkeleton: {
    padding: spacing.xl
  },
  profileTitleSkeleton: {
    height: 24,
    width: "62%"
  },
  profileMetaSkeleton: {
    height: 12,
    marginTop: spacing.md,
    width: "48%"
  },
  profileActionSkeleton: {
    height: 52,
    marginVertical: spacing.xl,
    width: "100%"
  },
  orderSkeleton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    flexDirection: "row",
    marginBottom: spacing.md,
    padding: spacing.lg,
    ...shadows.soft
  },
  orderAvatarSkeleton: {
    borderRadius: radii.md,
    height: 52,
    width: 52
  },
  orderBodySkeleton: {
    flex: 1,
    marginLeft: spacing.md
  },
  orderLineWide: {
    height: 13,
    width: "70%"
  },
  orderLine: {
    height: 10,
    marginTop: spacing.md,
    width: "48%"
  },
  serviceSkeleton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    padding: spacing.lg,
    ...shadows.soft
  },
  serviceSkeletonBody: {
    flex: 1,
    paddingRight: spacing.lg
  },
  serviceLineWide: {
    height: 14,
    width: "72%"
  },
  serviceLine: {
    height: 12,
    marginTop: spacing.md,
    width: "92%"
  },
  serviceLineShort: {
    height: 12,
    marginTop: spacing.sm,
    width: "44%"
  },
  serviceButtonSkeleton: {
    height: 38,
    width: 76
  },
  reviewSkeleton: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    ...shadows.soft
  },
  reviewHeaderSkeleton: {
    alignItems: "center",
    flexDirection: "row"
  },
  reviewAvatarSkeleton: {
    borderRadius: radii.pill,
    height: 42,
    width: 42
  },
  reviewNameSkeleton: {
    flex: 1,
    marginLeft: spacing.md
  },
  reviewLineWide: {
    height: 13,
    width: "42%"
  },
  reviewLineShort: {
    height: 11,
    marginTop: spacing.sm,
    width: "28%"
  },
  reviewTextSkeleton: {
    height: 12,
    marginTop: spacing.lg,
    width: "94%"
  },
  reviewTextShortSkeleton: {
    height: 12,
    marginTop: spacing.sm,
    width: "58%"
  }
});
