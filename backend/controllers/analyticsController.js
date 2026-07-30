import Application from "../models/Application.js";
import User from "../models/User.js";
import Interview from "../models/Interview.js";
import Notification from "../models/Notification.js";
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

// analyticsController.js — updated getMyStats only

// @desc    Logged-in student's personal dashboard stats
// @route   GET /api/analytics/my-stats
// @access  Private (student)
export const getMyStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // All applications for this user
    const applications = await Application.find({ user_id: userId });
    const applicationIds = applications.map((app) => app._id);
    const totalApplications = applications.length;

    // Status breakdown (for pie chart)
    const statusCount = {};
    applications.forEach((app) => {
      statusCount[app.status] = (statusCount[app.status] || 0) + 1;
    });

    // 👇 Naya block — Rejection reason breakdown (for Rejection Analysis chart)
    const rejectionBreakdown = {};
    applications.forEach((app) => {
      if (app.status === "Rejected" && app.rejection_reason) {
        rejectionBreakdown[app.rejection_reason] =
          (rejectionBreakdown[app.rejection_reason] || 0) + 1;
      }
    });

    // Offers — pulled straight from status breakdown
    const offers = statusCount["Offered"] || 0;

    // Active interviews — Option B: upcoming, scheduled interviews
    // tied to this user's applications (Interview has no user_id directly)
    const activeInterviews = await Interview.countDocuments({
      application_id: { $in: applicationIds },
      interview_date: { $gte: new Date() },
      status: "scheduled",
    });

    // Response rate = % of applications that moved past "Applied"
    const respondedCount = totalApplications - (statusCount["Applied"] || 0);
    const responseRate =
      totalApplications > 0
        ? Math.round((respondedCount / totalApplications) * 100)
        : 0;

    // Recent activity — last 5 notifications for this user
    const recentActivity = await Notification.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title message type createdAt");

    res.status(200).json({
      success: true,
      stats: {
        totalApplications,
        statusCount,
        rejectionBreakdown, // 👈 response mein add kiya
        offers,
        activeInterviews,
        responseRate,
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};