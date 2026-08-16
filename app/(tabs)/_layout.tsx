import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { DesktopHeader } from "@/components/DesktopHeader";
import { colors, shadows } from "@/constants/theme";
import { useResponsive } from "@/utils/responsive";

const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
  home: "home-outline",
  search: "compass-outline",
  orders: "receipt-outline",
  saved: "heart-outline",
  profile: "person-outline"
};

export default function TabsLayout() {
  const { isDesktop } = useResponsive();

  return (
    <View style={{ flex: 1 }}>
      <DesktopHeader />
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600"
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 22,
          paddingTop: 10,
          display: isDesktop ? "none" : "flex",
          ...shadows.floating
        },
        tabBarIcon: ({ color, size, focused }) => (
          <View style={{ transform: [{ scale: focused ? 1.08 : 1 }] }}>
            <Ionicons name={icons[route.name] ?? "ellipse-outline"} size={size} color={color} />
          </View>
        )
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="search" options={{ title: "Explore" }} />
      <Tabs.Screen name="orders" options={{ title: "Orders" }} />
      <Tabs.Screen name="saved" options={{ title: "Saved" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="categories" options={{ href: null }} />
      <Tabs.Screen name="wallet" options={{ href: null }} />
    </Tabs>
    </View>
  );
}
