// Generate real-time internship data
const generateInternships = () => {
  const baseInternships = [
    { title: "Software Developer Intern", company: "TechCorp", skills: ["Python", "Java", "Web Development"], stipend: "₹18,000/month" },
    { title: "Data Analyst Intern", company: "DataInsights", skills: ["Data Analysis", "Excel & Analytics", "SQL / Databases"], stipend: "₹16,000/month" },
    { title: "Digital Marketing Intern", company: "MarketPro", skills: ["Digital Marketing", "Social Media", "Content Creation"], stipend: "₹12,000/month" },
    { title: "Finance Intern", company: "FinanceHub", skills: ["Finance", "Accounting", "Excel & Analytics"], stipend: "₹14,000/month" },
    { title: "Mechanical Design Intern", company: "EngineerWorks", skills: ["Mechanical Engineering", "CAD Design", "Manufacturing"], stipend: "₹15,000/month" },
    { title: "Content Writer Intern", company: "ContentCraft", skills: ["Content Creation", "Writing", "SEO"], stipend: "₹10,000/month" },
    { title: "Graphic Design Intern", company: "DesignStudio", skills: ["Graphic Design", "UI/UX Design", "Creative Arts"], stipend: "₹11,000/month" },
    { title: "HR Intern", company: "PeopleFirst", skills: ["Human Resources", "Communication", "Psychology"], stipend: "₹12,000/month" },
    { title: "Sales Intern", company: "SalesForce", skills: ["Sales", "Communication", "Customer Service"], stipend: "₹13,000/month" },
    { title: "Project Management Intern", company: "ProjectPro", skills: ["Project Management", "Leadership", "Communication"], stipend: "₹17,000/month" },
    { title: "Cyber Security Intern", company: "SecureNet", skills: ["Cyber Security", "Networking", "Ethical Hacking"], stipend: "₹19,000/month" },
    { title: "Cloud Computing Intern", company: "CloudTech", skills: ["Cloud Computing", "AWS", "Networking"], stipend: "₹20,000/month" },
    { title: "Machine Learning Intern", company: "AI Labs", skills: ["Machine Learning", "Python", "Data Analysis"], stipend: "₹22,000/month" },
    { title: "Mobile App Developer Intern", company: "AppDev", skills: ["Mobile Development", "React Native", "JavaScript"], stipend: "₹16,000/month" },
    { title: "Business Analyst Intern", company: "BizAnalytics", skills: ["Business Analysis", "Excel & Analytics", "Communication"], stipend: "₹15,000/month" }
  ];
  
  const locations = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad"];
  const types = ["Remote", "On-site", "Hybrid"];
  const durations = ["3 months", "4 months", "5 months", "6 months"];
  
  return baseInternships.map((internship, index) => {
    const today = new Date();
    const postedDate = new Date(today.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Random date within last 7 days
    
    return {
      id: index + 1,
      title: internship.title,
      company: internship.company,
      location: `${locations[Math.floor(Math.random() * locations.length)]}, India`,
      type: types[Math.floor(Math.random() * types.length)],
      duration: durations[Math.floor(Math.random() * durations.length)],
      stipend: internship.stipend,
      skills: internship.skills,
      description: `Join our team as a ${internship.title} and gain hands-on experience in ${internship.skills.join(", ")}.`,
      postedDate: postedDate.toISOString().split('T')[0],
      applyUrl: `https://example.com/apply/${index + 1}`,
      companyLogo: null
    };
  });
};

const MOCK_INTERNSHIPS = generateInternships();

class InternshipAPI {
  // Simulate API delay
  async delay(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Fetch all internships with optional filters
  async fetchInternships(filters = {}) {
    await this.delay(800); // Simulate API call
    
    // Generate fresh data each time to simulate real-time updates
    let results = [...generateInternships()];
    
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