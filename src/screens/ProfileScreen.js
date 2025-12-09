import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  Alert,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
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

export default function ProfileScreen({ navigation }) {
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
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <ScreenHeader title="Profile" subtitle="Manage your personal information and skills" />
      
      <View style={styles.profileContent}>
        {!isEditing && (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <MaterialIcons name="edit" size={20} color={colors.white} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
        
        <ScrollView style={styles.scrollContent}>
        {/* Image Picker Modal */}
        {showImagePicker && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Profile Picture</Text>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => {
                  setShowImagePicker(false);
                  openGallery();
                }}
              >
                <Text style={styles.modalButtonText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => {
                  setShowImagePicker(false);
                  setProfileImage('default');
                }}
              >
                <Text style={styles.modalButtonText}>Use Default Avatar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowImagePicker(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {/* Profile Picture Section */}
        <View style={styles.profileImageSection}>
         
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
                    <TouchableOpacity style={styles.imageActionButton} onPress={pickImage}>
                      <MaterialIcons name="edit" size={16} color={colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.imageActionButton} onPress={removeImage}>
                      <MaterialIcons name="delete" size={16} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.imagePlaceholder} 
                onPress={pickImage}
                activeOpacity={0.7}
              >
                <MaterialIcons name="person" size={40} color={colors.textLight} />
                {isEditing && <Text style={styles.uploadText}>Tap to upload</Text>}
              </TouchableOpacity>
            )}
          </View>
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

        <Text style={styles.label}>Full Name</Text>
        <InputField 
          value={fullName} 
          onChangeText={setFullName} 
          editable={isEditing}
          style={!isEditing && styles.disabledInput}
        />

        <Text style={styles.label}>Education</Text>
        <InputField
          value={education}
          onChangeText={setEducation}
          placeholder="E.g. B.Sc IT, Final Year"
          editable={isEditing}
          style={!isEditing && styles.disabledInput}
        />

        <SkillSelector 
          selectedSkills={skills} 
          onChange={setSkills} 
          disabled={!isEditing}
        />

        <Text style={styles.label}>Interests</Text>
        <InterestSelector 
          selectedInterests={interests} 
          onChange={setInterests} 
          disabled={!isEditing}
        />

        <Text style={styles.label}>Resume</Text>
        <ResumeUploader 
          resume={resume}
          onUpload={setResume}
          disabled={!isEditing}
        />
        


        {isEditing && (
          <View style={[styles.buttonContainer, isMobile && styles.buttonContainerMobile]}>
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
        )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  containerMobile: {
    paddingTop: 12,
  },
  profileContent: {
    flex: 1,
    padding: 20,
    position: "relative",
  },
  editButton: {
    position: "absolute",
    top: 0,
    right: 60,
    backgroundColor: colors.accent,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  scrollContent: {
    flex: 1,
    paddingTop: 50,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 6,
    marginTop: 10,
  },
  disabledInput: {
    backgroundColor: colors.grayLight,
    color: colors.textLight,
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
  profileImageSection: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: "flex-start",
  },
  imageWrapper: {
    position: "relative",
  },
  profileImagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.grayLight,
    borderWidth: 2,
    borderColor: colors.grayBorder,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    fontSize: 12,
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
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 300,
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
});
