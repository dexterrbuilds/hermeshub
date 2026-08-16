import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, ViewStyle } from "react-native";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import {
  colors,
  fontWeights,
  layout,
  radii,
  shadows,
  spacing,
  typography
} from "@/constants/theme";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  icon,
  disabled = false,
  loading = false,
  style
}: ButtonProps) {
  const isPrimary = variant === "primary";
  const contentColor = isPrimary ? colors.white : variant === "danger" ? colors.danger : colors.primary;

  return (
    <AnimatedPressable
      disabled={disabled || loading}
      onPress={onPress}
      haptic={variant === "primary" ? "impact" : "selection"}
      contentStyle={[
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={contentColor} style={styles.icon} />
      ) : icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={contentColor}
          style={styles.icon}
        />
      ) : null}
      <Text
        style={[
          styles.text,
          isPrimary ? styles.primaryText : variant === "danger" ? styles.dangerText : styles.secondaryText,
          disabled && styles.disabledText
        ]}
      >
        {title}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radii.md,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: layout.buttonHeight,
    paddingHorizontal: spacing.xl
  },
  primary: {
    backgroundColor: colors.primary,
    ...shadows.soft
  },
  secondary: {
    backgroundColor: colors.surfaceBlue,
    borderColor: colors.border,
    borderWidth: 1
  },
  ghost: {
    backgroundColor: "transparent"
  },
  danger: {
    backgroundColor: colors.dangerSoft
  },
  disabled: {
    backgroundColor: colors.surfaceSoft,
    opacity: 0.8
  },
  icon: {
    marginRight: spacing.sm
  },
  text: {
    fontSize: typography.button,
    fontWeight: fontWeights.semibold
  },
  primaryText: {
    color: colors.white
  },
  secondaryText: {
    color: colors.primary
  },
  dangerText: {
    color: colors.danger
  },
  disabledText: {
    color: colors.textSubtle
  }
});
