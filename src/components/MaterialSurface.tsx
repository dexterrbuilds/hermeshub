import { ReactNode } from "react";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { colors, radii, shadows } from "@/constants/theme";

type MaterialSurfaceProps = {
  children: ReactNode;
  variant?: "content" | "elevated" | "glass" | "darkGlass";
  radius?: keyof typeof radii;
  style?: StyleProp<ViewStyle>;
};

export function MaterialSurface({
  children,
  variant = "content",
  radius = "lg",
  style
}: MaterialSurfaceProps) {
  return (
    <View style={[styles.base, { borderRadius: radii[radius] }, styles[variant], style]}>
      {children}
    </View>
  );
}

const webGlass = Platform.OS === "web" ? ({ backdropFilter: "blur(22px)" } as ViewStyle) : undefined;

const styles = StyleSheet.create({
  base: {
    overflow: "hidden"
  },
  content: {
    backgroundColor: colors.surface
  },
  elevated: {
    backgroundColor: colors.surfaceRaised,
    borderColor: "rgba(226, 232, 240, 0.78)",
    borderWidth: 1,
    ...shadows.ambient
  },
  glass: {
    backgroundColor: colors.glass,
    borderColor: "rgba(255, 255, 255, 0.72)",
    borderWidth: 1,
    ...shadows.glass,
    ...webGlass
  },
  darkGlass: {
    backgroundColor: colors.glassNavy,
    borderColor: "rgba(255, 255, 255, 0.14)",
    borderWidth: 1,
    ...shadows.glass,
    ...webGlass
  }
});
