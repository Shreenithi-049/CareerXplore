import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import Sidebar from "../components/Sidebar";
import HomeScreen from "../screens/HomeScreen";
import CareerRecommendationScreen from "../screens/CareerRecommendationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import InternshipScreen from "../screens/InternshipScreen";
import ApplicationTrackerScreen from "../screens/ApplicationTrackerScreen";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import ChatbotWidget from "../components/ChatbotWidget";
import colors from "../theme/colors";
import { useResponsive } from "../utils/useResponsive";

export default function DashboardShell({ navigation }) {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { isMobile } = useResponsive();

  const renderContent = () => {
    const commonProps = {
      navigation,
      showHamburger: activePage === "Dashboard" && !sidebarVisible,
      onToggleSidebar: () => setSidebarVisible(!sidebarVisible),
      setActivePage
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

  const showSidebar = activePage !== "Dashboard" || sidebarVisible;

  return (
    <View style={styles.container}>
      {isMobile ? (
        <Modal
          visible={showSidebar}
          animationType="slide"
          transparent
          onRequestClose={() => setSidebarVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1}
            onPress={() => setSidebarVisible(false)}
          >
            <View style={styles.sidebarModal}>
              <Sidebar 
                activePage={activePage} 
                setActivePage={setActivePage} 
                navigation={navigation}
                onClose={() => setSidebarVisible(false)}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      ) : (
        showSidebar && (
          <Sidebar 
            activePage={activePage} 
            setActivePage={setActivePage} 
            navigation={navigation}
            onClose={() => setSidebarVisible(false)}
          />
        )
      )}
      <View style={styles.content}>
        {renderContent()}
        <ChatbotWidget />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sidebarModal: {
    width: '80%',
    maxWidth: 300,
    height: '100%',
    backgroundColor: colors.white,
  },
});
