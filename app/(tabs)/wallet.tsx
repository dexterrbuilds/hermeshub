import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { AppHeader } from "@/components/AppHeader";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { ContentFade, OrderSkeletonList } from "@/components/StateViews";
import { colors, fontWeights, radii, spacing, typography } from "@/constants/theme";
import { marketplaceService } from "@/services/marketplaceService";
import { WalletTransaction } from "@/types/marketplace";
import { formatCurrency } from "@/utils/format";

export default function WalletScreen() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWallet = async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    const wallet = await marketplaceService.getWallet();
      setBalance(wallet.balance);
      setTransactions(wallet.transactions);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    void loadWallet();
  }, []);

  return (
    <Screen refreshing={refreshing} onRefresh={() => void loadWallet(true)}>
      <AppHeader leftIcon="chevron-back" onLeftPress={() => router.back()} title="Hermes balance" subtitle="A simple balance for fast local bookings." />
      <View style={styles.balanceCard}>
        <Text style={styles.label}>Available balance</Text>
        <Text style={styles.balance}>{formatCurrency(balance)}</Text>
        <Button title="Add funds" icon="add-outline" onPress={() => undefined} variant="secondary" />
      </View>

      <SectionHeader title="Recent activity" />
      {loading ? <OrderSkeletonList count={3} /> : (
        <ContentFade>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transaction}>
              <View style={styles.iconWrap}>
                <Ionicons
                  name={transaction.type === "credit" ? "arrow-down-outline" : "arrow-up-outline"}
                  size={18}
                  color={transaction.type === "credit" ? colors.success : colors.primary}
                />
              </View>
              <View style={styles.transactionBody}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.date}>{transaction.date}</Text>
              </View>
              <Text style={styles.amount}>
                {transaction.type === "credit" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </Text>
            </View>
          ))}
        </ContentFade>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    gap: spacing.lg,
    marginTop: spacing.xl,
    padding: spacing.xl
  },
  label: {
    color: "#DBEAFE",
    fontSize: typography.small,
    fontWeight: fontWeights.medium
  },
  balance: {
    color: colors.white,
    fontSize: 34,
    fontWeight: fontWeights.semibold
  },
  transaction: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: spacing.md,
    padding: spacing.lg
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.pill,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  transactionBody: {
    flex: 1,
    marginLeft: spacing.md
  },
  transactionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.semibold
  },
  date: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    marginTop: spacing.xs
  },
  amount: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold
  }
});
