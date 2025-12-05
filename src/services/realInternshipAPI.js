// Real API integration for internships
const API_CONFIG = {
  // Adzuna API (Free tier available)
  ADZUNA: {
    baseUrl: 'https://api.adzuna.com/v1/api/jobs',
    appId: 'YOUR_APP_ID', // Replace with actual API key
    appKey: 'YOUR_APP_KEY', // Replace with actual API key
    country: 'in' // India
  },
  
  // JSearch API (RapidAPI - Free tier)
  JSEARCH: {
    baseUrl: 'https://jsearch.p.rapidapi.com',
    apiKey: 'YOUR_RAPIDAPI_KEY', // Replace with actual API key
    host: 'jsearch.p.rapidapi.com'
  }
};

class RealInternshipAPI {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Check cache validity
  isCacheValid(key) {
    const cached = this.cache.get(key);
    return cached && (Date.now() - cached.timestamp) < this.cacheTimeout;
  }

  // Get from cache or fetch new data
  async getCachedOrFetch(key, fetchFunction) {
    if (this.isCacheValid(key)) {
      return this.cache.get(key).data;
    }
    
    const data = await fetchFunction();
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  }

  // Fetch from Adzuna API
  async fetchFromAdzuna(query = 'intern', location = 'india') {
    try {
      const { ADZUNA } = API_CONFIG;
      const url = `${ADZUNA.baseUrl}/${ADZUNA.country}/search/1?app_id=${ADZUNA.appId}&app_key=${ADZUNA.appKey}&results_per_page=20&what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results) {
        return data.results.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company.display_name,
          location: job.location.display_name,
          type: 'Not specified',
          duration: 'Not specified',
          stipend: job.salary_min ? `₹${Math.round(job.salary_min * 0.012)}/month` : 'Not disclosed',
          skills: this.extractSkills(job.description),
          description: job.description?.substring(0, 200) + '...' || 'No description available',
          postedDate: job.created,
          applyUrl: job.redirect_url,
          source: 'Adzuna'
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Adzuna API Error:', error);
      return [];
    }
  }

  // Fetch from JSearch API (RapidAPI)
  async fetchFromJSearch(query = 'intern', location = 'India') {
    try {
      const { JSEARCH } = API_CONFIG;
      const url = `${JSEARCH.baseUrl}/search?query=${encodeURIComponent(query + ' ' + location)}&page=1&num_pages=1`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': JSEARCH.apiKey,
          'X-RapidAPI-Host': JSEARCH.host
        }
      });
      
      const data = await response.json();
      
      if (data.data) {
        return data.data.map(job => ({
          id: job.job_id,
          title: job.job_title,
          company: job.employer_name,
          location: job.job_city + ', ' + job.job_country,
          type: job.job_employment_type || 'Not specified',
          duration: 'Not specified',
          stipend: job.job_min_salary ? `₹${Math.round(job.job_min_salary * 0.012)}/month` : 'Not disclosed',
          skills: this.extractSkills(job.job_description),
          description: job.job_description?.substring(0, 200) + '...' || 'No description available',
          postedDate: job.job_posted_at_datetime_utc,
          applyUrl: job.job_apply_link,
          source: 'JSearch'
        }));
      }
      
      return [];
    } catch (error) {
      console.error('JSearch API Error:', error);
      return [];
    }
  }

  // Extract skills from job description using keywords
  extractSkills(description) {
    if (!description) return [];
    
    const skillKeywords = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML', 'CSS',
      'SQL', 'MongoDB', 'Express', 'Angular', 'Vue', 'PHP', 'C++', 'C#',
      'Swift', 'Kotlin', 'Flutter', 'React Native', 'Django', 'Flask',
      'Spring', 'Laravel', 'Ruby', 'Go', 'Rust', 'TypeScript', 'GraphQL',
      'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'Linux', 'MySQL',
      'PostgreSQL', 'Redis', 'Elasticsearch', 'Firebase', 'Figma',
      'Photoshop', 'Illustrator', 'UI/UX', 'Design', 'Marketing',
      'Analytics', 'Excel', 'PowerBI', 'Tableau', 'Machine Learning',
      'Data Science', 'AI', 'TensorFlow', 'PyTorch'
    ];
    
    const foundSkills = [];
    const lowerDesc = description.toLowerCase();
    
    skillKeywords.forEach(skill => {
      if (lowerDesc.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });
    
    return foundSkills.slice(0, 5); // Limit to 5 skills
  }

  // Main fetch function that aggregates from multiple sources
  async fetchInternships(filters = {}) {
    const cacheKey = `internships_${JSON.stringify(filters)}`;
    
    return await this.getCachedOrFetch(cacheKey, async () => {
      try {
        const query = filters.search || 'intern';
        const location = filters.location || 'India';
        
        // Fetch from multiple sources in parallel
        const [adzunaResults, jsearchResults] = await Promise.allSettled([
          this.fetchFromAdzuna(query, location),
          this.fetchFromJSearch(query, location)
        ]);
        
        let allResults = [];
        
        // Combine results from successful API calls
        if (adzunaResults.status === 'fulfilled') {
          allResults = [...allResults, ...adzunaResults.value];
        }
        
        if (jsearchResults.status === 'fulfilled') {
          allResults = [...allResults, ...jsearchResults.value];
        }
        
        // Remove duplicates based on title and company
        const uniqueResults = allResults.filter((job, index, self) =>
          index === self.findIndex(j => 
            j.title.toLowerCase() === job.title.toLowerCase() && 
            j.company.toLowerCase() === job.company.toLowerCase()
          )
        );
        
        // Filter by skills if provided
        if (filters.skills && filters.skills.length > 0) {
          const filteredResults = uniqueResults.filter(job =>
            job.skills.some(skill =>
              filters.skills.some(userSkill =>
                skill.toLowerCase().includes(userSkill.toLowerCase())
              )
            )
          );
          
          return {
            success: true,
            data: filteredResults,
            total: filteredResults.length,
            timestamp: new Date().toISOString(),
            sources: ['Adzuna', 'JSearch']
          };
        }
        
        return {
          success: true,
          data: uniqueResults,
          total: uniqueResults.length,
          timestamp: new Date().toISOString(),
          sources: ['Adzuna', 'JSearch']
        };
        
      } catch (error) {
        console.error('API fetch error:', error);
        return {
          success: false,
          error: error.message,
          data: [],
          total: 0
        };
      }
    });
  }

  // Get recommended internships with match scoring
  async getRecommendedInternships(userSkills) {
    const results = await this.fetchInternships({ skills: userSkills });
    
    if (results.success && results.data.length > 0) {
      // Calculate match scores
      const scoredResults = results.data.map(internship => {
        const matchedSkills = internship.skills.filter(skill =>
          userSkills.some(userSkill =>
            skill.toLowerCase().includes(userSkill.toLowerCase()) ||
            userSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        
        const matchScore = matchedSkills.length > 0 
          ? Math.round((matchedSkills.length / Math.max(internship.skills.length, 1)) * 100)
          : 0;
        
        return {
          ...internship,
          matchedSkills,
          matchScore
        };
      });
      
      // Sort by match score and then by posting date
      scoredResults.sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        return new Date(b.postedDate) - new Date(a.postedDate);
      });
      
      return {
        success: true,
        data: scoredResults,
        total: scoredResults.length,
        sources: results.sources
      };
    }
    
    return results;
  }

  // Get internship by ID (for details view)
  async getInternshipById(id) {
    // This would typically make a specific API call
    // For now, we'll search through cached results
    for (const [key, cached] of this.cache.entries()) {
      if (cached.data && cached.data.data) {
        const found = cached.data.data.find(item => item.id === id);
        if (found) {
          return { success: true, data: found };
        }
      }
    }
    
    return { success: false, error: "Internship not found" };
  }
}

export default new RealInternshipAPI();