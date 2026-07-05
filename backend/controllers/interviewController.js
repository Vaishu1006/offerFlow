import Interview from "../models/Interview.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";
/// @desc    Schedule a new interview round
// @route   POST /api/interviews
// @access  Private
export const scheduleInterview = async (req, res, next) => {
  try {
    const {
      application_id,
      interview_date,
      round_type,
      custom_round_name,
      meeting_url,
      interview_notes,
    } = req.body;

    let application;

    // Student can schedule interviews only for their own applications
    if (req.user.role === "student") {
      application = await Application.findOne({
        _id: application_id,
        user_id: req.user._id,
      });
    }

    // Admin can schedule interviews for any application
    else {
      application = await Application.findById(application_id);
    }

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // Prevent scheduling interview after final decision
    if (["Selected", "Rejected"].includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: `Interview cannot be scheduled because application is already ${application.status}.`,
      });
    }

    // Prevent duplicate interview scheduling
    const existingInterview = await Interview.findOne({
      application_id,
      round_type,
      interview_date,
    });

    if (existingInterview) {
      return res.status(409).json({
        success: false,
        message: "This interview is already scheduled.",
      });
    }

    // Create interview
    const interview = await Interview.create({
      application_id,
      interview_date,
      round_type,
      custom_round_name,
      meeting_url,
      interview_notes,
    });

    // Automatically update application status
    const statusMapping = {
      OA: "OA Scheduled",
      "Interview Round 1": "Interview Round 1",
      "Interview Round 2": "Interview Round 2",
      "HR Round": "HR Round",
    };

    if (statusMapping[round_type]) {
      application.status = statusMapping[round_type];
      await application.save();
    }

    // Create notification
    try {
  console.log("🔔 Notification block reached");
  console.log("user_id:", application.user_id);
  console.log("interview_id:", interview._id);
  console.log("application_id:", application._id);
  
  const notif = await Notification.create({
    user_id: application.user_id,
    type: "interview_scheduled",
    title: "Interview Scheduled",
    message: `Your ${round_type} has been scheduled on ${new Date(
      interview_date
    ).toLocaleString()}.`,
    interview_id: interview._id,
    application_id: application._id,
  });
  
  console.log("✅ Notification saved:", notif._id);
} catch (err) {
  console.error("❌ Notification Error Message:", err.message);
  console.error("❌ Notification Error Name:", err.name);
  console.error("❌ Full Error:", err);
}
    
    console.log("After notification");
    return res.status(201).json({
      success: true,
      message: "Interview scheduled successfully.",
      interview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get interviews
// @route   GET /api/interviews
// @access  Private
export const getInterviews = async (req, res, next) => {
  try {
    const { application_id, status } = req.query;

    const query = {};

    // Student can view interviews only for their own applications
    if (req.user.role === "student") {
      const applications = await Application.find({
        user_id: req.user._id,
      }).select("_id");

      query.application_id = {
        $in: applications.map((application) => application._id),
      };
    }

    // Admin can filter by application
    if (req.user.role === "admin" && application_id) {
      query.application_id = application_id;
    }

    // Filter by interview status
    if (status) {
      query.status = status;
    }

    const interviews = await Interview.find(query)
      .populate({
        path: "application_id",
        select: "role status company_id user_id",
        populate: [
          {
            path: "company_id",
            select: "name",
          },
          {
            path: "user_id",
            select: "fullName email",
          },
        ],
      })
      .sort({ interview_date: 1 });

    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get single interview by ID
// @route   GET /api/interviews/:id
// @access  Private
export const getInterviewById = async (req, res, next) => {
  try {
    let interview;

    // Student can access only interviews of their own applications
    if (req.user.role === "student") {
      interview = await Interview.findById(req.params.id).populate({
        path: "application_id",
        match: {
          user_id: req.user._id,
        },
        populate: [
          {
            path: "user_id",
            select: "fullName email",
          },
          {
            path: "company_id",
            select: "name",
          },
        ],
      });

      // Interview exists but doesn't belong to this student
      if (!interview || !interview.application_id) {
        return res.status(404).json({
          success: false,
          message: "Interview not found.",
        });
      }
    }

    // Admin can access any interview
    else {
      interview = await Interview.findById(req.params.id).populate({
        path: "application_id",
        populate: [
          {
            path: "user_id",
            select: "fullName email",
          },
          {
            path: "company_id",
            select: "name",
          },
        ],
      });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found.",
        });
      }
    }

    return res.status(200).json({
      success: true,
      interview,
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update interview
// @route   PUT /api/interviews/:id
// @access  Private
export const updateInterview = async (req, res, next) => {
  try {
    const allowedFields = [
      "interview_date",
      "round_type",
      "custom_round_name",
      "meeting_url",
      "status",
      "interview_notes",
    ];

    let interview;

    if (req.user.role === "student") {
      interview = await Interview.findById(req.params.id).populate({
        path: "application_id",
        match: { user_id: req.user._id },
      });

      if (!interview || !interview.application_id) {
        return res.status(404).json({
          success: false,
          message: "Interview not found.",
        });
      }
    } else {
      interview = await Interview.findById(req.params.id)
        .populate("application_id");  // ✅ admin case mein bhi populate

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found.",
        });
      }
    }

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        interview[field] = req.body[field];
      }
    });

    await interview.save();

    // ✅ Corrected notification
    try {
      await Notification.create({
        user_id: interview.application_id.user_id,
        type: "interview_updated",
        title: "Interview Updated",
        message: `Your ${interview.round_type} has been updated on ${new Date(
          interview.interview_date
        ).toLocaleString()}.`,
        interview_id: interview._id,
        application_id: interview.application_id._id,
      });
      console.log("✅ Notification saved");
    } catch (err) {
      console.error("❌ Notification Error:", err.message);
    }

    return res.status(200).json({
      success: true,
      message: "Interview updated successfully.",
      interview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an interview
// @route   DELETE /api/interviews/:id
// @access  Private
export const deleteInterview = async (req, res, next) => {
  try {
    let interview;

    // Student can delete only their own interview
    if (req.user.role === "student") {
      interview = await Interview.findById(req.params.id).populate({
        path: "application_id",
        match: {
          user_id: req.user._id,
        },
      });

      if (!interview || !interview.application_id) {
        return res.status(404).json({
          success: false,
          message: "Interview not found.",
        });
      }
    }

    // Admin can delete any interview
    else {
      interview = await Interview.findById(req.params.id).populate(
        "application_id"
      );

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found.",
        });
      }
    }

    // Create notification before deleting interview
    await Notification.create({
      user_id: interview.application_id.user_id,
      type: "interview_cancelled",
      title: "Interview Cancelled",
      message: `Your ${
        interview.round_type
      } scheduled on ${new Date(
        interview.interview_date
      ).toLocaleString()} has been cancelled.`,
      interview_id: interview._id,
      application_id: interview.application_id._id,
    });

    // Delete interview
    await interview.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Interview deleted successfully.",
    });

  } catch (error) {
    next(error);
  }
};