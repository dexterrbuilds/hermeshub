import { Tabs } from "expo-router";
import { View } from "react-native";
import { DesktopHeader } from "@/components/DesktopHeader";
import { FloatingTabBar } from "@/components/FloatingTabBar";
import { useResponsive } from "@/utils/responsive";

export default function TabsLayout() {
  const { isDesktop } = useResponsive();

  return (
    <View style={{ flex: 1 }}>
      <DesktopHeader />
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { display: isDesktop ? "none" : "flex" }
      })}
      tabBar={(props) => isDesktop ? null : <FloatingTabBar {...props} />}
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
