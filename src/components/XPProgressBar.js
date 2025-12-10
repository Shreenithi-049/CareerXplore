import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function XPProgressBar({ currentXP, nextLevel = 300 }) {
  // Calculate current level and XP within that level
  const currentLevel = Math.floor(currentXP / nextLevel) + 1;
  const xpInCurrentLevel = currentXP % nextLevel;
  const progress = Math.min((xpInCurrentLevel / nextLevel) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Level {currentLevel} Progress</Text>
        <Text style={styles.xpText}>{xpInCurrentLevel} / {nextLevel} XP</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
    textShadowColor: 'rgba(200,169,81,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.grayLight,
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 6,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 3,
  },
});
