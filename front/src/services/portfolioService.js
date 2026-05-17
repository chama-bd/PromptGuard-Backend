export const calculateSkillScore = (projects, tasks) => {
  let scores = {
    cybersecurity: 0,
    react: 0,
    springboot: 0,
    aiSecurity: 0,
    cloud: 0,
    postgresql: 0
  };

  const allItems = [...projects, ...tasks];

  allItems.forEach(item => {
    const tech = item.technologies || item.tech || [];
    const isCompleted = item.status === 'TERMINEE' || item.isCompleted;

    const multiplier = isCompleted ? 2 : 1;
    const impactBonus = item.securityLevel === 'CRITICAL' ? 5 : item.securityLevel === 'HIGH' ? 3 : 1;

    tech.forEach(t => {
      const tLower = t.toLowerCase();
      if (tLower.includes('security') || tLower.includes('jwt') || tLower.includes('owasp') || item.category === 'Conformité') {
        scores.cybersecurity = Math.min(100, scores.cybersecurity + (3 * multiplier) + impactBonus);
      }
      if (tLower.includes('react') || tLower.includes('tailwind')) {
        scores.react = Math.min(100, scores.react + (4 * multiplier));
      }
      if (tLower.includes('spring') || tLower.includes('java')) {
        scores.springboot = Math.min(100, scores.springboot + (4 * multiplier));
      }
      if (tLower.includes('ai') || tLower.includes('llm') || tLower.includes('tensor')) {
        scores.aiSecurity = Math.min(100, scores.aiSecurity + (5 * multiplier) + impactBonus);
      }
      if (tLower.includes('aws') || tLower.includes('docker') || tLower.includes('terraform')) {
        scores.cloud = Math.min(100, scores.cloud + (3 * multiplier));
      }
      if (tLower.includes('postgre') || tLower.includes('sql') || tLower.includes('database')) {
        scores.postgresql = Math.min(100, scores.postgresql + (3 * multiplier));
      }
    });
  });

  return scores;
};
