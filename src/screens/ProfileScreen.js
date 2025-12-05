import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  Alert,
  View,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import { auth, db } from "../services/firebaseConfig";
import { ref, onValue, update } from "firebase/database";
import InputField from "../components/InputField";
import Button from "../components/Button";
import SkillSelector from "../components/SkillSelector";
import ScreenHeader from "../components/ScreenHeader";

export default function ProfileScreen() {
  const [fullName, setFullName] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = ref(db, "users/" + user.uid);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userData = {
          fullName: data.fullName || "",
          education: data.education || "",
          skills: Array.isArray(data.skills) ? data.skills : data.skills ? [data.skills] : []
        };
        setFullName(userData.fullName);
        setEducation(userData.education);
        setSkills(userData.skills);
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
    setIsEditing(false);
  };

  const handleSave = () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "No logged in user.");
      return;
    }

    update(ref(db, "users/" + user.uid), {
      fullName,
      education,
      skills,
    })
      .then(() => {
        Alert.alert("Success", "Profile updated successfully");
        setIsEditing(false);
      })
      .catch((err) => Alert.alert("Error", err.message));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <ScreenHeader title="Profile" subtitle="Manage your personal information and skills" />
        {!isEditing && (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <MaterialIcons name="edit" size={20} color={colors.white} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.profileContent}>
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

        {isEditing && (
          <View style={styles.buttonContainer}>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  headerContainer: {
    position: "relative",
  },
  editButton: {
    position: "absolute",
    top: 16,
    right: 20,
    backgroundColor: colors.accent,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  profileContent: {
    padding: 20,
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
});
