import { StyleSheet, Text, View } from "react-native";
import { Badge } from "@/components/Badge";
import { Rating } from "@/components/Rating";
import { colors, fontWeights, radii, spacing, typography } from "@/constants/theme";
import { Review } from "@/types/marketplace";

type ReviewCardProps = {
  review: Review;
};

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{review.customerName}</Text>
          <Text style={styles.date}>{review.date}</Text>
        </View>
        <Rating rating={review.rating} compact />
      </View>
      {"serviceUsed" in review && review.serviceUsed ? (
        <Badge label={review.serviceUsed} tone="neutral" />
      ) : null}
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.lg
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md
  },
  name: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.semibold
  },
  date: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    marginTop: spacing.xs
  },
  comment: {
    color: colors.text,
    fontSize: typography.small,
    lineHeight: 21,
    marginTop: spacing.md
  }
});
