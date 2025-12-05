import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { auth, db } from "../services/firebaseConfig";
import { ref, onValue } from "firebase/database";
import colors from "../theme/colors";
import { isProfileComplete } from "../utils/profileUtils";

export default function ProfileNotification({ onNavigateToProfile }) {
  const [showNotification, setShowNotification] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = ref(db, "users/" + user.uid);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      setProfileData(data);
      
      // Force hide notification if basic profile data exists
      const hasBasicData = data?.fullName && data?.education && 
        ((Array.isArray(data?.skills) && data.skills.length > 0) || data?.skills) &&
        ((Array.isArray(data?.interests) && data.interests.length > 0) || data?.interests);
      
      setShowNotification(!hasBasicData);
    });

    return () => unsubscribe();
  }, []);

  // Force hide notification
  return null;
}

const styles = StyleSheet.create({
  notification: {
    backgroundColor: colors.accent + "15",
    borderRadius: 8,
    padding: 12,
    margin: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.accent + "30",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  text: {
    fontSize: 13,
    color: colors.primary,
    marginLeft: 8,
    flex: 1,
  },
  button: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  buttonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
});