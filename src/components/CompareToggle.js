import React from "react";
import { View, StyleSheet, Platform, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import InteractiveWrapper from "./InteractiveWrapper";
import { useComparison } from "../context/ComparisonContext";

/**
 * Small, unobtrusive compare toggle button for internship cards
 */
export default function CompareToggle({ internship, size = 18, style }) {
  const { isInComparison, addToCompare, removeFromCompare } = useComparison();
  const isSelected = isInComparison(internship.id);

  const handleToggle = (e) => {
    e.stopPropagation();
    
    if (isSelected) {
      removeFromCompare(internship.id);
    } else {
      const result = addToCompare(internship);
      if (!result.success && result.message) {
        Alert.alert("Limit Reached", result.message);
      }
    }
  };

  return (
    <InteractiveWrapper
      style={[styles.container, isSelected && styles.selected, style]}
      onPress={handleToggle}
      androidRippleColor={colors.accent + "33"}
      hitSlop={6}
    >
      <MaterialIcons
        name={isSelected ? "check-circle" : "radio-button-unchecked"}
        size={size}
        color={isSelected ? colors.accent : colors.textLight}
      />
    </InteractiveWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
    borderRadius: 12,
    minWidth: 28,
    minHeight: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  selected: {
    backgroundColor: colors.accent + "15",
  },
});

