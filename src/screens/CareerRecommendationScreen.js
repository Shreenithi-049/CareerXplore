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
    title: "Frontend Developer",
    category: "Frontend / Web",
    requiredSkills: ["Web Development", "UI/UX Design"],
    tags: ["#Web", "#Frontend", "#UI"],
    salary: "₹3.5L – ₹10L per year",
    description:
      "Frontend Developers build the user-facing part of websites and web apps.",
    roles: [
      "Convert UI/UX designs into responsive web pages",
      "Optimize site performance and accessibility",
      "Work closely with designers and backend developers",
    ],
    futureScope:
      "High demand in product and service companies, freelancing opportunities are strong.",
    learningPath: [
      "Master HTML, CSS, JavaScript",
      "Learn a framework like React",
      "Understand UI/UX basics and responsive design",
    ],
  },
  {
    id: 3,
    title: "Data Analyst",
    category: "Data & Analytics",
    requiredSkills: ["Data Analysis", "Excel & Analytics", "SQL / Databases"],
    tags: ["#Data", "#Analytics", "#Excel"],
    salary: "₹4L – ₹9L per year",
    description:
      "Data Analysts interpret data and turn it into meaningful insights for decision making.",
    roles: [
      "Collect, clean, and analyze structured data",
      "Prepare reports and dashboards",
      "Support business teams with data-driven insights",
    ],
    futureScope:
      "Excellent growth with the rise of data-driven decisions in all industries.",
    learningPath: [
      "Learn Excel, SQL, and basic statistics",
      "Practice with visualization tools (Power BI / Tableau)",
      "Understand business KPIs and real datasets",
    ],
  },
  {
    id: 4,
    title: "Cyber Security Analyst",
    category: "Networking / Security",
    requiredSkills: ["Cyber Security", "Networking"],
    tags: ["#Security", "#Networking", "#EthicalHacking"],
    salary: "₹4L – ₹10L per year",
    description:
      "Cyber Security Analysts protect systems and networks from digital attacks.",
    roles: [
      "Monitor systems for suspicious activities",
      "Conduct vulnerability assessments",
      "Help implement security policies and best practices",
    ],
    futureScope:
      "Rapidly growing field due to increase in cyber threats across the world.",
    learningPath: [
      "Learn networking fundamentals",
      "Study security concepts, tools, and common attacks",
      "Get hands-on with labs and certifications (CEH, Security+)",
    ],
  },
  {
    id: 5,
    title: "Cloud Engineer (Junior)",
    category: "Cloud",
    requiredSkills: ["Cloud Computing", "Networking"],
    tags: ["#Cloud", "#AWS", "#Azure"],
    salary: "₹4L – ₹11L per year",
    description:
      "Cloud Engineers design and manage cloud-based infrastructure and services.",
    roles: [
      "Deploy and maintain applications on cloud platforms",
      "Monitor performance and optimize costs",
      "Work with DevOps and development teams",
    ],
    futureScope:
      "Strong future as most companies are migrating to cloud quickly.",
    learningPath: [
      "Learn basics of AWS / Azure / GCP",
      "Understand Linux, networking, and containers",
      "Get a cloud associate level certification",
    ],
  },
  {
    id: 6,
    title: "UI/UX Designer",
    category: "Design",
    requiredSkills: ["UI/UX Design", "Graphic Design"],
    tags: ["#Design", "#UIUX", "#Creative"],
    salary: "₹3L – ₹9L per year",
    description:
      "UI/UX Designers design interfaces and user journeys that are simple and delightful.",
    roles: [
      "Create wireframes, mockups, and prototypes",
      "Conduct user research and usability testing",
      "Collaborate with developers to implement designs",
    ],
    futureScope:
      "In demand for all digital products – apps, websites, and SaaS platforms.",
    learningPath: [
      "Learn design fundamentals (layout, color, typography)",
      "Practice with tools like Figma",
      "Study UX processes and build a strong portfolio",
    ],
  },
];

const CATEGORIES = [
  "All",
  "Software Development",
  "Frontend / Web",
  "Data & Analytics",
  "Networking / Security",
  "Cloud",
  "Design",
];

export default function CareerRecommendationScreen({ navigation }) {
  const [userSkills, setUserSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState(null);

  // Load user skills from Firebase
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = ref(db, "users/" + user.uid);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.skills) {
        const arr = Array.isArray(data.skills) ? data.skills : [data.skills];
        setUserSkills(arr.map((s) => s.toLowerCase()));
      } else {
        setUserSkills([]);
      }
    });
  }, []);

  // Compute match score for each career and filter **only matched**
  const matchedCareers = useMemo(() => {
    if (!userSkills || userSkills.length === 0) return [];

    const scored = CAREERS.map((career) => {
      const required = career.requiredSkills.map((s) => s.toLowerCase());
      const matched = required.filter((s) => userSkills.includes(s));
      const matchCount = matched.length;
      const matchRatio = required.length
        ? matchCount / required.length
        : 0;
      return {
        ...career,
        matchCount,
        matchRatio,
        matchedSkills: matched,
      };
    })
      .filter((c) => c.matchCount > 0) // only careers with at least 1 matched skill
      .sort((a, b) => b.matchCount - a.matchCount);

    return scored;
  }, [userSkills]);

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
