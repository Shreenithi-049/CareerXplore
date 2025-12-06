import { auth, db } from "./firebaseConfig";
import { ref, set, remove, onValue, get } from "firebase/database";

const FavoritesService = {
  // Add career to favorites
  addCareerToFavorites: async (career) => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: "User not authenticated" };

    try {
      const favoriteRef = ref(db, `users/${user.uid}/favorites/careers/${career.id}`);
      await set(favoriteRef, {
        ...career,
        savedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Remove career from favorites
  removeCareerFromFavorites: async (careerId) => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: "User not authenticated" };

    try {
      const favoriteRef = ref(db, `users/${user.uid}/favorites/careers/${careerId}`);
      await remove(favoriteRef);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Add internship to favorites
  addInternshipToFavorites: async (internship) => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: "User not authenticated" };

    try {
      const favoriteRef = ref(db, `users/${user.uid}/favorites/internships/${internship.id}`);
      await set(favoriteRef, {
        ...internship,
        savedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Remove internship from favorites
  removeInternshipFromFavorites: async (internshipId) => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: "User not authenticated" };

    try {
      const favoriteRef = ref(db, `users/${user.uid}/favorites/internships/${internshipId}`);
      await remove(favoriteRef);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Check if career is favorited
  isCareerFavorited: async (careerId) => {
    const user = auth.currentUser;
    if (!user) return false;

    try {
      const favoriteRef = ref(db, `users/${user.uid}/favorites/careers/${careerId}`);
      const snapshot = await get(favoriteRef);
      return snapshot.exists();
    } catch (error) {
      return false;
    }
  },

  // Check if internship is favorited
  isInternshipFavorited: async (internshipId) => {
    const user = auth.currentUser;
    if (!user) return false;

    try {
      const favoriteRef = ref(db, `users/${user.uid}/favorites/internships/${internshipId}`);
      const snapshot = await get(favoriteRef);
      return snapshot.exists();
    } catch (error) {
      return false;
    }
  },

  // Listen to favorite careers
  listenToFavoriteCareers: (callback) => {
    const user = auth.currentUser;
    if (!user) return () => {};

    const favoritesRef = ref(db, `users/${user.uid}/favorites/careers`);
    return onValue(favoritesRef, (snapshot) => {
      const data = snapshot.val();
      const favorites = data ? Object.values(data) : [];
      callback(favorites);
    });
  },

  // Listen to favorite internships
  listenToFavoriteInternships: (callback) => {
    const user = auth.currentUser;
    if (!user) return () => {};

    const favoritesRef = ref(db, `users/${user.uid}/favorites/internships`);
    return onValue(favoritesRef, (snapshot) => {
      const data = snapshot.val();
      const favorites = data ? Object.values(data) : [];
      callback(favorites);
    });
  },
};

export default FavoritesService;
