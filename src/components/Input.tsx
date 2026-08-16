import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors, fontWeights, layout, radii, spacing, typography } from "@/constants/theme";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  password?: boolean;
};

export function Input({ label, error, style, multiline, icon, password = false, secureTextEntry, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(password || secureTextEntry);

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, focused && styles.focused, error && styles.errorInput, multiline && styles.multilineField]}>
        {icon ? <Ionicons name={icon} size={19} color={focused ? colors.primary : colors.textSubtle} style={styles.icon} /> : null}
        <TextInput
          placeholderTextColor={colors.textSubtle}
          multiline={multiline}
          secureTextEntry={hidden}
          onFocus={(event) => {
            setFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            props.onBlur?.(event);
          }}
          style={[styles.input, multiline && styles.multiline, style]}
          {...props}
        />
        {password || secureTextEntry ? (
          <Pressable onPress={() => setHidden((current) => !current)} style={styles.eye} hitSlop={8}>
            <Ionicons name={hidden ? "eye-outline" : "eye-off-outline"} size={19} color={colors.textSubtle} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg
  },
  label: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.sm
  },
  field: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: layout.inputHeight,
    paddingHorizontal: spacing.lg
  },
  focused: {
    backgroundColor: colors.white,
    borderColor: colors.primary
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
    minHeight: layout.inputHeight,
    paddingVertical: 0
  },
  icon: {
    marginRight: spacing.sm
  },
  multilineField: {
    alignItems: "flex-start",
    minHeight: 104,
    paddingTop: spacing.md
  },
  multiline: {
    minHeight: 92,
    textAlignVertical: "top"
  },
  errorInput: {
    borderColor: colors.danger
  },
  eye: {
    alignItems: "center",
    height: 34,
    justifyContent: "center",
    marginLeft: spacing.sm,
    width: 34
  },
  error: {
    color: colors.danger,
    fontSize: typography.tiny,
    marginTop: spacing.xs
  }
});
