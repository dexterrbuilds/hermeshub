import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, layout, spacing } from "@/constants/theme";
import { useResponsive } from "@/utils/responsive";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  keyboard?: boolean;
  bottomInset?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function Screen({
  children,
  scroll = true,
  padded = true,
  keyboard = false,
  bottomInset = true,
  refreshing = false,
  onRefresh
}: ScreenProps) {
  const { gutter, isDesktop, maxContentWidth } = useResponsive();
  const paddedStyle = padded
    ? {
        paddingHorizontal: isDesktop ? gutter : layout.screenPadding,
        maxWidth: isDesktop ? maxContentWidth : undefined,
        alignSelf: "center" as const,
        width: "100%" as const
      }
    : undefined;

  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        paddedStyle,
        bottomInset && (isDesktop ? styles.desktopBottomInset : styles.bottomInset)
      ]}
      keyboardShouldPersistTaps="handled"
      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} /> : undefined}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, paddedStyle, bottomInset && (isDesktop ? styles.desktopBottomInset : styles.bottomInset)]}>
      {children}
    </View>
  );

  if (keyboard) {
    return (
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.fill}
        >
          {content}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return <SafeAreaView style={styles.safe}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background
  },
  fill: {
    flex: 1
  },
  content: {
    paddingTop: spacing.lg
  },
  bottomInset: {
    paddingBottom: 118
  },
  desktopBottomInset: {
    paddingBottom: spacing.huge
  }
});
