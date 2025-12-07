// src/components/Sidebar.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { auth } from "../services/firebaseConfig";
import colors from "../theme/colors";

export default function Sidebar({ activePage, setActivePage, navigation, onClose }) {
  const menuItems = [
    { key: "Dashboard", label: "Home", icon: "home-filled" },
    { key: "Careers", label: "Careers", icon: "psychology" },
    { key: "Internships", label: "Internships", icon: "work" },
    { key: "Tracker", label: "App Tracker", icon: "track-changes" },
    { key: "Analytics", label: "Analytics", icon: "bar-chart" },
    { key: "Profile", label: "Profile", icon: "person" },
  ];

  const handleMenuPress = (key) => {
    if (key === "Dashboard" || key === "Careers" || key === "Internships" || key === "Tracker" || key === "Analytics" || key === "Profile") {
      setActivePage(key);
      if (onClose) onClose();
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate("Login");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.sidebar}>
      {/* Logo / Branding */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/CareerXplore_logo_alone.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.logoTitle}>CareerXplore</Text>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => {
          const isActive = activePage === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => handleMenuPress(item.key)}
            >
              <MaterialIcons
                name={item.icon}
                size={22}
                color={isActive ? colors.accent : "#E5E7EB"}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.menuLabel,
                  isActive && { color: colors.accent, fontWeight: "700" },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutItem}
        onPress={handleLogout}
      >
        <MaterialIcons name="logout" size={20} color={colors.danger} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 220,
    backgroundColor: "#2C3E3F",
    paddingTop: 26,
    paddingHorizontal: 16,
    paddingBottom: 20,
    justifyContent: "space-between",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 4,
  },
  logoTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "serif",
    letterSpacing: 0.5,
  },

  menuContainer: {
    flexGrow: 1,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  menuItemActive: {
    backgroundColor: "rgba(200,169,81,0.15)",
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  icon: {
    marginRight: 12,
  },
  menuLabel: {
    color: "#E5E7EB",
    fontSize: 14,
    fontWeight: "500",
  },

  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  logoutText: {
    color: colors.danger,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
});
