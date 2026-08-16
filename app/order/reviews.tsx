import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { Input } from "@/components/Input";
import { ReviewCard } from "@/components/ReviewCard";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { SuccessState } from "@/components/StateViews";
import { colors, fontWeights, radii, shadows, spacing, typography } from "@/constants/theme";
import { marketplaceService } from "@/services/marketplaceService";
import { Review } from "@/types/marketplace";

const tags = ["Professional", "On time", "Good communication", "Good value", "Would recommend"];

export default function ReviewsScreen() {
  const { vendorId, bookingId } = useLocalSearchParams<{ vendorId?: string; bookingId?: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(["On time"]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    marketplaceService.getVendorReviews(vendorId ?? "akobo-sweetcrumbs").then(setReviews);
  }, [vendorId]);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    );
  };

  const submitReview = () => {
    setSubmitting(true);
    marketplaceService.submitReview({ bookingId, rating, comment }).then(() => {
      setSubmitting(false);
      setSubmitted(true);
    });
  };

  if (submitted) {
    return (
      <Screen scroll={false}>
        <SuccessState
          title="Review submitted"
          message="Thanks for helping people nearby choose with more confidence."
          actionLabel="Back to orders"
          onAction={() => router.replace("/orders")}
        />
      </Screen>
    );
  }

  return (
    <Screen keyboard>
      <View style={styles.topBar}>
        <IconButton icon="chevron-back" onPress={() => router.back()} />
      </View>
      <Text style={styles.title}>Leave a review</Text>
      <Text style={styles.subtitle}>Keep it short and helpful for the next person nearby.</Text>

      <View style={styles.form}>
        <Text style={styles.formTitle}>How was the experience?</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Pressable key={value} onPress={() => setRating(value)} hitSlop={8}>
              <Ionicons name={value <= rating ? "star" : "star-outline"} size={30} color={colors.warning} />
            </Pressable>
          ))}
        </View>

        <View style={styles.tags}>
          {tags.map((tag) => {
            const selected = selectedTags.includes(tag);
            return (
              <Pressable key={tag} onPress={() => toggleTag(tag)} style={[styles.tag, selected && styles.tagSelected]}>
                <Text style={[styles.tagText, selected && styles.tagTextSelected]}>{tag}</Text>
              </Pressable>
            );
          })}
        </View>

        <Input
          icon="chatbubble-ellipses-outline"
          label="Review"
          value={comment}
          onChangeText={setComment}
          placeholder="What should others know?"
          multiline
        />
        <Button title={submitting ? "Submitting..." : "Submit review"} loading={submitting} icon="send-outline" onPress={submitReview} />
      </View>

      <SectionHeader title="Recent reviews" />
      {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: fontWeights.semibold
  },
  topBar: {
    marginBottom: spacing.xl
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.xs
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    marginTop: spacing.xl,
    padding: spacing.xl,
    ...shadows.soft
  },
  formTitle: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: fontWeights.semibold
  },
  stars: {
    flexDirection: "row",
    gap: spacing.sm,
    marginVertical: spacing.lg
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  tag: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  tagSelected: {
    backgroundColor: colors.surfaceBlue
  },
  tagText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: fontWeights.medium
  },
  tagTextSelected: {
    color: colors.primary,
    fontWeight: fontWeights.semibold
  }
});
