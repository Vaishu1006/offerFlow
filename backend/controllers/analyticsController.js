import Application from "../models/Application.js";
import User from "../models/User.js";
import Interview from "../models/Interview.js";

// @desc    Dashboard stats - overall counts + status breakdown
// @route   GET /api/analytics/dashboard
// @access  Private (admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalMentors = await User.countDocuments({ role: "mentor" });
    const totalApplications = await Application.countDocuments();
    const totalInterviews = await Interview.countDocuments();

    const statusBreakdown = await Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalMentors,
        totalApplications,
        totalInterviews,
        statusBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Applications grouped by company (for charts)
// @route   GET /api/analytics/applications-by-company
// @access  Private (admin)
export const getApplicationsByCompany = async (req, res, next) => {
  try {
    const data = await Application.aggregate([
      { $group: { _id: "$company_id", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "companies",
          localField: "_id",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          companyId: "$_id",
          companyName: "$company.name",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Applications trend over time (monthly, for line charts)
// @route   GET /api/analytics/applications-trend
// @access  Private (admin)
export const getApplicationsTrend = async (req, res, next) => {
  try {
    const data = await Application.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date_applied" },
            month: { $month: "$date_applied" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Logged-in student's personal stats
// @route   GET /api/analytics/my-stats
// @access  Private (student)
export const getMyStats = async (req, res, next) => {
  try {
    const applications = await Application.find({ user_id: req.user.id });

    const statusCount = {};
    applications.forEach((app) => {
      statusCount[app.status] = (statusCount[app.status] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      stats: { totalApplications: applications.length, statusCount },
    });
  } catch (error) {
    next(error);
  }
};