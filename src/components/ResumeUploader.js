import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';
import colors from "../theme/colors";

export default function ResumeUploader({ resume, onUpload, disabled = false }) {
  const [uploading, setUploading] = useState(false);

  const pickDocument = async () => {
    if (disabled) return;
    
    try {
      setUploading(true);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        
        // Simulate AI processing of the actual document
        setTimeout(() => {
          const resumeData = {
            fileName: file.name,
            uri: file.uri,
            size: file.size,
            extractedData: {
              skills: ["JavaScript", "React", "Node.js", "Python"],
              experience: "2 years software development",
              education: "B.Tech Computer Science",
              projects: ["E-commerce Website", "Mobile App Development"]
            },
            uploadDate: new Date().toISOString()
          };
          
          onUpload(resumeData);
          setUploading(false);
          
          Alert.alert(
            "Resume Processed! 🎉",
            `Extracted:\n• ${resumeData.extractedData.skills.length} skills\n• Education: ${resumeData.extractedData.education}\n• Experience: ${resumeData.extractedData.experience}`
          );
        }, 2000);
      } else {
        setUploading(false);
      }
    } catch (error) {
      console.log('Document picker error:', error);
      setUploading(false);
      Alert.alert('Error', 'Failed to pick document');
    }
  };



  const removeResume = () => {
    if (disabled) return;
    onUpload(null);
  };

  return (
    <View style={styles.container}>
      {resume ? (
        <View style={styles.resumeContainer}>
          <View style={styles.resumeInfo}>
            <MaterialIcons name="description" size={24} color={colors.accent} />
            <View style={styles.resumeDetails}>
              <Text style={styles.fileName}>{resume.fileName}</Text>
              <Text style={styles.uploadDate}>
                Uploaded: {new Date(resume.uploadDate).toLocaleDateString()}
              </Text>
              {resume.extractedData && (
                <Text style={styles.extractedInfo}>
                  ✓ {resume.extractedData.skills.length} skills extracted
                </Text>
              )}
            </View>
          </View>
          
          {!disabled && (
            <View style={styles.resumeActions}>
              <TouchableOpacity style={styles.actionButton} onPress={pickDocument}>
                <MaterialIcons name="refresh" size={16} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={removeResume}>
                <MaterialIcons name="delete" size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <TouchableOpacity 
          style={[styles.uploadArea, disabled && styles.uploadAreaDisabled]} 
          onPress={pickDocument}
          disabled={disabled || uploading}
        >
          <MaterialIcons 
            name={uploading ? "hourglass-empty" : "cloud-upload"} 
            size={32} 
            color={disabled ? colors.textLight : colors.accent} 
          />
          <Text style={[styles.uploadText, disabled && styles.uploadTextDisabled]}>
            {uploading ? "Processing resume..." : "Upload Resume (PDF/DOC)"}
          </Text>
          {!disabled && (
            <Text style={styles.uploadSubtext}>
              We'll extract skills and experience automatically
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: colors.accent,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    backgroundColor: colors.accent + "10",
  },
  uploadAreaDisabled: {
    borderColor: colors.grayBorder,
    backgroundColor: colors.grayLight,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.accent,
    marginTop: 8,
    textAlign: "center",
  },
  uploadTextDisabled: {
    color: colors.textLight,
  },
  uploadSubtext: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    textAlign: "center",
  },
  resumeContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.grayBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resumeInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  resumeDetails: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  uploadDate: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  extractedInfo: {
    fontSize: 12,
    color: colors.success,
    marginTop: 2,
  },
  resumeActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    backgroundColor: colors.accent,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});