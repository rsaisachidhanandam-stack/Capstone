const Student = require('../models/Student');

exports.analyzeResume = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    // Mock AI Analysis
    const simulatedScore = Math.floor(Math.random() * 41) + 50; // 50 to 90
    const suggestions = [
      'Add more measurable impact metrics to your experience section.',
      'Highlight specific programming languages used in your projects.',
      'Ensure formatting is consistent across the document.'
    ];

    student.resumeScore = simulatedScore;
    await student.save();

    res.json({
      score: simulatedScore,
      suggestions: suggestions,
      message: 'Resume analyzed successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing resume', error: error.message });
  }
};

exports.skillGap = async (req, res) => {
  try {
    const { requiredSkills } = req.body;
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const studentSkills = student.skills.map(skill => skill.toLowerCase());
    const reqSkillsLower = requiredSkills.map(skill => skill.toLowerCase());

    const missingSkills = reqSkillsLower.filter(reqSkill => !studentSkills.includes(reqSkill));

    res.json({
      studentSkills: student.skills,
      requiredSkills,
      missingSkills,
      matchPercentage: ((requiredSkills.length - missingSkills.length) / requiredSkills.length) * 100
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating skill gap analysis', error: error.message });
  }
};

exports.mockInterview = async (req, res) => {
  try {
    // Generate simple mock questions
    const mockQuestions = [
      "Tell me about a time you overcame a difficult technical problem.",
      "How do you ensure your code is maintainable?",
      "Design a scalable system for a URL shortener.",
      "Explain the difference between SQL and NoSQL databases."
    ];

    // Simulating evaluation based on hypothetical response
    const evaluation = {
      technicalKnowledge: Math.floor(Math.random() * 11) + 80, // 80 - 90
      communication: Math.floor(Math.random() * 11) + 80,
      confidence: Math.floor(Math.random() * 11) + 80,
      readinessScore: 85,
      feedback: "Good structured answers. Try to be more concise."
    };

    res.json({ questions: mockQuestions, evaluation });
  } catch (error) {
    res.status(500).json({ message: 'Error simulating mock interview', error: error.message });
  }
};
