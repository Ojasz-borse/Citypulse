import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  navigation: any;
};

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      // This is the correct IP for connecting from an Android emulator to a localhost server
      const res = await fetch("http://10.0.2.2:5000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "user" }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Registration successful!");
        console.log("Register response:", data);
        // On successful registration, you can navigate to Login or directly to Home
        navigation.navigate("Login"); 
      } else {
        // Use the error message from the server if available
        Alert.alert("Registration Failed", data.msg || "An error occurred.");
      }
    } catch (error) {
      console.error("Register error:", error);
      Alert.alert("Connection Error", "Could not connect to the server. Please check your connection.");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f5f7fa",
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
          color: "#28559a",
        }}
      >
        Register
      </Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 10,
          marginBottom: 12,
          backgroundColor: "white",
        }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 10,
          marginBottom: 12,
          backgroundColor: "white",
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          paddingHorizontal: 12,
          marginBottom: 12,
          backgroundColor: "white",
        }}
      >
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={{ flex: 1, paddingVertical: 12 }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#28559a"
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          paddingHorizontal: 12,
          marginBottom: 20,
          backgroundColor: "white",
        }}
      >
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          style={{ flex: 1, paddingVertical: 12 }}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Ionicons
            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#28559a"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleRegister}
        style={{
          backgroundColor: "#28559a",
          padding: 15,
          borderRadius: 12,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          Register
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={{ textAlign: "center", color: "#28559a" }}>
          Already have an account?{" "}
          <Text style={{ textDecorationLine: "underline" }}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
