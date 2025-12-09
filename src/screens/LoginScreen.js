import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import colors from "../theme/colors";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { auth } from "../services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useResponsive } from "../utils/useResponsive";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isMobile, isDesktop } = useResponsive();

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill all the fields");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigation.replace("HomeTabs"))
      .catch((err) => alert(err.message));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, isDesktop && styles.scrollContentDesktop]}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/CareerXplore_logo_alone.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>CareerXplore</Text>
      </View>
      <Text style={styles.subtitle}>Login to continue</Text>

      <View style={styles.card}>
        <InputField
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <InputField
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button title="Login" onPress={handleLogin} />

        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.linkText}>
            Don’t have an account?{" "}
            <Text style={styles.linkStrong}>Signup</Text>
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  scrollContentDesktop: {
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 25,
    marginTop: 5,
  },
  card: {
    width: "100%",
    maxWidth: 450,
    padding: 20,
    backgroundColor: "#FAFAFA",
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    alignItems: "center",
  },
  linkText: {
    color: colors.textLight,
    marginTop: 15,
  },
  linkStrong: {
    color: colors.primary,
    fontWeight: "600",
  },
});
