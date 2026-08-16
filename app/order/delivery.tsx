import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { Screen } from "@/components/Screen";
import { colors, fontWeights, radii, shadows, spacing, typography } from "@/constants/theme";

export default function DeliveryStatusScreen() {
  return (
    <Screen>
      <View style={styles.topBar}>
        <IconButton icon="chevron-back" onPress={() => router.back()} />
      </View>
      <Text style={styles.title}>Delivery status</Text>
      <Text style={styles.subtitle}>Track the order using clear status updates from the business.</Text>

      <View style={styles.statusPanel}>
        <View style={styles.iconWrap}>
          <Ionicons name="bicycle-outline" size={32} color={colors.primary} />
        </View>
        <Text style={styles.statusTitle}>Preparing order</Text>
        <Text style={styles.statusText}>SweetCrumbs Akobo is preparing your order. Estimated arrival is today at 4:20 PM.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Route area</Text>
        <Text style={styles.cardText}>Akobo to Bodija, Ibadan</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What happens next?</Text>
        <Text style={styles.cardText}>You will see an update when the order is out for delivery. Confirm completion when it arrives.</Text>
      </View>

      <Button title="Confirm completion" icon="checkmark-done-outline" onPress={() => router.push("/order/reviews")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: fontWeights.semibold
  },
  topBar: {
    alignItems: "flex-start",
    marginBottom: spacing.xl
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.xs
  },
  statusPanel: {
    alignItems: "center",
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.xl,
    marginVertical: spacing.xl,
    padding: spacing.xxxl,
    ...shadows.soft
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    height: 72,
    justifyContent: "center",
    width: 72
  },
  statusTitle: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold,
    marginTop: spacing.lg
  },
  statusText: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
    textAlign: "center"
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    ...shadows.soft
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.semibold
  },
  cardText: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 20,
    marginTop: spacing.xs
  }
});
