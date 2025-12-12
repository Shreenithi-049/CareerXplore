import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import InteractiveWrapper from "./InteractiveWrapper";

export default function ScreenHeader({ title, subtitle, showHamburger, onToggleSidebar, showLogo = false }) {
  const [hover, setHover] = useState(false);

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>

        {showHamburger && (
          <InteractiveWrapper
            style={[styles.hamburger, hover && styles.hamburgerHover]}
            onPress={onToggleSidebar}
            {...(Platform.OS === "web"
              ? {
                  onMouseEnter: () => setHover(true),
                  onMouseLeave: () => setHover(false),
                }
              : {})}
          >
            <MaterialIcons name="menu" size={24} color={colors.white} />
          </InteractiveWrapper>
        )}

        {showLogo && (
          <Image
            source={require('../../assets/CareerXplore_logo_alone.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
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
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  /* Hamburger button */
  hamburger: {
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.18s ease", // smooth animation on web
  },

  /* Hover Effect */
  hamburgerHover: Platform.select({
    web: {
      backgroundColor: "rgba(200,169,81,0.25)",
      transform: "scale(1.1)",
      cursor: "pointer",
    },
    default: {},
  }),

  headerLogo: {
    width: 60,
    height: 60,
    marginRight: 12,
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.accent,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: "#F5F1E8",
  },
});
