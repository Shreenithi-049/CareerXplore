import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { auth, db } from "../services/firebaseConfig";
import { ref, onValue } from "firebase/database";
import colors from "../theme/colors";
import ProgressBar from "./ProgressBar";
import { getProfileProgress, BADGES, getBadgeDetails } from "../services/gamificationService";

export default function GamificationCard() {
  const [xp, setXp] = useState(0);
  const [badges, setBadges] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = ref(db, `users/${user.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setXp(data.xp || 0);
        setBadges(data.badges || []);
        setProgress(getProfileProgress(data));
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>
      
      <View style={styles.xpSection}>
        <Text style={styles.xpLabel}>Total XP</Text>
        <Text style={styles.xpValue}>{xp}</Text>
      </View>

      <ProgressBar progress={progress} label="Profile Completion" />

      <View style={styles.badgesSection}>
        <Text style={styles.badgesTitle}>Badges Earned ({badges.length}/{BADGES.length})</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesList}>
          {BADGES.map((badge) => {
            const earned = badges.includes(badge.id);
            return (
              <View key={badge.id} style={[styles.badge, !earned && styles.badgeLocked]}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={[styles.badgeName, !earned && styles.badgeNameLocked]}>
                  {badge.name}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: colors.grayBorder,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 12,
  },
  xpSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.grayLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  xpLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  xpValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.accent,
  },
  badgesSection: {
    marginTop: 12,
  },
  badgesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 8,
  },
  badgesList: {
    flexDirection: "row",
  },
  badge: {
    alignItems: "center",
    marginRight: 12,
    padding: 8,
    backgroundColor: colors.grayLight,
    borderRadius: 8,
    minWidth: 70,
  },
  badgeLocked: {
    opacity: 0.4,
  },
  badgeIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  badgeName: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.primary,
    textAlign: "center",
  },
  badgeNameLocked: {
    color: colors.textLight,
  },
});
