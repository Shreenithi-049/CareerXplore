import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../theme/colors";
import ScreenHeader from "../components/ScreenHeader";
import ProfileNotification from "../components/ProfileNotification";
import TrackerWidget from "../components/TrackerWidget";
import GamificationCard from "../components/GamificationCard";
import DailyXPCard from "../components/DailyXPCard";
import { auth, db } from "../services/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { useResponsive } from "../utils/useResponsive";
import HeaderBanner from "../components/HeaderBanner";

export default function HomeScreen({ showHamburger, onToggleSidebar, setActivePage }) {
  const [fullName, setFullName] = useState("");
  const [dailyXP, setDailyXP] = useState(0);
  const { isMobile, isTablet, isDesktop } = useResponsive();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = ref(db, "users/" + user.uid);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.fullName) {
        setFullName(data.fullName);
      }
      setDailyXP(data?.xp || 0);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, isMobile && styles.containerMobile]}>
        <ScreenHeader 
          title="CareerXplore" 
          subtitle="Unlock Your Perfect Career Path" 
          showHamburger={showHamburger}
          onToggleSidebar={onToggleSidebar}
          showLogo={true}
        />
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <HeaderBanner
            image={require("../../assets/homepage.jpg")}
            title="Shape your next career move"
            subtitle="Stay on track with your learning, XP goals, and applications"
            height={isMobile ? 200 : 260}
            overlayOpacity={0.2}
          />

          <ProfileNotification 
            onNavigateToProfile={() => setActivePage('Profile')}
          />
          
          <Text style={[styles.greeting, isMobile && styles.greetingMobile]}>
            Hello, {fullName || "User"}! 👋
          </Text>
          
          <DailyXPCard 
            dailyXP={dailyXP} 
            motivationalText="Keep exploring careers to earn more XP!" 
          />
          
          <GamificationCard />
          
          <TrackerWidget onNavigate={() => setActivePage('Tracker')} />
          
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.text}>
            Use the navigation menu (left) to explore:
          </Text>
          <Text style={styles.bullet}>• Career recommendations based on your skills</Text>
          <Text style={styles.bullet}>• Matching internships</Text>
          <Text style={styles.bullet}>• Track your applications</Text>
          <Text style={styles.bullet}>• View your performance</Text>
          <Text style={styles.bullet}>• Your profile details & updates</Text>

          <View className="spacer" style={{ height: 12 }} />

          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>Tip</Text>
            <Text style={styles.tipText}>
              Keep your skills and education updated for better recommendations and
              internship matches.
            </Text>
          </View>
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
  },
  containerMobile: {
    padding: 12,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 16,
    textShadowColor: 'rgba(200,169,81,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  greetingMobile: {
    fontSize: 18,
    marginBottom: 12,
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
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
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
