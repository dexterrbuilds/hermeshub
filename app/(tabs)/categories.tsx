import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppHeader } from "@/components/AppHeader";
import { CategoryCard } from "@/components/CategoryCard";
import { Screen } from "@/components/Screen";
import { CategorySkeletonList, ContentFade } from "@/components/StateViews";
import { colors, spacing, typography } from "@/constants/theme";
import { marketplaceService } from "@/services/marketplaceService";
import { Category } from "@/types/marketplace";

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    marketplaceService.getCategories().then((items) => {
      setCategories(items);
      setLoading(false);
    });
  }, []);

  return (
    <Screen>
      <AppHeader leftIcon="chevron-back" onLeftPress={() => router.back()} title="Categories" subtitle="Browse services people commonly need around Ibadan." />
      <Text style={styles.helper}>Choose a category to see nearby businesses, then compare ratings, availability, and trust cues before booking.</Text>
      {loading ? <CategorySkeletonList /> : (
        <ContentFade>
          <View style={styles.grid}>
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={() => router.push({ pathname: "/nearby", params: { category: category.id, title: category.name } })}
              />
            ))}
          </View>
        </ContentFade>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  helper: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginBottom: spacing.xl
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    justifyContent: "space-between"
  }
});
