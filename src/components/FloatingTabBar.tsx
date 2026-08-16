import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fontWeights, layout, motion, radii, spacing, typography } from "@/constants/theme";
import { MaterialSurface } from "@/components/MaterialSurface";
import { selectionFeedback } from "@/utils/feedback";

const icons: Record<string, { inactive: keyof typeof Ionicons.glyphMap; active: keyof typeof Ionicons.glyphMap }> = {
  home: { inactive: "home-outline", active: "home" },
  search: { inactive: "compass-outline", active: "compass" },
  orders: { inactive: "receipt-outline", active: "receipt" },
  saved: { inactive: "heart-outline", active: "heart" },
  profile: { inactive: "person-outline", active: "person" }
};

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const visibleRoutes = useMemo(
    () => state.routes.filter((route) => (descriptors[route.key].options as { href?: unknown }).href !== null),
    [descriptors, state.routes]
  );
  const activeRouteKey = state.routes[state.index]?.key;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: insets.bottom + spacing.sm }]}>
      <MaterialSurface variant="glass" radius="pill" style={styles.bar}>
        {visibleRoutes.map((route) => {
          const routeIndex = state.routes.findIndex((item) => item.key === route.key);
          const focused = route.key === activeRouteKey;
          const options = descriptors[route.key].options;
          const label = options.title ?? route.name;
          const icon = icons[route.name] ?? { inactive: "ellipse-outline", active: "ellipse" };

          const onPress = () => {
            void selectionFeedback();
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <FloatingTabItem
              key={route.key}
              focused={focused}
              icon={focused ? icon.active : icon.inactive}
              label={String(label)}
              onPress={onPress}
              routeIndex={routeIndex}
            />
          );
        })}
      </MaterialSurface>
    </View>
  );
}

function FloatingTabItem({
  focused,
  icon,
  label,
  onPress
}: {
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  routeIndex: number;
}) {
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      ...motion.softSpring
    }).start();
  }, [focused, progress]);

  const labelOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0.64, 1] });
  const iconScale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.04] });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
    >
      <Animated.View style={[styles.activeCapsule, { opacity: progress }]} />
      <Animated.View style={[styles.itemContent, { transform: [{ scale: iconScale }] }]}>
        <Ionicons name={icon} size={18} color={focused ? colors.primary : colors.textMuted} />
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.label,
            focused && styles.labelFocused,
            { opacity: labelOpacity }
          ]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    bottom: 0,
    left: 0,
    paddingHorizontal: spacing.lg,
    pointerEvents: "box-none",
    position: "absolute",
    right: 0
  },
  bar: {
    alignItems: "center",
    flexDirection: "row",
    height: layout.tabBarHeight,
    justifyContent: "space-between",
    maxWidth: layout.floatingTabWidth,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    width: "100%"
  },
  item: {
    alignItems: "center",
    borderRadius: radii.pill,
    flex: 1,
    height: "100%",
    justifyContent: "center",
    marginHorizontal: 0,
    overflow: "hidden"
  },
  itemPressed: {
    opacity: Platform.OS === "web" ? 0.82 : 1
  },
  activeCapsule: {
    backgroundColor: "rgba(239, 246, 255, 0.86)",
    borderColor: "rgba(37, 99, 235, 0.08)",
    borderRadius: radii.pill,
    borderWidth: 1,
    bottom: spacing.sm,
    left: spacing.xs,
    position: "absolute",
    right: spacing.xs,
    top: spacing.sm
  },
  itemContent: {
    alignItems: "center",
    gap: 2,
    justifyContent: "center"
  },
  label: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: fontWeights.medium,
    letterSpacing: 0,
    maxWidth: 54
  },
  labelFocused: {
    color: colors.primary,
    fontWeight: fontWeights.semibold
  }
});
