import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import colors from "../theme/colors";

const DEFAULT_SKILLS = [
  // Technical
  "Python",
  "Java",
  "C++",
  "Web Development",
  "SQL / Databases",
  "Data Analysis",
  "Machine Learning Basics",
  "Networking",
  "Cyber Security",
  "Cloud Computing",
  "Mobile App Development",
  // Design / Creative
  "UI/UX Design",
  "Graphic Design",
  "Video Editing",
  // Business / Core
  "Excel & Analytics",
  "Accounting Basics",
  "Digital Marketing",
  "Business Strategy",
  // Soft Skills
  "Communication",
  "Problem Solving",
  "Leadership",
  "Teamwork",
];

export default function SkillSelector({ selectedSkills, onChange, disabled = false }) {
  const [customSkill, setCustomSkill] = useState("");

  const toggleSkill = (skill) => {
    if (disabled) return;
    if (selectedSkills.includes(skill)) {
      onChange(selectedSkills.filter((s) => s !== skill));
    } else {
      onChange([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = () => {
    if (disabled) return;
    const trimmed = customSkill.trim();
    if (!trimmed) return;
    if (!selectedSkills.includes(trimmed)) {
      onChange([...selectedSkills, trimmed]);
    }
    setCustomSkill("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Your Skills</Text>

      <View style={styles.tagsContainer}>
        {DEFAULT_SKILLS.map((skill) => {
          const active = selectedSkills.includes(skill);
          return (
            <TouchableOpacity
              key={skill}
              style={[
                styles.tag, 
                active && styles.tagActive,
                disabled && styles.tagDisabled
              ]}
              onPress={() => toggleSkill(skill)}
              disabled={disabled}
            >
              <Text style={[
                styles.tagText, 
                active && styles.tagTextActive,
                disabled && styles.tagTextDisabled
              ]}>
                {skill}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {!disabled && (
        <>
          <Text style={[styles.label, { marginTop: 10 }]}>
            Add Custom Skill (optional)
          </Text>
          <View style={styles.customRow}>
            <TextInput
              style={styles.customInput}
              placeholder="E.g. Flutter, AutoCAD..."
              placeholderTextColor={colors.textLight}
              value={customSkill}
              onChangeText={setCustomSkill}
            />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={handleAddCustomSkill}
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
    shadowColor: colors.accentGlow,
    shadowOpacity: 0.35,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
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
