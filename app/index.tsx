import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/Button";
import { FadeInView } from "@/components/FadeInView";
import { MarketplaceDemo } from "@/components/MarketplaceDemo";
import { Screen } from "@/components/Screen";
import { colors, fontWeights, motion, radii, spacing, typography } from "@/constants/theme";
import { useResponsive } from "@/utils/responsive";

export default function OnboardingScreen() {
  const { isDesktop, isLargeDesktop } = useResponsive();

  return (
    <Screen scroll={!isDesktop}>
      <View style={[styles.container, isDesktop && styles.desktopContainer]}>
        <FadeInView delay={0} style={[styles.top, isDesktop && styles.desktopTop]}>
          <BrandMark />
          <Text style={styles.beta}>Ibadan beta</Text>
        </FadeInView>

        <View style={[styles.heroLayout, isDesktop && styles.desktopHeroLayout]}>
          <View style={[styles.copyColumn, !isDesktop && styles.mobileCopyColumn, isDesktop && styles.desktopCopyColumn]}>
            <FadeInView delay={motion.stagger * 5}>
              <Text style={[styles.headline, isDesktop && styles.desktopHeadline, isLargeDesktop && styles.largeHeadline]}>Whatever you need, find it nearby.</Text>
            </FadeInView>
            <FadeInView delay={motion.stagger * 6}>
              <Text style={[styles.tagline, isDesktop && styles.desktopTagline]}>Discover trusted businesses, skilled professionals, services and local makers around you.</Text>
            </FadeInView>
            <FadeInView delay={motion.stagger * 7} style={[styles.proofRow, !isDesktop && styles.mobileHidden]}>
              {["Verified local businesses", "Real customer reviews", "Beauty, food, events, home and more"].map((item) => (
                <View key={item} style={styles.proofItem}>
                  <Ionicons name="checkmark-circle" size={17} color={colors.success} />
                  <Text style={styles.proofText}>{item}</Text>
                </View>
              ))}
            </FadeInView>
            <FadeInView delay={motion.stagger * 8} style={[styles.actions, isDesktop && styles.desktopActions]}>
              <Button title="Get started" icon="arrow-forward-outline" onPress={() => router.push("/signup")} style={isDesktop ? styles.fitButton : undefined} />
              <AnimatedPressable onPress={() => router.push("/login")} contentStyle={styles.loginLink} haptic="selection">
                <Text style={styles.loginText}>{isDesktop ? "Sign in" : "I already have an account"}</Text>
              </AnimatedPressable>
            </FadeInView>
          </View>

          <View style={[styles.previewStage, isDesktop && styles.desktopPreviewStage]}>
            <MarketplaceDemo />
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: spacing.md
  },
  desktopContainer: {
    justifyContent: "flex-start",
    minHeight: 680,
    paddingVertical: spacing.xxxl
  },
  top: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  beta: {
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.pill,
    color: colors.primaryDark,
    fontSize: typography.tiny,
    fontWeight: fontWeights.semibold,
    overflow: "hidden",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  desktopTop: {
    marginBottom: spacing.huge
  },
  heroLayout: {
    flex: 1
  },
  desktopHeroLayout: {
    alignItems: "center",
    flexDirection: "row",
    gap: 72,
    justifyContent: "space-between"
  },
  copyColumn: {},
  mobileCopyColumn: {
    marginTop: spacing.xxxl
  },
  desktopCopyColumn: {
    flex: 1,
    maxWidth: 600
  },
  previewStage: {
    minHeight: 380,
    justifyContent: "center",
    marginTop: spacing.xl
  },
  desktopPreviewStage: {
    flex: 1,
    minHeight: 520,
    marginTop: 0,
    maxWidth: 560
  },
  headline: {
    color: colors.text,
    fontSize: typography.hero,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0,
    lineHeight: 44
  },
  desktopHeadline: {
    fontSize: 58,
    lineHeight: 64,
    maxWidth: 620
  },
  largeHeadline: {
    fontSize: 64,
    lineHeight: 70
  },
  tagline: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
    marginTop: spacing.md
  },
  desktopTagline: {
    fontSize: 18,
    lineHeight: 29,
    maxWidth: 560
  },
  proofRow: {
    gap: spacing.md,
    marginTop: spacing.xxl
  },
  proofItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  proofText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.medium
  },
  mobileHidden: {
    display: "none"
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xxl
  },
  desktopActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.lg
  },
  fitButton: {
    alignSelf: "flex-start"
  },
  loginLink: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48
  },
  loginText: {
    color: colors.primary,
    fontSize: typography.button,
    fontWeight: fontWeights.semibold
  }
});
