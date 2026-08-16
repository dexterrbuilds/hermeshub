import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, fontWeights, radii, spacing, typography } from "@/constants/theme";

type BrandMarkProps = {
  compact?: boolean;
  light?: boolean;
};

export function BrandMark({ compact = false, light = false }: BrandMarkProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.mark, compact && styles.markCompact, light && styles.markLight]}>
        <Ionicons name="navigate" size={compact ? 18 : 22} color={light ? colors.primary : colors.white} />
      </View>
      <View>
        <Text style={[styles.name, compact && styles.nameCompact, light && styles.lightText]}>Hermes Hub</Text>
        {!compact ? <Text style={[styles.tagline, light && styles.lightMuted]}>Trusted local marketplace</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  mark: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  markCompact: {
    borderRadius: radii.sm,
    height: 34,
    width: 34
  },
  markLight: {
    backgroundColor: colors.white
  },
  name: {
    color: colors.text,
    fontSize: typography.cardTitle,
    fontWeight: fontWeights.semibold
  },
  nameCompact: {
    fontSize: typography.body
  },
  tagline: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    marginTop: 1
  },
  lightText: {
    color: colors.white
  },
  lightMuted: {
    color: "#DBEAFE"
  }
});
