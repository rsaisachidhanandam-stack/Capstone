/**
 * @desc    Analyzes resume text and provides scoring and feedback
 */
exports.analyzeResume = (resumeText, targetSkills = []) => {
  if (!resumeText) return null;

  const text = resumeText.toLowerCase();
  const wordCount = resumeText.split(/\s+/).length;

  // 1. Section Detection (30 points)
  const sections = {
    hasEducation: /education|academic|qualification/i.test(resumeText),
    hasExperience: /experience|work|employment|internship/i.test(resumeText),
    hasProjects: /projects|personal projects/i.test(resumeText),
    hasSkills: /skills|technical skills|expertise/i.test(resumeText),
    hasCertifications: /certifications|certificates|courses/i.test(resumeText),
    hasSummary: /summary|objective|about/i.test(resumeText)
  };

  let sectionScore = 0;
  if (sections.hasEducation) sectionScore += 5;
  if (sections.hasExperience) sectionScore += 5;
  if (sections.hasProjects) sectionScore += 5;
  if (sections.hasSkills) sectionScore += 5;
  if (sections.hasCertifications) sectionScore += 5;
  if (sections.hasSummary) sectionScore += 5;

  // 2. Keyword Scoring (25 points)
  const actionVerbs = [
    'developed', 'built', 'implemented', 'designed', 'managed',
    'led', 'created', 'optimized', 'improved', 'achieved',
    'deployed', 'collaborated', 'analyzed'
  ];

  let foundVerbs = 0;
  actionVerbs.forEach(verb => {
    if (text.includes(verb)) foundVerbs++;
  });
  const keywordScore = Math.min(foundVerbs * 2, 25);

  // 3. Skill Match (25 points)
  let skillMatchScore = 0;
  const matchedSkills = [];
  const missingSkills = [];

  if (targetSkills.length > 0) {
    targetSkills.forEach(skill => {
      if (text.includes(skill.toLowerCase())) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });
    skillMatchScore = (matchedSkills.length / targetSkills.length) * 25;
  } else {
    // If no target skills provided, we give a baseline if skills section found
    skillMatchScore = sections.hasSkills ? 15 : 0;
  }

  // 4. Quantification Check (10 points)
  const quantificationRegex = /\d+%|\d+ years|\d+\+/;
  const quantificationFound = quantificationRegex.test(resumeText);
  const quantificationScore = quantificationFound ? 10 : 0;

  // 5. Length Check (10 points)
  let lengthScore = 0;
  if (wordCount > 300) lengthScore = 10;
  else if (wordCount > 150) lengthScore = 5;

  // Total Score (0-100)
  const totalScore = sectionScore + keywordScore + skillMatchScore + quantificationScore + lengthScore;

  // Generate Feedback & Suggestions
  const suggestions = [];
  const improvements = [];

  if (!sections.hasProjects) suggestions.push("Add a Projects section with 2-3 relevant projects");
  if (!sections.hasCertifications) suggestions.push("Add certifications to boost your profile");
  if (foundVerbs < 5) suggestions.push(`Use more action verbs like 'developed', 'implemented', 'optimized'`);
  if (!quantificationFound) suggestions.push("Add numbers and metrics to your achievements (e.g. Improved speed by 20%)");
  if (wordCount < 150) improvements.push("Your resume is quite short. Elaborate on your projects and experiences.");
  
  return {
    totalScore: Math.round(totalScore),
    sectionScore: Math.round((sectionScore / 30) * 100),
    keywordScore: Math.round((keywordScore / 25) * 100),
    skillMatchScore: Math.round((skillMatchScore / 25) * 100),
    sections,
    matchedSkills,
    missingSkills,
    suggestions,
    improvements
  };
};
