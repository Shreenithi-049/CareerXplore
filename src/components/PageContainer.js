import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import colors from "../theme/colors";

export default function PageContainer({ children }) {
  const isWeb = Platform.OS === "web";

  return (
    <View style={[styles.wrapper, isWeb && styles.webWrapper]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 15,
  },

  // FIX FOR WEB
  webWrapper: {
    maxWidth: "100%",     // allow full width
    alignSelf: "stretch", // no centering box
    paddingHorizontal: 40, // desktop-friendly padding
  },
});
