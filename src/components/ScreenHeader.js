import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";

export default function ScreenHeader({ title, subtitle, showHamburger, onToggleSidebar }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {showHamburger && (
          <TouchableOpacity style={styles.hamburger} onPress={onToggleSidebar}>
            <MaterialIcons name="menu" size={24} color={colors.white} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2C3E3F",
    marginBottom: 20,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  hamburger: {
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#E5E7EB",
  },
});