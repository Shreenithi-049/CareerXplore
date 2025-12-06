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
};
