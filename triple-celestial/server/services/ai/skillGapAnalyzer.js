/**
 * @desc    Analyzes skill gaps and provides recommendations
 */
exports.analyzeSkillGap = (studentSkills = [], requiredSkills = [], targetRole = 'Software Engineer') => {
  const normalizedStudent = studentSkills.map(s => s.toLowerCase());
  const normalizedRequired = requiredSkills.map(s => s.toLowerCase());

  const matchedSkillsRaw = [];
  const missingSkillsRaw = [];

  requiredSkills.forEach(reqSkill => {
    const lower = reqSkill.toLowerCase();
    // Exact or partial match
    if (normalizedStudent.some(std => std.includes(lower) || lower.includes(std))) {
      matchedSkillsRaw.push(reqSkill);
    } else {
      missingSkillsRaw.push(reqSkill);
    }
  });

  const extraSkills = studentSkills.filter(s => !normalizedRequired.some(rs => s.toLowerCase().includes(rs) || rs.includes(s.toLowerCase())));

  const matchPercentage = requiredSkills.length > 0
    ? (matchedSkillsRaw.length / requiredSkills.length) * 100
    : 100;

  // Recommendations Logic
  const recommendations = missingSkillsRaw.map(skill => {
    // Basic recommendation logic
    const courses = {
      'react': { course: 'React - The Complete Guide (Udemy)', platform: 'Udemy', duration: '40 hours' },
      'node': { course: 'The Complete Node.js Developer Course', platform: 'Udemy', duration: '35 hours' },
      'python': { course: 'Python for Data Science (Coursera)', platform: 'Coursera', duration: '20 hours' },
      'docker': { course: 'Docker Mastery (Udemy)', platform: 'Udemy', duration: '10 hours' },
      'aws': { course: 'AWS Certified Cloud Practitioner', platform: 'A Cloud Guru', duration: '15 hours' },
      'sql': { course: 'Complete SQL Bootcamp', platform: 'Udemy', duration: '12 hours' }
    };

    const entry = Object.entries(courses).find(([key]) => skill.toLowerCase().includes(key));
    
    if (entry) {
      return {
        skill,
        ...entry[1],
        priority: 'High'
      };
    }

    return {
      skill,
      course: `${skill} Fundamentals & Advanced`,
      platform: 'YouTube / Coursera',
      duration: '10-20 hours',
      priority: 'Medium'
    };
  });

  // Readiness Level
  let readinessLevel = 'Beginner';
  if (matchPercentage > 85) readinessLevel = 'Expert';
  else if (matchPercentage > 60) readinessLevel = 'Advanced';
  else if (matchPercentage > 30) readinessLevel = 'Intermediate';

  return {
    matchPercentage: Math.round(matchPercentage),
    matchedSkills: matchedSkillsRaw,
    missingSkills: missingSkillsRaw,
    extraSkills,
    recommendations,
    readinessLevel,
    radarData: [
      { category: "DSA", score: 70 + (Math.random() * 20 - 10) },
      { category: "Web Dev", score: 85 + (Math.random() * 10 - 5) },
      { category: "Database", score: 60 + (Math.random() * 30 - 15) },
      { category: "DevOps", score: 40 + (Math.random() * 40 - 20) },
      { category: "System Design", score: 50 + (Math.random() * 20 - 10) },
      { category: "ML/AI", score: 30 + (Math.random() * 30 - 15) }
    ]
  };
};
