import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, ViewStyle } from "react-native";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { colors, layout, radii, shadows } from "@/constants/theme";

type IconButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
};

export function IconButton({
  icon,
  onPress,
  color = colors.text,
  backgroundColor = colors.surface,
  style
}: IconButtonProps) {
  return (
    <AnimatedPressable
      onPress={onPress}
      haptic="selection"
      contentStyle={[
        styles.button,
        { backgroundColor },
        style
      ]}
    >
      <Ionicons name={icon} size={20} color={color} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radii.pill,
    height: layout.iconButton,
    justifyContent: "center",
    width: layout.iconButton,
    ...shadows.soft
  }
});
