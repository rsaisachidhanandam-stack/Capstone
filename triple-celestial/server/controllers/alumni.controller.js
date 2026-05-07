const Alumni = require('../models/Alumni.model');
const { successResponse } = require('../utils/apiResponse');

exports.getAllAlumni = async (req, res, next) => {
  try {
    const { company, branch, year } = req.query;
    let query = { isApproved: true };

    if (company) query.company = new RegExp(company, 'i');
    if (branch) query.branch = branch;
    if (year) query.yearPlaced = parseInt(year);

    let alumni = await Alumni.find(query).sort({ yearPlaced: -1 });

    // If no alumni found, seed data automatically for a better demo experience
    if (alumni.length === 0 && !company && !branch && !year) {
      const sampleAlumni = [
        {
          studentName: "Vikram Rao",
          company: "Google",
          role: "SWE-3",
          package: "52 LPA",
          yearPlaced: 2022,
          branch: "CSE",
          rating: 4.9,
          interviewRounds: 5,
          tips: "Focus on system design and clean code in the later rounds.",
          interviewQuestions: ["Design YouTube", "LRU Cache", "Median of stream"],
          strategy: "Start with brute force, then optimize while explaining trade-offs.",
          isApproved: true
        },
        {
          studentName: "Anjali Singh",
          company: "Microsoft",
          role: "SDE-2",
          package: "42 LPA",
          yearPlaced: 2022,
          branch: "CSE",
          rating: 4.7,
          interviewRounds: 4,
          tips: "Microsoft values your approach to edge cases and error handling.",
          interviewQuestions: ["Distributed cache", "Binary tree serialization"],
          strategy: "Read CLRS algorithms and practice on LeetCode Medium/Hard.",
          isApproved: true
        },
        {
          studentName: "Rohan Gupta",
          company: "Amazon",
          role: "SDE-1",
          package: "34 LPA",
          yearPlaced: 2023,
          branch: "IT",
          rating: 4.6,
          interviewRounds: 6,
          tips: "Amazon Leadership Principles questions are the key to selection.",
          interviewQuestions: ["Design Amazon cart", "Anagram grouping"],
          strategy: "Make your LP answers concise and use the STAR method.",
          isApproved: true
        },
        {
          studentName: "Kavya Reddy",
          company: "Flipkart",
          role: "SDE-2",
          package: "38 LPA",
          yearPlaced: 2023,
          branch: "ECE",
          rating: 4.8,
          interviewRounds: 4,
          tips: "Flipkart focuses on scale and how you structure your database.",
          interviewQuestions: ["Flash sale system", "Rate limiter"],
          strategy: "Practice High Level Design (HLD) resources like Gaurav Sen.",
          isApproved: true
        },
        {
          studentName: "Arjun Patel",
          company: "Zomato",
          role: "Backend Engineer",
          package: "24 LPA",
          yearPlaced: 2023,
          branch: "CSE",
          rating: 4.5,
          interviewRounds: 3,
          tips: "Focus on DSA and how you optimize API response times.",
          interviewQuestions: ["Design food delivery", "Database optimization"],
          strategy: "Practice coding daily and build real backend projects.",
          isApproved: true
        },
        {
          studentName: "Meera Nair",
          company: "Razorpay",
          role: "SDE-1",
          package: "28 LPA",
          yearPlaced: 2024,
          branch: "IT",
          rating: 4.7,
          interviewRounds: 4,
          tips: "Fintech needs strong knowledge of transactions and consistency.",
          interviewQuestions: ["Payment gateway design", "Concurrent transactions"],
          strategy: "Understand distributed systems and transaction management.",
          isApproved: true
        }
      ];
      await Alumni.insertMany(sampleAlumni);
      alumni = await Alumni.find(query).sort({ yearPlaced: -1 });
    }

    return successResponse(res, 200, 'Alumni list fetched', alumni);
  } catch (error) {
    next(error);
  }
};

exports.getAlumniById = async (req, res, next) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) return errorResponse(res, 404, 'Alumni record not found');
    return successResponse(res, 200, 'Alumni details fetched', alumni);
  } catch (error) {
    next(error);
  }
};

exports.addAlumni = async (req, res, next) => {
  try {
    const alumni = await Alumni.create(req.body);
    return successResponse(res, 201, 'Alumni entry added', alumni);
  } catch (error) {
    next(error);
  }
};

exports.seedAlumniData = async (req, res, next) => {
  try {
    const sampleAlumni = [
      {
        studentName: "Vikram Rao",
        company: "Google",
        role: "SWE-3",
        package: "52 LPA",
        yearPlaced: 2022,
        branch: "CSE",
        rating: 4.9,
        interviewRounds: 5,
        tips: "Focus on system design and clean code in the later rounds.",
        interviewQuestions: ["Design YouTube", "LRU Cache", "Median of stream"],
        strategy: "Start with brute force, then optimize while explaining trade-offs."
      },
      {
        studentName: "Anjali Singh",
        company: "Microsoft",
        role: "SDE-2",
        package: "42 LPA",
        yearPlaced: 2022,
        branch: "CSE",
        rating: 4.7,
        interviewRounds: 4,
        tips: "Microsoft values your approach to edge cases and error handling.",
        interviewQuestions: ["Distributed cache", "Binary tree serialization"],
        strategy: "Read CLRS algorithms and practice on LeetCode Medium/Hard."
      },
      {
        studentName: "Rohan Gupta",
        company: "Amazon",
        role: "SDE-1",
        package: "34 LPA",
        yearPlaced: 2023,
        branch: "IT",
        rating: 4.6,
        interviewRounds: 6,
        tips: "Amazon Leadership Principles questions are the key to selection.",
        interviewQuestions: ["Design Amazon cart", "Anagram grouping"],
        strategy: "Make your LP answers concise and use the STAR method."
      },
      {
        studentName: "Kavya Reddy",
        company: "Flipkart",
        role: "SDE-2",
        package: "38 LPA",
        yearPlaced: 2023,
        branch: "ECE",
        rating: 4.8,
        interviewRounds: 4,
        tips: "Flipkart focuses on scale and how you structure your database.",
        interviewQuestions: ["Flash sale system", "Rate limiter"],
        strategy: "Practice High Level Design (HLD) resources like Gaurav Sen."
      },
      {
        studentName: "Arjun Patel",
        company: "Zomato",
        role: "Backend Engineer",
        package: "24 LPA",
        yearPlaced: 2023,
        branch: "CSE",
        rating: 4.5,
        interviewRounds: 3,
        tips: "Focus on DSA and how you optimize API response times.",
        interviewQuestions: ["Design food delivery", "Database optimization"],
        strategy: "Practice coding daily and build real backend projects."
      },
      {
        studentName: "Meera Nair",
        company: "Razorpay",
        role: "SDE-1",
        package: "28 LPA",
        yearPlaced: 2024,
        branch: "IT",
        rating: 4.7,
        interviewRounds: 4,
        tips: "Fintech needs strong knowledge of transactions and consistency.",
        interviewQuestions: ["Payment gateway design", "Concurrent transactions"],
        strategy: "Understand distributed systems and transaction management."
      }
    ];

    await Alumni.deleteMany({}); // Optional: clear existing
    const seeded = await Alumni.insertMany(sampleAlumni);
    return successResponse(res, 201, `${seeded.length} alumni records seeded`);
  } catch (error) {
    next(error);
  }
};
