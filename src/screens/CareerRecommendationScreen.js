import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { useResponsive } from "../utils/useResponsive";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import { auth, db } from "../services/firebaseConfig";
import { ref, onValue } from "firebase/database";
import ScreenHeader from "../components/ScreenHeader";
import ProfileNotification from "../components/ProfileNotification";
import { isProfileComplete } from "../utils/profileUtils";
import FavoritesService from "../services/favoritesService";

const isWeb = Platform.OS === "web";

// ---------------- CAREER DATA ----------------
const CAREERS = [
  {
    id: 1,
    title: "Software Developer",
    category: "Software Development",
    requiredSkills: ["Python", "Java", "C++", "Web Development"],
    tags: ["#Tech", "#Software", "#FullStack"],
    salary: "₹4L – ₹12L per year (entry to mid level)",
    description:
      "Software Developers build and maintain applications for web, desktop, or mobile platforms.",
    roles: [
      "Design, code, and test software applications",
      "Fix bugs and improve performance",
      "Collaborate with designers, testers, and product teams",
    ],
    futureScope:
      "Very high demand with opportunities in product companies, startups, and service industries.",
    learningPath: [
      "Strengthen Data Structures & Algorithms",
      "Practice building full-stack projects",
      "Learn version control (Git) and basic DevOps concepts",
    ],
  },
  {
    id: 2,
    title: "Data Scientist",
    category: "Data & Analytics",
    requiredSkills: ["Data Analysis", "Python", "Machine Learning", "SQL / Databases"],
    tags: ["#Data", "#AI", "#ML"],
    salary: "₹6L – ₹15L per year",
    description:
      "Data Scientists extract insights from complex data using statistical methods and machine learning.",
    roles: ["Build predictive models", "Analyze large datasets", "Present findings to stakeholders"],
    futureScope:
      "Extremely high demand across all industries with AI/ML growth.",
    learningPath: [
      "Master Python and R",
      "Learn statistics and ML algorithms",
      "Practice with real datasets",
    ],
  },
  {
    id: 3,
    title: "Digital Marketing Specialist",
    category: "Marketing",
    requiredSkills: ["Digital Marketing", "Content Creation", "Social Media"],
    tags: ["#Marketing", "#Digital", "#Social"],
    salary: "₹3L – ₹8L per year",
    description: "Digital Marketing Specialists create and manage online marketing campaigns.",
    roles: ["Manage social media campaigns", "Create content strategies", "Analyze marketing metrics"],
    futureScope: "Growing rapidly with digital transformation of businesses.",
    learningPath: ["Learn Google Ads and Analytics", "Master social media platforms", "Understand SEO/SEM"],
  },
  {
    id: 4,
    title: "Financial Analyst",
    category: "Finance",
    requiredSkills: ["Finance", "Excel & Analytics", "Accounting"],
    tags: ["#Finance", "#Analysis", "#Investment"],
    salary: "₹4L – ₹10L per year",
    description:
      "Financial Analysts evaluate investment opportunities and financial performance.",
    roles: ["Analyze financial data", "Create financial models", "Prepare investment reports"],
    futureScope: "Stable demand in banking, investment, and corporate sectors.",
    learningPath: ["Master Excel and financial modeling", "Learn accounting principles", "Understand market analysis"],
  },
  {
    id: 5,
    title: "Mechanical Engineer",
    category: "Engineering",
    requiredSkills: ["Mechanical Engineering", "CAD Design", "Manufacturing"],
    tags: ["#Engineering", "#Design", "#Manufacturing"],
    salary: "₹3.5L – ₹9L per year",
    description:
      "Mechanical Engineers design and develop mechanical systems and products.",
    roles: ["Design mechanical components", "Oversee manufacturing processes", "Test and improve products"],
    futureScope:
      "Consistent demand in automotive, aerospace, and manufacturing industries.",
    learningPath: ["Master CAD software", "Learn manufacturing processes", "Understand materials science"],
  },
  {
    id: 6,
    title: "Content Writer",
    category: "Content & Media",
    requiredSkills: ["Content Creation", "Writing", "SEO"],
    tags: ["#Writing", "#Content", "#SEO"],
    salary: "₹2.5L – ₹6L per year",
    description:
      "Content Writers create engaging written content for websites, blogs, and marketing materials.",
    roles: ["Write blog posts and articles", "Create marketing copy", "Optimize content for SEO"],
    futureScope:
      "High demand with growth of digital content and online businesses.",
    learningPath: ["Improve writing skills", "Learn SEO basics", "Build a content portfolio"],
  },
  {
    id: 7,
    title: "Graphic Designer",
    category: "Design",
    requiredSkills: ["Graphic Design", "UI/UX Design", "Creative Arts"],
    tags: ["#Design", "#Creative", "#Visual"],
    salary: "₹2.5L – ₹7L per year",
    description: "Graphic Designers create visual content for print and digital media.",
    roles: ["Design logos and branding", "Create marketing materials", "Develop visual concepts"],
    futureScope: "Steady demand across advertising, media, and digital industries.",
    learningPath: [
      "Master design software (Photoshop, Illustrator)",
      "Study design principles",
      "Build a strong portfolio",
    ],
  },
  {
    id: 8,
    title: "Human Resources Specialist",
    category: "Human Resources",
    requiredSkills: ["Human Resources", "Communication", "Psychology"],
    tags: ["#HR", "#People", "#Management"],
    salary: "₹3L – ₹8L per year",
    description:
      "HR Specialists manage employee relations, recruitment, and organizational development.",
    roles: ["Recruit and hire employees", "Manage employee relations", "Develop HR policies"],
    futureScope:
      "Essential role in all organizations with focus on employee experience.",
    learningPath: ["Learn HR best practices", "Understand employment law", "Develop interpersonal skills"],
  },
  {
    id: 9,
    title: "Sales Representative",
    category: "Sales",
    requiredSkills: ["Sales", "Communication", "Customer Service"],
    tags: ["#Sales", "#Business", "#Customer"],
    salary: "₹3L – ₹10L per year (with incentives)",
    description:
      "Sales Representatives sell products or services to customers and build client relationships.",
    roles: ["Generate leads and prospects", "Present products to clients", "Close sales deals"],
    futureScope:
      "Always in demand across all industries with good earning potential.",
    learningPath: ["Develop communication skills", "Learn sales techniques", "Understand customer psychology"],
  },
  {
    id: 10,
    title: "Project Manager",
    category: "Management",
    requiredSkills: ["Project Management", "Leadership", "Communication"],
    tags: ["#Management", "#Leadership", "#Planning"],
    salary: "₹5L – ₹12L per year",
    description:
      "Project Managers plan, execute, and oversee projects from initiation to completion.",
    roles: ["Plan project timelines", "Coordinate team activities", "Manage project budgets"],
    futureScope:
      "High demand across all industries as organizations focus on efficient project delivery.",
    learningPath: [
      "Learn project management methodologies",
      "Develop leadership skills",
      "Get PMP certification",
    ],
  },
];

const CATEGORIES = [
  "All",
  "Favorites",
  "Software Development",
  "Data & Analytics",
  "Marketing",
  "Finance",
  "Engineering",
  "Content & Media",
  "Design",
  "Human Resources",
  "Sales",
  "Management",
];

export default function CareerRecommendationScreen({
  navigation,
  setActivePage,
  showHamburger,
  onToggleSidebar,
}) {
  const [userSkills, setUserSkills] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [favoritedCareers, setFavoritedCareers] = useState([]);
  const { isMobile, isTablet } = useResponsive();

  // --- Fetch Firebase user data ---
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = ref(db, "users/" + user.uid);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();

      // Skills
      if (data?.skills) {
        const arr = Array.isArray(data.skills) ? data.skills : [data.skills];
        setUserSkills(arr.map((s) => s.toLowerCase()));
      } else {
        setUserSkills([]);
      }

      // Interests
      if (data?.interests) {
        const arr = Array.isArray(data.interests) ? data.interests : [data.interests];
        setUserInterests(arr.map((i) => i.toLowerCase()));
      } else {
        setUserInterests([]);
      }

      setProfileComplete(isProfileComplete(data));
    });

    // Favorites
    const unsubscribe = FavoritesService.listenToFavoriteCareers((favorites) => {
      setFavoritedCareers(favorites.map((f) => f.id));
    });

    return () => unsubscribe();
  }, []);

  const toggleFavorite = async (e, career) => {
    e.stopPropagation();
    const isFav = favoritedCareers.includes(career.id);

    if (isFav) {
      await FavoritesService.removeCareerFromFavorites(career.id);
    } else {
      await FavoritesService.addCareerToFavorites(career);
    }
  };

  // --- Matching Logic ---
  const matchedCareers = useMemo(() => {
    if (!userSkills || userSkills.length === 0) return [];

    const scored = CAREERS.map((career) => {
      const required = career.requiredSkills.map((s) => s.toLowerCase());
      const matched = required.filter((s) => userSkills.includes(s));

      const matchRatio = matched.length / required.length;

      return {
        ...career,
        matchCount: matched.length,
        matchRatio: Math.min(1, matchRatio),
        matchedSkills: matched,
      };
    })
      .filter((c) => c.matchCount > 0)
      .sort((a, b) => b.matchRatio - a.matchRatio);

    return scored;
  }, [userSkills]);

  const filteredCareers = useMemo(() => {
    return matchedCareers.filter((career) => {
      if (activeCategory === "Favorites") {
        if (!favoritedCareers.includes(career.id)) return false;
      } else if (activeCategory !== "All" && career.category !== activeCategory) {
        return false;
      }
      if (search) {
        const term = search.toLowerCase();
        if (!career.title.toLowerCase().includes(term)) return false;
      }
      return true;
    });
  }, [matchedCareers, search, activeCategory, favoritedCareers]);

  const openDetails = (career) => {
    navigation.navigate("CareerDetails", { career, userSkills });
  };

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <ScreenHeader
        title="Career Recommendations"
        subtitle="Discover careers that match your skills"
        showHamburger={showHamburger}
        onToggleSidebar={onToggleSidebar}
        showLogo={true}
      />

      {!profileComplete && (
        <ProfileNotification
          onNavigateToProfile={() => setActivePage && setActivePage("Profile")}
        />
      )}

      <View style={styles.topRow}>
        <TextInput
          style={[styles.searchInput, isMobile && styles.searchInputMobile]}
          placeholder="Search career role"
          placeholderTextColor={colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Category Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.chip,
              isMobile && styles.chipMobile,
              activeCategory === cat && styles.chipActive,
            ]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text
              style={[
                styles.chipText,
                activeCategory === cat && styles.chipTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Career Cards */}
      <ScrollView style={styles.listScroll}>
        {filteredCareers.length === 0 ? (
          <Text style={styles.emptyText}>No matched careers yet.</Text>
        ) : (
          <View style={styles.grid}>
            {filteredCareers.map((career) => (
              <TouchableOpacity
                key={career.id}
                onPress={() => openDetails(career)}
                style={[
                  styles.card,
                  isMobile
                    ? styles.cardMobile
                    : isTablet
                    ? styles.cardTablet
                    : styles.cardDesktop,
                  hoveredId === career.id && styles.cardHovered,
                ]}
                {...(isWeb && {
                  onMouseEnter: () => setHoveredId(career.id),
                  onMouseLeave: () => setHoveredId(null),
                })}
              >
                {/* Favorite Icon */}
                <TouchableOpacity
                  style={styles.favoriteIcon}
                  onPress={(e) => toggleFavorite(e, career)}
                >
                  <MaterialIcons
                    name={
                      favoritedCareers.includes(career.id)
                        ? "favorite"
                        : "favorite-border"
                    }
                    size={20}
                    color={
                      favoritedCareers.includes(career.id)
                        ? "#D4AF37"
                        : colors.textLight
                    }
                  />
                </TouchableOpacity>

                {/* Match Badge */}
                <View style={styles.matchBadge}>
                  <Text style={styles.matchBadgeValue}>
                    {(career.matchRatio * 100).toFixed(0)}%
                  </Text>
                  <Text style={styles.matchBadgeLabel}>match</Text>
                </View>

                <Text style={styles.cardTitle}>{career.title}</Text>
                <Text style={styles.cardTags}>{(career.tags || []).join("   ")}</Text>
                <Text style={styles.cardMatch}>
                  Matched skills: {career.matchCount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ---------------- STYLES -------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  containerMobile: {
    padding: 12,
  },

  topRow: {
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    backgroundColor: colors.grayLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grayBorder,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
  },
  searchInputMobile: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    minHeight: 48,
  },

  chipRow: {
    marginTop: 4,
    marginBottom: 10,
  },

  chip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: colors.card,
    height: 36,
    justifyContent: "center",
    alignItems: "center",

    // ⭐ Smoother hover transition (web)
    ...(Platform.OS === "web" && {
      transition: "background-color 0.35s ease, color 0.35s ease, border 0.35s ease",
    }),
  },

  chipMobile: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    height: 44,
  },

  chipActive: {
    backgroundColor: colors.primary,
  },

  chipText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.primary,
  },
  chipTextActive: {
    color: colors.white,
  },

  listScroll: {
    marginTop: 4,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  // ---------- CARD STYLES WITH TRANSITION ----------
  card: {
    backgroundColor: "#F2F4F5",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E4E7",
    shadowColor: colors.accent,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    position: "relative",
    marginBottom: 16,

    // ⭐ Smooth hover animation for Web
    ...(Platform.OS === "web" && {
      transition:
        "all 0.45s ease", // <-- Adjust hover duration here
    }),
  },

  cardMobile: {
    width: "100%",
    padding: 14,
  },
  cardTablet: {
    width: "48%",
  },
  cardDesktop: {
    width: "32%",
  },

  cardHovered: {
    shadowColor: colors.accent,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    transform: [{ translateY: -4 }, { scale: 1.02 }],
    borderColor: colors.accent,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },

  cardTags: {
    fontSize: 11,
    color: colors.textLight,
    marginBottom: 6,
  },

  cardMatch: {
    fontSize: 12,
    color: colors.accent,
    marginTop: 2,
  },

  favoriteIcon: {
    position: "absolute",
    bottom: 5,
    right: 20,
    zIndex: 1,
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },

  matchBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(200,169,81,0.16)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },

  matchBadgeValue: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.accent,
    marginBottom: -2,
    textShadowColor: "rgba(200,169,81,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  matchBadgeLabel: {
    fontSize: 10,
    color: colors.accent,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: colors.textLight,
    fontSize: 13,
  },
});
