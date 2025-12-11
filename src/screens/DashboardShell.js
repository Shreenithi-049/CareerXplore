import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from "react-native";
import Sidebar from "../components/Sidebar";
import HomeScreen from "../screens/HomeScreen";
import CareerRecommendationScreen from "../screens/CareerRecommendationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import InternshipScreen from "../screens/InternshipScreen";
import ApplicationTrackerScreen from "../screens/ApplicationTrackerScreen";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import ChatbotWidget from "../components/ChatbotWidget";
import colors from "../theme/colors";

export default function DashboardShell({ navigation }) {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const [hoverHamburger, setHoverHamburger] = useState(false);

  const SIDEBAR_WIDTH = 220;

  const sidebarX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const contentX = useRef(new Animated.Value(0)).current;

  const handlePageChange = (page) => {
    setActivePage(page);
    setSidebarVisible(false);
  };

  useEffect(() => {
    if (sidebarVisible) {
      Animated.parallel([
        Animated.timing(sidebarX, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(contentX, {
          toValue: SIDEBAR_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(sidebarX, {
          toValue: -SIDEBAR_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(contentX, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [sidebarVisible]);

  const renderContent = () => {
    const commonProps = {
      navigation,
      showHamburger: true,
      onToggleSidebar: () => setSidebarVisible(!sidebarVisible),
      setActivePage: handlePageChange,
    };

    switch (activePage) {
      case "Dashboard":
        return <HomeScreen {...commonProps} />;
      case "Careers":
        return <CareerRecommendationScreen {...commonProps} />;
      case "Internships":
        return <InternshipScreen {...commonProps} />;
      case "Tracker":
        return <ApplicationTrackerScreen {...commonProps} />;
      case "Analytics":
        return <AnalyticsScreen {...commonProps} />;
      case "Profile":
        return <ProfileScreen {...commonProps} />;
      default:
        return <HomeScreen {...commonProps} />;
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Sidebar sliding panel */}
      <Animated.View
        style={[
          styles.sidebarContainer,
          { transform: [{ translateX: sidebarX }] },
        ]}
      >
        <Sidebar
          activePage={activePage}
          setActivePage={handlePageChange}
          navigation={navigation}
          onClose={() => setSidebarVisible(false)}
        />
      </Animated.View>

      {/* Content that slides */}
      <Animated.View
        style={[
          styles.content,
          { transform: [{ translateX: contentX }] },
        ]}
      >
        {renderContent()}
        <ChatbotWidget />

        {/* Backdrop when sidebar open */}
        {sidebarVisible && (
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setSidebarVisible(false)}
            {...(Platform.OS === "web"
              ? { onMouseEnter: () => {}, style: styles.backdropHover }
              : {})}
          />
        )}
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: "hidden",
  },

  sidebarContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 220,
    height: "100%",
    backgroundColor: colors.white,
    elevation: 15,
    zIndex: 10,
  },

  content: {
    flex: 1,
    zIndex: 5,
  },

  /* Backdrop */
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  /* Hover cursor for backdrop (web) */
  backdropHover: Platform.select({
    web: {
      cursor: "pointer",
    },
    default: {},
  }),
});
