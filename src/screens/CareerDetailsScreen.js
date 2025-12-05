import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";

export default function CareerDetailsScreen({ route, navigation }) {
  const { career, userSkills } = route.params;

  const matchedSkills = career.requiredSkills.filter((s) =>
    userSkills.map((x) => x.toLowerCase()).includes(s.toLowerCase())
  );

  const matchPercentage = Math.round((matchedSkills.length / career.requiredSkills.length) * 100);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with Back Navigation */}
      <View style={styles.headerBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Career Details</Text>
      </View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{career.title}</Text>
        <View style={styles.tagContainer}>
          {career.tags.map((tag, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.category}>{career.category}</Text>
      </View>

      {/* Match Score Card */}
      <View style={styles.matchCard}>
        <View style={styles.matchHeader}>
          <MaterialIcons name="psychology" size={24} color={colors.accent} />
          <Text style={styles.matchTitle}>Skill Match</Text>
        </View>
        <View style={styles.matchContent}>
          <Text style={styles.matchPercentage}>{matchPercentage}%</Text>
          <Text style={styles.matchSubtext}>{matchedSkills.length} of {career.requiredSkills.length} skills matched</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <MaterialIcons name="attach-money" size={20} color={colors.accent} />
          <Text style={styles.statLabel}>Salary Range</Text>
          <Text style={styles.statValue}>{career.salary}</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="trending-up" size={20} color={colors.success} />
          <Text style={styles.statLabel}>Growth</Text>
          <Text style={styles.statValue}>High Demand</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.body}>{career.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Matched Skills</Text>
        {matchedSkills.length > 0 ? (
          <View style={styles.skillsContainer}>
            {matchedSkills.map((skill, idx) => (
              <View key={idx} style={styles.skillChip}>
                <MaterialIcons name="check-circle" size={16} color={colors.success} />
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.bodyMuted}>
            No strong matches yet. Add more skills in your profile to improve recommendations.
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="work" size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Typical Roles & Responsibilities</Text>
        </View>
        {career.roles.map((r, idx) => (
          <View key={idx} style={styles.bulletContainer}>
            <MaterialIcons name="fiber-manual-record" size={8} color={colors.accent} style={styles.bulletIcon} />
            <Text style={styles.bullet}>{r}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="trending-up" size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Future Scope</Text>
        </View>
        <View style={styles.futureCard}>
          <Text style={styles.body}>{career.futureScope}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="school" size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Suggested Learning Path</Text>
        </View>
        {career.learningPath.map((step, idx) => (
          <View key={idx} style={styles.learningStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{idx + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },
  headerBar: {
    backgroundColor: "#2C3E3F",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.white,
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: colors.accent + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: "600",
  },
  category: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: "500",
  },
  matchCard: {
    backgroundColor: colors.accent + "10",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.accent + "30",
  },
  matchHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginLeft: 8,
  },
  matchContent: {
    alignItems: "center",
  },
  matchPercentage: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.accent,
  },
  matchSubtext: {
    fontSize: 12,
    color: colors.textLight,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.grayBorder,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    marginLeft: 8,
  },
  body: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 20,
  },
  bodyMuted: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.success + "15",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.success + "30",
  },
  skillText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: "500",
    marginLeft: 4,
  },
  bulletContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bulletIcon: {
    marginTop: 6,
    marginRight: 8,
  },
  bullet: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 20,
    flex: 1,
  },
  futureCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.grayBorder,
  },
  learningStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.white,
  },
  stepText: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 20,
    flex: 1,
  },
});
