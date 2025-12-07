import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import { AIService } from "../services/aiService";
import { auth, db } from "../services/firebaseConfig";
import { ref, onValue } from "firebase/database";

export default function CareerRoadmapScreen({ route, navigation }) {
  const { career, userSkills } = route.params;
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile) {
      generateRoadmap();
    }
  }, [userProfile]);

  const loadUserProfile = () => {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = ref(db, "users/" + user.uid);
    onValue(userRef, (snapshot) => setUserProfile(snapshot.val()));
  };

  const generateRoadmap = async () => {
    setLoading(true);
    const result = await AIService.generateCareerRoadmap(userProfile, career, userSkills);
    if (result.success) {
      setRoadmap(result.roadmap);
    }
    setLoading(false);
  };

  const openLink = () => {
    Linking.openURL("https://example.com");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Generating your personalized roadmap...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Career Roadmap</Text>
      </View>

      <View style={styles.careerHeader}>
        <MaterialIcons name="explore" size={32} color={colors.accent} />
        <Text style={styles.careerTitle}>{career.title}</Text>
      </View>

      {roadmap?.skillGaps?.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="local-fire-department" size={24} color="#E15B64" />
            <Text style={styles.sectionTitle}>Skill Gaps 🔥</Text>
          </View>
          {roadmap.skillGaps.map((skill, idx) => (
            <View key={idx} style={styles.gapItem}>
              <MaterialIcons name="warning" size={18} color="#E15B64" />
              <Text style={styles.gapText}>{skill}</Text>
            </View>
          ))}
        </View>
      )}

      {roadmap?.learningPath && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="timeline" size={24} color={colors.accent} />
            <Text style={styles.sectionTitle}>Learning Path</Text>
          </View>
          {["Beginner", "Intermediate", "Advanced"].map((level, idx) => {
            const steps = roadmap.learningPath[level.toLowerCase()];
            return steps?.length > 0 ? (
              <View key={idx} style={styles.levelContainer}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>{level}</Text>
                </View>
                {steps.map((step, i) => (
                  <View key={i} style={styles.stepItem}>
                    <View style={styles.stepDot} />
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            ) : null;
          })}
        </View>
      )}

      {roadmap?.resources?.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="school" size={24} color="#2196F3" />
            <Text style={styles.sectionTitle}>Free Learning Resources</Text>
          </View>
          {roadmap.resources.map((resource, idx) => (
            <TouchableOpacity key={idx} style={styles.resourceCard} onPress={openLink}>
              <View style={styles.resourceIcon}>
                <MaterialIcons name="play-circle-filled" size={20} color="#2196F3" />
              </View>
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceProvider}>{resource.provider}</Text>
              </View>
              <MaterialIcons name="open-in-new" size={20} color={colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {roadmap?.timeEstimate && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="schedule" size={24} color="#9C27B0" />
            <Text style={styles.sectionTitle}>Time to Career Readiness</Text>
          </View>
          <View style={styles.timeCard}>
            <Text style={styles.timeValue}>{roadmap.timeEstimate.total}</Text>
            <Text style={styles.timeLabel}>Estimated Duration</Text>
            <View style={styles.timeBreakdown}>
              <View style={styles.timeItem}>
                <Text style={styles.timeItemLabel}>Beginner</Text>
                <Text style={styles.timeItemValue}>{roadmap.timeEstimate.beginner}</Text>
              </View>
              <View style={styles.timeItem}>
                <Text style={styles.timeItemLabel}>Intermediate</Text>
                <Text style={styles.timeItemValue}>{roadmap.timeEstimate.intermediate}</Text>
              </View>
              <View style={styles.timeItem}>
                <Text style={styles.timeItemLabel}>Advanced</Text>
                <Text style={styles.timeItemValue}>{roadmap.timeEstimate.advanced}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {roadmap?.salaryGrowth?.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="trending-up" size={24} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Salary Growth Chart</Text>
          </View>
          {roadmap.salaryGrowth.map((item, idx) => (
            <View key={idx} style={styles.salaryRow}>
              <View style={styles.salaryLevel}>
                <Text style={styles.salaryLevelText}>{item.level}</Text>
                <Text style={styles.salaryYears}>{item.years}</Text>
              </View>
              <View style={styles.salaryBar}>
                <View style={[styles.salaryFill, { width: `${(idx + 1) * 25}%` }]} />
              </View>
              <Text style={styles.salaryAmount}>{item.salary}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  loadingText: { marginTop: 16, fontSize: 14, color: colors.textLight },
  header: { flexDirection: "row", alignItems: "center", padding: 20, backgroundColor: colors.white },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: colors.primary },
  careerHeader: { alignItems: "center", padding: 24, backgroundColor: colors.white, marginBottom: 16 },
  careerTitle: { fontSize: 22, fontWeight: "800", color: colors.primary, marginTop: 8, textAlign: "center" },
  section: { backgroundColor: colors.white, marginBottom: 16, padding: 20 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.primary, marginLeft: 8 },
  gapItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF3F3", padding: 12, borderRadius: 8, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: "#E15B64" },
  gapText: { fontSize: 14, color: colors.textDark, marginLeft: 8, flex: 1 },
  levelContainer: { marginBottom: 20 },
  levelBadge: { backgroundColor: colors.accent, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, alignSelf: "flex-start", marginBottom: 12 },
  levelText: { fontSize: 12, fontWeight: "700", color: colors.white },
  stepItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10, paddingLeft: 8 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginTop: 6, marginRight: 12 },
  stepText: { fontSize: 14, color: colors.textDark, flex: 1, lineHeight: 20 },
  resourceCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.grayLight, padding: 14, borderRadius: 10, marginBottom: 10 },
  resourceIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#E3F2FD", alignItems: "center", justifyContent: "center", marginRight: 12 },
  resourceContent: { flex: 1 },
  resourceTitle: { fontSize: 14, fontWeight: "600", color: colors.textDark },
  resourceProvider: { fontSize: 12, color: colors.textLight, marginTop: 2 },
  timeCard: { backgroundColor: colors.grayLight, padding: 20, borderRadius: 12, alignItems: "center" },
  timeValue: { fontSize: 36, fontWeight: "800", color: colors.accent },
  timeLabel: { fontSize: 14, color: colors.textLight, marginTop: 4 },
  timeBreakdown: { flexDirection: "row", marginTop: 20, gap: 16 },
  timeItem: { alignItems: "center" },
  timeItemLabel: { fontSize: 11, color: colors.textLight, marginBottom: 4 },
  timeItemValue: { fontSize: 16, fontWeight: "700", color: colors.primary },
  salaryRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  salaryLevel: { width: 100 },
  salaryLevelText: { fontSize: 13, fontWeight: "600", color: colors.textDark },
  salaryYears: { fontSize: 11, color: colors.textLight },
  salaryBar: { flex: 1, height: 24, backgroundColor: colors.grayLight, borderRadius: 12, marginHorizontal: 12, overflow: "hidden" },
  salaryFill: { height: "100%", backgroundColor: "#4CAF50", borderRadius: 12 },
  salaryAmount: { fontSize: 13, fontWeight: "700", color: colors.primary, width: 80, textAlign: "right" },
});
