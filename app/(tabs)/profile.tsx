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
import { Screen } from "@/components/Screen";
import { colors, fontWeights, radii, shadows, spacing, typography } from "@/constants/theme";
import { useResponsive } from "@/utils/responsive";

const sections = [
  { title: "Saved addresses", icon: "location-outline" },
  { title: "Payment methods", icon: "card-outline" },
  { title: "Notifications", icon: "notifications-outline" },
  { title: "Help and support", icon: "help-circle-outline" },
  { title: "About Hermes Hub", icon: "information-circle-outline" },
  { title: "Terms and privacy", icon: "document-text-outline" }
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
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{fullName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.area}>{profile?.defaultArea ?? "Bodija"}, Ibadan</Text>
          <Badge label="Beta tester" tone="blue" />
        </View>
      </View>

      <Pressable style={styles.feedback} onPress={() => setFeedbackOpen(true)}>
        <View style={styles.feedbackIcon}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} />
        </View>
        <View style={styles.feedbackCopy}>
          <Text style={styles.feedbackTitle}>Send feedback</Text>
          <Text style={styles.feedbackText}>Tell us what felt confusing, slow, or missing during the Ibadan beta.</Text>
        </View>
      </Pressable>

      <View style={styles.list}>
        <Pressable style={styles.row} onPress={() => router.push("/wallet")}>
          <View style={styles.rowIcon}>
            <Ionicons name="wallet-outline" size={19} color={colors.primary} />
          </View>
          <Text style={styles.rowText}>Hermes balance</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
        </Pressable>
        {sections.map((item) => (
          <Pressable key={item.title} style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name={item.icon} size={19} color={colors.primary} />
            </View>
            <Text style={styles.rowText}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
          </Pressable>
        ))}
      </View>

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
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    flexDirection: "row",
    padding: spacing.xl,
    ...shadows.soft
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
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.xl,
    flexDirection: "row",
    marginVertical: spacing.xl,
    padding: spacing.lg,
    ...shadows.soft
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
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    marginBottom: spacing.xl,
    overflow: "hidden",
    ...shadows.soft
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
