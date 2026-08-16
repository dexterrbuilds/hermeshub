import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { Screen } from "@/components/Screen";
import { SuccessState } from "@/components/StateViews";
import { colors, fontWeights, radii, shadows, spacing, typography } from "@/constants/theme";
import { marketplaceService } from "@/services/marketplaceService";
import { Service, Vendor } from "@/types/marketplace";
import { formatCurrency } from "@/utils/format";
import { successFeedback } from "@/utils/feedback";
import { useResponsive } from "@/utils/responsive";

export default function CheckoutScreen() {
  const { serviceId, date, time, address } = useLocalSearchParams<{
    serviceId?: string;
    date?: string;
    time?: string;
    address?: string;
  }>();
  const fallbackService = useMemo(() => marketplaceService.getDefaultService(), []);
  const [service, setService] = useState<Service>(fallbackService);
  const [vendor, setVendor] = useState<Vendor | undefined>();
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { isDesktop } = useResponsive();

  useEffect(() => {
    const load = async () => {
      const item = serviceId ? await marketplaceService.getServiceById(serviceId) : fallbackService;
      const selected = item ?? fallbackService;
      setService(selected);
      marketplaceService.getVendorById(selected.vendorId).then(setVendor);
    };
    load();
  }, [fallbackService, serviceId]);

  const fee = service.fee ?? 500;
  const total = service.price + fee;

  const confirmBooking = () => {
    if (confirming) return;
    setConfirming(true);
    const requestedDate = date === "Today"
      ? new Date()
      : new Date(Date.now() + 24 * 60 * 60 * 1000);
    marketplaceService.confirmBooking({
      businessId: service.vendorId,
      serviceId: service.id,
      requestedDate: requestedDate.toISOString().slice(0, 10),
      requestedTime: time ?? "13:30",
      notes: address ? `Location: ${address}` : undefined
    }).then(() => {
      setConfirming(false);
      setConfirmed(true);
      void successFeedback();
    });
  };

  if (confirmed) {
    return (
      <Screen scroll={false}>
        <SuccessState
          title="Booking confirmed"
          message={`Your request with ${vendor?.businessName ?? "the business"} has been sent. You can track what happens next.`}
          actionLabel="View booking"
          onAction={() => router.replace("/order/tracking")}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.topBar}>
        <IconButton icon="chevron-back" onPress={() => router.back()} />
        <Text style={styles.stepText}>Final step</Text>
      </View>
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.subtitle}>Confirm the details before sending your request.</Text>

      <View style={[isDesktop && styles.checkoutLayout]}>
        <View style={[isDesktop && styles.checkoutMain]}>
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.vendor}>{vendor?.businessName}</Text>
                <Text style={styles.service}>{service.name}</Text>
              </View>
              <Badge label={service.type === "delivery" ? "Delivery" : "Service"} tone="blue" />
            </View>
            <View style={styles.detailRow}><Text style={styles.label}>Date</Text><Text style={styles.value}>{date ?? "Tomorrow"}</Text></View>
            <View style={styles.detailRow}><Text style={styles.label}>Time</Text><Text style={styles.value}>{time ?? "1:30 PM"}</Text></View>
            <View style={styles.detailRow}><Text style={styles.label}>Location</Text><Text style={styles.value}>{address ?? "Bodija, Ibadan"}</Text></View>
          </View>

          <View style={styles.payment}>
            <View style={styles.paymentIcon}>
              <Ionicons name="wallet-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.paymentBody}>
              <Text style={styles.paymentTitle}>Hermes balance</Text>
              <Text style={styles.paymentMeta}>Available: {formatCurrency(73500)}</Text>
            </View>
            <Ionicons name="checkmark-circle" size={22} color={colors.success} />
          </View>
        </View>

        <View style={[styles.totalCard, isDesktop && styles.desktopSummary]}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <View style={styles.totalRow}><Text style={styles.totalLabel}>Service</Text><Text style={styles.totalValue}>{formatCurrency(service.price)}</Text></View>
          <View style={styles.totalRow}><Text style={styles.totalLabel}>Service fee</Text><Text style={styles.totalValue}>{formatCurrency(fee)}</Text></View>
          <View style={styles.divider} />
          <View style={styles.totalRow}><Text style={styles.totalTitle}>Total</Text><Text style={styles.totalTitle}>{formatCurrency(total)}</Text></View>
          <Button title={confirming ? "Confirming..." : `Confirm booking . ${formatCurrency(total)}`} loading={confirming} icon="checkmark-outline" onPress={confirmBooking} />
          <Text style={styles.helper}>Your payment method will be charged only after you confirm.</Text>
        </View>
      </View>
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
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl
  },
  stepText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.xs
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    marginTop: spacing.xl,
    padding: spacing.xl,
    ...shadows.soft
  },
  checkoutLayout: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.xxxl
  },
  checkoutMain: {
    flex: 1
  },
  desktopSummary: {
    marginTop: spacing.xl,
    width: 360
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.lg
  },
  vendor: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  service: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold,
    marginTop: spacing.xs
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.small
  },
  value: {
    color: colors.text,
    flex: 1,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold,
    paddingLeft: spacing.md,
    textAlign: "right"
  },
  payment: {
    alignItems: "center",
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.xl,
    flexDirection: "row",
    marginVertical: spacing.xl,
    padding: spacing.lg
  },
  paymentIcon: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  paymentBody: {
    flex: 1,
    marginLeft: spacing.md
  },
  paymentTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.semibold
  },
  paymentMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: spacing.xs
  },
  totalCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    marginBottom: spacing.xl,
    padding: spacing.xl,
    ...shadows.soft
  },
  summaryTitle: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.lg
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md
  },
  totalLabel: {
    color: colors.textMuted,
    fontSize: typography.small
  },
  totalValue: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginBottom: spacing.md
  },
  totalTitle: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold
  },
  helper: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    lineHeight: 18,
    marginTop: spacing.md,
    textAlign: "center"
  }
});
