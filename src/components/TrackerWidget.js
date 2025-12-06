import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import ApplicationTrackerService from "../services/applicationTrackerService";

export default function TrackerWidget({ onNavigate }) {
  const [stats, setStats] = useState({ total: 0, active: 0, offers: 0 });

  useEffect(() => {
    const unsubscribe = ApplicationTrackerService.listenToApplications((apps) => {
      const total = apps.length;
      const active = apps.filter(app => 
        ["applied", "interview"].includes(app.status)
      ).length;
      const offers = apps.filter(app => app.status === "offer").length;
      
      setStats({ total, active, offers });
    });

    return unsubscribe;
  }, []);

  if (stats.total === 0) return null;

  return (
    <TouchableOpacity style={styles.widget} onPress={onNavigate}>
      <View style={styles.header}>
        <MaterialIcons name="track-changes" size={20} color={colors.accent} />
        <Text style={styles.title}>Application Tracker</Text>
        <MaterialIcons name="arrow-forward" size={16} color={colors.textLight} />
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: "#10B981" }]}>{stats.offers}</Text>
          <Text style={styles.statLabel}>Offers</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  widget: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.grayBorder,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.accent,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
});
