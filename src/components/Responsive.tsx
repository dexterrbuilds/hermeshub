import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { spacing } from "@/constants/theme";
import { useResponsive } from "@/utils/responsive";

export function ResponsiveContainer({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  const { gutter, isDesktop, maxContentWidth } = useResponsive();

  return (
    <View
      style={[
        styles.container,
        {
          maxWidth: wide && isDesktop ? 1320 : maxContentWidth,
          paddingHorizontal: gutter
        }
      ]}
    >
      {children}
    </View>
  );
}

export function ResponsiveGrid({ children, columns, gap = spacing.lg }: { children: ReactNode; columns: number; gap?: number }) {
  return (
    <View style={[styles.grid, { gap }]}>
      {children}
    </View>
  );
}

export function gridItemWidth(columns: number, gap: number) {
  if (columns <= 1) return "100%";
  return `${100 / columns}%`;
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: "100%"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap"
  }
});
