import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import colors from "../theme/colors";
import InteractiveWrapper from "./InteractiveWrapper";
import Button from "./Button";

const locationOptions = [
  "Remote",
  "On-site",
  "Hybrid",
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Hyderabad",
  "Chennai",
  "Pune",
];

const stipendOptions = [
  "< ₹10,000",
  "₹10k - ₹15k",
  "₹15k - ₹20k",
  "> ₹20k",
];

const typeOptions = ["Full-time", "Part-time", "Paid", "Unpaid"];
const durationOptions = ["1-3 months", "3-6 months", "6+ months"];

export default function FilterModal({ visible, onClose, onApply, initial }) {
  const [selected, setSelected] = useState(initial || {});

  useEffect(() => {
    setSelected(initial || {});
  }, [initial, visible]);

  const toggle = (key, value) => {
    setSelected((prev) => {
      const current = prev[key] || [];
      const exists = current.includes(value);
      return {
        ...prev,
        [key]: exists ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  };

  const clearAll = () => {
    setSelected({});
  };

  const apply = () => {
    onApply(selected);
    onClose();
  };

  const renderPills = (items, key) => (
    <View style={styles.pillRow}>
      {items.map((item) => {
        const active = (selected[key] || []).includes(item);
        return (
          <InteractiveWrapper
            key={item}
            onPress={() => toggle(key, item)}
            style={[styles.pill, active && styles.pillActive]}
          >
            <Text style={[styles.pillText, active && styles.pillTextActive]}>
              {item}
            </Text>
          </InteractiveWrapper>
        );
      })}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet}>
        <View style={styles.dragHandle} />
        <Text style={styles.title}>Filter Internships</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.sectionLabel}>Location</Text>
          {renderPills(locationOptions, "locations")}

          <Text style={styles.sectionLabel}>Stipend</Text>
          {renderPills(stipendOptions, "stipends")}

          <Text style={styles.sectionLabel}>Type</Text>
          {renderPills(typeOptions, "types")}

          <Text style={styles.sectionLabel}>Duration</Text>
          {renderPills(durationOptions, "durations")}
        </ScrollView>

        <View style={styles.footer}>
          <InteractiveWrapper
            onPress={clearAll}
            style={[styles.footerButton, styles.clearBtn]}
          >
            <Text style={styles.clearText}>Clear</Text>
          </InteractiveWrapper>
          <View style={{ flex: 1 }}>
            <Button title="Apply Filters" onPress={apply} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: "70%",
    paddingTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -3 },
    elevation: 12,
  },
  dragHandle: {
    alignSelf: "center",
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.grayBorder,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textDark,
    marginBottom: 4,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.grayLight,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.grayBorder,
  },
  pillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  pillText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 12,
  },
  pillTextActive: {
    color: colors.white,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.grayBorder,
  },
  footerButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    minHeight: 48,
  },
  clearBtn: {
    minWidth: 90,
  },
  clearText: {
    textAlign: "center",
    color: colors.textDark,
    fontWeight: "600",
  },
});

