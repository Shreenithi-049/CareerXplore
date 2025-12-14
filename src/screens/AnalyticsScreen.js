import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated } from 'react-native';
import { useResponsive } from '../utils/useResponsive';
import { MaterialIcons } from '@expo/vector-icons';
import { ref, onValue } from 'firebase/database';
import { auth, db } from '../services/firebaseConfig';
import ScreenHeader from '../components/ScreenHeader';
import colors from '../theme/colors';

const CircularProgress = ({ percentage, size = 100, color = colors.accent }) => {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.grayLight, justifyContent: 'center', alignItems: 'center', borderWidth: 8, borderColor: color }}>
      <Text style={{ fontSize: 24, fontWeight: '700', color: color }}>{percentage}%</Text>
    </View>
  );
};

export default function AnalyticsScreen({ showHamburger, onToggleSidebar }) {
  const [userData, setUserData] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const { isMobile } = useResponsive();

  useEffect(() => {
    const userRef = ref(db, `users/${auth.currentUser.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      setUserData(snapshot.val());
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    });
    return () => unsubscribe();
  }, []);

  if (!userData) return <Text>Loading...</Text>;

  const weeklyXP = userData.xp || 0;
  const careerViews = userData.careerViews || 0;
  const applications = userData.applications ? Object.keys(userData.applications).length : 0;

  const xpProgress = Math.min((weeklyXP / 500) * 100, 100);
  const careerProgress = Math.min((careerViews / 20) * 100, 100);
  const appProgress = Math.min((applications / 10) * 100, 100);

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <ScreenHeader
        title="Analytics"
        subtitle="Track your progress"
        showHamburger={showHamburger}
        onToggleSidebar={onToggleSidebar}
        showLogo={true}
      />
      <ScrollView style={styles.content}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Stats Grid */}
          <View style={[styles.statsGrid, isMobile && styles.statsGridMobile]}>
            <View style={styles.statBox}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="bolt" size={28} color={colors.accent} />
              </View>
              <Text style={styles.statNumber}>{weeklyXP}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>

            <View style={styles.statBox}>
              <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                <MaterialIcons name="visibility" size={28} color="#2196F3" />
              </View>
              <Text style={styles.statNumber}>{careerViews}</Text>
              <Text style={styles.statLabel}>Career Views</Text>
            </View>

            <View style={styles.statBox}>
              <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                <MaterialIcons name="work" size={28} color="#4CAF50" />
              </View>
              <Text style={styles.statNumber}>{applications}</Text>
              <Text style={styles.statLabel}>Applications</Text>
            </View>
          </View>

          {/* Circular Progress Cards */}
          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Your Progress</Text>

            <View style={styles.circularCard}>
              <CircularProgress percentage={Math.round(xpProgress)} color={colors.accent} />
              <View style={styles.circularInfo}>
                <Text style={styles.circularTitle}>XP Growth</Text>
                <Text style={styles.circularSubtitle}>{weeklyXP} / 500 XP</Text>
                <Text style={styles.circularDescription}>Keep earning XP to level up!</Text>
              </View>
            </View>

            <View style={styles.circularCard}>
              <CircularProgress percentage={Math.round(careerProgress)} color="#2196F3" />
              <View style={styles.circularInfo}>
                <Text style={styles.circularTitle}>Career Exploration</Text>
                <Text style={styles.circularSubtitle}>{careerViews} / 20 careers</Text>
                <Text style={styles.circularDescription}>Explore more to find your perfect match</Text>
              </View>
            </View>

            <View style={styles.circularCard}>
              <CircularProgress percentage={Math.round(appProgress)} color="#4CAF50" />
              <View style={styles.circularInfo}>
                <Text style={styles.circularTitle}>Application Activity</Text>
                <Text style={styles.circularSubtitle}>{applications} / 10 applications</Text>
                <Text style={styles.circularDescription}>Great progress on your job search!</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  containerMobile: {
    padding: 12,
  },
  content: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
    justifyContent: 'center', // Center aligned as requested
  },
  statsGridMobile: {
    // Mobile specific adjustments if needed, but flex-wrap row works well for centering
  },
  statBox: {
    flex: 1,
    minWidth: 100,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grayBorder,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(200,169,81,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 4,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
    textShadowColor: 'rgba(200,169,81,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  progressSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
  },
  circularCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grayBorder,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  circularInfo: {
    width: '100%',
    marginTop: 16,
    alignItems: 'center',
  },
  circularTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  circularSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: 6,
    textAlign: 'center',
  },
  circularDescription: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 16,
    textAlign: 'center',
  },
});
