import { ref, update, onValue } from "firebase/database";
import { db, auth } from "./firebaseConfig";

const XP_REWARDS = {
  PROFILE_COMPLETE: 100,
  ADD_SKILL: 10,
  ADD_INTEREST: 10,
  UPLOAD_RESUME: 50,
  APPLY_INTERNSHIP: 30,
  VIEW_CAREER: 5,
};

const BADGES = [
  { id: "skill_prodigy", name: "Skill Prodigy", requirement: "skills", threshold: 5, icon: "🎯" },
  { id: "fast_learner", name: "Fast Learner", requirement: "xp", threshold: 200, icon: "⚡" },
  { id: "career_explorer", name: "Career Explorer", requirement: "careerViews", threshold: 10, icon: "🔍" },
  { id: "go_getter", name: "Go-Getter", requirement: "applications", threshold: 5, icon: "🚀" },
];

export const awardXP = async (action, amount = null) => {
  const user = auth.currentUser;
  if (!user) return;

  const xpAmount = amount || XP_REWARDS[action] || 0;
  const userRef = ref(db, `users/${user.uid}`);

  onValue(userRef, async (snapshot) => {
    const data = snapshot.val();
    const currentXP = data?.xp || 0;
    const newXP = currentXP + xpAmount;

    await update(userRef, { xp: newXP });
    checkAndAwardBadges(user.uid, data);
  }, { onlyOnce: true });
};

const checkAndAwardBadges = async (userId, userData) => {
  const userRef = ref(db, `users/${userId}`);
  const earnedBadges = userData?.badges || [];

  BADGES.forEach(async (badge) => {
    if (earnedBadges.includes(badge.id)) return;

    let earned = false;
    switch (badge.requirement) {
      case "skills":
        earned = (userData?.skills?.length || 0) >= badge.threshold;
        break;
      case "xp":
        earned = (userData?.xp || 0) >= badge.threshold;
        break;
      case "careerViews":
        earned = (userData?.careerViews || 0) >= badge.threshold;
        break;
      case "applications":
        earned = (userData?.applications || 0) >= badge.threshold;
        break;
    }

    if (earned) {
      await update(userRef, {
        badges: [...earnedBadges, badge.id],
      });
    }
  });
};

export const getProfileProgress = (userData) => {
  const fields = [
    userData?.fullName,
    userData?.education,
    userData?.skills?.length > 0,
    userData?.interests?.length > 0,
    userData?.resume,
  ];
  const completed = fields.filter(Boolean).length;
  return Math.round((completed / fields.length) * 100);
};

export const getBadgeDetails = (badgeId) => {
  return BADGES.find((b) => b.id === badgeId);
};

export { BADGES, XP_REWARDS };
