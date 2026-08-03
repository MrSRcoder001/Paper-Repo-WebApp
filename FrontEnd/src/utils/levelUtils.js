/**
 * Helper utility to calculate user XP tier level
 * @param {number} xp - Total XP points
 * @returns {string} Level title (e.g. "Level 4 Scholar")
 */
export const getUserLevel = (xp = 1250) => {
  const points = Number(xp) || 0;
  if (points >= 3500) return 'Level 6 Legend';
  if (points >= 2000) return 'Level 5 Master';
  if (points >= 1200) return 'Level 4 Scholar';
  if (points >= 700) return 'Level 3 Academic';
  if (points >= 300) return 'Level 2 Contributor';
  return 'Level 1 Novice';
};
