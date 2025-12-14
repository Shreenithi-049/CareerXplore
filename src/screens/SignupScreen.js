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
import { auth, db } from "../services/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useResponsive } from "../utils/useResponsive";

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isDesktop } = useResponsive();

  const handleSignup = () => {
    if (!fullName || !email || !password) {
      alert("All fields are required!");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        set(ref(db, "users/" + res.user.uid), {
          fullName,
          email,
          xp: 0,
          level: 1,
        });
        navigation.replace("ProfileSetup");
      })
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
        <Text style={styles.subtitle}>Create your account</Text>

        <View style={styles.card}>
          <InputField
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />

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

          <Button title="Sign Up" onPress={handleSignup} />

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>
              Already have an account?{" "}
              <Text style={styles.linkStrong}>Login</Text>
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
