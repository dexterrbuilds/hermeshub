import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { Button } from "@/components/Button";
import { FadeInView } from "@/components/FadeInView";
import { IconButton } from "@/components/IconButton";
import { Input } from "@/components/Input";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { colors, fontWeights, radii, shadows, spacing, typography } from "@/constants/theme";
import { marketplaceService } from "@/services/marketplaceService";
import { Service, Vendor } from "@/types/marketplace";
import { formatCurrency } from "@/utils/format";
import { useResponsive } from "@/utils/responsive";

const dates = ["Today", "Tomorrow", "Fri", "Sat"];
const times = ["10:00 AM", "1:30 PM", "4:00 PM", "6:30 PM"];
const steps = ["Service", "Date", "Time", "Details"];

export default function CartScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId?: string }>();
  const fallbackService = useMemo(() => marketplaceService.getDefaultService(), []);
  const [service, setService] = useState<Service>(fallbackService);
  const [vendor, setVendor] = useState<Vendor | undefined>();
  const [date, setDate] = useState("Tomorrow");
  const [time, setTime] = useState("1:30 PM");
  const [address, setAddress] = useState("Bodija, Ibadan");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState(0);
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
  const canContinue = address.trim().length > 3;
  const isFinalStep = step === steps.length - 1;

  const continueFlow = () => {
    if (!isFinalStep) {
      setStep((current) => Math.min(current + 1, steps.length - 1));
      return;
    }
    router.push({ pathname: "/checkout", params: { serviceId: service.id, date, time, address } });
  };

  return (
    <Screen keyboard>
      <View style={styles.topBar}>
        <IconButton icon="chevron-back" onPress={() => step > 1 ? setStep((current) => current - 1) : router.back()} />
        <Text style={styles.stepText}>Step {step + 1} of {steps.length}</Text>
      </View>
      <Text style={styles.title}>{service.type === "delivery" ? "Order details" : "Book service"}</Text>
      <Text style={styles.subtitle}>Pick a time and share the details the business needs.</Text>
      <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${((step + 1) / steps.length) * 100}%` }]} /></View>

      <View style={[isDesktop && styles.bookingLayout]}>
        <View style={[isDesktop && styles.bookingMain]}>
          <View style={styles.summaryCard}>
            <Text style={styles.vendor}>{vendor?.businessName}</Text>
            <Text style={styles.service}>{service.name}</Text>
            <Text style={styles.price}>From {formatCurrency(service.price)}</Text>
          </View>

      <FadeInView key={step} distance={12}>
        {step === 0 ? (
          <View style={styles.serviceStep}>
            <Text style={styles.serviceStepTitle}>{service.name}</Text>
            <Text style={styles.serviceStepText}>{service.description}</Text>
            <View style={styles.serviceStepMeta}>
              <Text style={styles.price}>From {formatCurrency(service.price)}</Text>
              <Text style={styles.price}>{service.duration}</Text>
            </View>
          </View>
        ) : null}

        {step === 1 ? (
          <>
            <SectionHeader title="Preferred date" />
            <View style={styles.optionRow}>
              {dates.map((item) => (
                <AnimatedPressable key={item} haptic="selection" onPress={() => setDate(item)} contentStyle={[styles.option, date === item && styles.optionSelected]}>
                  <Text style={[styles.optionText, date === item && styles.optionTextSelected]}>{item}</Text>
                </AnimatedPressable>
              ))}
            </View>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <SectionHeader title="Preferred time" />
            <View style={styles.optionRow}>
              {times.map((item, index) => {
                const disabled = index === 0 && date === "Today";
                return (
                  <AnimatedPressable key={item} disabled={disabled} haptic="selection" onPress={() => setTime(item)} contentStyle={[styles.option, time === item && styles.optionSelected, disabled && styles.optionDisabled]}>
                    <Text style={[styles.optionText, time === item && styles.optionTextSelected, disabled && styles.optionTextDisabled]}>{item}</Text>
                  </AnimatedPressable>
                );
              })}
            </View>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <SectionHeader title="Location and notes" />
            <Input icon="location-outline" label="Service address" value={address} onChangeText={setAddress} error={!canContinue ? "Enter a delivery or service area." : undefined} />
            <Input icon="create-outline" label="Details for the business" value={notes} onChangeText={setNotes} placeholder="Landmark, order details, service notes..." multiline />

            <View style={styles.totalCard}>
              <View style={styles.totalRow}><Text style={styles.totalLabel}>Service</Text><Text style={styles.totalValue}>{formatCurrency(service.price)}</Text></View>
              <View style={styles.totalRow}><Text style={styles.totalLabel}>Service fee</Text><Text style={styles.totalValue}>{formatCurrency(fee)}</Text></View>
              <View style={styles.totalRow}><Text style={styles.totalLabel}>Date/time</Text><Text style={styles.totalValue}>{date}, {time}</Text></View>
              <View style={styles.divider} />
              <View style={styles.totalRow}><Text style={styles.totalTitle}>Total</Text><Text style={styles.totalTitle}>{formatCurrency(total)}</Text></View>
            </View>
          </>
        ) : null}
      </FadeInView>

        </View>
        <View style={[isDesktop && styles.bookingSummaryAside]}>
          {isDesktop ? (
            <View style={styles.totalCard}>
              <Text style={styles.totalTitle}>Booking summary</Text>
              <View style={styles.totalRow}><Text style={styles.totalLabel}>Date</Text><Text style={styles.totalValue}>{date}</Text></View>
              <View style={styles.totalRow}><Text style={styles.totalLabel}>Time</Text><Text style={styles.totalValue}>{time}</Text></View>
              <View style={styles.totalRow}><Text style={styles.totalLabel}>Service</Text><Text style={styles.totalValue}>{formatCurrency(service.price)}</Text></View>
              <View style={styles.totalRow}><Text style={styles.totalLabel}>Fee</Text><Text style={styles.totalValue}>{formatCurrency(fee)}</Text></View>
              <View style={styles.divider} />
              <View style={styles.totalRow}><Text style={styles.totalTitle}>Total</Text><Text style={styles.totalTitle}>{formatCurrency(total)}</Text></View>
            </View>
          ) : null}
          <Button
            title={isFinalStep ? `Review checkout . ${formatCurrency(total)}` : "Continue"}
            icon="card-outline"
            disabled={isFinalStep && !canContinue}
            onPress={continueFlow}
          />
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
  progressTrack: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.pill,
    height: 6,
    marginTop: spacing.lg,
    overflow: "hidden"
  },
  progressFill: {
    backgroundColor: colors.primary,
    height: 6,
    width: "50%"
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.xs
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    marginTop: spacing.xl,
    padding: spacing.xl,
    ...shadows.soft
  },
  bookingLayout: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.xxxl
  },
  bookingMain: {
    flex: 1,
    maxWidth: 720
  },
  bookingSummaryAside: {
    gap: spacing.lg,
    paddingTop: spacing.xl,
    width: 360
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
  price: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: spacing.sm
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  serviceStep: {
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.xl,
    marginVertical: spacing.xl,
    padding: spacing.xl
  },
  serviceStepTitle: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold
  },
  serviceStepText: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
    marginTop: spacing.sm
  },
  serviceStepMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg
  },
  option: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  optionDisabled: {
    backgroundColor: colors.surfaceSoft,
    opacity: 0.58
  },
  optionText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  optionTextSelected: {
    color: colors.white
  },
  optionTextDisabled: {
    color: colors.textSubtle
  },
  totalCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    marginBottom: spacing.xl,
    marginTop: spacing.md,
    padding: spacing.xl,
    ...shadows.soft
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
  }
});
