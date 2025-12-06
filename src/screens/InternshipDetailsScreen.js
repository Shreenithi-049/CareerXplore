import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import FavoritesService from "../services/favoritesService";
import ApplicationTrackerService from "../services/applicationTrackerService";

export default function InternshipDetailsScreen({ route, navigation }) {
  const { job } = route.params;
  const [isFavorited, setIsFavorited] = useState(false);
  const [isTracked, setIsTracked] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
    checkTrackedStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    const favorited = await FavoritesService.isInternshipFavorited(job.id);
    setIsFavorited(favorited);
  };

  const checkTrackedStatus = async () => {
    const tracked = await ApplicationTrackerService.isInternshipTracked(job.id);
    setIsTracked(tracked);
  };

  const toggleFavorite = async () => {
    if (isFavorited) {
      const result = await FavoritesService.removeInternshipFromFavorites(job.id);
      if (result.success) {
        setIsFavorited(false);
        Alert.alert("Removed", "Internship removed from favorites");
      }
    } else {
      const result = await FavoritesService.addInternshipToFavorites(job);
      if (result.success) {
        setIsFavorited(true);
        Alert.alert("Saved", "Internship added to favorites");
      }
    }
  };

  const handleTrackApplication = async () => {
    if (isTracked) {
      Alert.alert("Already Tracked", "This application is already being tracked");
      return;
    }

    const result = await ApplicationTrackerService.addApplication(job, "saved");
    if (result.success) {
      setIsTracked(true);
      Alert.alert("Success", "Application added to tracker!");
    } else {
      Alert.alert("Error", result.message);
    }
  };

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
        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <MaterialIcons 
            name={isFavorited ? "favorite" : "favorite-border"} 
            size={24} 
            color={isFavorited ? "#D4AF37" : colors.white} 
          />
        </TouchableOpacity>
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

        {/* Track Application Button */}
        <TouchableOpacity 
          style={[styles.trackButton, isTracked && styles.trackButtonDisabled]} 
          onPress={handleTrackApplication}
          disabled={isTracked}
        >
          <MaterialIcons name={isTracked ? "check-circle" : "bookmark-add"} size={20} color={colors.white} />
          <Text style={styles.trackButtonText}>
            {isTracked ? "Already Tracked" : "Track Application"}
          </Text>
        </TouchableOpacity>

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
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: colors.white,
  },
  favoriteButton: {
    padding: 4,
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
  trackButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  trackButtonDisabled: {
    backgroundColor: "#6B7280",
    opacity: 0.7,
  },
  trackButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  applyButton: {
    backgroundColor: colors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
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
