import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BrandMark } from "@/components/BrandMark";
import { colors, fontWeights, radii, shadows, spacing, typography } from "@/constants/theme";
import { useResponsive } from "@/utils/responsive";

const navItems = [
  { label: "Home", path: "/home" },
  { label: "Explore", path: "/search" },
  { label: "Orders", path: "/orders" },
  { label: "Saved", path: "/saved" }
] as const;

export function DesktopHeader() {
  const { isDesktop, gutter, maxContentWidth } = useResponsive();
  const pathname = usePathname();

  if (!isDesktop) return null;

  return (
    <View style={styles.shell}>
      <View style={[styles.inner, { maxWidth: maxContentWidth, paddingHorizontal: gutter }]}>
        <Pressable onPress={() => router.push("/home")}>
          <BrandMark compact />
        </Pressable>
        <View style={styles.nav}>
          {navItems.map((item) => {
            const active = pathname === item.path || pathname.endsWith(item.path.replace("/", ""));
            return (
              <Pressable key={item.path} onPress={() => router.push(item.path)} style={[styles.navItem, active && styles.navItemActive]}>
                <Text style={[styles.navText, active && styles.navTextActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.right}>
          <View style={styles.location}>
            <Ionicons name="location" size={15} color={colors.primary} />
            <Text style={styles.locationText}>Bodija, Ibadan</Text>
          </View>
          <Pressable style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={18} color={colors.text} />
          </Pressable>
          <Pressable onPress={() => router.push("/profile")} style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    zIndex: 10
  },
  inner: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    height: 72,
    justifyContent: "space-between",
    width: "100%"
  },
  nav: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs
  },
  navItem: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  navItemActive: {
    backgroundColor: colors.surfaceBlue
  },
  navText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  navTextActive: {
    color: colors.primaryDark
  },
  right: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  location: {
    alignItems: "center",
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.pill,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  locationText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.medium
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    height: 38,
    justifyContent: "center",
    width: 38,
    ...shadows.soft
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.navy,
    borderRadius: radii.pill,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  avatarText: {
    color: colors.white,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  }
});
