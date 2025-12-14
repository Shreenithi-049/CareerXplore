import { auth, db } from "./firebaseConfig";
import { ref, set, remove, onValue, get, push, update } from "firebase/database";

const ApplicationTrackerService = {
  // Add new application
  addApplication: async (internship, initialStatus = "saved") => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: "User not authenticated" };

    try {
      // strict duplicate check
      const isAlreadyTracked = await ApplicationTrackerService.isInternshipTracked(internship.id);
      if (isAlreadyTracked) {
        return { success: false, message: "This internship is already being tracked" };
      }

      const applicationsRef = ref(db, `users/${user.uid}/my_tracker_entries`);
      const newAppRef = push(applicationsRef);

      await set(newAppRef, {
        id: newAppRef.key,
        internshipId: internship.id,
        title: internship.title,
        company: internship.company,
        location: internship.location,
        status: initialStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [
          {
            status: initialStatus,
            date: new Date().toISOString(),
            note: "Application saved"
          }
        ],
        notes: "",
        deadline: null,
        documents: []
      });

      return { success: true, id: newAppRef.key };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Update application status
  updateStatus: async (applicationId, newStatus, note = "") => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: "User not authenticated" };

    try {
      const appRef = ref(db, `users/${user.uid}/my_tracker_entries/${applicationId}`);
      const snapshot = await get(appRef);

      if (!snapshot.exists()) {
        return { success: false, message: "Application not found" };
      }

      const currentData = snapshot.val();
      const updatedTimeline = [
        ...(currentData.timeline || []),
        {
          status: newStatus,
          date: new Date().toISOString(),
          note: note || `Status changed to ${newStatus}`
        }
      ];

      await set(appRef, {
        ...currentData,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        timeline: updatedTimeline
      });

      // Track application count for badges
      if (newStatus === "applied") {
        const userRef = ref(db, `users/${user.uid}`);
        const userSnapshot = await get(userRef);
        const userData = userSnapshot.val();
        const applications = (userData?.applications || 0) + 1;
        await update(userRef, { applications });
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Update notes
  updateNotes: async (applicationId, notes) => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: "User not authenticated" };

    try {
      const appRef = ref(db, `users/${user.uid}/my_tracker_entries/${applicationId}`);
      const snapshot = await get(appRef);

      if (!snapshot.exists()) {
        return { success: false, message: "Application not found" };
      }

      const currentData = snapshot.val();
      await set(appRef, {
        ...currentData,
        notes,
        updatedAt: new Date().toISOString()
      });

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Update deadline
  updateDeadline: async (applicationId, deadline) => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: "User not authenticated" };

    try {
      const appRef = ref(db, `users/${user.uid}/my_tracker_entries/${applicationId}`);
      const snapshot = await get(appRef);

      if (!snapshot.exists()) {
        return { success: false, message: "Application not found" };
      }

      const currentData = snapshot.val();
      await set(appRef, {
        ...currentData,
        deadline,
        updatedAt: new Date().toISOString()
      });

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Add document reference
  addDocument: async (applicationId, document) => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: "User not authenticated" };

    try {
      const appRef = ref(db, `users/${user.uid}/my_tracker_entries/${applicationId}`);
      const snapshot = await get(appRef);

      if (!snapshot.exists()) {
        return { success: false, message: "Application not found" };
      }

      const currentData = snapshot.val();
      const updatedDocuments = [
        ...(currentData.documents || []),
        {
          ...document,
          uploadedAt: new Date().toISOString()
        }
      ];

      await set(appRef, {
        ...currentData,
        documents: updatedDocuments,
        updatedAt: new Date().toISOString()
      });

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Remove application
  removeApplication: async (applicationId) => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: "User not authenticated" };

    try {
      const appRef = ref(db, `users/${user.uid}/my_tracker_entries/${applicationId}`);
      await remove(appRef);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Listen to all applications
  listenToApplications: (callback) => {
    const user = auth.currentUser;
    if (!user) return () => { };

    const applicationsRef = ref(db, `users/${user.uid}/my_tracker_entries`);
    return onValue(applicationsRef, (snapshot) => {
      const data = snapshot.val();
      const applications = data ? Object.values(data) : [];
      callback(applications);
    });
  },

  // Check if internship is already tracked
  isInternshipTracked: async (internshipId) => {
    const user = auth.currentUser;
    if (!user) return false;

    try {
      const applicationsRef = ref(db, `users/${user.uid}/my_tracker_entries`);
      const snapshot = await get(applicationsRef);

      if (!snapshot.exists()) return false;

      const applications = Object.values(snapshot.val());
      return applications.some(app => app.internshipId === internshipId);
    } catch (error) {
      return false;
    }
  }
};

export default ApplicationTrackerService;
