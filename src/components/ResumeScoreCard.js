import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import { AIService } from "../services/aiService";

export default function ResumeScoreCard({ resume, userProfile }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {
    if (!resume) {
      Alert.alert("No Resume", "Please upload your resume first to analyze.");
      return;
    }
    
    setLoading(true);
    console.log('Starting real resume extraction and analysis...');
    
    try {
      let dataToAnalyze = resume.extractedData;
      
      // Always try to extract from the actual file
      if (!dataToAnalyze || !dataToAnalyze.name) {
        console.log('Extracting from resume file:', resume.fileName);
        const extractResult = await AIService.extractResumeData(resume.uri);
        
        if (extractResult.success && extractResult.data) {
          dataToAnalyze = extractResult.data;
          console.log('Real extraction successful:', dataToAnalyze);
        } else {
          console.error('Extraction failed:', extractResult.error);
          Alert.alert(
            "Extraction Failed", 
            "Unable to read your resume content. Please ensure it's a clear, readable PDF or DOC file with text (not just images)."
          );
          return;
        }
      }
      
      // Verify we have actual resume data
      if (!dataToAnalyze.name && !dataToAnalyze.email && !dataToAnalyze.projects) {
        Alert.alert(
          "No Content Found", 
          "Could not extract meaningful content from your resume. Please upload a text-based resume file."
        );
        return;
      }
      
      console.log('Analyzing extracted resume data:', dataToAnalyze);
      const result = await AIService.analyzeResume(dataToAnalyze);
      
      if (result.success) {
        setAnalysis(result.analysis);
        console.log('Analysis completed with real data:', result.analysis);
      } else {
        Alert.alert("Analysis Failed", result.error || "Unable to analyze resume content.");
      }
    } catch (error) {
      console.error("Resume analysis error:", error);
      Alert.alert(
        "Analysis Error", 
        "Failed to process your resume. Please try uploading a different file format or check your internet connection."
      );
    } finally {
      setLoading(false);
    }
  };

  console.log("ResumeScoreCard render - resume:", resume, "analysis:", analysis);
  
  if (!resume) {
    console.log("No resume found, not rendering");
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  return (
    <View style={styles.aiSection}>
      <View style={styles.aiHeader}>
        <MaterialIcons name="auto-awesome" size={24} color="#9333EA" />
        <Text style={styles.aiTitle}>🚀 AI Resume Analyzer</Text>
      </View>
      
      {!analysis ? (
        <TouchableOpacity 
          style={styles.generateButton} 
          onPress={analyzeResume}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator color={colors.white} />
              <Text style={styles.generateButtonText}>Reading Resume...</Text>
            </>
          ) : (
            <>
              <MaterialIcons name="psychology" size={20} color={colors.white} />
              <Text style={styles.generateButtonText}>Analyze Real Resume</Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <View>
          <View style={styles.insightCard}>
            <Text style={styles.insightLabel}>🎯 ATS Compatibility Score</Text>
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreText, { color: getScoreColor(analysis.score) }]}>
                {analysis.score}/100
              </Text>
              <Text style={styles.scoreDescription}>
                {analysis.score >= 85 
                  ? "Excellent! ATS-ready and recruiter-friendly."
                  : analysis.score >= 70 
                  ? "Good foundation. Few tweaks for better visibility."
                  : "Needs optimization for ATS systems."}
              </Text>
            </View>
          </View>

          {analysis.missing.length > 0 && (
            <View style={styles.insightCard}>
              <Text style={styles.insightLabel}>🚨 Priority Improvements</Text>
              {analysis.missing.slice(0, 4).map((item, index) => (
                <View key={index} style={styles.insightItem}>
                  <MaterialIcons name="fiber-manual-record" size={8} color="#9333EA" />
                  <Text style={styles.insightItemText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {analysis.suggestions.length > 0 && (
            <View style={styles.insightCard}>
              <Text style={styles.insightLabel}>✨ Actionable Suggestions</Text>
              {analysis.suggestions.slice(0, 4).map((item, index) => (
                <View key={index} style={styles.insightItem}>
                  <MaterialIcons name="fiber-manual-record" size={8} color="#9333EA" />
                  <Text style={styles.insightItemText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity 
            style={styles.regenerateButton} 
            onPress={analyzeResume}
          >
            <MaterialIcons name="refresh" size={18} color="#9333EA" />
            <Text style={styles.regenerateButtonText}>Get New Tips</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  aiSection: {
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#F5F3FF",
    borderRadius: 12,
    marginHorizontal: 0,
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
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "800",
  },
  scoreDescription: {
    fontSize: 13,
    color: colors.textDark,
    lineHeight: 19,
    flex: 1,
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