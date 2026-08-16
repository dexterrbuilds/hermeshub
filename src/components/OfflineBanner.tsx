import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { colors, fontWeights, motion, spacing, typography } from "@/constants/theme";

type OfflineBannerProps = {
  visible?: boolean;
  restored?: boolean;
};

export function OfflineBanner({ visible = false, restored = false }: OfflineBannerProps) {
  const translateY = useRef(new Animated.Value(-48)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible || restored ? 0 : -48,
      duration: motion.normal,
      useNativeDriver: true
    }).start();
  }, [restored, translateY, visible]);

  if (!visible && !restored) return null;

  return (
    <Animated.View style={[styles.banner, restored && styles.restored, { transform: [{ translateY }] }]}>
      <Text style={styles.text}>{restored ? "Back online" : "You're offline"}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: "center",
    backgroundColor: colors.navy,
    left: 0,
    paddingVertical: spacing.sm,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 20
  },
  restored: {
    backgroundColor: colors.success
  },
  text: {
    color: colors.white,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  }
});
