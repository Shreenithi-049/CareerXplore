import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Platform, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import InteractiveWrapper from "./InteractiveWrapper";
import { useNavigation } from "@react-navigation/native";

export default function ScreenHeader({
  title,
  subtitle,
  showHamburger,
  onToggleSidebar,
  showLogo = false,
  showBackButton = false,
  onBack,
  rightAction
}) {
  const [hover, setHover] = useState(false);
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>

        {showBackButton ? (
          <InteractiveWrapper
            style={[styles.iconButton, hover && styles.iconButtonHover]}
            onPress={handleBack}
            {...(Platform.OS === "web"
              ? {
                onMouseEnter: () => setHover(true),
                onMouseLeave: () => setHover(false),
              }
              : {})}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.white} />
          </InteractiveWrapper>
        ) : showHamburger ? (
          <InteractiveWrapper
            style={[styles.iconButton, hover && styles.iconButtonHover]}
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
        ) : null}

        {showLogo && (
          <Image
            source={require('../../assets/CareerXplore_logo_alone.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>

        {rightAction && (
          <View style={styles.rightAction}>
            {rightAction}
          </View>
        )}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    minHeight: 80,
    justifyContent: 'center',
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  /* Icon button (Hamburger / Back) */
  iconButton: {
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
  iconButtonHover: Platform.select({
    web: {
      backgroundColor: "rgba(200,169,81,0.25)",
      transform: "scale(1.1)",
      cursor: "pointer",
    },
    default: {},
  }),

  headerLogo: {
    width: 50,
    height: 50,
    marginRight: 12,
  },

  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 22, // Adjusted for consistency
    fontWeight: "700",
    color: colors.accent,
    marginBottom: 2,
  },

  subtitle: {
    fontSize: 13,
    color: "#F5F1E8",
    opacity: 0.9,
  },

  rightAction: {
    marginLeft: 10,
  }
});
