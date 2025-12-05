import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";

export default function InternshipDetailsScreen({ route, navigation }) {
  const { job } = route.params;

  const handleApply = () => {
    if (job.applyUrl) {
      Linking.openURL(job.applyUrl);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

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
        <Text style={styles.headerTitle}>Internship Details</Text>
      </View>

      <View style={styles.content}>
        {/* Main Info */}
        <View style={styles.mainInfo}>
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.company}>{job.company}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <MaterialIcons name="location-on" size={16} color={colors.textLight} />
              <Text style={styles.metaText}>{job.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialIcons name="schedule" size={16} color={colors.textLight} />
              <Text style={styles.metaText}>{job.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialIcons name="work" size={16} color={colors.textLight} />
              <Text style={styles.metaText}>{job.type}</Text>
            </View>
          </View>
        </View>

        {/* Stipend Card */}
        <View style={styles.stipendCard}>
          <MaterialIcons name="attach-money" size={20} color={colors.success} />
          <Text style={styles.stipendLabel}>Stipend</Text>
          <Text style={styles.stipendAmount}>{job.stipend}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this Internship</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Skills</Text>
          <View style={styles.skillsContainer}>
            {job.skills.map((skill, index) => {
              const isMatched = job.matchedSkills?.includes(skill);
              return (
                <View key={index} style={[
                  styles.skillChip,
                  isMatched && styles.skillChipMatched
                ]}>
                  {isMatched && (
                    <MaterialIcons name="check-circle" size={12} color={colors.success} />
                  )}
                  <Text style={[
                    styles.skillText,
                    isMatched && styles.skillTextMatched
                  ]}>{skill}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Posted Date */}
        <View style={styles.section}>
          <Text style={styles.postedDate}>Posted on {formatDate(job.postedDate)}</Text>
        </View>

        {/* Apply Button */}
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <MaterialIcons name="send" size={20} color={colors.white} />
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
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
  content: {
    paddingHorizontal: 20,
  },
  mainInfo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 4,
  },
  company: {
    fontSize: 18,
    color: colors.textLight,
    fontWeight: "500",
    marginBottom: 12,
  },
  metaContainer: {
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: colors.textLight,
  },
  stipendCard: {
    backgroundColor: colors.success + "15",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.success + "30",
  },
  stipendLabel: {
    fontSize: 14,
    color: colors.success,
    fontWeight: "500",
  },
  stipendAmount: {
    fontSize: 18,
    color: colors.success,
    fontWeight: "700",
    marginLeft: "auto",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillChip: {
    backgroundColor: colors.grayLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  skillChipMatched: {
    backgroundColor: colors.success + "20",
    borderWidth: 1,
    borderColor: colors.success + "40",
  },
  skillText: {
    fontSize: 12,
    color: colors.textDark,
    fontWeight: "500",
  },
  skillTextMatched: {
    color: colors.success,
    fontWeight: "600",
  },
  postedDate: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: "italic",
  },
  applyButton: {
    backgroundColor: colors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: colors.accentGlow,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  applyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
