import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { Input } from "@/components/Input";
import { MaterialSurface } from "@/components/MaterialSurface";
import { Screen } from "@/components/Screen";
import { SuccessState } from "@/components/StateViews";
import { colors, fontWeights, radii, spacing, typography } from "@/constants/theme";
import { businessApplicationService, BusinessClassification } from "@/services/businessApplicationService";
import { businessDocumentService } from "@/services/businessDocumentService";
import { formatCurrency } from "@/utils/format";

const businessTypes = [
  "Service professional",
  "Shop / small business",
  "Food business",
  "Beauty professional",
  "Creative professional",
  "Home service",
  "Repair / technical service",
  "Made-to-order products",
  "Other"
];

const categories = {
  Beauty: ["Barber", "Hairdresser", "Makeup artist", "Nail technician", "Braider"],
  Food: ["Baker", "Caterer", "Chef", "Food vendor"],
  Repairs: ["Phone repair", "Laptop repair", "Electronics repair", "Mechanic"],
  Events: ["Photographer", "Videographer", "Event decor", "Catering"],
  Learning: ["Tutor", "Trainer", "Coach"]
};

const steps = ["Type", "Info", "Category", "Offerings", "Location", "Verification", "Review"];

export default function BusinessOnboardingScreen() {
  const [step, setStep] = useState(0);
  const [businessType, setBusinessType] = useState("Beauty professional");
  const [classification, setClassification] = useState<BusinessClassification>("individual");
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("Bodija");
  const [serviceRadius, setServiceRadius] = useState("8");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Makeup artist"]);
  const [offeringName, setOfferingName] = useState("Event makeup booking");
  const [price, setPrice] = useState("20000");
  const [docs, setDocs] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const requiredDocuments = useMemo(() => {
    if (classification === "individual") {
      return ["Government-issued ID", "Phone verification", "Professional evidence"];
    }
    if (classification === "registered_business") {
      return ["CAC registration document", "Registration number", "Representative ID"];
    }
    return ["CAC registration document", "TIN / tax document", "Representative ID", "Proof of business address"];
  }, [classification]);

  const toggleCategory = (value: string) => {
    setSelectedCategories((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const uploadDocument = async (type: string) => {
    await businessDocumentService.uploadDocument(type);
    setDocs((current) => ({ ...current, [type]: true }));
  };

  const next = async () => {
    if (step < steps.length - 1) {
      setStep((current) => current + 1);
      return;
    }
    setSubmitting(true);
    await businessApplicationService.saveDraft({
      businessType,
      classification,
      businessName: businessName || "My Hermes business",
      description,
      area,
      serviceRadiusKm: Number(serviceRadius) || 8,
      categories: selectedCategories,
      offerings: [{
        name: offeringName,
        priceType: "starting_from",
        price: Number(price) || 0,
        leadTime: "By appointment"
      }],
      documents: requiredDocuments.map((type) => ({ type, required: true, uploaded: Boolean(docs[type]) }))
    });
    await businessApplicationService.submitApplication();
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Screen scroll={false}>
        <SuccessState
          title="Business submitted"
          message="Your business application has been received. You can track verification from your profile."
          actionLabel="View status"
          onAction={() => router.replace("/business/verification")}
        />
      </Screen>
    );
  }

  return (
    <Screen keyboard>
      <View style={styles.topBar}>
        <IconButton icon="chevron-back" onPress={() => step ? setStep(step - 1) : router.back()} />
        <Text style={styles.progressLabel}>{step + 1} of {steps.length}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${((step + 1) / steps.length) * 100}%` }]} />
      </View>

      <Text style={styles.title}>{stepTitle(step)}</Text>
      <Text style={styles.subtitle}>{stepSubtitle(step)}</Text>

      <View style={styles.stepBody}>
        {step === 0 ? (
          <>
            <Text style={styles.fieldLabel}>What do you do?</Text>
            <View style={styles.optionGrid}>
              {businessTypes.map((type) => (
                <Choice key={type} label={type} selected={businessType === type} onPress={() => setBusinessType(type)} />
              ))}
            </View>
            <Text style={styles.fieldLabel}>How should Hermes verify you?</Text>
            <View style={styles.optionGrid}>
              <Choice label="Individual professional" selected={classification === "individual"} onPress={() => setClassification("individual")} />
              <Choice label="Registered business" selected={classification === "registered_business"} onPress={() => setClassification("registered_business")} />
              <Choice label="Company" selected={classification === "company"} onPress={() => setClassification("company")} />
            </View>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <Input label="Business or trading name" icon="storefront-outline" value={businessName} onChangeText={setBusinessName} placeholder="e.g. Ada Beauty Studio" />
            <Input label="Short description" icon="sparkles-outline" value={description} onChangeText={setDescription} placeholder="What should customers know?" multiline />
            <Input label="Phone" icon="call-outline" value={phone} onChangeText={setPhone} placeholder="+234..." keyboardType="phone-pad" />
          </>
        ) : null}

        {step === 2 ? (
          <>
            {Object.entries(categories).map(([group, items]) => (
              <View key={group} style={styles.categoryGroup}>
                <Text style={styles.groupTitle}>{group}</Text>
                <View style={styles.optionGrid}>
                  {items.map((item) => (
                    <Choice key={item} label={item} selected={selectedCategories.includes(item)} onPress={() => toggleCategory(item)} />
                  ))}
                </View>
              </View>
            ))}
          </>
        ) : null}

        {step === 3 ? (
          <>
            <Input label="Offering name" icon="pricetag-outline" value={offeringName} onChangeText={setOfferingName} placeholder="e.g. Birthday cake order" />
            <Input label="Starting price" icon="cash-outline" value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="20000" />
            <MaterialSurface variant="elevated" radius="xl" style={styles.preview}>
              <Text style={styles.previewTitle}>{offeringName || "Your offering"}</Text>
              <Text style={styles.previewMeta}>Starting from {formatCurrency(Number(price) || 0)} · Quote details can be added later</Text>
            </MaterialSurface>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <Input label="Primary area" icon="location-outline" value={area} onChangeText={setArea} placeholder="Bodija" />
            <Input label="Service radius in km" icon="navigate-outline" value={serviceRadius} onChangeText={setServiceRadius} keyboardType="numeric" placeholder="8" />
            <View style={styles.optionGrid}>
              {["Customers visit me", "I travel to customers", "I deliver", "I operate online"].map((item) => (
                <Choice key={item} label={item} selected={item !== "I operate online"} onPress={() => undefined} />
              ))}
            </View>
          </>
        ) : null}

        {step === 5 ? (
          <>
            <MaterialSurface variant="elevated" radius="xl" style={styles.verifyNote}>
              <Ionicons name="shield-checkmark-outline" size={22} color={colors.primaryDark} />
              <Text style={styles.verifyText}>Hermes reviews business information before showing Verified on Hermes. Requirements adapt to how you operate.</Text>
            </MaterialSurface>
            {requiredDocuments.map((doc) => (
              <DocumentRow key={doc} title={doc} uploaded={Boolean(docs[doc])} onPress={() => uploadDocument(doc)} />
            ))}
          </>
        ) : null}

        {step === 6 ? (
          <MaterialSurface variant="elevated" radius="xl" style={styles.reviewCard}>
            <Text style={styles.reviewTitle}>{businessName || "My Hermes business"}</Text>
            <Text style={styles.reviewLine}>{businessType} · {classification.replace(/_/g, " ")}</Text>
            <Text style={styles.reviewLine}>{selectedCategories.join(", ") || "No categories selected"}</Text>
            <Text style={styles.reviewLine}>{area}, Ibadan · {serviceRadius || 8} km radius</Text>
            <Text style={styles.reviewLine}>{offeringName} · from {formatCurrency(Number(price) || 0)}</Text>
          </MaterialSurface>
        ) : null}
      </View>

      <MaterialSurface variant="glass" radius="xl" style={styles.stickyAction}>
        <Button title={step === steps.length - 1 ? "Submit for review" : "Continue"} loading={submitting} onPress={next} />
      </MaterialSurface>
    </Screen>
  );
}

function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <AnimatedPressable onPress={onPress} haptic="selection" contentStyle={[styles.choice, selected && styles.choiceSelected]}>
      <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{label}</Text>
    </AnimatedPressable>
  );
}

function DocumentRow({ title, uploaded, onPress }: { title: string; uploaded: boolean; onPress: () => void }) {
  return (
    <AnimatedPressable onPress={onPress} haptic="selection" contentStyle={styles.documentRow}>
      <View style={[styles.documentIcon, uploaded && styles.documentIconDone]}>
        <Ionicons name={uploaded ? "checkmark" : "document-attach-outline"} size={18} color={uploaded ? colors.white : colors.primaryDark} />
      </View>
      <View style={styles.documentCopy}>
        <Text style={styles.documentTitle}>{title}</Text>
        <Text style={styles.documentMeta}>{uploaded ? "Uploaded · tap to replace" : "Image or PDF · private to Hermes review"}</Text>
      </View>
      <Ionicons name="cloud-upload-outline" size={18} color={colors.textSubtle} />
    </AnimatedPressable>
  );
}

function stepTitle(step: number) {
  return ["What do you do?", "Tell customers about it", "Choose categories", "Add an offering", "Where do you operate?", "Verification", "Review and submit"][step];
}

function stepSubtitle(step: number) {
  return [
    "Every Hermes account starts as a customer account. You can add a business to the same profile.",
    "Use the name and description customers will recognize.",
    "Pick the categories that best describe what people can book or order from you.",
    "Start with one service or product. You can add more after approval.",
    "Help customers understand whether they visit you, you travel, or you deliver.",
    "Verification helps customers compare businesses with more confidence.",
    "Check the basics before sending your business for review."
  ][step];
}

const styles = StyleSheet.create({
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg
  },
  progressLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  progressTrack: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.pill,
    height: 7,
    marginBottom: spacing.xl,
    overflow: "hidden"
  },
  progressFill: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    height: "100%"
  },
  title: {
    color: colors.text,
    fontSize: 31,
    fontWeight: fontWeights.semibold,
    lineHeight: 37
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
    marginTop: spacing.sm
  },
  stepBody: {
    gap: spacing.lg,
    marginTop: spacing.xl
  },
  fieldLabel: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  choice: {
    backgroundColor: colors.glassStrong,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  choiceSelected: {
    backgroundColor: colors.navy,
    borderColor: colors.navy
  },
  choiceText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  choiceTextSelected: {
    color: colors.white
  },
  categoryGroup: {
    gap: spacing.sm
  },
  groupTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.semibold
  },
  preview: {
    padding: spacing.lg
  },
  previewTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.semibold
  },
  previewMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 20,
    marginTop: spacing.xs
  },
  verifyNote: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg
  },
  verifyText: {
    color: colors.textMuted,
    flex: 1,
    fontSize: typography.small,
    lineHeight: 20
  },
  documentRow: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    paddingVertical: spacing.md
  },
  documentIcon: {
    alignItems: "center",
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.lg,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  documentIconDone: {
    backgroundColor: colors.success
  },
  documentCopy: {
    flex: 1
  },
  documentTitle: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  documentMeta: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    marginTop: spacing.xs
  },
  reviewCard: {
    gap: spacing.sm,
    padding: spacing.xl
  },
  reviewTitle: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold
  },
  reviewLine: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 20
  },
  stickyAction: {
    marginTop: spacing.xl,
    padding: spacing.sm
  }
});
