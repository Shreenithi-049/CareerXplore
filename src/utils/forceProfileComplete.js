import { auth, db } from "../services/firebaseConfig";
import { ref, update } from "firebase/database";

// Utility to manually force profile completion
export const forceProfileComplete = async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await update(ref(db, "users/" + user.uid), {
      profileComplete: true,
      forceComplete: true,
      lastForceUpdate: new Date().toISOString()
    });
    console.log("Profile completion forced");
  } catch (error) {
    console.error("Error forcing profile completion:", error);
  }
};