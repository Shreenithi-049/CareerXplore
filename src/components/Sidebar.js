// src/components/Sidebar.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, StatusBar } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { auth } from "../services/firebaseConfig";
import colors from "../theme/colors";
import { useResponsive } from "../utils/useResponsive";

export default function Sidebar({ activePage, setActivePage, navigation, onClose }) {
  const { isMobile } = useResponsive();
  
  const menuItems = [
    { key: "Dashboard", label: "Home", icon: "home-filled" },
    { key: "Careers", label: "Careers", icon: "psychology" },
    { key: "Internships", label: "Internships", icon: "work" },
    { key: "Tracker", label: "App Tracker", icon: "track-changes" },
    { key: "Analytics", label: "Analytics", icon: "bar-chart" },
    { key: "Profile", label: "Profile", icon: "person" },
  ];

  const handleMenuPress = (key) => {
    setActivePage(key);
    if (onClose) {
      // Add slight delay for smooth animation
      setTimeout(() => onClose(), 100);
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
    <View style={[styles.sidebar, isMobile && styles.sidebarMobile]}>
      {/* Close Button for Mobile */}
      {isMobile && (
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <MaterialIcons name="close" size={24} color={colors.white} />
        </TouchableOpacity>
      )}

      {/* Logo / Branding */}
      <View style={[styles.logoContainer, isMobile && styles.logoContainerMobile]}>
        <Image 
          source={require('../../assets/CareerXplore_logo_alone.png')}
          style={[styles.logo, isMobile && styles.logoMobile]}
          resizeMode="contain"
        />
        <Text style={[styles.logoTitle, isMobile && styles.logoTitleMobile]}>CareerXplore</Text>
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
  sidebarMobile: {
    width: '100%',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    right: 16,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainerMobile: {
    marginBottom: 30,
    marginTop: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 4,
  },
  logoMobile: {
    width: 80,
    height: 80,
  },
  logoTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "serif",
    letterSpacing: 0.5,
  },
  logoTitleMobile: {
    fontSize: 20,
  },

  menuContainer: {
    flexGrow: 1,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    minHeight: 52,
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
    fontSize: 15,
    fontWeight: "500",
  },

  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 10,
    minHeight: 52,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutText: {
    color: colors.danger,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
  },
});
