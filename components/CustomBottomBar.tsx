// src/components/CustomBottomBar.tsx
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

const ICON_SIZE = 26;

export default function CustomBottomBar({ onTabPress }: { onTabPress: (tab: string) => void }) {
  const [activeTab, setActiveTab] = useState("Home");

  const handlePress = (tab: string) => {
    setActiveTab(tab);
    onTabPress(tab);
  };

  return (
    <View style={styles.container}>
      {/* Home */}
      <TouchableOpacity onPress={() => handlePress("Home")}>
        <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24">
          <Path
            d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V9.5z"
            fill={activeTab === "Home" ? "#3778c2" : "#999"}
          />
        </Svg>
      </TouchableOpacity>

      {/* Reports */}
      <TouchableOpacity onPress={() => handlePress("Reports")}>
        <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24">
          <Path
            d="M4 4h16v2H4V4zm2 4h12v12H6V8z"
            fill={activeTab === "Reports" ? "#3778c2" : "#999"}
          />
        </Svg>
      </TouchableOpacity>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => handlePress("Add")}>
        <Svg width={32} height={32} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="12" fill="#3778c2" />
          <Path d="M12 7v10M7 12h10" stroke="white" strokeWidth={2} strokeLinecap="round" />
        </Svg>
      </TouchableOpacity>

      {/* Notifications */}
      <TouchableOpacity onPress={() => handlePress("Notifications")}>
        <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24">
          <Path
            d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V10a6 6 0 10-12 0v6l-2 2v1h16v-1l-2-2z"
            fill={activeTab === "Notifications" ? "#3778c2" : "#999"}
          />
        </Svg>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity onPress={() => handlePress("Profile")}>
        <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24">
          <Path
            d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5c0-3-4-5.5-9-5.5z"
            fill={activeTab === "Profile" ? "#3778c2" : "#999"}
          />
        </Svg>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
    elevation: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
  },
  fab: {
    marginTop: -30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});
