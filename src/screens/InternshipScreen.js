import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useResponsive } from "../utils/useResponsive";
import { MaterialIcons } from "@expo/vector-icons";
import { auth, db } from "../services/firebaseConfig";
import { ref, onValue } from "firebase/database";
import colors from "../theme/colors";
import ScreenHeader from "../components/ScreenHeader";
import ProfileNotification from "../components/ProfileNotification";
import InternshipAPI from "../services/internshipAPI";
import { isProfileComplete } from "../utils/profileUtils";
import RealInternshipAPI from "../services/realInternshipAPI";
import WebScrapingAPI from "../services/webScrapingAPI";
import FavoritesService from "../services/favoritesService";

export default function InternshipScreen({ navigation, setActivePage }) {
  const [internships, setInternships] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [filterMode, setFilterMode] = useState("recommended");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [lastProfileUpdate, setLastProfileUpdate] = useState(null);
  const [favoritedInternships, setFavoritedInternships] = useState([]);
  const { isMobile } = useResponsive();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = ref(db, "users/" + user.uid);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      const skills = data?.skills ? (Array.isArray(data.skills) ? data.skills : [data.skills]) : [];
      const interests = data?.interests ? (Array.isArray(data.interests) ? data.interests : [data.interests]) : [];
      
      setUserSkills(skills);
      setUserInterests(interests);
      
      // Check if profile is complete
      const isComplete = isProfileComplete(data);
      setProfileComplete(isComplete);
      
      // Check if profile was recently updated
      const currentUpdate = data?.profileUpdatedAt || data?.lastUpdated;
      if (currentUpdate && currentUpdate !== lastProfileUpdate) {
        setLastProfileUpdate(currentUpdate);
        if (isComplete) {
          loadInternships(skills, interests);
        }
      } else if (!lastProfileUpdate) {
        // Initial load
        setLastProfileUpdate(currentUpdate);
        loadInternships(skills, interests);
      }
    });

    // Listen to favorite internships
    const unsubscribe = FavoritesService.listenToFavoriteInternships((favorites) => {
      setFavoritedInternships(favorites.map(f => f.id));
    });

    return () => unsubscribe();
  }, [lastProfileUpdate]);

  const toggleFavorite = async (e, internship) => {
    e.stopPropagation();
    const isFavorited = favoritedInternships.includes(internship.id);
    
    if (isFavorited) {
      await FavoritesService.removeInternshipFromFavorites(internship.id);
    } else {
      await FavoritesService.addInternshipToFavorites(internship);
    }
  };

  const loadInternships = async (skills = userSkills, interests = userInterests) => {
    try {
      setLoading(true);
      let results = [];
      
      // Fetch from multiple sources in parallel
      const [mockResult, realResult, scrapedResult] = await Promise.allSettled([
        filterMode === "recommended" && skills.length > 0
          ? InternshipAPI.getRecommendedInternships(skills)
          : InternshipAPI.fetchInternships({ search }),
        filterMode === "recommended" && skills.length > 0
          ? RealInternshipAPI.getRecommendedInternships(skills)
          : RealInternshipAPI.fetchInternships({ search }),
        filterMode === "recommended" && skills.length > 0
          ? WebScrapingAPI.getRecommendedFromScraping(skills)
          : WebScrapingAPI.scrapeAllSources({ search })
      ]);
      
      // Combine results from all sources
      if (mockResult.status === 'fulfilled' && mockResult.value.success) {
        results = [...results, ...mockResult.value.data];
      }
      
      if (realResult.status === 'fulfilled' && realResult.value.success) {
        results = [...results, ...realResult.value.data];
      }
      
      if (scrapedResult.status === 'fulfilled' && scrapedResult.value.success) {
        results = [...results, ...scrapedResult.value.data];
      }
      
      // Remove duplicates and sort
      const uniqueResults = results.filter((job, index, self) =>
        index === self.findIndex(j => 
          j.title.toLowerCase() === job.title.toLowerCase() && 
          j.company.toLowerCase() === job.company.toLowerCase()
        )
      );
      
      // Sort by match score (if available) then by date
      uniqueResults.sort((a, b) => {
        if (a.matchScore && b.matchScore && a.matchScore !== b.matchScore) {
          return b.matchScore - a.matchScore;
        }
        return new Date(b.postedDate) - new Date(a.postedDate);
      });
      
      setInternships(uniqueResults);
      
    } catch (error) {
      console.error("Error loading internships:", error);
      // Fallback to mock data if all APIs fail
      const fallbackResult = await InternshipAPI.fetchInternships({ search });
      if (fallbackResult.success) {
        setInternships(fallbackResult.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInternships();
    setRefreshing(false);
  };

  const handleFilterChange = (mode) => {
    setFilterMode(mode);
    setTimeout(() => loadInternships(), 100);
  };

  const handleSearch = (text) => {
    setSearch(text);
  };

  const getDisplayedList = () => {
    let filtered = internships;
    
    // Apply filter mode
    if (filterMode === "favorites") {
      filtered = filtered.filter(job => favoritedInternships.includes(job.id));
    } else if (filterMode === "recommended") {
      filtered = filtered.filter(job => job.matchScore && job.matchScore > 0);
    }
    
    // Apply search across all modes
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter((job) => 
        job.title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };

  const list = getDisplayedList();

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <ScreenHeader title="Internships" subtitle="Live opportunities from multiple sources" />
      {!profileComplete && (
        <ProfileNotification onNavigateToProfile={() => setActivePage && setActivePage('Profile')} />
      )}
      
      {/* Search + Filter row */}
      <View style={styles.topRow}>
        <TextInput
          style={[styles.searchInput, isMobile && styles.searchInputMobile]}
          placeholder="Search title, company, location"
          placeholderTextColor={colors.textLight}
          value={search}
          onChangeText={handleSearch}
        />
        
        <TouchableOpacity style={[styles.refreshButton, isMobile && styles.refreshButtonMobile]} onPress={onRefresh}>
          <MaterialIcons name="refresh" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            isMobile && styles.filterChipMobile,
            filterMode === "recommended" && styles.filterChipActive,
          ]}
          onPress={() => handleFilterChange("recommended")}
        >
          <Text
            style={[
              styles.filterText,
              filterMode === "recommended" && styles.filterTextActive,
            ]}
          >
            Recommended
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            isMobile && styles.filterChipMobile,
            filterMode === "all" && styles.filterChipActive,
          ]}
          onPress={() => handleFilterChange("all")}
        >
          <Text
            style={[
              styles.filterText,
              filterMode === "all" && styles.filterTextActive,
            ]}
          >
            All Latest
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            isMobile && styles.filterChipMobile,
            filterMode === "favorites" && styles.filterChipActive,
          ]}
          onPress={() => handleFilterChange("favorites")}
        >
          <Text
            style={[
              styles.filterText,
              filterMode === "favorites" && styles.filterTextActive,
            ]}
          >
            Favorites
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Fetching from multiple sources...</Text>
          <Text style={styles.loadingSubtext}>APIs • Web Scraping • Live Data</Text>
        </View>
      )}

      {/* Internship list */}
      {!loading && (
        <ScrollView 
          style={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {list.length > 0 ? (
            list.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate("InternshipDetails", { job: item })
                }
              >
                <View style={styles.cardHeader}>
                  <MaterialIcons name="work" size={24} color={colors.primary} />
                  <View style={styles.cardHeaderRight}>
                    {item.matchScore && (
                      <View style={styles.matchBadge}>
                        <Text style={styles.matchText}>{item.matchScore}% match</Text>
                      </View>
                    )}
                    <TouchableOpacity onPress={(e) => toggleFavorite(e, item)}>
                      <MaterialIcons 
                        name={favoritedInternships.includes(item.id) ? "favorite" : "favorite-border"} 
                        size={20} 
                        color={favoritedInternships.includes(item.id) ? "#D4AF37" : colors.textLight} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.cardContent}>
                  <Text style={styles.jobTitle}>{item.title}</Text>
                  <Text style={styles.company}>{item.company}</Text>
                  
                  <View style={styles.metaRow}>
                    <Text style={styles.location}>{item.location}</Text>
                    <Text style={styles.type}>{item.type}</Text>
                  </View>
                  
                  <Text style={styles.stipend}>{item.stipend}</Text>
                  
                  <View style={styles.skillsContainer}>
                    {item.skills.slice(0, 3).map((skill, idx) => (
                      <View key={idx} style={styles.skillTag}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                    {item.skills.length > 3 && (
                      <Text style={styles.moreSkills}>+{item.skills.length - 3} more</Text>
                    )}
                  </View>
                  
                  {item.source && (
                    <View style={styles.sourceContainer}>
                      <MaterialIcons name="source" size={12} color={colors.textLight} />
                      <Text style={styles.sourceText}>{item.source}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noData}>
              No internships found. Try refreshing or updating your skills.
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  containerMobile: {
    padding: 12,
  },
  topRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.grayLight || "#F3F4F6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grayBorder || "#D1D5DB",
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
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.grayBorder,
  },
  refreshButtonMobile: {
    padding: 12,
    minWidth: 48,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterChipMobile: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
  },
  filterTextActive: {
    color: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 10,
    color: colors.textLight,
    fontSize: 14,
    fontWeight: "500",
  },
  loadingSubtext: {
    marginTop: 4,
    color: colors.textLight,
    fontSize: 12,
    opacity: 0.7,
  },
  list: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.grayBorder,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  matchBadge: {
    backgroundColor: colors.accent + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchText: {
    fontSize: 10,
    color: colors.accent,
    fontWeight: "600",
  },
  cardContent: {
    gap: 4,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  company: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: "500",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  location: {
    fontSize: 12,
    color: colors.textLight,
  },
  type: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: "500",
  },
  stipend: {
    fontSize: 14,
    color: colors.success,
    fontWeight: "600",
    marginTop: 4,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  skillTag: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "500",
  },
  moreSkills: {
    fontSize: 10,
    color: colors.textLight,
    alignSelf: "center",
  },
  sourceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  sourceText: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: "500",
  },
  noData: {
    marginTop: 40,
    textAlign: "center",
    color: colors.textLight,
    fontSize: 14,
  },
});
