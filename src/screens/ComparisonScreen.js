import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import { useComparison } from "../context/ComparisonContext";
import { useResponsive } from "../utils/useResponsive";

export default function ComparisonScreen({ navigation }) {
  const { comparisonList, clearCompare } = useComparison();
  const { isMobile } = useResponsive();

  const handleApply = (applyUrl) => {
    if (applyUrl) {
      Linking.openURL(applyUrl);
    }
  };

  const extractStipendNumber = (stipend) => {
    if (!stipend) return 0;
    const match = stipend.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, "")) : 0;
  };

  const getBestValue = (field, getValue) => {
    if (comparisonList.length === 0) return null;
    const values = comparisonList.map(getValue);
    
    if (field === "stipend") {
      const numbers = values.map(extractStipendNumber);
      const maxIndex = numbers.indexOf(Math.max(...numbers));
      return maxIndex;
    }
    return null;
  };

  const bestStipendIndex = getBestValue("stipend", (item) => item.stipend);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Compare Internships</Text>
          <TouchableOpacity style={styles.clearButton} onPress={clearCompare}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Comparison Table */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.comparisonTable}>
            {/* Header Row */}
            <View style={styles.headerRow}>
              <View style={styles.labelColumn}>
                <Text style={styles.labelHeader}>Details</Text>
              </View>
              {comparisonList.map((item, index) => (
                <View key={item.id} style={styles.column}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.cardCompany}>{item.company}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Rows */}
            <ComparisonRow
              label="Location"
              items={comparisonList}
              getValue={(item) => item.location}
            />
            <ComparisonRow
              label="Stipend"
              items={comparisonList}
              getValue={(item) => item.stipend}
              highlightIndex={bestStipendIndex}
            />
            <ComparisonRow
              label="Duration"
              items={comparisonList}
              getValue={(item) => item.duration || "Not specified"}
            />
            <ComparisonRow
              label="Type"
              items={comparisonList}
              getValue={(item) => item.type || "Not specified"}
            />
            <ComparisonRow
              label="Skills"
              items={comparisonList}
              getValue={(item) => item.skills || []}
              isArray={true}
            />
            <ComparisonRow
              label="Match Score"
              items={comparisonList}
              getValue={(item) => item.matchScore ? `${item.matchScore}%` : "N/A"}
            />

            {/* Apply Buttons Row */}
            <View style={styles.actionRow}>
              <View style={styles.labelColumn}>
                <Text style={styles.labelHeader}>Actions</Text>
              </View>
              {comparisonList.map((item) => (
                <View key={item.id} style={styles.column}>
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => handleApply(item.applyUrl)}
                  >
                    <MaterialIcons name="send" size={16} color={colors.white} />
                    <Text style={styles.applyButtonText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function ComparisonRow({ label, items, getValue, highlightIndex, isArray = false }) {
  return (
    <View style={styles.row}>
      <View style={styles.labelColumn}>
        <Text style={styles.label}>{label}</Text>
      </View>
      {items.map((item, index) => {
        const value = getValue(item);
        const isHighlighted = highlightIndex === index;
        
        return (
          <View key={item.id} style={styles.column}>
            {isArray ? (
              <View style={styles.skillsContainer}>
                {value.slice(0, 3).map((skill, idx) => (
                  <View key={idx} style={styles.skillTag}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
                {value.length > 3 && (
                  <Text style={styles.moreSkills}>+{value.length - 3}</Text>
                )}
              </View>
            ) : (
              <View style={[styles.valueContainer, isHighlighted && styles.highlighted]}>
                <Text style={[styles.value, isHighlighted && styles.highlightedText]}>
                  {value}
                </Text>
                {isHighlighted && (
                  <MaterialIcons name="star" size={14} color={colors.accent} />
                )}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBorder,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  comparisonTable: {
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.grayBorder,
  },
  labelColumn: {
    width: 120,
    paddingRight: 12,
  },
  column: {
    width: 200,
    paddingHorizontal: 8,
  },
  labelHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textLight,
    marginTop: 4,
  },
  cardHeader: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.grayBorder,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },
  cardCompany: {
    fontSize: 12,
    color: colors.textLight,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.grayBorder,
  },
  highlighted: {
    backgroundColor: colors.accent + "15",
    borderColor: colors.accent,
  },
  value: {
    fontSize: 13,
    color: colors.textDark,
    flex: 1,
  },
  highlightedText: {
    color: colors.accent,
    fontWeight: "600",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillTag: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "500",
  },
  moreSkills: {
    fontSize: 10,
    color: colors.textLight,
    alignSelf: "center",
    marginLeft: 4,
  },
  applyButton: {
    backgroundColor: colors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: colors.accentGlow,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  applyButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.white,
  },
});

