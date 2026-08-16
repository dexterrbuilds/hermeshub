import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/auth/AuthContext";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { Input } from "@/components/Input";
import { Screen } from "@/components/Screen";
import { colors, fontWeights, radii, shadows, spacing, typography } from "@/constants/theme";
import { useResponsive } from "@/utils/responsive";

export default function SignupScreen() {
  const { isDesktop } = useResponsive();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
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
      const result = await signUp(fullName.trim(), email.trim(), password);
      if (result.needsEmailConfirmation) {
        setNotice("Account created. Please check your email to confirm before signing in.");
      } else {
        router.replace("/home");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account. Please try again.");
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
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Join Hermes Hub and discover trusted businesses around you.</Text>
          <Input icon="person-outline" label="Full name" placeholder="Your name" value={fullName} onChangeText={setFullName} />
          <Input icon="mail-outline" label="Email address" placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <Input icon="lock-closed-outline" label="Password" placeholder="Create a password" password value={password} onChangeText={setPassword} error={error || undefined} />
          {notice ? <Text style={styles.notice}>{notice}</Text> : null}
          <Text style={styles.requirement}>Use at least 8 characters with a number or symbol.</Text>
          <Button title="Create account" loading={loading} disabled={!fullName.trim() || !email.trim() || password.length < 8} onPress={submit} style={styles.cta} />
          <Text style={styles.terms}>By continuing, you agree to the Terms of Service and Privacy Policy.</Text>
          <Text style={styles.switchText}>
            Already have an account? <Text style={styles.switchLink} onPress={() => router.push("/login")}>Sign in</Text>
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
    maxWidth: 500,
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
    marginBottom: spacing.lg,
    marginTop: spacing.sm
  },
  requirement: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    lineHeight: 18,
    marginBottom: spacing.lg,
    marginTop: -spacing.sm
  },
  notice: {
    color: colors.success,
    fontSize: typography.small,
    lineHeight: 20,
    marginBottom: spacing.md,
    marginTop: -spacing.sm
  },
  cta: {
    marginTop: spacing.xs
  },
  terms: {
    color: colors.textSubtle,
    fontSize: typography.tiny,
    lineHeight: 18,
    marginTop: spacing.lg,
    textAlign: "center"
  },
  switchText: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: spacing.xl,
    textAlign: "center"
  },
  switchLink: {
    color: colors.primary,
    fontWeight: fontWeights.semibold
  }
});
