/**
 * @desc    Predicts placement probability based on various metrics
 */
exports.predictPlacement = (studentData) => {
  const {
    cgpa,
    resumeScore,
    skillMatchScore,
    interviewScore,
    backlogs,
    appliedCount,
    shortlistedCount
  } = studentData;

  // 1. CGPA Score (20% weight)
  const cgpaScore = (cgpa / 10) * 100;

  // 2. Resume Score (25% weight)
  // Already 0-100

  // 3. Skill Match (30% weight)
  // Already 0-100

  // 4. Interview Score (25% weight)
  // Already 0-100

  // Calculation
  let probability = (
    cgpaScore * 0.20 + 
    resumeScore * 0.25 + 
    skillMatchScore * 0.30 + 
    interviewScore * 0.25
  );

  // 5. Penalty factors
  if (backlogs > 0) {
    probability -= (backlogs * 5);
  }

  if (cgpa < 6) {
    probability -= 10;
  }

  // Final check
  probability = Math.min(Math.max(probability, 0), 100);

  // Risk Level
  let riskLevel = "Medium";
  let riskColor = "yellow";

  if (probability > 85) {
    riskLevel = "Very Low";
    riskColor = "green";
  } else if (probability > 70) {
    riskLevel = "Low";
    riskColor = "blue";
  } else if (probability > 40) {
    riskLevel = "Medium";
    riskColor = "yellow";
  } else if (probability > 20) {
    riskLevel = "High";
    riskColor = "orange";
  } else {
    riskLevel = "Very High";
    riskColor = "red";
  }

  // Suggestions
  const suggestions = [];
  if (cgpa < 7.5) suggestions.push("Try to improve your CGPA to cross the 7.5 threshold for Tier-1 companies");
  if (resumeScore < 70) suggestions.push("Optimize your resume using the AI analyzer to reach a 80+ score");
  if (skillMatchScore < 60) suggestions.push("Complete the recommended courses to bridge the skill gap");
  if (interviewScore < 50) suggestions.push("Practice mock interviews with AI to boost your confidence");

  return {
    probability: Math.round(probability),
    riskLevel,
    riskColor,
    factors: [
      { name: "CGPA", score: Math.round(cgpaScore), weight: "20%" },
      { name: "Resume", score: Math.round(resumeScore), weight: "25%" },
      { name: "Skill Match", score: Math.round(skillMatchScore), weight: "30%" },
      { name: "Interview", score: Math.round(interviewScore), weight: "25%" }
    ],
    suggestions
  };
};
