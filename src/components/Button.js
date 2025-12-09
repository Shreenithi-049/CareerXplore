// src/components/Button.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";
import { useResponsive } from "../utils/useResponsive";

export default function Button({ title, onPress, style, textStyle }) {
  const { isMobile } = useResponsive();
  
  return (
    <TouchableOpacity 
      style={[styles.btn, isMobile && styles.btnMobile, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.btnText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    minHeight: 44,
    shadowColor: colors.accentGlow,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  btnMobile: {
    paddingVertical: 16,
    minHeight: 48,
  },
  btnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
