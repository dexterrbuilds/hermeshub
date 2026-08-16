import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/auth/AuthContext";
import { AppHeader } from "@/components/AppHeader";
import { Badge } from "@/components/Badge";
import { BottomSheet } from "@/components/BottomSheet";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { MaterialSurface } from "@/components/MaterialSurface";
import { Screen } from "@/components/Screen";
import { colors, fontWeights, radii, shadows, spacing, typography } from "@/constants/theme";
import { useResponsive } from "@/utils/responsive";

const groups = [
  {
    title: "Account",
    items: [
      { title: "Personal information", icon: "person-outline", route: undefined },
      { title: "Addresses", icon: "location-outline", route: undefined },
      { title: "Payments", icon: "card-outline", route: "/wallet" }
    ]
  },
  {
    title: "Activity",
    items: [
      { title: "Orders", icon: "receipt-outline", route: "/orders" },
      { title: "Saved businesses", icon: "heart-outline", route: "/saved" },
      { title: "Reviews", icon: "star-outline", route: undefined }
    ]
  },
  {
    title: "Support",
    items: [
      { title: "Help and support", icon: "help-circle-outline", route: undefined },
      { title: "About Hermes Hub", icon: "information-circle-outline", route: undefined },
      { title: "Terms and privacy", icon: "document-text-outline", route: undefined }
    ]
  }
] as const;

export default function ProfileScreen() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const { isDesktop } = useResponsive();
  const { profile, signOut } = useAuth();
  const fullName = profile?.fullName ?? "Hermes User";

  return (
    <Screen>
      <AppHeader title="Profile" subtitle="Manage your account, payments, and beta feedback." />
      <View style={[isDesktop && styles.desktopProfileLayout]}>
      <View style={[isDesktop && styles.desktopSidebar]}>
        <Text style={styles.sidebarTitle}>Settings</Text>
        {["Account", "Addresses", "Payments", "Notifications", "Help", "About"].map((item) => (
          <View key={item} style={[styles.sidebarItem, item === "Account" && styles.sidebarItemActive]}>
            <Text style={[styles.sidebarItemText, item === "Account" && styles.sidebarItemTextActive]}>{item}</Text>
          </View>
        ))}
      </View>
      <View style={[isDesktop && styles.desktopProfileMain]}>
      <MaterialSurface variant="elevated" radius="xl" style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{fullName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.area}>{profile?.defaultArea ?? "Bodija"}, Ibadan</Text>
          <Badge label="Beta tester" tone="blue" />
        </View>
      </MaterialSurface>

      <View style={styles.quickActions}>
        {[
          { title: "Bookings", icon: "receipt-outline", route: "/orders" },
          { title: "Saved", icon: "heart-outline", route: "/saved" },
          { title: "Payments", icon: "wallet-outline", route: "/wallet" },
          { title: "Addresses", icon: "location-outline", route: undefined }
        ].map((item) => (
          <Pressable key={item.title} style={styles.quickAction} onPress={() => item.route ? router.push(item.route as never) : undefined}>
            <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={19} color={colors.primaryDark} />
            <Text style={styles.quickActionText}>{item.title}</Text>
          </Pressable>
        ))}
      </View>

      <MaterialSurface variant="elevated" radius="xl" style={styles.businessPanel}>
        <View style={styles.businessIcon}>
          <Ionicons name="storefront-outline" size={21} color={colors.primary} />
        </View>
        <View style={styles.businessCopy}>
          <Text style={styles.businessTitle}>Have a business?</Text>
          <Text style={styles.businessText}>Reach customers nearby and manage bookings with Hermes.</Text>
        </View>
        <View style={styles.businessActions}>
          <Button title="List your business" icon="arrow-forward-outline" onPress={() => router.push("/business/onboarding")} style={styles.businessPrimary} />
          <Button title="Status" variant="secondary" onPress={() => router.push("/business/verification")} style={styles.businessStatus} />
        </View>
      </MaterialSurface>

      <Pressable style={styles.feedback} onPress={() => setFeedbackOpen(true)}>
        <View style={styles.feedbackIcon}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} />
        </View>
        <View style={styles.feedbackCopy}>
          <Text style={styles.feedbackTitle}>Send feedback</Text>
          <Text style={styles.feedbackText}>Tell us what felt confusing, slow, or missing during the Ibadan beta.</Text>
        </View>
      </Pressable>

      {groups.map((group) => (
        <View key={group.title} style={styles.group}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          <View style={styles.list}>
            {group.items.map((item) => (
              <Pressable key={item.title} style={styles.row} onPress={() => item.route ? router.push(item.route as never) : undefined}>
                <View style={styles.rowIcon}>
                  <Ionicons name={item.icon} size={19} color={colors.primary} />
                </View>
                <Text style={styles.rowText}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      <Button title="Track active order" icon="navigate-outline" onPress={() => router.push("/order/tracking")} />
      <Button title="Log out" variant="ghost" onPress={signOut} style={styles.logout} />
      </View>
      </View>

      <BottomSheet visible={feedbackOpen} title="Send feedback" onClose={() => setFeedbackOpen(false)}>
        {feedbackSent ? (
          <View style={styles.feedbackSuccess}>
            <Ionicons name="checkmark-circle" size={34} color={colors.success} />
            <Text style={styles.feedbackSuccessTitle}>Feedback sent</Text>
            <Text style={styles.feedbackSuccessText}>Thanks. This helps shape the Ibadan beta.</Text>
            <Button title="Done" onPress={() => {
              setFeedbackOpen(false);
              setFeedbackSent(false);
            }} />
          </View>
        ) : (
          <>
            <Input icon="chatbubble-ellipses-outline" label="What should we improve?" placeholder="Tell us what felt confusing, slow, or missing..." multiline />
            <Button title="Send feedback" icon="send-outline" onPress={() => setFeedbackSent(true)} />
          </>
        )}
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: "center",
    flexDirection: "row",
    padding: spacing.xl
  },
  desktopProfileLayout: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.xxxl
  },
  desktopSidebar: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    width: 260,
    ...shadows.soft
  },
  desktopProfileMain: {
    flex: 1,
    maxWidth: 720
  },
  sidebarTitle: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.lg
  },
  sidebarItem: {
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md
  },
  sidebarItemActive: {
    backgroundColor: colors.surfaceBlue
  },
  sidebarItemText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  sidebarItemTextActive: {
    color: colors.primaryDark
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.pill,
    height: 64,
    justifyContent: "center",
    marginRight: spacing.md,
    width: 64
  },
  initials: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: fontWeights.semibold
  },
  profileCopy: {
    flex: 1,
    gap: spacing.xs
  },
  name: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold
  },
  area: {
    color: colors.textMuted,
    fontSize: typography.small
  },
  feedback: {
    alignItems: "center",
    backgroundColor: colors.glassStrong,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: 1,
    flexDirection: "row",
    marginVertical: spacing.xl,
    padding: spacing.lg
  },
  feedbackIcon: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    height: 44,
    justifyContent: "center",
    marginRight: spacing.md,
    width: 44
  },
  feedbackCopy: {
    flex: 1
  },
  feedbackTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.semibold
  },
  feedbackText: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 19,
    marginTop: spacing.xs
  },
  list: {
    backgroundColor: "transparent",
    marginBottom: spacing.xl,
    overflow: "hidden"
  },
  row: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    minHeight: 58,
    paddingHorizontal: spacing.lg
  },
  rowIcon: {
    alignItems: "center",
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.pill,
    height: 36,
    justifyContent: "center",
    marginRight: spacing.md,
    width: 36
  },
  rowText: {
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
    fontWeight: fontWeights.medium
  },
  logout: {
    marginTop: spacing.sm
  },
  quickActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  quickAction: {
    alignItems: "center",
    backgroundColor: colors.glassStrong,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    minHeight: 74,
    justifyContent: "center",
    paddingHorizontal: spacing.xs
  },
  quickActionText: {
    color: colors.text,
    fontSize: typography.tiny,
    fontWeight: fontWeights.semibold
  },
  businessPanel: {
    marginTop: spacing.xl,
    padding: spacing.lg
  },
  businessIcon: {
    alignItems: "center",
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.lg,
    height: 44,
    justifyContent: "center",
    marginBottom: spacing.md,
    width: 44
  },
  businessCopy: {
    marginBottom: spacing.md
  },
  businessTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.semibold,
    lineHeight: 22
  },
  businessText: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 20,
    marginTop: spacing.xs
  },
  businessActions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  businessPrimary: {
    flex: 1
  },
  businessStatus: {
    minWidth: 92,
    paddingHorizontal: spacing.md
  },
  group: {
    marginTop: spacing.xl
  },
  groupTitle: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.sm
  },
  feedbackSuccess: {
    alignItems: "center",
    paddingVertical: spacing.xl
  },
  feedbackSuccessTitle: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold,
    marginTop: spacing.md
  },
  feedbackSuccessText: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 20,
    marginBottom: spacing.xl,
    marginTop: spacing.xs,
    textAlign: "center"
  }
});
