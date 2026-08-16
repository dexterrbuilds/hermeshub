import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { FadeImage } from "@/components/FadeImage";
import { IconButton } from "@/components/IconButton";
import { Screen } from "@/components/Screen";
import { ContentFade, SkeletonList } from "@/components/StateViews";
import { colors, fontWeights, radii, shadows, spacing, typography } from "@/constants/theme";
import { marketplaceService } from "@/services/marketplaceService";
import { Order } from "@/types/marketplace";
import { formatCurrency } from "@/utils/format";
import { useResponsive } from "@/utils/responsive";

export default function OrderTrackingScreen() {
  const [order, setOrder] = useState<Order | undefined>();
  const pulse = useRef(new Animated.Value(1)).current;
  const { isDesktop } = useResponsive();

  useEffect(() => {
    marketplaceService.getActiveOrder().then(setOrder);
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.18, duration: 760, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 760, useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const currentIndex = useMemo(() => {
    if (!order) return -1;
    const firstPending = order.timeline.findIndex((item) => !item.completed);
    return firstPending === -1 ? order.timeline.length - 1 : Math.max(firstPending - 1, 0);
  }, [order]);

  if (!order) {
    return (
      <Screen>
        <SkeletonList count={2} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.topBar}>
        <IconButton icon="chevron-back" onPress={() => router.back()} />
        <Badge label="Live status" tone="blue" />
      </View>
      <Text style={styles.title}>{order.kind === "delivery" ? "Order tracking" : "Service tracking"}</Text>
      <Text style={styles.subtitle}>Know what happens next from request to completion.</Text>

      <ContentFade>
      <View style={[isDesktop && styles.desktopTrackingLayout]}>
      <View style={[styles.summary, isDesktop && styles.desktopSummary]}>
        <View style={styles.summaryHeader}>
          {order.vendorImage ? <FadeImage uri={order.vendorImage} style={styles.vendorImage} /> : null}
          <View style={styles.summaryCopy}>
            <Text style={styles.orderId}>Order {order.id}</Text>
            <Text style={styles.vendor}>{order.vendorName}</Text>
            <Text style={styles.service}>{order.serviceName}</Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.meta}>ETA: {order.eta}</Text>
          <Text style={styles.total}>{formatCurrency(order.total)}</Text>
        </View>
      </View>

      <View style={[styles.actions, isDesktop && styles.desktopActions]}>
        {["Call", "Message", "Cancel"].map((item) => (
          <Pressable key={item} style={styles.action}>
            <Ionicons name={item === "Call" ? "call-outline" : item === "Message" ? "chatbubble-outline" : "close-circle-outline"} size={18} color={item === "Cancel" ? colors.danger : colors.primary} />
            <Text style={[styles.actionText, item === "Cancel" && styles.cancelText]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.timeline, isDesktop && styles.desktopTimeline]}>
        {order.timeline.map((item, index) => (
          <View key={`${item.label}-${index}`} style={styles.step}>
            <View style={styles.stepRail}>
              <Animated.View style={[styles.dot, item.completed && styles.dotActive, index === currentIndex && { transform: [{ scale: pulse }] }]}>
                {item.completed ? <Ionicons name="checkmark" size={13} color={colors.white} /> : null}
              </Animated.View>
              {index < order.timeline.length - 1 ? <View style={[styles.line, item.completed && styles.lineActive]} /> : null}
            </View>
            <View style={styles.stepBody}>
              <Text style={styles.stepLabel}>{item.label}</Text>
              <Text style={styles.stepTime}>{item.time}</Text>
            </View>
          </View>
        ))}
      </View>

      </View>
      <Button title="View delivery status" icon="bicycle-outline" onPress={() => router.push("/order/delivery")} />
      </ContentFade>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: fontWeights.semibold
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.xs
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl
  },
  summary: {
    backgroundColor: colors.navy,
    borderRadius: radii.xl,
    marginVertical: spacing.xl,
    padding: spacing.xl,
    ...shadows.card
  },
  summaryHeader: {
    alignItems: "center",
    flexDirection: "row"
  },
  vendorImage: {
    borderRadius: radii.lg,
    height: 66,
    marginRight: spacing.md,
    width: 66
  },
  summaryCopy: {
    flex: 1
  },
  orderId: {
    color: "#BFDBFE",
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  vendor: {
    color: colors.white,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold,
    marginTop: spacing.xs
  },
  service: {
    color: "#DBEAFE",
    fontSize: typography.small,
    marginTop: spacing.xs
  },
  summaryRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xl
  },
  meta: {
    color: "#DBEAFE",
    fontSize: typography.small
  },
  total: {
    color: colors.white,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xl
  },
  action: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    flex: 1,
    gap: spacing.xs,
    minHeight: 72,
    justifyContent: "center",
    ...shadows.soft
  },
  actionText: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  },
  cancelText: {
    color: colors.danger
  },
  timeline: {
    marginBottom: spacing.xl
  },
  desktopTrackingLayout: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.xxxl
  },
  desktopSummary: {
    marginTop: spacing.xl,
    width: 360
  },
  desktopActions: {
    flexDirection: "column"
  },
  desktopTimeline: {
    flex: 1,
    marginTop: spacing.xl
  },
  step: {
    flexDirection: "row"
  },
  stepRail: {
    alignItems: "center",
    marginRight: spacing.md
  },
  dot: {
    alignItems: "center",
    backgroundColor: colors.borderStrong,
    borderRadius: radii.pill,
    height: 28,
    justifyContent: "center",
    width: 28
  },
  dotActive: {
    backgroundColor: colors.primary
  },
  line: {
    backgroundColor: colors.border,
    flex: 1,
    minHeight: 34,
    width: 2
  },
  lineActive: {
    backgroundColor: colors.primarySoft
  },
  stepBody: {
    flex: 1,
    paddingBottom: spacing.xl
  },
  stepLabel: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.semibold
  },
  stepTime: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: spacing.xs
  }
});
