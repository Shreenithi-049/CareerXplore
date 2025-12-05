// Mock API service for internships (can be replaced with real APIs)
const MOCK_INTERNSHIPS = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechCorp Solutions",
    location: "Bangalore, India",
    type: "Remote",
    duration: "3 months",
    stipend: "₹15,000/month",
    skills: ["React", "JavaScript", "HTML", "CSS"],
    description: "Work on modern web applications using React and JavaScript.",
    postedDate: "2024-01-15",
    applyUrl: "https://example.com/apply/1",
    companyLogo: null
  },
  {
    id: 2,
    title: "Python Developer Intern",
    company: "DataTech Labs",
    location: "Hyderabad, India",
    type: "Hybrid",
    duration: "6 months",
    stipend: "₹20,000/month",
    skills: ["Python", "Django", "SQL", "Data Analysis"],
    description: "Build data processing applications and APIs using Python.",
    postedDate: "2024-01-14",
    applyUrl: "https://example.com/apply/2",
    companyLogo: null
  },
  {
    id: 3,
    title: "UI/UX Design Intern",
    company: "Creative Studio",
    location: "Mumbai, India",
    type: "On-site",
    duration: "4 months",
    stipend: "₹12,000/month",
    skills: ["Figma", "UI/UX Design", "Prototyping"],
    description: "Design user interfaces and experiences for mobile and web apps.",
    postedDate: "2024-01-13",
    applyUrl: "https://example.com/apply/3",
    companyLogo: null
  },
  {
    id: 4,
    title: "Java Backend Intern",
    company: "Enterprise Systems",
    location: "Pune, India",
    type: "On-site",
    duration: "6 months",
    stipend: "₹18,000/month",
    skills: ["Java", "Spring Boot", "SQL", "REST APIs"],
    description: "Develop backend services and APIs for enterprise applications.",
    postedDate: "2024-01-12",
    applyUrl: "https://example.com/apply/4",
    companyLogo: null
  },
  {
    id: 5,
    title: "Data Science Intern",
    company: "Analytics Pro",
    location: "Chennai, India",
    type: "Remote",
    duration: "5 months",
    stipend: "₹22,000/month",
    skills: ["Python", "Machine Learning", "Data Analysis", "SQL"],
    description: "Work on machine learning models and data analysis projects.",
    postedDate: "2024-01-11",
    applyUrl: "https://example.com/apply/5",
    companyLogo: null
  },
  {
    id: 6,
    title: "Mobile App Developer Intern",
    company: "AppTech Solutions",
    location: "Delhi, India",
    type: "Hybrid",
    duration: "4 months",
    stipend: "₹16,000/month",
    skills: ["React Native", "JavaScript", "Mobile Development"],
    description: "Build cross-platform mobile applications using React Native.",
    postedDate: "2024-01-10",
    applyUrl: "https://example.com/apply/6",
    companyLogo: null
  }
];

class InternshipAPI {
  // Simulate API delay
  async delay(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Fetch all internships with optional filters
  async fetchInternships(filters = {}) {
    await this.delay(800); // Simulate API call
    
    let results = [...MOCK_INTERNSHIPS];
    
    // Filter by skills
    if (filters.skills && filters.skills.length > 0) {
      results = results.filter(internship =>
        internship.skills.some(skill =>
          filters.skills.some(userSkill =>
            skill.toLowerCase().includes(userSkill.toLowerCase())
          )
        )
      );
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(internship =>
        internship.title.toLowerCase().includes(searchTerm) ||
        internship.company.toLowerCase().includes(searchTerm) ||
        internship.location.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by location
    if (filters.location) {
      results = results.filter(internship =>
        internship.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Sort by posted date (newest first)
    results.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    
    return {
      success: true,
      data: results,
      total: results.length,
      timestamp: new Date().toISOString()
    };
  }

  // Get internship by ID
  async getInternshipById(id) {
    await this.delay(300);
    const internship = MOCK_INTERNSHIPS.find(item => item.id === parseInt(id));
    
    if (internship) {
      return { success: true, data: internship };
    } else {
      return { success: false, error: "Internship not found" };
    }
  }

  // Get recommended internships based on user skills
  async getRecommendedInternships(userSkills) {
    const results = await this.fetchInternships({ skills: userSkills });
    
    if (results.success) {
      // Calculate match scores
      const scoredResults = results.data.map(internship => {
        const matchedSkills = internship.skills.filter(skill =>
          userSkills.some(userSkill =>
            skill.toLowerCase().includes(userSkill.toLowerCase())
          )
        );
        
        const matchScore = matchedSkills.length / internship.skills.length;
        
        return {
          ...internship,
          matchedSkills,
          matchScore: Math.round(matchScore * 100)
        };
      });
      
      // Sort by match score
      scoredResults.sort((a, b) => b.matchScore - a.matchScore);
      
      return {
        success: true,
        data: scoredResults,
        total: scoredResults.length
      };
    }
    
    return results;
  }
}

export default new InternshipAPI();