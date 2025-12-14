import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';

export default function DailyXPCard({ dailyXP = 0, motivationalText }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="bolt" size={32} color={colors.accent} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Total XP Earned</Text>
        <Text style={styles.xpValue}>{dailyXP} XP</Text>
        {motivationalText && <Text style={styles.motivation}>{motivationalText}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
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
    marginRight: 12,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  xpValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.accent,
    textShadowColor: 'rgba(200,169,81,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  motivation: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
