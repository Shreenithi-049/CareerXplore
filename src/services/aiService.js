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

  async analyzeResume(resumeBase64, mimeType = "application/pdf") {
    try {
      console.log("Starting Resume Analysis...");

      const prompt = `Analyze this resume for a student seeking internships/jobs.
      Provide a "Resume Score" (0-100) based on content, formatting, and impact.
      
      Respond ONLY in JSON format:
      {
        "score": 85,
        "summary": "Brief summary of the resume quality.",
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"],
        "suggestions": ["Actionable suggestion 1", "Actionable suggestion 2"]
      }`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: resumeBase64
                  }
                }
              ]
            }]
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "API failed");

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log("AI Analysis Response:", text);

      const analysis = this.parseJSONAnalysis(text);
      return { success: true, analysis };
    } catch (error) {
      console.error("Resume Analysis Error:", error);
      return { success: false, error: error.message };
    }
  },

  parseJSONAnalysis(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error("JSON parse error", e);
    }
    return {
      score: 0,
      summary: "Could not parse analysis.",
      strengths: [],
      weaknesses: [],
      suggestions: ["Try uploading a clearer PDF."]
    };
  },
};
