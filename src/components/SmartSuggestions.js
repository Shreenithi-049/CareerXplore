import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import InteractiveWrapper from "./InteractiveWrapper";
import CompareToggle from "./CompareToggle";
import { useResponsive } from "../utils/useResponsive";

/**
 * Smart suggestions component showing similar/better internships
 */
export default function SmartSuggestions({
  currentInternship,
  allInternships,
  userSkills = [],
  onSelect,
}) {
  const { isMobile } = useResponsive();

  const suggestions = useMemo(() => {
    if (!currentInternship || !allInternships || allInternships.length === 0) {
      return [];
    }

    // Filter out current internship
    const others = allInternships.filter(
      (item) => item.id !== currentInternship.id
    );

    // Score each suggestion
    const scored = others.map((item) => {
      let score = 0;
      const reasons = [];

      // Same category/role
      if (
        item.title.toLowerCase().includes(
          currentInternship.title.split(" ")[0].toLowerCase()
        )
      ) {
        score += 20;
        reasons.push("Same role");
      }

      // Higher salary
      const currentStipend = extractStipendNumber(currentInternship.stipend);
      const itemStipend = extractStipendNumber(item.stipend);
      if (itemStipend > currentStipend) {
        score += 30;
        reasons.push("Higher stipend");
      }

      // Better skill match
      if (userSkills.length > 0 && item.skills) {
        const matchedSkills = item.skills.filter((skill) =>
          userSkills.some(
            (userSkill) =>
              skill.toLowerCase().includes(userSkill.toLowerCase()) ||
              userSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        const matchRatio = matchedSkills.length / Math.max(item.skills.length, 1);
        if (matchRatio > 0.5) {
          score += 25;
          reasons.push("More skill match");
        }
      }

      // Same type
      if (item.type === currentInternship.type) {
        score += 10;
      }

      // Closer location (simplified - just check if same city)
      if (item.location && currentInternship.location) {
        const currentCity = currentInternship.location.split(",")[0].toLowerCase();
        const itemCity = item.location.split(",")[0].toLowerCase();
        if (currentCity === itemCity) {
          score += 15;
          reasons.push("Closer location");
        }
      }

      return {
        ...item,
        suggestionScore: score,
        reasons: reasons.slice(0, 2), // Max 2 reasons
      };
    });

    // Sort by score and return top 5
    return scored
      .filter((item) => item.suggestionScore > 0)
      .sort((a, b) => b.suggestionScore - a.suggestionScore)
      .slice(0, 5);
  }, [currentInternship, allInternships, userSkills]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="lightbulb" size={20} color={colors.accent} />
        <Text style={styles.title}>Recommendations for You</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {suggestions.map((item) => (
          <InteractiveWrapper
            key={item.id}
            style={[styles.card, isMobile && styles.cardMobile]}
            onPress={() => onSelect && onSelect(item)}
          >
            <View style={styles.cardHeader}>
              <CompareToggle internship={item} size={16} style={styles.compareToggle} />
              {item.matchScore && (
                <View style={styles.matchBadge}>
                  <Text style={styles.matchText}>{item.matchScore}%</Text>
                </View>
              )}
            </View>

            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.cardCompany}>{item.company}</Text>

            <View style={styles.metaRow}>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.type}>{item.type}</Text>
            </View>

            <Text style={styles.stipend}>{item.stipend}</Text>

            {item.reasons && item.reasons.length > 0 && (
              <View style={styles.reasonsContainer}>
                {item.reasons.map((reason, idx) => (
                  <View key={idx} style={styles.reasonTag}>
                    <MaterialIcons name="check-circle" size={10} color={colors.success} />
                    <Text style={styles.reasonText}>{reason}</Text>
                  </View>
                ))}
              </View>
            )}
          </InteractiveWrapper>
        ))}
      </ScrollView>
    </View>
  );
}

function extractStipendNumber(stipend) {
  if (!stipend) return 0;
  const match = stipend.match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, "")) : 0;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingRight: 20,
  },
  card: {
    width: 240,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.grayBorder,
    marginRight: 12,
    shadowColor: colors.accent,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardMobile: {
    width: 200,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  compareToggle: {
    position: "absolute",
    top: -4,
    left: -4,
    zIndex: 1,
  },
  matchBadge: {
    backgroundColor: colors.accent + "20",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: "auto",
  },
  matchText: {
    fontSize: 9,
    color: colors.accent,
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 4,
    marginTop: 4,
  },
  cardCompany: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  location: {
    fontSize: 11,
    color: colors.textLight,
  },
  type: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: "500",
  },
  stipend: {
    fontSize: 13,
    color: colors.success,
    fontWeight: "600",
    marginTop: 4,
  },
  reasonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 8,
  },
  reasonTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.success + "15",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  reasonText: {
    fontSize: 9,
    color: colors.success,
    fontWeight: "500",
  },
});

