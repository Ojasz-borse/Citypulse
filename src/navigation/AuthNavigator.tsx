// src/navigation/AuthNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "@/src/screens/auth/RegisterScreen";
import LoginScreen from "@/src/screens/auth/LoginScreen";
import HomeScreen from "@/src/screens/HomeScreens";

export type AuthStackParamList = {
  Register: undefined;
  Login: undefined;
  Home: undefined; // <- add Home here
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} /> {/* <- add Home */}
    </Stack.Navigator>
  );
}
