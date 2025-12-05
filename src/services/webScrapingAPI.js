// Web scraping service for Indian internship platforms
// Note: This is a conceptual implementation. In production, you'd need a backend service.

class WebScrapingAPI {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  // Simulate scraping Internshala (would be done on backend)
  async scrapeInternshala(filters = {}) {
    // In production, this would be handled by a backend service
    // using tools like Puppeteer, Cheerio, or Scrapy
    
    const mockScrapedData = [
      {
        id: 'internshala_1',
        title: 'Web Development Intern',
        company: 'StartupTech India',
        location: 'Bangalore, India',
        type: 'Remote',
        duration: '2 months',
        stipend: '₹8,000/month',
        skills: ['HTML', 'CSS', 'JavaScript', 'React'],
        description: 'Work on exciting web projects using modern technologies. Learn from experienced developers.',
        postedDate: new Date().toISOString(),
        applyUrl: 'https://internshala.com/internship/detail/web-development-intern-work-from-home-job-internship-at-startuptech-india1234',
        source: 'Internshala'
      },
      {
        id: 'internshala_2',
        title: 'Android Development Intern',
        company: 'MobileFirst Solutions',
        location: 'Hyderabad, India',
        type: 'On-site',
        duration: '3 months',
        stipend: '₹12,000/month',
        skills: ['Java', 'Kotlin', 'Android Studio', 'Firebase'],
        description: 'Develop Android applications for various clients. Gain hands-on experience with latest Android technologies.',
        postedDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        applyUrl: 'https://internshala.com/internship/detail/android-development-intern-in-hyderabad-at-mobilefirst-solutions5678',
        source: 'Internshala'
      },
      {
        id: 'internshala_3',
        title: 'Digital Marketing Intern',
        company: 'GrowthHackers',
        location: 'Mumbai, India',
        type: 'Hybrid',
        duration: '4 months',
        stipend: '₹10,000/month',
        skills: ['Digital Marketing', 'SEO', 'Social Media', 'Analytics'],
        description: 'Learn digital marketing strategies and execute campaigns for real clients.',
        postedDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        applyUrl: 'https://internshala.com/internship/detail/digital-marketing-intern-in-mumbai-at-growthhackers9012',
        source: 'Internshala'
      }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Apply filters
    let filteredData = mockScrapedData;
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredData = filteredData.filter(job =>
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.skills && filters.skills.length > 0) {
      filteredData = filteredData.filter(job =>
        job.skills.some(skill =>
          filters.skills.some(userSkill =>
            skill.toLowerCase().includes(userSkill.toLowerCase())
          )
        )
      );
    }

    return {
      success: true,
      data: filteredData,
      total: filteredData.length,
      source: 'Internshala',
      scrapedAt: new Date().toISOString()
    };
  }

  // Simulate scraping Naukri.com
  async scrapeNaukri(filters = {}) {
    const mockNaukriData = [
      {
        id: 'naukri_1',
        title: 'Software Engineer Intern',
        company: 'TechCorp India Pvt Ltd',
        location: 'Pune, India',
        type: 'On-site',
        duration: '6 months',
        stipend: '₹15,000/month',
        skills: ['Python', 'Django', 'PostgreSQL', 'Git'],
        description: 'Join our engineering team and work on scalable web applications.',
        postedDate: new Date().toISOString(),
        applyUrl: 'https://naukri.com/job-listings/software-engineer-intern-techcorp-india-pune-1234567',
        source: 'Naukri'
      },
      {
        id: 'naukri_2',
        title: 'Data Analyst Intern',
        company: 'Analytics Pro Solutions',
        location: 'Delhi, India',
        type: 'Remote',
        duration: '4 months',
        stipend: '₹18,000/month',
        skills: ['Python', 'SQL', 'Excel', 'Power BI', 'Statistics'],
        description: 'Analyze business data and create insightful reports for decision making.',
        postedDate: new Date(Date.now() - 86400000).toISOString(),
        applyUrl: 'https://naukri.com/job-listings/data-analyst-intern-analytics-pro-delhi-2345678',
        source: 'Naukri'
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 1200));

    let filteredData = mockNaukriData;
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredData = filteredData.filter(job =>
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm)
      );
    }

    return {
      success: true,
      data: filteredData,
      total: filteredData.length,
      source: 'Naukri',
      scrapedAt: new Date().toISOString()
    };
  }

  // Aggregate data from multiple scraping sources
  async scrapeAllSources(filters = {}) {
    try {
      const [internshalaResults, naukriResults] = await Promise.allSettled([
        this.scrapeInternshala(filters),
        this.scrapeNaukri(filters)
      ]);

      let allResults = [];
      const sources = [];

      if (internshalaResults.status === 'fulfilled' && internshalaResults.value.success) {
        allResults = [...allResults, ...internshalaResults.value.data];
        sources.push('Internshala');
      }

      if (naukriResults.status === 'fulfilled' && naukriResults.value.success) {
        allResults = [...allResults, ...naukriResults.value.data];
        sources.push('Naukri');
      }

      // Sort by posted date (newest first)
      allResults.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

      return {
        success: true,
        data: allResults,
        total: allResults.length,
        sources: sources,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Scraping error:', error);
      return {
        success: false,
        error: error.message,
        data: [],
        total: 0
      };
    }
  }

  // Get recommended internships from scraped data
  async getRecommendedFromScraping(userSkills) {
    const results = await this.scrapeAllSources({ skills: userSkills });
    
    if (results.success && results.data.length > 0) {
      const scoredResults = results.data.map(internship => {
        const matchedSkills = internship.skills.filter(skill =>
          userSkills.some(userSkill =>
            skill.toLowerCase().includes(userSkill.toLowerCase()) ||
            userSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        
        const matchScore = matchedSkills.length > 0 
          ? Math.round((matchedSkills.length / internship.skills.length) * 100)
          : 0;
        
        return {
          ...internship,
          matchedSkills,
          matchScore
        };
      });
      
      scoredResults.sort((a, b) => b.matchScore - a.matchScore);
      
      return {
        success: true,
        data: scoredResults,
        total: scoredResults.length,
        sources: results.sources
      };
    }
    
    return results;
  }
}

export default new WebScrapingAPI();