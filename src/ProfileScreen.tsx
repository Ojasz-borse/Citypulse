import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://via.placeholder.com/100" }}
        style={styles.avatar}
      />
      <Text style={styles.name}>Ojaswini Borse</Text>
      <Text style={styles.role}>Computer Engineering Student</Text>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF4F4",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F2557",
  },
  role: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
});
