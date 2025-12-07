import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY;

export const AIService = {
  async generateCareerInsights(userProfile, career) {
    try {
      console.log("Starting AI generation...");

      const prompt = `Given this user profile:
Skills: ${userProfile.skills?.join(", ") || "None"}
Interests: ${userProfile.interests?.join(", ") || "None"}
Education: ${userProfile.education || "Not specified"}

Analyze why "${career.title}" is recommended for this user.

Respond ONLY in JSON format:
{
  "whyRecommended": "2-3 sentences explaining why this career matches",
  "skillGaps": ["skill1", "skill2", "skill3", "skill4"],
  "recommendedCourses": ["course1", "course2", "course3"],
  "futureScope": "1-2 sentences about future prospects"
}`;

      console.log("Calling Gemini API...");
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          }),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        // Try to list available models
        console.log("Fetching available models...");
        const modelsResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
        );
        const modelsData = await modelsResponse.json();
        console.log("Available models:", modelsData);
        const modelNames = modelsData.models?.map(m => m.name).slice(0, 10);
        console.log("First 10 model names:", modelNames);
        
        throw new Error(data.error?.message || "API request failed");
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log("AI Response:", text);

      const insights = this.parseJSONInsights(text);
      console.log("Parsed Insights:", insights);

      return {
        success: true,
        insights,
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  parseJSONInsights(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          whyRecommended: parsed.whyRecommended || "This career aligns with your profile.",
          skillGaps: Array.isArray(parsed.skillGaps) ? parsed.skillGaps : [],
          recommendations: Array.isArray(parsed.recommendedCourses) ? parsed.recommendedCourses : [],
          futureScope: parsed.futureScope || "Strong growth expected in this field."
        };
      }
    } catch (e) {
      console.error("JSON parse error:", e);
    }
    
    return {
      whyRecommended: "This career matches your profile.",
      skillGaps: ["Data Structures", "System Design", "Cloud Computing"],
      recommendations: ["Online courses", "Certifications", "Practice projects"],
      futureScope: "Strong growth expected in this field."
    };
  },

  async generateCareerRoadmap(userProfile, career, userSkills) {
    try {
      const matchedSkills = career.requiredSkills?.filter(s => 
        userSkills?.map(x => x.toLowerCase()).includes(s.toLowerCase())
      ) || [];
      const missingSkills = career.requiredSkills?.filter(s => 
        !userSkills?.map(x => x.toLowerCase()).includes(s.toLowerCase())
      ) || [];

      const prompt = `Create a detailed career roadmap for "${career.title}".
User has: ${matchedSkills.join(", ") || "basic knowledge"}
Missing: ${missingSkills.join(", ") || "none"}

Provide:
1. Top 4 skill gaps to focus on
2. Learning path with 3 steps each for Beginner, Intermediate, Advanced levels
3. 4 free learning resources (Coursera/Google Career Certificates/edX)
4. Time estimates: beginner (months), intermediate (months), advanced (months), total
5. Salary growth: Entry (0-2 yrs), Junior (2-4 yrs), Mid (4-7 yrs), Senior (7+ yrs)

Format as:
SKILL GAPS:
- skill1
- skill2

BEGINNER:
- step1
- step2

INTERMEDIATE:
- step1

ADVANCED:
- step1

RESOURCES:
- Title | Provider | URL

TIME:
beginner: X months
intermediate: Y months
advanced: Z months
total: N months

SALARY:
Entry: $XX,000 (0-2 years)
Junior: $XX,000 (2-4 years)
Mid: $XX,000 (4-7 years)
Senior: $XX,000 (7+ years)`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "API failed");

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const roadmap = this.parseRoadmap(text);

      return { success: true, roadmap };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async analyzeResume(resumeData, targetRole = 'Software Developer') {
    try {
      console.log('Analyzing resume for role:', targetRole);
      
      const prompt = `Analyze this resume for "${targetRole}" role:

Skills: ${(resumeData.skills || []).join(", ") || "None"}
Education: ${resumeData.education || "Not specified"}
Projects: ${resumeData.projects || "None"}
Experience: ${resumeData.experience || "None"}

Respond ONLY in JSON format:
{
  "atsScore": 85,
  "missingSkills": ["skill1", "skill2", "skill3"],
  "strengths": ["strength1", "strength2", "strength3"],
  "weakSections": ["section1", "section2"]
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "API failed");

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const analysis = this.parseResumeAnalysisJSON(text);

      return { success: true, analysis };
    } catch (error) {
      console.error('Resume analysis error:', error);
      return { success: false, error: error.message };
    }
  },

  async extractResumeData(fileUri) {
    try {
      console.log('Extracting resume data from file:', fileUri);
      
      if (!API_KEY) {
        throw new Error('Gemini API key not configured');
      }
      
      const prompt = `Extract information from this resume and return ONLY a JSON object:

{
  "name": "full name",
  "email": "email address",
  "phone": "phone number",
  "linkedin": "LinkedIn URL",
  "github": "GitHub URL",
  "summary": "professional summary",
  "education": "education details",
  "skills": ["list of technical skills"],
  "experience": "work experience",
  "projects": "project descriptions",
  "certifications": "certifications",
  "interests": ["interests"]
}

Extract ONLY actual data from resume. Use "" or [] if not present.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          }),
        }
      );

      const data = await response.json();
      console.log('Gemini API response:', data);
      
      if (!response.ok) {
        console.error('API error:', data);
        throw new Error(data.error?.message || `API failed with status ${response.status}`);
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log('Extracted text:', text);
      
      if (!text) {
        throw new Error('No content extracted from resume');
      }
      
      const extracted = this.parseExtractedData(text);
      console.log('Parsed extracted data:', extracted);
      
      return { success: true, data: extracted };
    } catch (error) {
      console.error('Resume extraction error:', error);
      return { success: false, error: error.message };
    }
  },

  parseExtractedData(text) {
    try {
      // Find JSON object in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Return only actual extracted data, no fallbacks
        return {
          name: parsed.name || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          linkedin: parsed.linkedin || "",
          github: parsed.github || "",
          summary: parsed.summary || "",
          education: parsed.education || "",
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          experience: parsed.experience || "",
          projects: parsed.projects || "",
          certifications: parsed.certifications || "",
          interests: Array.isArray(parsed.interests) ? parsed.interests : []
        };
      }
    } catch (e) {
      console.error("JSON parse error:", e);
      throw new Error('Failed to parse extracted resume data');
    }
    
    throw new Error('No valid JSON found in resume extraction response');
  },

  generateSpecificAnalysis(resumeData, scores, totalScore) {
    const missing = [];
    const suggestions = [];

    // Specific missing items based on actual content
    if (!resumeData.email || !resumeData.phone) missing.push("Add complete contact information (email & phone)");
    if (!resumeData.linkedin) missing.push("Add LinkedIn profile URL for professional networking");
    if (!resumeData.github) missing.push("Include GitHub portfolio to showcase code");
    if (!resumeData.summary || resumeData.summary.length < 50) missing.push("Write a compelling professional summary (3-4 lines)");
    
    // Check education details
    const education = resumeData.education || '';
    if (!education.toLowerCase().includes('university') && !education.toLowerCase().includes('college')) {
      missing.push("Add university/college name and graduation year");
    }
    if (!/\d\.\d|\d{1,2}%/.test(education)) {
      missing.push("Include GPA/percentage if above 7.0/70%");
    }

    // Check projects
    const projects = resumeData.projects || '';
    if (projects.length < 100) {
      missing.push("Expand project descriptions with technologies used");
    }
    if (!/\d+/.test(projects)) {
      missing.push("Add quantifiable metrics to project outcomes");
    }

    // Specific suggestions based on content
    const skills = Array.isArray(resumeData.skills) ? resumeData.skills : [];
    const hasReact = skills.some(s => s.toLowerCase().includes('react'));
    const hasNode = skills.some(s => s.toLowerCase().includes('node'));
    const hasPython = skills.some(s => s.toLowerCase().includes('python'));
    
    if (hasReact && projects.toLowerCase().includes('react')) {
      suggestions.push("Specify React features used: 'Built with React Hooks, Context API'");
    }
    if (hasNode && projects.toLowerCase().includes('node')) {
      suggestions.push("Detail Node.js implementation: 'Created REST APIs with Express.js'");
    }
    if (hasPython) {
      suggestions.push("Highlight Python projects: 'Developed data analysis scripts'");
    }
    
    // Generic improvements if no specific ones
    if (suggestions.length === 0) {
      suggestions.push(`Enhance ${skills[0] || 'technical'} project descriptions with specific achievements`);
      suggestions.push("Add problem-solution format: 'Solved X by implementing Y'");
      suggestions.push("Include deployment details: 'Deployed on AWS/Heroku with 99% uptime'");
    }

    const result = {
      score: totalScore,
      missing: missing.slice(0, 4),
      suggestions: suggestions.slice(0, 4)
    };
    
    console.log('Generated specific analysis:', result);
    return result;
  },

  calculateSectionScores(resumeData, targetRole) {
    const scores = {
      contact: { score: 0, status: '' },
      summary: { score: 0, status: '' },
      education: { score: 0, status: '' },
      skills: { score: 0, status: '' },
      projects: { score: 0, status: '' }
    };

    // Contact Info (10%)
    let contactScore = 0;
    if (resumeData.email) contactScore += 3;
    if (resumeData.phone) contactScore += 3;
    if (resumeData.linkedin) contactScore += 2;
    if (resumeData.github) contactScore += 2;
    scores.contact = { score: contactScore, status: contactScore >= 8 ? 'Complete' : 'Missing links' };

    // Skills Relevance (25%)
    const relevantSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL'];
    const userSkills = resumeData.skills || [];
    const matchCount = relevantSkills.filter(skill => 
      userSkills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()))
    ).length;
    scores.skills = { score: Math.min(25, matchCount * 4), status: matchCount >= 4 ? 'Strong match' : 'Add more tech skills' };

    // Projects (30%)
    const projectLength = (resumeData.projects || '').length;
    const projectScore = Math.min(30, Math.floor(projectLength / 20));
    scores.projects = { score: projectScore, status: projectScore >= 25 ? 'Well detailed' : 'Add more details' };

    // Education (20%)
    const hasUniversity = (resumeData.education || '').toLowerCase().includes('university');
    const hasGPA = /\d\.\d/.test(resumeData.education || '');
    scores.education = { score: hasUniversity ? (hasGPA ? 20 : 15) : 10, status: hasUniversity ? 'Complete' : 'Add university details' };

    // Summary (15%)
    const summaryLength = (resumeData.summary || '').length;
    scores.summary = { score: Math.min(15, Math.floor(summaryLength / 10)), status: summaryLength >= 100 ? 'Strong' : 'Expand summary' };

    return scores;
  },

  parseResumeAnalysisJSON(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          score: Math.min(100, Math.max(0, parsed.atsScore || 75)),
          missing: Array.isArray(parsed.missingSkills) ? parsed.missingSkills.slice(0, 4) : [],
          suggestions: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 3) : [],
          weakSections: Array.isArray(parsed.weakSections) ? parsed.weakSections.slice(0, 2) : []
        };
      }
    } catch (e) {
      console.error("JSON parse error:", e);
    }
    
    return {
      score: 75,
      missing: ["Add LinkedIn profile", "Include GitHub portfolio", "Mention certifications"],
      suggestions: ["Strong technical skills", "Good project experience", "Clear education background"],
      weakSections: ["Professional summary", "Quantifiable metrics"]
    };
  },

  parseRoadmap(text) {
    const roadmap = {
      skillGaps: [],
      learningPath: { beginner: [], intermediate: [], advanced: [] },
      resources: [],
      timeEstimate: { beginner: "3 months", intermediate: "4 months", advanced: "5 months", total: "12 months" },
      salaryGrowth: []
    };

    const lines = text.split("\n").map(l => l.trim()).filter(l => l);
    let section = "";

    lines.forEach(line => {
      if (line.match(/SKILL GAPS?:/i)) section = "gaps";
      else if (line.match(/BEGINNER:/i)) section = "beginner";
      else if (line.match(/INTERMEDIATE:/i)) section = "intermediate";
      else if (line.match(/ADVANCED:/i)) section = "advanced";
      else if (line.match(/RESOURCES?:/i)) section = "resources";
      else if (line.match(/TIME:/i)) section = "time";
      else if (line.match(/SALARY:/i)) section = "salary";
      else if (line.startsWith("-") || line.startsWith("*") || line.startsWith("•")) {
        const content = line.substring(1).trim();
        if (section === "gaps" && roadmap.skillGaps.length < 4) roadmap.skillGaps.push(content);
        else if (section === "beginner" && roadmap.learningPath.beginner.length < 3) roadmap.learningPath.beginner.push(content);
        else if (section === "intermediate" && roadmap.learningPath.intermediate.length < 3) roadmap.learningPath.intermediate.push(content);
        else if (section === "advanced" && roadmap.learningPath.advanced.length < 3) roadmap.learningPath.advanced.push(content);
        else if (section === "resources" && roadmap.resources.length < 4) {
          const parts = content.split("|").map(p => p.trim());
          if (parts.length >= 2) {
            roadmap.resources.push({
              title: parts[0],
              provider: parts[1],
              url: parts[2] || "https://www.coursera.org"
            });
          }
        }
      } else if (section === "time") {
        const match = line.match(/(beginner|intermediate|advanced|total):\s*([\d]+)\s*months?/i);
        if (match) roadmap.timeEstimate[match[1].toLowerCase()] = `${match[2]} months`;
      } else if (section === "salary") {
        const match = line.match(/(Entry|Junior|Mid|Senior):\s*\$([\d,]+).*\((.*?)\)/i);
        if (match && roadmap.salaryGrowth.length < 4) {
          roadmap.salaryGrowth.push({
            level: match[1],
            salary: `$${match[2]}`,
            years: match[3]
          });
        }
      }
    });

    // Fallback data
    if (roadmap.skillGaps.length === 0) roadmap.skillGaps = ["Core technical skills", "Industry tools", "Soft skills", "Domain knowledge"];
    if (roadmap.learningPath.beginner.length === 0) roadmap.learningPath.beginner = ["Learn fundamentals", "Build basic projects", "Study best practices"];
    if (roadmap.learningPath.intermediate.length === 0) roadmap.learningPath.intermediate = ["Advanced concepts", "Real-world projects", "Collaborate with teams"];
    if (roadmap.learningPath.advanced.length === 0) roadmap.learningPath.advanced = ["Master specialization", "Lead projects", "Mentor others"];
    if (roadmap.resources.length === 0) roadmap.resources = [
      { title: "Google Career Certificates", provider: "Google", url: "https://grow.google/certificates/" },
      { title: "Professional Certificate Programs", provider: "Coursera", url: "https://www.coursera.org" },
      { title: "Free Courses", provider: "edX", url: "https://www.edx.org" },
      { title: "Skill Development", provider: "LinkedIn Learning", url: "https://www.linkedin.com/learning/" }
    ];
    if (roadmap.salaryGrowth.length === 0) roadmap.salaryGrowth = [
      { level: "Entry", salary: "$50,000", years: "0-2 years" },
      { level: "Junior", salary: "$70,000", years: "2-4 years" },
      { level: "Mid", salary: "$95,000", years: "4-7 years" },
      { level: "Senior", salary: "$130,000", years: "7+ years" }
    ];

    return roadmap;
  },
};
