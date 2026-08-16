import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fontWeights, layout, radii, shadows, spacing, typography } from "@/constants/theme";

type AppHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  onLeftPress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

export function AppHeader({ eyebrow, title, subtitle, leftIcon, onLeftPress, rightIcon = "person-outline", onRightPress }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      {onLeftPress && leftIcon ? (
        <Pressable onPress={onLeftPress} style={[styles.iconButton, styles.leftButton]} hitSlop={8}>
          <Ionicons name={leftIcon} size={20} color={colors.text} />
        </Pressable>
      ) : null}
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {onRightPress ? (
        <Pressable onPress={onRightPress} style={styles.iconButton} hitSlop={8}>
          <Ionicons name={rightIcon} size={20} color={colors.text} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl
  },
  copy: {
    flex: 1,
    paddingRight: spacing.md
  },
  leftButton: {
    marginRight: spacing.md
  },
  eyebrow: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: fontWeights.medium,
    marginBottom: spacing.xs
  },
  title: {
    color: colors.text,
    fontSize: typography.screenTitle,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 19,
    marginTop: spacing.xs
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    height: layout.iconButton,
    justifyContent: "center",
    width: layout.iconButton,
    ...shadows.soft
  }
});
