import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, ProtectedRoutes } from "@/auth/AuthContext";
import { colors } from "@/constants/theme";
import { MarketplaceStateProvider } from "@/state/MarketplaceState";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <MarketplaceStateProvider>
          <ProtectedRoutes />
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: "slide_from_right"
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
            <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
            <Stack.Screen name="nearby" />
            <Stack.Screen name="categories" />
            <Stack.Screen name="wallet" />
            <Stack.Screen name="vendor/[id]" />
            <Stack.Screen name="service/[id]" />
            <Stack.Screen name="cart" />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="business/onboarding" />
            <Stack.Screen name="business/verification" />
            <Stack.Screen name="business/dashboard" />
            <Stack.Screen name="order/tracking" />
            <Stack.Screen name="order/delivery" />
            <Stack.Screen name="order/reviews" />
          </Stack>
        </MarketplaceStateProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
