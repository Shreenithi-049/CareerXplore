import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";
import ScreenHeader from "../components/ScreenHeader";
import { auth, db } from "../services/firebaseConfig";
import { ref, onValue } from "firebase/database";

export default function HomeScreen({ showHamburger, onToggleSidebar }) {
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = ref(db, "users/" + user.uid);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.fullName) {
        setFullName(data.fullName);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <ScreenHeader 
        title="Dashboard" 
        subtitle="Welcome to your career portal" 
        showHamburger={showHamburger}
        onToggleSidebar={onToggleSidebar}
      />
      
      <Text style={styles.greeting}>
        Hello, {fullName || "User"}! 👋
      </Text>
      
      <Text style={styles.sectionTitle}>Overview</Text>
      <Text style={styles.text}>
        Use the navigation menu (left) to explore:
      </Text>
      <Text style={styles.bullet}>• Career recommendations based on your skills</Text>
      <Text style={styles.bullet}>• Matching internships</Text>
      <Text style={styles.bullet}>• Your profile details & updates</Text>

      <View className="spacer" style={{ height: 12 }} />

      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>Tip</Text>
        <Text style={styles.tipText}>
          Keep your skills and education updated for better recommendations and
          internship matches.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 6,
  },
  bullet: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
    marginBottom: 4,
  },
  tipBox: {
    marginTop: 18,
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.grayLight,
    borderWidth: 1,
    borderColor: colors.grayBorder,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: colors.textLight,
  },
});
