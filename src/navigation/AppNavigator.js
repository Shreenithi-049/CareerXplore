import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import DashboardShell from "../screens/DashboardShell";
import CareerDetailsScreen from "../screens/CareerDetailsScreen";
import InternshipDetailsScreen from "../screens/InternshipDetailsScreen";
import CareerRoadmapScreen from "../screens/CareerRoadmapScreen";

import { auth, db } from "../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { ActivityIndicator, View } from "react-native";
import colors from "../theme/colors";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      setUser(loggedUser);


      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={DashboardShell} />
            <Stack.Screen name="CareerDetails" component={CareerDetailsScreen} />
            <Stack.Screen name="InternshipDetails" component={InternshipDetailsScreen} />
            <Stack.Screen name="CareerRoadmap" component={CareerRoadmapScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
