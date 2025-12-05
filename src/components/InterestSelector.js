import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import colors from "../theme/colors";

const DEFAULT_INTERESTS = [
  // Technology
  "Artificial Intelligence",
  "Web Development",
  "Mobile Apps",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing",
  "Blockchain",
  "IoT",
  // Business
  "Entrepreneurship",
  "Marketing",
  "Finance",
  "Consulting",
  "Project Management",
  "Sales",
  // Creative
  "Design",
  "Photography",
  "Video Production",
  "Writing",
  "Music",
  // Other
  "Healthcare",
  "Education",
  "Research",
  "Gaming",
  "Travel",
  "Sports",
];

export default function InterestSelector({ selectedInterests, onChange, disabled = false }) {
  const [customInterest, setCustomInterest] = useState("");

  const toggleInterest = (interest) => {
    if (disabled) return;
    if (selectedInterests.includes(interest)) {
      onChange(selectedInterests.filter((i) => i !== interest));
    } else {
      onChange([...selectedInterests, interest]);
    }
  };

  const handleAddCustomInterest = () => {
    if (disabled) return;
    const trimmed = customInterest.trim();
    if (!trimmed) return;
    if (!selectedInterests.includes(trimmed)) {
      onChange([...selectedInterests, trimmed]);
    }
    setCustomInterest("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.tagsContainer}>
        {DEFAULT_INTERESTS.map((interest) => {
          const active = selectedInterests.includes(interest);
          return (
            <TouchableOpacity
              key={interest}
              style={[
                styles.tag,
                active && styles.tagActive,
                disabled && styles.tagDisabled
              ]}
              onPress={() => toggleInterest(interest)}
              disabled={disabled}
            >
              <Text style={[
                styles.tagText,
                active && styles.tagTextActive,
                disabled && styles.tagTextDisabled
              ]}>
                {interest}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {!disabled && (
        <>
          <Text style={[styles.label, { marginTop: 10 }]}>
            Add Custom Interest (optional)
          </Text>
          <View style={styles.customRow}>
            <TextInput
              style={styles.customInput}
              placeholder="E.g. Robotics, Fashion..."
              placeholderTextColor={colors.textLight}
              value={customInterest}
              onChangeText={setCustomInterest}
            />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={handleAddCustomInterest}
            >
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 6,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.grayBorder,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.card,
  },
  tagActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  tagText: {
    fontSize: 12,
    color: "#1F2937",
    fontWeight: "600",
  },
  tagTextActive: {
    color: colors.white,
    fontWeight: "600",
  },
  tagDisabled: {
    opacity: 0.6,
  },
  tagTextDisabled: {
    color: colors.textLight,
  },
  customRow: {
    flexDirection: "row",
    marginTop: 4,
    columnGap: 8,
    alignItems: "center",
  },
  customInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grayBorder,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.textDark,
  },
  addBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  addBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
});