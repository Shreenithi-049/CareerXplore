import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../theme/colors";

export default function PageContainer({ children }) {
  return <View style={styles.wrapper}>{children}</View>;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    width: "100%",
    maxWidth: 500, // Laptop responsive width
    alignSelf: "center",
  },
});
