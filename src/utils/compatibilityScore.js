/**
 * Calculate compatibility score between user skills and career requirements
 * @param {Array<string>} userSkills - User's skills
 * @param {Array<string>} careerSkills - Career required skills
 * @returns {number} - Compatibility score (0-100)
 */
export const calculateCompatibilityScore = (userSkills, careerSkills) => {
  if (!careerSkills || careerSkills.length === 0) return 0;
  if (!userSkills || userSkills.length === 0) return 0;

  const normalizedUserSkills = userSkills.map(s => s.toLowerCase());
  const normalizedCareerSkills = careerSkills.map(s => s.toLowerCase());

  const match = normalizedUserSkills.filter(skill =>
    normalizedCareerSkills.includes(skill)
  ).length;

  const total = normalizedCareerSkills.length;
  const score = Math.min(100, Math.round((match / total) * 100));

  return score;
};
