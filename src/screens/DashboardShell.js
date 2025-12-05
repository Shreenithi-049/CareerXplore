import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Sidebar from "../components/Sidebar";
import HomeScreen from "../screens/HomeScreen";
import CareerRecommendationScreen from "../screens/CareerRecommendationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import InternshipScreen from "../screens/InternshipScreen";
import colors from "../theme/colors";

export default function DashboardShell({ navigation }) {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarVisible, setSidebarVisible] = useState(false);

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
      case "Profile":
        return <ProfileScreen {...commonProps} />;
      default:
        return <HomeScreen {...commonProps} />;
    }
  };

  const showSidebar = activePage !== "Dashboard" || sidebarVisible;

  return (
    <View style={styles.container}>
      {showSidebar && (
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage} 
          navigation={navigation}
          onClose={() => setSidebarVisible(false)}
        />
      )}
      <View style={styles.content}>{renderContent()}</View>
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
});
