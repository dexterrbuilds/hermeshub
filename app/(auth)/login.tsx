import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/auth/AuthContext";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { Input } from "@/components/Input";
import { Screen } from "@/components/Screen";
import { colors, fontWeights, radii, shadows, spacing, typography } from "@/constants/theme";
import { useResponsive } from "@/utils/responsive";

export default function LoginScreen() {
  const { isDesktop } = useResponsive();
  const { signIn, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const submit = async () => {
    setError("");
    setNotice("");
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setNotice("Password reset email sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen keyboard>
      <View style={[styles.container, isDesktop && styles.desktopContainer]}>
        <View style={styles.header}>
          <IconButton icon="chevron-back" onPress={() => router.back()} />
          <BrandMark compact />
        </View>
        <View style={[styles.card, isDesktop && styles.desktopCard]}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Find trusted local services around you.</Text>
          <Input icon="mail-outline" label="Email address" placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <Input icon="lock-closed-outline" label="Password" placeholder="Your password" password value={password} onChangeText={setPassword} error={error || undefined} />
          {notice ? <Text style={styles.notice}>{notice}</Text> : null}
          <Pressable style={styles.forgot} onPress={forgotPassword}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>
          <Button title="Sign in" loading={loading} disabled={!email.trim() || !password} onPress={submit} />
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>
          <Text style={styles.switchText}>
            Don't have an account? <Text style={styles.switchLink} onPress={() => router.push("/signup")}>Create account</Text>
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  desktopContainer: {
    alignSelf: "center",
    maxWidth: 480,
    width: "100%"
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    ...shadows.card
  },
  desktopCard: {
    padding: spacing.xxxl
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: fontWeights.semibold
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.xl,
    marginTop: spacing.sm
  },
  forgot: {
    alignSelf: "flex-end",
    marginBottom: spacing.lg,
    marginTop: -spacing.sm
  },
  forgotText: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  notice: {
    color: colors.success,
    fontSize: typography.small,
    marginBottom: spacing.md
  },
  dividerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    marginVertical: spacing.xl
  },
  divider: {
    backgroundColor: colors.border,
    flex: 1,
    height: 1
  },
  dividerText: {
    color: colors.textSubtle,
    fontSize: typography.tiny,
    fontWeight: fontWeights.semibold
  },
  switchText: {
    color: colors.textMuted,
    fontSize: typography.small,
    textAlign: "center"
  },
  switchLink: {
    color: colors.primary,
    fontWeight: fontWeights.semibold
  }
});
