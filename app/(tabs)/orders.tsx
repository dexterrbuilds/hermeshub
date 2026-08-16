import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "@/components/AppHeader";
import { ContentFade, EmptyState, OrderSkeletonList } from "@/components/StateViews";
import { OrderCard } from "@/components/OrderCard";
import { Screen } from "@/components/Screen";
import { colors, fontWeights, radii, spacing, typography } from "@/constants/theme";
import { marketplaceService } from "@/services/marketplaceService";
import { Order } from "@/types/marketplace";
import { useResponsive } from "@/utils/responsive";

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<"active" | "history">("active");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isDesktop } = useResponsive();

  const loadOrders = async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    const items = await marketplaceService.getOrders();
    setOrders(items);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const visibleOrders = orders.filter((order) => tab === "active" ? order.status !== "completed" : order.status === "completed");

  return (
    <Screen refreshing={refreshing} onRefresh={() => void loadOrders(true)}>
      <AppHeader title="Orders" subtitle="Track bookings, deliveries, and completed local jobs." />
      <View style={styles.tabs}>
        {(["active", "history"] as const).map((item) => (
          <Pressable key={item} onPress={() => setTab(item)} style={[styles.tab, tab === item && styles.activeTab]}>
            <Text style={[styles.tabText, tab === item && styles.activeTabText]}>{item === "active" ? "Current" : "History"}</Text>
          </Pressable>
        ))}
      </View>
      {loading ? (
        <OrderSkeletonList count={3} />
      ) : visibleOrders.length ? (
        <ContentFade>
          <View style={[isDesktop && styles.desktopOrdersGrid]}>
            {visibleOrders.map((order) => (
              <View key={order.id} style={[isDesktop && styles.desktopOrderItem]}>
                <OrderCard
                  order={order}
                  onPress={() => order.status === "completed" ? router.push({ pathname: "/order/reviews", params: { bookingId: order.id, vendorId: order.vendorId } }) : router.push("/order/tracking")}
                />
              </View>
            ))}
          </View>
        </ContentFade>
      ) : (
        <EmptyState
          title={tab === "active" ? "No active orders" : "No completed orders yet"}
          message={tab === "active" ? "Book a business and your current order will appear here." : "Completed bookings will stay here for receipts and reviews."}
          actionLabel="Explore businesses"
          onAction={() => router.push("/search")}
          icon="receipt-outline"
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.lg,
    flexDirection: "row",
    marginBottom: spacing.xl,
    padding: spacing.xs
  },
  tab: {
    alignItems: "center",
    borderRadius: radii.md,
    flex: 1,
    paddingVertical: spacing.md
  },
  activeTab: {
    backgroundColor: colors.surface
  },
  tabText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  activeTabText: {
    color: colors.text
  },
  desktopOrdersGrid: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  desktopOrderItem: {
    paddingRight: spacing.lg,
    width: "50%"
  }
});
