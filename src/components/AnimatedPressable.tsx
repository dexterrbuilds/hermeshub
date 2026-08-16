import { ReactNode, useRef } from "react";
import { Animated, GestureResponderEvent, Pressable, StyleProp, ViewStyle } from "react-native";
import { motion } from "@/constants/theme";
import { impactFeedback, selectionFeedback } from "@/utils/feedback";

type AnimatedPressableProps = {
  children: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  haptic?: "none" | "selection" | "impact";
};

export function AnimatedPressable({
  children,
  onPress,
  style,
  contentStyle,
  disabled = false,
  haptic = "none"
}: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      ...motion.spring
    }).start();
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (haptic === "selection") void selectionFeedback();
    if (haptic === "impact") void impactFeedback();
    onPress?.(event);
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={handlePress}
      onPressIn={() => animateTo(0.985)}
      onPressOut={() => animateTo(1)}
      style={style}
    >
      <Animated.View style={[contentStyle, { transform: [{ scale }], opacity: disabled ? 0.62 : 1 }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
