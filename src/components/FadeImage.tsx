import { Ionicons } from "@expo/vector-icons";
import { Image, ImageProps } from "expo-image";
import { useState } from "react";
import { ImageStyle, StyleProp, StyleSheet, View } from "react-native";
import { colors, radii } from "@/constants/theme";

type FadeImageProps = {
  uri?: string;
  style?: StyleProp<ImageStyle>;
  fallbackIcon?: keyof typeof Ionicons.glyphMap;
  contentFit?: ImageProps["contentFit"];
};

export function FadeImage({ uri, style, fallbackIcon = "storefront-outline", contentFit = "cover" }: FadeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    return (
      <View style={[styles.fallback, style]}>
        <Ionicons name={fallbackIcon} size={28} color={colors.primary} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      contentFit={contentFit}
      transition={220}
      cachePolicy="memory-disk"
      placeholder={{ blurhash: "L5H2EC=PM+yV0g-mq.wG9c010J}I" }}
      onError={() => setFailed(true)}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    backgroundColor: colors.surfaceBlue,
    borderRadius: radii.md,
    justifyContent: "center"
  }
});
