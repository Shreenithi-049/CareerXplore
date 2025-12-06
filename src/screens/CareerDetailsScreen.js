import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import FavoritesService from "../services/favoritesService";
import { AIService } from "../services/aiService";
import { auth, db } from "../services/firebaseConfig";
import { ref, onValue } from "firebase/database";

export default function CareerDetailsScreen({ route, navigation }) {
  const { career, userSkills } = route.params;
  const [isFavorited, setIsFavorited] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const matchedSkills = career.requiredSkills.filter((s) =>
    userSkills.map((x) => x.toLowerCase()).includes(s.toLowerCase())
  );

  const matchPercentage = Math.round((matchedSkills.length / career.requiredSkills.length) * 100);

  useEffect(() => {
    checkFavoriteStatus();
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = ref(db, "users/" + user.uid);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      setUserProfile(data);
    });
  };

  const generateAIInsights = async () => {
    console.log("Generate button clicked");
    console.log("User Profile:", userProfile);
    
    if (!userProfile) {
      Alert.alert("Error", "Please complete your profile first");
      return;
    }

    console.log("Starting AI generation...");
    setLoadingAI(true);
    
    try {
      const result = await AIService.generateCareerInsights(userProfile, career);
      console.log("AI Result:", result);
      setLoadingAI(false);

      if (result.success) {
        console.log("Setting insights:", result.insights);
        setAiInsights(result.insights);
      } else {
        console.error("AI Error:", result.error);
        Alert.alert("Error", `Failed to generate AI insights: ${result.error}`);
      }
    } catch (error) {
      console.error("Catch Error:", error);
      setLoadingAI(false);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const checkFavoriteStatus = async () => {
    const favorited = await FavoritesService.isCareerFavorited(career.id);
    setIsFavorited(favorited);
  };

  const toggleFavorite = async () => {
    if (isFavorited) {
      const result = await FavoritesService.removeCareerFromFavorites(career.id);
      if (result.success) {
        setIsFavorited(false);
        Alert.alert("Removed", "Career removed from favorites");
      }
    } else {
      const result = await FavoritesService.addCareerToFavorites(career);
      if (result.success) {
        setIsFavorited(true);
        Alert.alert("Saved", "Career added to favorites");
      }
    }
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
        <Text style={styles.headerTitle}>Career Details</Text>
        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <MaterialIcons 
            name={isFavorited ? "favorite" : "favorite-border"} 
            size={24} 
            color={isFavorited ? "#D4AF37" : colors.white} 
          />
        </TouchableOpacity>
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

      {/* AI-Powered Insights Section */}
      <View style={styles.aiSection}>
        <View style={styles.aiHeader}>
          <MaterialIcons name="auto-awesome" size={24} color="#9333EA" />
          <Text style={styles.aiTitle}>AI-Powered Career Insights</Text>
        </View>
        
        {!aiInsights ? (
          <TouchableOpacity 
            style={styles.generateButton} 
            onPress={generateAIInsights}
            disabled={loadingAI}
          >
            {loadingAI ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <MaterialIcons name="psychology" size={20} color={colors.white} />
                <Text style={styles.generateButtonText}>Generate Personalized Insights</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <View>
            <View style={styles.insightCard}>
              <Text style={styles.insightLabel}>🎯 Why This is Recommended</Text>
              <Text style={styles.insightText}>{aiInsights.whyRecommended}</Text>
            </View>

            {aiInsights.skillGaps.length > 0 && (
              <View style={styles.insightCard}>
                <Text style={styles.insightLabel}>📚 Skills to Learn</Text>
                {aiInsights.skillGaps.map((skill, idx) => (
                  <View key={idx} style={styles.insightItem}>
                    <MaterialIcons name="fiber-manual-record" size={8} color="#9333EA" />
                    <Text style={styles.insightItemText}>{skill}</Text>
                  </View>
                ))}
              </View>
            )}

            {aiInsights.recommendations.length > 0 && (
              <View style={styles.insightCard}>
                <Text style={styles.insightLabel}>🎓 Recommended Courses</Text>
                {aiInsights.recommendations.map((rec, idx) => (
                  <View key={idx} style={styles.insightItem}>
                    <MaterialIcons name="fiber-manual-record" size={8} color="#9333EA" />
                    <Text style={styles.insightItemText}>{rec}</Text>
                  </View>
                ))}
              </View>
            )}

            {aiInsights.futureScope && (
              <View style={styles.insightCard}>
                <Text style={styles.insightLabel}>🚀 Future Outlook</Text>
                <Text style={styles.insightText}>{aiInsights.futureScope}</Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.regenerateButton} 
              onPress={generateAIInsights}
            >
              <MaterialIcons name="refresh" size={18} color="#9333EA" />
              <Text style={styles.regenerateButtonText}>Regenerate Insights</Text>
            </TouchableOpacity>
          </View>
        )}
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
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: colors.white,
  },
  favoriteButton: {
    padding: 4,
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
  aiSection: {
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#F5F3FF",
    borderRadius: 12,
    marginHorizontal: 20,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#9333EA",
    marginLeft: 8,
  },
  generateButton: {
    backgroundColor: "#9333EA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  generateButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  insightCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  insightLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9333EA",
    marginBottom: 8,
  },
  insightText: {
    fontSize: 13,
    color: colors.textDark,
    lineHeight: 19,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingLeft: 4,
  },
  insightItemText: {
    fontSize: 13,
    color: colors.textDark,
    marginLeft: 8,
    flex: 1,
  },
  regenerateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#9333EA",
    backgroundColor: colors.white,
    gap: 6,
  },
  regenerateButtonText: {
    color: "#9333EA",
    fontSize: 14,
    fontWeight: "600",
  },
});
