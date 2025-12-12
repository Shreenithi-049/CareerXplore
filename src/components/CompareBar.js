import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import InteractiveWrapper from "./InteractiveWrapper";
import { useComparison } from "../context/ComparisonContext";

/**
 * Sticky compare bar that appears at bottom when 2+ internships are selected
 */
export default function CompareBar({ onComparePress }) {
  const { comparisonList, clearCompare } = useComparison();

  if (comparisonList.length < 2) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <MaterialIcons name="compare-arrows" size={20} color={colors.primary} />
          <Text style={styles.text}>
            Compare {comparisonList.length} internship{comparisonList.length > 1 ? "s" : ""}
          </Text>
        </View>
        
        <View style={styles.actions}>
          <InteractiveWrapper
            style={styles.clearButton}
            onPress={clearCompare}
            androidRippleColor={colors.textLight + "20"}
          >
            <Text style={styles.clearText}>Clear</Text>
          </InteractiveWrapper>
          
          <InteractiveWrapper
            style={styles.compareButton}
            onPress={onComparePress}
            androidRippleColor={colors.white + "20"}
          >
            <Text style={styles.compareText}>Compare →</Text>
          </InteractiveWrapper>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.grayBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        paddingBottom: 20, // Safe area for iOS
      },
    }),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: "500",
  },
  compareButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: colors.accentGlow,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  compareText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
  },
});

