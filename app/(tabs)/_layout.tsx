// app/(home)/_layout.tsx
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import CustomBottomBar from "@/components/CustomBottomBar";

import HomeScreen from "@/src/screens/HomeScreens";
import ExploreScreen from "@/src/screens/ExploreScreen";
import ProfileScreen from "@/src/screens/ProfileScreen";
import ReportsScreen from "@/src/screens/ReportsScreen";
import NotificationsScreen from "@/src/screens/NotificationsScreen";

export default function Layout() {
  const [activeTab, setActiveTab] = useState("Home");

  const renderScreen = () => {
    switch (activeTab) {
      case "Home":
        return <HomeScreen />;
      case "Reports":
        return <ReportsScreen />;
      case "Notifications":
        return <NotificationsScreen />;
      case "Profile":
        return <ProfileScreen />;
      case "Add":
        return <ExploreScreen />; // FAB action
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
      <CustomBottomBar onTabPress={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});
