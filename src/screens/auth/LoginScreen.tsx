import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  navigation: any; // You can type it properly later with React Navigation
};

// --- Troubleshooting Connection ---
// If you get a timeout or network error, follow these steps:
// 1. Make sure your backend server is running (npm run dev).
// 2. Run 'adb reverse tcp:5000 tcp:5000' in a NEW terminal.
//    This allows the emulator to connect to 'localhost:5000'.
// 3. If that fails, find your computer's local IP address.
//    - Windows: open cmd and type 'ipconfig' (Look for IPv4 Address).
//    - Mac: open Terminal and type 'ifconfig' (Look for 'inet' under 'en0').
// 4. Replace 'localhost' in the fetch URL below with your computer's IP,
//    e.g., "http://192.168.1.10:5000/api/v1/auth/login"
const API_URL = "http://localhost:5000/api/v1/auth/login";


export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Login successful!");
        console.log("Login successful, token:", data.token);
        navigation.navigate("Home");
      } else {
        Alert.alert("Login Failed", data.msg || "Invalid credentials.");
      }
    } catch (error: any) {
      // More detailed error logging
      console.error("Login fetch error:", JSON.stringify(error, null, 2));
      Alert.alert(
        "Connection Error",
        `Could not connect to the server. Please ensure it is running and you have followed the connection steps. \n\nError: ${error.message}`
      );
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f5f7fa" }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#28559a" }}>
        Login
      </Text>

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
          marginBottom: 20,
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
          <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#28559a" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#28559a",
          padding: 15,
          borderRadius: 12,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={{ textAlign: "center", color: "#28559a" }}>
          Don’t have an account? <Text style={{ textDecorationLine: "underline" }}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

