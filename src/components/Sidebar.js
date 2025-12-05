// src/components/Sidebar.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";

export default function Sidebar({ activePage, setActivePage, navigation, onClose }) {
  const menuItems = [
    { key: "Dashboard", label: "Home", icon: "home-filled" },
    { key: "Careers", label: "Careers", icon: "psychology" },
    { key: "Internships", label: "Internships", icon: "work" },
    { key: "Profile", label: "Profile", icon: "person" },
  ];

  const handleMenuPress = (key) => {
    if (key === "Dashboard" || key === "Careers" || key === "Internships" || key === "Profile") {
      setActivePage(key);
      if (onClose) onClose();
    }
  };

  const handleLogout = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.sidebar}>
      {/* Logo / Branding */}
      <View style={styles.logoContainer}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>CR</Text>
        </View>
        <Text style={styles.logoTitle}>Career Portal</Text>
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
  logoBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#3B444B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logoText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "800",
  },
  logoTitle: {
    color: "#E5E7EB",
    fontSize: 14,
    fontWeight: "600",
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
