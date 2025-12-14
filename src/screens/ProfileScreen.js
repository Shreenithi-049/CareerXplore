import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  Alert,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
  Linking,
  ActivityIndicator
} from "react-native";
import { WebView } from 'react-native-webview';
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import { useResponsive } from "../utils/useResponsive";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import colors from "../theme/colors";
import { auth, db } from "../services/firebaseConfig";
import { ref, onValue, update } from "firebase/database";
import InputField from "../components/InputField";
import Button from "../components/Button";
import SkillSelector from "../components/SkillSelector";
import InterestSelector from "../components/InterestSelector";
import ResumeUploader from "../components/ResumeUploader";

import ScreenHeader from "../components/ScreenHeader";
import XPProgressBar from "../components/XPProgressBar";
import { isProfileComplete } from "../utils/profileUtils";
import { forceProfileComplete } from "../utils/forceProfileComplete";
import { awardXP, BADGES } from "../services/gamificationService";
import InteractiveWrapper from "../components/InteractiveWrapper";
import { AIService } from "../services/aiService";

export default function ProfileScreen({ navigation, showHamburger, onToggleSidebar }) {
  const [fullName, setFullName] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [resume, setResume] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [showResumeViewer, setShowResumeViewer] = useState(false);
  const [resumeViewUri, setResumeViewUri] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const [xp, setXp] = useState(0);
  const [badges, setBadges] = useState([]);
  const { isMobile } = useResponsive();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = ref(db, "users/" + user.uid);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userData = {
          fullName: data.fullName || data.name || "",
          education: data.education || "",
          skills: Array.isArray(data.skills) ? data.skills : data.skills ? [data.skills] : [],
          interests: Array.isArray(data.interests) ? data.interests : data.interests ? [data.interests] : [],
          resume: data.resume || null,
          profileImage: data.profileImage || null
        };
        setXp(data.xp || 0);
        setBadges(data.badges || []);
        setFullName(userData.fullName);
        setEducation(userData.education);
        setSkills(userData.skills);
        setInterests(userData.interests);
        setResume(userData.resume);
        setProfileImage(userData.profileImage);
        setOriginalData(userData);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFullName(originalData.fullName);
    setEducation(originalData.education);
    setSkills(originalData.skills);
    setInterests(originalData.interests);
    setResume(originalData.resume);
    setProfileImage(originalData.profileImage);
    setIsEditing(false);
  };

  const pickImage = () => {
    console.log('pickImage called, isEditing:', isEditing);
    setShowImagePicker(true);
  };

  const openCamera = async () => {
    try {
      console.log('Opening camera...');
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log('Camera permission status:', status);

      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Setting image URI:', result.assets[0].uri);
        setProfileImage(result.assets[0].uri);
        Alert.alert('Success', 'Photo captured successfully!');
      }
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera: ' + error.message);
    }
  };

  const openGallery = async () => {
    try {
      console.log('Opening gallery...');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Gallery permission status:', status);

      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant gallery permissions to select photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Gallery result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Setting image URI:', result.assets[0].uri);
        setProfileImage(result.assets[0].uri);
        Alert.alert('Success', 'Image selected successfully!');
      }
    } catch (error) {
      console.log('Gallery error:', error);
      Alert.alert('Error', 'Failed to open gallery: ' + error.message);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
  };

  const resolveResumeUri = async () => {
    if (!resume) return null;
    const candidateUri = resume.storedUri || resume.uri || resume.fileUri || resume;

    try {
      // Remote URL - download for consistent access
      if (typeof candidateUri === "string" && candidateUri.startsWith("http")) {
        const downloadPath = FileSystem.documentDirectory + "resume-remote.pdf";
        await FileSystem.downloadAsync(candidateUri, downloadPath);
        return downloadPath;
      }

      // Android content URIs or temporary files
      if (Platform.OS !== "web" && typeof candidateUri === "string" && candidateUri.startsWith("content://")) {
        const dest = FileSystem.documentDirectory + "resume.pdf";
        await FileSystem.copyAsync({ from: candidateUri, to: dest });
        return dest;
      }

      // Already a file path we can read
      if (typeof candidateUri === "string") {
        return candidateUri;
      }
    } catch (error) {
      console.log("resume resolve error", error);
      Alert.alert("Error", "Could not prepare resume for viewing.");
    }

    return null;
  };

  const handleViewResume = async () => {
    if (!resume) return;

    // Resume Object or String handling
    const resumeUri = resume.uri || resume.storedUri || resume;
    const isPdf = (typeof resumeUri === 'string' && resumeUri.toLowerCase().endsWith('.pdf')) || (resume.mimeType === 'application/pdf');

    if (Platform.OS === 'web') {
      try {
        await Linking.openURL(resumeUri);
      } catch (error) {
        Alert.alert("Error", "Failed to open resume");
      }
    } else if (Platform.OS === 'android') {
      // ANDROID HANDLING
      if (typeof resumeUri === 'string' && resumeUri.startsWith('http') && isPdf) {
        // Remote PDF -> Use Google Docs Viewer in WebView
        setResumeViewUri(`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(resumeUri)}`);
        setShowResumeViewer(true);
      } else {
        // Local File or content URI -> Open externally
        try {
          let uriToOpen = resumeUri;

          // Android: Convert file:// to content:// to avoid FileUriExposedException
          if (typeof resumeUri === 'string' && resumeUri.startsWith('file://')) {
            try {
              uriToOpen = await FileSystem.getContentUriAsync(resumeUri);
            } catch (e) {
              console.log("Could not get content URI", e);
            }
          }

          const supported = await Linking.canOpenURL(uriToOpen);
          if (supported) {
            await Linking.openURL(uriToOpen);
          } else {
            // Fallback: try sharing or intent using the original or content URI
            Alert.alert("Open Externally", "Cannot preview this file internally. Open with external app?", [
              { text: "Cancel", style: "cancel" },
              { text: "Open", onPress: () => Linking.openURL(uriToOpen) }
            ]);
          }
        } catch (e) {
          Alert.alert("Error", "Could not open file.");
        }
      }
    } else {
      // iOS -> WebView handles PDF fine
      const prepared = await resolveResumeUri();
      if (prepared) {
        setResumeViewUri(prepared);
        setShowResumeViewer(true);
      }
    }
  };

  const handleAnalyzeResume = async () => {
    if (!resume) return;

    setAnalyzing(true);
    try {
      // Resume Object or String handling
      const resumeUri = resume.uri || resume.storedUri || resume;
      // Basic mime type check or default to pdf
      const mimeType = resume.mimeType || "application/pdf";

      let base64 = "";

      if (resume.base64Data) {
        base64 = resume.base64Data;
      } else if (Platform.OS === 'web') {
        // Web handling for remote or blob URIs
        try {
          const response = await fetch(resumeUri);
          const blob = await response.blob();
          base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (err) {
          console.error("Web fetch error:", err);
          throw new Error("Resume file is not accessible. Please re-upload your resume.");
        }
      } else if (typeof resumeUri === 'string' && (resumeUri.startsWith('http') || resumeUri.startsWith('https'))) {
        // Native Remote file - download to temp
        const downloadRes = await FileSystem.downloadAsync(
          resumeUri,
          FileSystem.documentDirectory + 'temp_resume.pdf'
        );
        base64 = await FileSystem.readAsStringAsync(downloadRes.uri, { encoding: FileSystem.EncodingType.Base64 });
      } else {
        // Native Local file
        base64 = await FileSystem.readAsStringAsync(resumeUri, { encoding: FileSystem.EncodingType.Base64 });
      }

      const result = await AIService.analyzeResume(base64, mimeType);
      if (result.success) {
        setAnalysisResult(result.analysis);
        setShowAnalysisModal(true);
        awardXP("ANALYZE_RESUME");
      } else {
        Alert.alert("Analysis Failed", result.error || "Could not analyze resume.");
      }
    } catch (e) {
      console.error("Analysis Error:", e);
      if (e.message.includes("not accessible")) {
        Alert.alert(
          "Resume Expired",
          "The link to your resume has expired (browser security). Please remove and re-upload it.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Remove Now",
              style: "destructive",
              onPress: () => {
                setResume(null);
                handleSave(); // Trigger save to clear it from DB
              }
            }
          ]
        );
      } else {
        Alert.alert("Error", e.message || "Failed to process resume file for analysis.");
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const triggerReRecommendations = () => {
    // Trigger a refresh of career recommendations and internships
    // by updating a timestamp that other screens can listen to
    const user = auth.currentUser;
    if (user) {
      update(ref(db, "users/" + user.uid), {
        profileUpdatedAt: new Date().toISOString(),
      }).catch(err => console.log('Error updating profile timestamp:', err));
    }
    console.log('Triggering re-recommendations with updated profile data');
  };



  const handleSave = () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "No logged in user.");
      return;
    }

    const profileData = { fullName, education, skills, interests };
    const profileCompleteStatus = isProfileComplete(profileData);

    // Award XP for profile updates
    const skillsAdded = skills.length - originalData.skills.length;
    const interestsAdded = interests.length - originalData.interests.length;
    const resumeUploaded = resume && !originalData.resume;

    if (skillsAdded > 0) awardXP("ADD_SKILL", skillsAdded * 10);
    if (interestsAdded > 0) awardXP("ADD_INTEREST", interestsAdded * 10);
    if (resumeUploaded) awardXP("UPLOAD_RESUME");
    if (profileCompleteStatus && !originalData.profileComplete) awardXP("PROFILE_COMPLETE");

    update(ref(db, "users/" + user.uid), {
      fullName,
      education,
      skills,
      interests,
      resume,
      profileImage,
      lastUpdated: new Date().toISOString(),
      profileComplete: profileCompleteStatus,
    })
      .then(() => {
        const message = profileCompleteStatus
          ? "Profile updated successfully! Career recommendations and internships will be refreshed."
          : "Profile updated successfully!";
        Alert.alert("Success", message);
        setIsEditing(false);
        if (profileCompleteStatus) {
          triggerReRecommendations();
          update(ref(db, "users/" + user.uid), {
            profileComplete: true
          }).catch(err => console.log('Error updating profileComplete flag:', err));
        }
      })
      .catch((err) => Alert.alert("Error", err.message));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, isMobile && styles.containerMobile]}>
        <ScreenHeader
          title="Profile"
          subtitle="Manage your personal information and skills"
          showHamburger={showHamburger}
          onToggleSidebar={onToggleSidebar}
          showLogo={true}
        />

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Picker Modal */}
          {showImagePicker && (
            <View style={styles.imagePickerOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Profile Picture</Text>
                <InteractiveWrapper
                  style={styles.modalButton}
                  onPress={() => {
                    setShowImagePicker(false);
                    openGallery();
                  }}
                >
                  <Text style={styles.modalButtonText}>Gallery</Text>
                </InteractiveWrapper>
                <InteractiveWrapper
                  style={styles.modalButton}
                  onPress={() => {
                    setShowImagePicker(false);
                    setProfileImage('default');
                  }}
                >
                  <Text style={styles.modalButtonText}>Use Default Avatar</Text>
                </InteractiveWrapper>
                <InteractiveWrapper
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowImagePicker(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </InteractiveWrapper>
              </View>
            </View>
          )}

          {/* Profile Header Section */}
          <View style={styles.profileHeader}>
            <View style={styles.imageContainer}>
              {profileImage ? (
                <View style={styles.imageWrapper}>
                  {profileImage === 'default' ? (
                    <Image source={require('../../assets/profile.png')} style={styles.profileImagePreview} />
                  ) : (
                    <Image source={{ uri: profileImage }} style={styles.profileImagePreview} />
                  )}
                  {isEditing && (
                    <View style={styles.imageActions}>
                      <InteractiveWrapper style={styles.imageActionButton} onPress={pickImage}>
                        <MaterialIcons name="edit" size={16} color={colors.white} />
                      </InteractiveWrapper>
                      <InteractiveWrapper style={styles.imageActionButton} onPress={removeImage}>
                        <MaterialIcons name="delete" size={16} color={colors.white} />
                      </InteractiveWrapper>
                    </View>
                  )}
                </View>
              ) : (
                <InteractiveWrapper
                  style={styles.imagePlaceholder}
                  onPress={pickImage}
                >
                  <MaterialIcons name="person" size={40} color={colors.textLight} />
                  {isEditing && <Text style={styles.uploadText}>Tap to upload</Text>}
                </InteractiveWrapper>
              )}
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{fullName || "Your Name"}</Text>
              <Text style={styles.profileEducation}>{education || "Add your education"}</Text>
            </View>

            <InteractiveWrapper style={styles.editButton} onPress={handleEdit}>
              <MaterialIcons name="edit" size={18} color={colors.accent} />
            </InteractiveWrapper>
          </View>

          {/* Skills & Interests Summary */}
          <View style={styles.summarySection}>
            {skills.length > 0 && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryTitle}>Skills</Text>
                {skills.map((skill, index) => (
                  <Text key={index} style={styles.bulletPoint}>• {skill}</Text>
                ))}
              </View>
            )}

            {interests.length > 0 && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryTitle}>Interests</Text>
                {interests.map((interest, index) => (
                  <Text key={index} style={styles.bulletPoint}>• {interest}</Text>
                ))}
              </View>
            )}
          </View>

          {/* Resume Preview */}
          {resume && (
            <View style={styles.resumeSection}>
              <Text style={styles.summaryTitle}>Resume</Text>
              <InteractiveWrapper style={styles.resumePreview} onPress={handleViewResume}>
                <MaterialIcons name="description" size={24} color={colors.accent} />
                <Text style={styles.resumeText}>View Resume</Text>
                <MaterialIcons name="open-in-new" size={16} color={colors.textLight} />
              </InteractiveWrapper>
            </View>
          )}

          {/* Resume Section (View Mode) */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Resume</Text>
          </View>
          <View style={styles.resumeCard}>
            {resume ? (
              <View>
                <View style={styles.resumeRow}>
                  <MaterialIcons name="description" size={24} color={colors.accent} />
                  <Text style={styles.resumeName}>
                    {resume.fileName || "Uploaded Resume"}
                  </Text>
                </View>
                <View style={styles.resumeActions}>
                  <TouchableOpacity style={styles.viewButton} onPress={handleViewResume}>
                    <MaterialIcons name="visibility" size={16} color={colors.primary} />
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.analyzeButton}
                    onPress={handleAnalyzeResume}
                    disabled={analyzing}
                  >
                    {analyzing ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <MaterialIcons name="auto-awesome" size={16} color={colors.white} />
                    )}
                    <Text style={styles.analyzeButtonText}>
                      {analyzing ? "Analyzing..." : "Analyze Quality"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.noResume}>
                <Text style={styles.noResumeText}>No resume uploaded yet.</Text>
                <Button title="Upload in Edit Mode" onPress={handleEdit} style={styles.smallButton} />
              </View>
            )}
          </View>

          <XPProgressBar currentXP={xp} nextLevel={300} />

          {badges.length > 0 && (
            <View style={styles.badgesSection}>
              <Text style={styles.label}>Badges Earned</Text>
              <View style={styles.badgesGrid}>
                {badges.map(badgeId => {
                  const badge = BADGES.find(b => b.id === badgeId);
                  return badge ? (
                    <View key={badgeId} style={styles.badge}>
                      <Text style={styles.badgeIcon}>{badge.icon}</Text>
                      <Text style={styles.badgeName}>{badge.name}</Text>
                    </View>
                  ) : null;
                })}
              </View>
            </View>
          )}

          {/* Edit Profile Modal */}
          {isEditing && (
            <View style={styles.modalOverlay}>
              <View style={styles.editModalContent}>
                <View style={styles.editModalHeader}>
                  <Text style={styles.editModalTitle}>Edit Profile</Text>
                  <InteractiveWrapper onPress={handleCancel} style={styles.iconClose}>
                    <MaterialIcons name="close" size={24} color={colors.textLight} />
                  </InteractiveWrapper>
                </View>

                <ScrollView style={styles.editModalScroll}>
                  {/* Profile Picture Upload */}
                  <Text style={styles.label}>Profile Picture</Text>
                  <View style={styles.profileImageSection}>
                    <View style={styles.imageContainer}>
                      {profileImage ? (
                        <View style={styles.imageWrapper}>
                          {profileImage === 'default' ? (
                            <Image source={require('../../assets/profile.png')} style={styles.editProfileImage} />
                          ) : (
                            <Image source={{ uri: profileImage }} style={styles.editProfileImage} />
                          )}
                          <View style={styles.imageActions}>
                            <InteractiveWrapper style={styles.imageActionButton} onPress={pickImage}>
                              <MaterialIcons name="edit" size={16} color={colors.white} />
                            </InteractiveWrapper>
                            <InteractiveWrapper style={styles.imageActionButton} onPress={removeImage}>
                              <MaterialIcons name="delete" size={16} color={colors.white} />
                            </InteractiveWrapper>
                          </View>
                        </View>
                      ) : (
                        <InteractiveWrapper
                          style={styles.editImagePlaceholder}
                          onPress={pickImage}
                        >
                          <MaterialIcons name="person" size={40} color={colors.textLight} />
                          <Text style={styles.uploadText}>Tap to upload</Text>
                        </InteractiveWrapper>
                      )}
                    </View>
                  </View>

                  <Text style={styles.label}>Full Name</Text>
                  <InputField
                    value={fullName}
                    onChangeText={setFullName}
                  />

                  <Text style={styles.label}>Education</Text>
                  <InputField
                    value={education}
                    onChangeText={setEducation}
                    placeholder="E.g. B.Sc IT, Final Year"
                  />

                  <SkillSelector
                    selectedSkills={skills}
                    onChange={setSkills}
                  />

                  <Text style={styles.label}>Interests</Text>
                  <InterestSelector
                    selectedInterests={interests}
                    onChange={setInterests}
                  />

                  <Text style={styles.label}>Resume</Text>
                  <ResumeUploader
                    resume={resume}
                    onUpload={setResume}
                  />
                </ScrollView>

                <View style={styles.editModalButtons}>
                  <Button
                    title="Cancel"
                    onPress={handleCancel}
                    style={styles.cancelButton}
                    textStyle={styles.cancelButtonText}
                  />
                  <Button
                    title="Save Changes"
                    onPress={handleSave}
                    style={styles.saveButton}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Resume Viewer Modal - Only for mobile platforms */}
          {Platform.OS !== 'web' && (
            <Modal
              visible={showResumeViewer}
              animationType="slide"
              onRequestClose={() => setShowResumeViewer(false)}
            >
              <View style={styles.resumeViewerContainer}>
                <View style={styles.resumeViewerHeader}>
                  <Text style={styles.resumeViewerTitle}>Resume</Text>
                  <InteractiveWrapper onPress={() => setShowResumeViewer(false)} style={styles.iconClose}>
                    <MaterialIcons name="close" size={24} color={colors.textLight} />
                  </InteractiveWrapper>
                </View>
                <WebView
                  source={{ uri: resumeViewUri || resume?.uri || resume }}
                  style={styles.resumeWebView}
                  startInLoadingState={true}
                  allowFileAccess
                  allowUniversalAccessFromFileURLs
                  originWhitelist={['*']}
                />
              </View>
            </Modal>
          )}

          {/* AI Analysis Modal */}
          <Modal
            visible={showAnalysisModal}
            animationType="slide"
            transparent
            onRequestClose={() => setShowAnalysisModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.analysisModalContent}>
                <View style={styles.analysisHeader}>
                  <MaterialIcons name="auto-awesome" size={24} color={colors.accent} />
                  <Text style={styles.analysisTitle}>Resume Analysis</Text>
                  <TouchableOpacity onPress={() => setShowAnalysisModal(false)}>
                    <MaterialIcons name="close" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.analysisBody}>
                  {analysisResult && (
                    <>
                      <View style={styles.scoreContainer}>
                        <View style={[styles.scoreCircle, { borderColor: analysisResult.score > 70 ? colors.success : colors.warning }]}>
                          <Text style={styles.scoreText}>{analysisResult.score}</Text>
                          <Text style={styles.scoreLabel}>/ 100</Text>
                        </View>
                        <Text style={styles.scoreSummary}>{analysisResult.summary}</Text>
                      </View>

                      <View style={styles.analysisSection}>
                        <Text style={styles.analysisHeading}>✨ Strengths</Text>
                        {analysisResult.strengths?.map((s, i) => (
                          <Text key={i} style={styles.bulletItem}>• {s}</Text>
                        ))}
                      </View>

                      <View style={styles.analysisSection}>
                        <Text style={styles.analysisHeading}>⚠️ Improvements</Text>
                        {analysisResult.weaknesses?.map((w, i) => (
                          <Text key={i} style={styles.bulletItem}>• {w}</Text>
                        ))}
                      </View>

                      <View style={styles.analysisSection}>
                        <Text style={styles.analysisHeading}>💡 Suggestions</Text>
                        {analysisResult.suggestions?.map((s, i) => (
                          <Text key={i} style={styles.suggestionItem}>➜ {s}</Text>
                        ))}
                      </View>
                    </>
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 20,
    position: "relative",
  },
  containerMobile: {
    padding: 12,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 44,
    minHeight: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 6,
    marginTop: 10,
  },
  editModalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    margin: 20,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBorder,
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  sectionHeader: {
    marginBottom: 10,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
  },
  resumeCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.grayBorder,
    marginBottom: 20,
  },
  resumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  resumeName: {
    fontSize: 14,
    color: colors.textDark,
    flex: 1,
  },
  resumeActions: {
    flexDirection: 'row',
    gap: 10,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.primary + "10",
  },
  viewButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    flex: 1,
    justifyContent: 'center',
  },
  analyzeButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  analysisModalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBorder,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
    marginLeft: 10,
  },
  analysisBody: {
    padding: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  scoreLabel: {
    fontSize: 10,
    color: colors.textLight,
  },
  scoreSummary: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.textDark,
    fontStyle: 'italic',
  },
  analysisSection: {
    marginBottom: 20,
  },
  analysisHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  bulletItem: {
    fontSize: 13,
    color: colors.textDark,
    marginBottom: 4,
    paddingLeft: 4,
  },
  suggestionItem: {
    fontSize: 13,
    color: colors.accent,
    marginBottom: 6,
    paddingLeft: 4,
    fontWeight: '500',
  },
  noResume: {
    alignItems: 'center',
    padding: 10,
  },
  noResumeText: {
    marginBottom: 10,
    color: colors.textLight,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 120,
  },
  iconClose: {
    padding: 6,
    borderRadius: 10,
  },
  editModalScroll: {
    flex: 1,
    padding: 20,
  },
  editModalButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.grayBorder,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: 12,
    marginTop: 20,
  },
  buttonContainerMobile: {
    flexDirection: "column",
    gap: 10,
  },
  cancelButton: {
    backgroundColor: colors.grayLight,
    flex: 1,
    marginTop: 0,
  },
  saveButton: {
    flex: 1,
    marginTop: 0,
  },
  cancelButtonText: {
    color: colors.textDark,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 16,
  },
  imageContainer: {
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },
  profileEducation: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: "500",
  },
  summarySection: {
    marginBottom: 20,
    gap: 12,
  },
  summaryItem: {
    gap: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 6,
  },
  bulletPoint: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
    lineHeight: 20,
  },
  resumeSection: {
    marginBottom: 20,
  },
  resumePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.grayBorder,
    gap: 12,
  },
  resumeText: {
    flex: 1,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  editProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  editImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.grayLight,
    borderWidth: 2,
    borderColor: colors.grayBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    position: "relative",
  },
  profileImagePreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  imageActions: {
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
    gap: 8,
  },
  imageActionButton: {
    backgroundColor: colors.accent,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.grayLight,
    borderWidth: 2,
    borderColor: colors.grayBorder,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 4,
    textAlign: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  imagePickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 600,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: colors.accent,
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  modalButtonText: {
    color: colors.white,
    fontWeight: "600",
  },
  badgesSection: {
    marginVertical: 16,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
    justifyContent: "flex-start",
  },
  badge: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.grayBorder,
    minWidth: 90,
    minHeight: 90,
    justifyContent: "center",
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  badgeName: {
    fontSize: 10,
    color: colors.textLight,
    textAlign: "center",
  },
  resumeViewerContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  resumeViewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBorder,
  },
  resumeViewerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  resumeWebView: {
    flex: 1,
  },
});
