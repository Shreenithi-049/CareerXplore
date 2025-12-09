// src/components/InputField.js
import React from "react";
import { TextInput, StyleSheet, Platform } from "react-native";
import colors from "../theme/colors";
import { useResponsive } from "../utils/useResponsive";

export default function InputField({ placeholder, ...props }) {
  const { isMobile } = useResponsive();
  
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={colors.textLight}
      style={[styles.input, isMobile && styles.inputMobile]}
      autoCorrect={false}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    backgroundColor: colors.card,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grayBorder,
    fontSize: 15,
    marginBottom: 14,
    color: colors.textDark,
  },
  inputMobile: {
    paddingVertical: 16,
    paddingHorizontal: 14,
    fontSize: 16,
    minHeight: 48,
  },
});
