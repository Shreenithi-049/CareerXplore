// src/components/InputField.js
import React from "react";
import { TextInput, StyleSheet } from "react-native";
import colors from "../theme/colors";

export default function InputField({ placeholder, ...props }) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={colors.textLight}
      style={styles.input}
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
});
