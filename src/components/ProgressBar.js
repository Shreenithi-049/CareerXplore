import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";

export default function ProgressBar({ progress, label }) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.percentage}>{progress}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 6,
  },
  barContainer: {
    height: 12,
    backgroundColor: colors.grayLight,
    borderRadius: 6,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: 6,
  },
  percentage: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    textAlign: "right",
  },
});
