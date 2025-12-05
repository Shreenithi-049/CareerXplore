import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import colors from "../theme/colors";
import { auth, db } from "../services/firebaseConfig";
import { ref, update } from "firebase/database";
import InputField from "../components/InputField";
import Button from "../components/Button";
import SkillSelector from "../components/SkillSelector";

export default function ProfileSetupScreen({ navigation }) {
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState([]);

  const handleSave = () => {
    if (!education || skills.length === 0) {
      Alert.alert("Missing info", "Please enter education & select skills.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "No user logged in.");
      return;
    }

    update(ref(db, "users/" + user.uid), {
      education,
      skills,
    })
      .then(() => {
        Alert.alert("Profile Saved", "Your profile has been set up.", [
          {
            text: "Continue",
            onPress: () => navigation.replace("Dashboard"),
          },
        ]);
      })
      .catch((err) => {
        Alert.alert("Error", err.message);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>
      <Text style={styles.subtitle}>
        Tell us about your education and skills. We’ll use this to recommend
        careers and internships.
      </Text>

      <Text style={styles.label}>Education</Text>
      <InputField
        placeholder="E.g. B.Tech CSE, 3rd Year"
        value={education}
        onChangeText={setEducation}
      />

      <SkillSelector selectedSkills={skills} onChange={setSkills} />

      <View style={{ marginTop: 20 }}>
        <Button title="Save & Continue" onPress={handleSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 6,
    marginTop: 10,
  },
});
