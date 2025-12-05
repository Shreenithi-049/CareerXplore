/**
 * Utility functions for profile management
 */

/**
 * Check if user profile is complete
 * @param {Object} profileData - User profile data from Firebase
 * @returns {boolean} - True if profile is complete
 */
export const isProfileComplete = (profileData) => {
  if (!profileData) return false;
  
  const hasSkills = profileData.skills && 
    (Array.isArray(profileData.skills) ? profileData.skills.length > 0 : !!profileData.skills);
  const hasInterests = profileData.interests && 
    (Array.isArray(profileData.interests) ? profileData.interests.length > 0 : !!profileData.interests);
  
  return !!(profileData.fullName && profileData.education && hasSkills && hasInterests);
};

/**
 * Get profile completion percentage
 * @param {Object} profileData - User profile data from Firebase
 * @returns {number} - Completion percentage (0-100)
 */
export const getProfileCompletionPercentage = (profileData) => {
  if (!profileData) return 0;
  
  let completed = 0;
  const total = 4; // fullName, education, skills, interests
  
  if (profileData.fullName) completed++;
  if (profileData.education) completed++;
  if (profileData.skills && (Array.isArray(profileData.skills) ? profileData.skills.length > 0 : true)) completed++;
  if (profileData.interests && (Array.isArray(profileData.interests) ? profileData.interests.length > 0 : true)) completed++;
  
  return Math.round((completed / total) * 100);
};

/**
 * Get missing profile fields
 * @param {Object} profileData - User profile data from Firebase
 * @returns {Array} - Array of missing field names
 */
export const getMissingProfileFields = (profileData) => {
  const missing = [];
  
  if (!profileData?.fullName) missing.push('Full Name');
  if (!profileData?.education) missing.push('Education');
  if (!profileData?.skills || (Array.isArray(profileData.skills) && profileData.skills.length === 0)) {
    missing.push('Skills');
  }
  if (!profileData?.interests || (Array.isArray(profileData.interests) && profileData.interests.length === 0)) {
    missing.push('Interests');
  }
  
  return missing;
};