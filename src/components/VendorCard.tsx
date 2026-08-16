import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, GestureResponderEvent, StyleSheet, Text, View, ViewStyle } from "react-native";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { FadeImage } from "@/components/FadeImage";
import { Rating } from "@/components/Rating";
import { colors, fontWeights, layout, motion, radii, shadows, spacing, typography } from "@/constants/theme";
import { Vendor } from "@/types/marketplace";
import { getBusinessCardCopy } from "@/utils/businessCopy";
import { selectionFeedback } from "@/utils/feedback";

type VendorCardProps = {
  vendor: Vendor;
  onPress: () => void;
  onSavePress?: () => void;
  onTrustPress?: () => void;
  saved?: boolean;
  compact?: boolean;
  style?: ViewStyle;
};

export function VendorCard({ vendor, onPress, onSavePress, onTrustPress, saved = false, compact = false, style }: VendorCardProps) {
  const heartScale = useRef(new Animated.Value(1)).current;
  const copy = getBusinessCardCopy(vendor);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.24, duration: motion.fast, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, ...motion.spring })
    ]).start();
  }, [heartScale, saved]);

  const handleSave = (event: GestureResponderEvent) => {
    event.stopPropagation?.();
    void selectionFeedback();
    onSavePress?.();
  };

  const handleTrust = (event: GestureResponderEvent) => {
    event.stopPropagation?.();
    onTrustPress?.();
  };

  return (
    <AnimatedPressable onPress={onPress} haptic="selection" contentStyle={[styles.card, compact && styles.compact, style]}>
      <View style={styles.imageWrap}>
        <FadeImage uri={vendor.image} style={[styles.image, compact && styles.compactImage]} fallbackIcon="briefcase-outline" />
        <View style={styles.imageOverlay} />
        <AnimatedPressable onPress={handleSave} contentStyle={styles.save} haptic="selection">
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Ionicons name={saved ? "heart" : "heart-outline"} size={19} color={saved ? colors.danger : colors.text} />
          </Animated.View>
        </AnimatedPressable>
      </View>
      <View style={styles.body}>
        <View style={styles.top}>
          <View style={styles.nameWrap}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>{vendor.businessName}</Text>
              {vendor.verified ? <Ionicons name="checkmark-circle" size={16} color={colors.success} /> : null}
            </View>
          </View>
          <Text style={styles.distance}>{vendor.distanceKm.toFixed(1)} km</Text>
        </View>

        <Text style={styles.meta} numberOfLines={1}>{vendor.category} · {vendor.area}</Text>
        <Text style={styles.price} numberOfLines={1}>{copy.priceLine}</Text>

        <View style={styles.footer}>
          <Rating rating={vendor.rating} reviewCount={vendor.reviewCount} compact />
          <AnimatedPressable onPress={handleTrust} contentStyle={styles.trustInline} haptic="selection">
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.success} />
            <Text style={styles.trust}>Verified</Text>
          </AnimatedPressable>
        </View>
        <Text style={styles.availability} numberOfLines={1}>{copy.availabilityLine}</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadows.card
  },
  compact: {
    marginRight: spacing.md,
    width: 292
  },
  imageWrap: {
    position: "relative"
  },
  image: {
    backgroundColor: colors.surfaceBlue,
    height: layout.vendorImage + 12,
    width: "100%"
  },
  compactImage: {
    height: 154,
    width: "100%"
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.08)"
  },
  body: {
    padding: spacing.lg
  },
  top: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  nameWrap: {
    flex: 1,
    paddingRight: spacing.sm
  },
  nameRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs
  },
  name: {
    color: colors.text,
    flexShrink: 1,
    fontSize: typography.cardTitle,
    fontWeight: fontWeights.semibold
  },
  price: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold,
    marginTop: spacing.md
  },
  meta: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: spacing.xs
  },
  save: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    height: 30,
    justifyContent: "center",
    position: "absolute",
    right: spacing.md,
    top: spacing.md,
    width: 30
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    gap: spacing.sm
  },
  distance: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    fontWeight: fontWeights.semibold,
    marginTop: 2
  },
  trustInline: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs
  },
  trust: {
    color: colors.success,
    fontSize: typography.tiny,
    fontWeight: fontWeights.medium
  },
  availability: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    fontWeight: fontWeights.medium,
    marginTop: spacing.sm
  }
});
