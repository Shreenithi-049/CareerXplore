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
import colors from "../theme/colors";
import { auth, db } from "../services/firebaseConfig";
import { ref, onValue } from "firebase/database";
import ScreenHeader from "../components/ScreenHeader";
import ProfileNotification from "../components/ProfileNotification";
import { isProfileComplete } from "../utils/profileUtils";

const isWeb = Platform.OS === "web";

// Master career dataset with details + tags
const CAREERS = [
  {
    id: 1,
    title: "Software Developer",
    category: "Software Development",
    requiredSkills: ["Python", "Java", "C++", "Web Development"],
    tags: ["#Tech", "#Software", "#FullStack"],
    salary: "₹4L – ₹12L per year (entry to mid level)",
    description: "Software Developers build and maintain applications for web, desktop, or mobile platforms.",
    roles: ["Design, code, and test software applications", "Fix bugs and improve performance", "Collaborate with designers, testers, and product teams"],
    futureScope: "Very high demand with opportunities in product companies, startups, and service industries.",
    learningPath: ["Strengthen Data Structures & Algorithms", "Practice building full-stack projects", "Learn version control (Git) and basic DevOps concepts"],
  },
  {
    id: 2,
    title: "Data Scientist",
    category: "Data & Analytics",
    requiredSkills: ["Data Analysis", "Python", "Machine Learning", "SQL / Databases"],
    tags: ["#Data", "#AI", "#ML"],
    salary: "₹6L – ₹15L per year",
    description: "Data Scientists extract insights from complex data using statistical methods and machine learning.",
    roles: ["Build predictive models", "Analyze large datasets", "Present findings to stakeholders"],
    futureScope: "Extremely high demand across all industries with AI/ML growth.",
    learningPath: ["Master Python and R", "Learn statistics and ML algorithms", "Practice with real datasets"],
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
    description: "Financial Analysts evaluate investment opportunities and financial performance.",
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
    description: "Mechanical Engineers design and develop mechanical systems and products.",
    roles: ["Design mechanical components", "Oversee manufacturing processes", "Test and improve products"],
    futureScope: "Consistent demand in automotive, aerospace, and manufacturing industries.",
    learningPath: ["Master CAD software", "Learn manufacturing processes", "Understand materials science"],
  },
  {
    id: 6,
    title: "Content Writer",
    category: "Content & Media",
    requiredSkills: ["Content Creation", "Writing", "SEO"],
    tags: ["#Writing", "#Content", "#SEO"],
    salary: "₹2.5L – ₹6L per year",
    description: "Content Writers create engaging written content for websites, blogs, and marketing materials.",
    roles: ["Write blog posts and articles", "Create marketing copy", "Optimize content for SEO"],
    futureScope: "High demand with growth of digital content and online businesses.",
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
    learningPath: ["Master design software (Photoshop, Illustrator)", "Study design principles", "Build a strong portfolio"],
  },
  {
    id: 8,
    title: "Human Resources Specialist",
    category: "Human Resources",
    requiredSkills: ["Human Resources", "Communication", "Psychology"],
    tags: ["#HR", "#People", "#Management"],
    salary: "₹3L – ₹8L per year",
    description: "HR Specialists manage employee relations, recruitment, and organizational development.",
    roles: ["Recruit and hire employees", "Manage employee relations", "Develop HR policies"],
    futureScope: "Essential role in all organizations with focus on employee experience.",
    learningPath: ["Learn HR best practices", "Understand employment law", "Develop interpersonal skills"],
  },
  {
    id: 9,
    title: "Sales Representative",
    category: "Sales",
    requiredSkills: ["Sales", "Communication", "Customer Service"],
    tags: ["#Sales", "#Business", "#Customer"],
    salary: "₹3L – ₹10L per year (with incentives)",
    description: "Sales Representatives sell products or services to customers and build client relationships.",
    roles: ["Generate leads and prospects", "Present products to clients", "Close sales deals"],
    futureScope: "Always in demand across all industries with good earning potential.",
    learningPath: ["Develop communication skills", "Learn sales techniques", "Understand customer psychology"],
  },
  {
    id: 10,
    title: "Project Manager",
    category: "Management",
    requiredSkills: ["Project Management", "Leadership", "Communication"],
    tags: ["#Management", "#Leadership", "#Planning"],
    salary: "₹5L – ₹12L per year",
    description: "Project Managers plan, execute, and oversee projects from initiation to completion.",
    roles: ["Plan project timelines", "Coordinate team activities", "Manage project budgets"],
    futureScope: "High demand across all industries as organizations focus on efficient project delivery.",
    learningPath: ["Learn project management methodologies", "Develop leadership skills", "Get PMP certification"],
  },
];

const CATEGORIES = [
  "All",
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

export default function CareerRecommendationScreen({ navigation, setActivePage }) {
  const [userSkills, setUserSkills] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);

  // Load user profile data from Firebase
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = ref(db, "users/" + user.uid);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      
      // Update skills
      if (data?.skills) {
        const arr = Array.isArray(data.skills) ? data.skills : [data.skills];
        setUserSkills(arr.map((s) => s.toLowerCase()));
      } else {
        setUserSkills([]);
      }
      
      // Update interests
      if (data?.interests) {
        const arr = Array.isArray(data.interests) ? data.interests : [data.interests];
        setUserInterests(arr.map((i) => i.toLowerCase()));
      } else {
        setUserInterests([]);
      }
      
      // Check if profile is complete
      setProfileComplete(isProfileComplete(data));
    });
  }, []);

  // Compute match score for each career and filter **only matched**
  const matchedCareers = useMemo(() => {
    if (!userSkills || userSkills.length === 0) return [];

    const scored = CAREERS.map((career) => {
      const required = career.requiredSkills.map((s) => s.toLowerCase());
      const skillMatched = required.filter((s) => userSkills.includes(s));
      const skillMatchCount = skillMatched.length;
      const skillMatchRatio = required.length ? skillMatchCount / required.length : 0;
      
      // Bonus scoring for interests alignment (if available)
      let interestBonus = 0;
      if (userInterests.length > 0) {
        const careerKeywords = [...career.title.toLowerCase().split(' '), ...career.category.toLowerCase().split(' ')];
        const interestMatch = userInterests.some(interest => 
          careerKeywords.some(keyword => keyword.includes(interest) || interest.includes(keyword))
        );
        interestBonus = interestMatch ? 0.2 : 0;
      }
      
      const totalMatchRatio = skillMatchRatio + interestBonus;
      
      return {
        ...career,
        matchCount: skillMatchCount,
        matchRatio: totalMatchRatio,
        matchedSkills: skillMatched,
      };
    })
      .filter((c) => c.matchCount > 0) // only careers with at least 1 matched skill
      .sort((a, b) => b.matchRatio - a.matchRatio);

    return scored;
  }, [userSkills, userInterests]);

  // Apply category + search filters
  const filteredCareers = useMemo(() => {
    return matchedCareers.filter((career) => {
      if (activeCategory !== "All" && career.category !== activeCategory) {
        return false;
      }
      if (search) {
        const term = search.toLowerCase();
        if (!career.title.toLowerCase().includes(term)) return false;
      }
      return true;
    });
  }, [matchedCareers, search, activeCategory]);

  const handleOpenDetails = (career) => {
    navigation.navigate("CareerDetails", {
      career,
      userSkills,
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Career Recommendations" subtitle="Discover careers that match your skills" />
      {!profileComplete && (
        <ProfileNotification onNavigateToProfile={() => setActivePage && setActivePage('Profile')} />
      )}
      {/* Search */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search career role"
          placeholderTextColor={colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipRow}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.chip,
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

      {/* Cards grid */}
      <ScrollView style={styles.listScroll}>
        {filteredCareers.length === 0 ? (
          <Text style={styles.emptyText}>
            No matched careers yet. Try adding more skills in your Profile.
          </Text>
        ) : (
          <View style={styles.grid}>
            {filteredCareers.map((career) => (
              <TouchableOpacity
                key={career.id}
                onPress={() => handleOpenDetails(career)}
                style={[
                  styles.card,
                  isWeb ? styles.cardWeb : styles.cardMobile,
                  hoveredId === career.id && styles.cardHovered,
                ]}
                {...(isWeb && {
                  onMouseEnter: () => setHoveredId(career.id),
                  onMouseLeave: () => setHoveredId(null),
                })}
              >
                {/* Match Badge */}
                <View style={styles.matchBadge}>
                  <Text style={styles.matchBadgeValue}>
                    {(career.matchRatio * 100).toFixed(0)}%
                  </Text>
                  <Text style={styles.matchBadgeLabel}>match</Text>
                </View>

                <Text style={styles.cardTitle}>{career.title}</Text>
                {/* Tagline style T3: tags */}
                <Text style={styles.cardTags}>
                  {(career.tags || []).join("   ")}
                </Text>
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

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchWrapper: {
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grayBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.textDark,
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
    gap: 16,
  },

  card: {
    backgroundColor: "#F2F4F5",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E4E7",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    position: "relative",
  },
  cardWeb: {
    flex: 1,
    minWidth: 280,
    maxWidth: "calc(33.333% - 11px)",
  },
  cardMobile: {
    width: "100%",
  },
  cardHovered: {
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    transform: [{ translateY: -2 }],
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
  },
  matchBadgeValue: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.accent,
    marginBottom: -2,
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
