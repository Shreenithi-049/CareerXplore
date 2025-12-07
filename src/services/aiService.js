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

Analyze why "${career.title}" is recommended for this user. Provide:
1. Why this career matches (2-3 sentences)
2. Skill gaps (list 3-4 missing skills they should learn)
3. Top 3 recommended courses/certifications
4. Future scope prediction (1-2 sentences)

Keep response concise and actionable.`;

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

      const insights = this.parseInsights(text);
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

  parseInsights(text) {
    const sections = {
      whyRecommended: "",
      skillGaps: [],
      recommendations: [],
      futureScope: "",
    };

    // Split by numbered sections
    const parts = text.split(/\d+\.\s+/);
    
    if (parts.length >= 5) {
      // Section 1: Why matches
      sections.whyRecommended = parts[1]?.trim() || "This career aligns with your profile.";
      
      // Section 2: Skill gaps
      const skillText = parts[2]?.trim() || "";
      sections.skillGaps = skillText
        .split(/\n|\*|•|-/)
        .map(s => s.trim())
        .filter(s => s && s.length > 3)
        .slice(0, 4);
      
      // Section 3: Recommendations
      const recText = parts[3]?.trim() || "";
      sections.recommendations = recText
        .split(/\n|\*|•|-/)
        .map(s => s.trim())
        .filter(s => s && s.length > 3)
        .slice(0, 3);
      
      // Section 4: Future scope
      sections.futureScope = parts[4]?.trim() || "This career has strong growth potential.";
    } else {
      // Fallback: use entire text
      sections.whyRecommended = text.substring(0, 200) || "This career matches your profile.";
      sections.skillGaps = ["Data Structures", "System Design", "Cloud Computing"];
      sections.recommendations = ["Online courses", "Certifications", "Practice projects"];
      sections.futureScope = "Strong growth expected in this field.";
    }

    return sections;
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

  async analyzeResume(resumeData) {
    try {
      const prompt = `Analyze this resume and provide:
1. Overall score (0-100)
2. List 4 missing details or weak areas
3. List 4 improvement suggestions

Resume Data:
Name: ${resumeData.name}
Education: ${resumeData.education}
Skills: ${resumeData.skills.join(", ")}
Experience: ${resumeData.experience}
Projects: ${resumeData.projects}

Format:
SCORE: X
MISSING:
- detail1
- detail2
SUGGESTIONS:
- suggestion1
- suggestion2`;

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
      const analysis = this.parseResumeAnalysis(text);

      return { success: true, analysis };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async extractResumeData(fileUri) {
    try {
      const prompt = `Extract the following information from this resume and format as JSON:
{
  "name": "full name",
  "email": "email address",
  "phone": "phone number",
  "summary": "professional summary",
  "education": "education details",
  "skills": ["skill1", "skill2"],
  "experience": "work experience",
  "projects": "projects",
  "certifications": "certifications",
  "interests": ["interest1", "interest2"]
}

Note: Infer interests from skills and experience. This is a simulated extraction. Provide realistic sample data for a software developer resume.`;

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
      const extracted = this.parseExtractedData(text);

      return { success: true, data: extracted };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  parseExtractedData(text) {
    const SKILL_MAP = {"python":"Python","java":"Java","c++":"C++","web":"Web Development","sql":"SQL / Databases","database":"SQL / Databases","data":"Data Analysis","ml":"Machine Learning Basics","machine learning":"Machine Learning Basics","network":"Networking","cyber":"Cyber Security","cloud":"Cloud Computing","mobile":"Mobile App Development","ui":"UI/UX Design","ux":"UI/UX Design","design":"Graphic Design","graphic":"Graphic Design","video":"Video Editing","excel":"Excel & Analytics","accounting":"Accounting Basics","marketing":"Digital Marketing","digital marketing":"Digital Marketing","business":"Business Strategy","communication":"Communication","problem":"Problem Solving","leadership":"Leadership","team":"Teamwork"};
    const INTEREST_MAP = {"ai":"Artificial Intelligence","artificial":"Artificial Intelligence","web":"Web Development","mobile":"Mobile Apps","data":"Data Science","cyber":"Cybersecurity","cloud":"Cloud Computing","blockchain":"Blockchain","iot":"IoT","entrepreneur":"Entrepreneurship","marketing":"Marketing","finance":"Finance","consulting":"Consulting","project":"Project Management","sales":"Sales","design":"Design","photo":"Photography","video":"Video Production","writing":"Writing","music":"Music","health":"Healthcare","education":"Education","research":"Research","gaming":"Gaming","travel":"Travel","sports":"Sports"};
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const rawSkills = Array.isArray(parsed.skills) ? parsed.skills : [];
        const rawInterests = Array.isArray(parsed.interests) ? parsed.interests : [];
        
        const mappedSkills = rawSkills.map(s => {
          const lower = s.toLowerCase();
          for (const [key, val] of Object.entries(SKILL_MAP)) {
            if (lower.includes(key)) return val;
          }
          return s;
        }).filter((v, i, a) => a.indexOf(v) === i);
        
        const mappedInterests = rawInterests.map(i => {
          const lower = i.toLowerCase();
          for (const [key, val] of Object.entries(INTEREST_MAP)) {
            if (lower.includes(key)) return val;
          }
          return i;
        }).filter((v, i, a) => a.indexOf(v) === i);
        
        return {
          name: parsed.name || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          summary: parsed.summary || "",
          education: parsed.education || "",
          skills: mappedSkills,
          experience: parsed.experience || "",
          projects: parsed.projects || "",
          certifications: parsed.certifications || "",
          interests: mappedInterests
        };
      }
    } catch (e) {
      console.log("Parse error:", e);
    }
    return {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      summary: "Experienced software developer with 3+ years in web development",
      education: "Bachelor of Science in Computer Science, XYZ University, 2020",
      skills: ["Python", "Java", "Web Development", "SQL / Databases", "Machine Learning Basics"],
      experience: "Software Developer at Tech Corp (2020-Present)\n- Developed web applications\n- Collaborated with cross-functional teams",
      projects: "E-commerce Platform - Built full-stack application using MERN stack",
      certifications: "AWS Certified Developer Associate",
      interests: ["Web Development", "Artificial Intelligence", "Cloud Computing"]
    };
  },

  parseResumeAnalysis(text) {
    const analysis = { score: 75, missing: [], suggestions: [] };
    const lines = text.split("\n").map(l => l.trim()).filter(l => l);
    let section = "";

    lines.forEach(line => {
      const scoreMatch = line.match(/SCORE:\s*(\d+)/i);
      if (scoreMatch) analysis.score = parseInt(scoreMatch[1]);
      else if (line.match(/MISSING:/i)) section = "missing";
      else if (line.match(/SUGGESTIONS?:/i)) section = "suggestions";
      else if (line.startsWith("-") || line.startsWith("*") || line.startsWith("•")) {
        const content = line.substring(1).trim();
        if (section === "missing" && analysis.missing.length < 4) analysis.missing.push(content);
        else if (section === "suggestions" && analysis.suggestions.length < 4) analysis.suggestions.push(content);
      }
    });

    if (analysis.missing.length === 0) analysis.missing = ["Add quantifiable achievements", "Include certifications", "Add contact links (LinkedIn)", "Specify project outcomes"];
    if (analysis.suggestions.length === 0) analysis.suggestions = ["Use action verbs", "Quantify achievements with numbers", "Tailor to job description", "Keep it concise (1-2 pages)"];

    return analysis;
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
