import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, fontWeights, radii, spacing, typography } from "@/constants/theme";

type BadgeProps = {
  label: string;
  tone?: "blue" | "green" | "amber" | "red" | "neutral";
  icon?: keyof typeof Ionicons.glyphMap;
};

export function Badge({ label, tone = "neutral", icon }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[tone]]}>
      {icon ? (
        <Ionicons
          name={icon}
          size={13}
          color={tone === "green" ? colors.success : tone === "amber" ? colors.warning : tone === "red" ? colors.danger : colors.primary}
          style={styles.icon}
        />
      ) : null}
      <Text style={[styles.text, styles[`${tone}Text` as const]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: radii.pill,
    flexDirection: "row",
    paddingHorizontal: spacing.sm,
    paddingVertical: 5
  },
  blue: { backgroundColor: colors.surfaceBlue },
  green: { backgroundColor: colors.successSoft },
  amber: { backgroundColor: colors.warningSoft },
  red: { backgroundColor: colors.dangerSoft },
  neutral: { backgroundColor: colors.surfaceSoft },
  icon: { marginRight: spacing.xs },
  text: {
    fontSize: typography.tiny,
    fontWeight: fontWeights.semibold
  },
  blueText: { color: colors.primary },
  greenText: { color: colors.success },
  amberText: { color: colors.warning },
  redText: { color: colors.danger },
  neutralText: { color: colors.textMuted }
});
