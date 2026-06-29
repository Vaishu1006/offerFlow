import Interview from "../models/Interview.js";
import Application from "../models/Application.js";

// @desc    Schedule a new interview round for an application
// @route   POST /api/interviews
// @access  Private (admin/mentor)
export const scheduleInterview = async (req, res, next) => {
  try {
    const { application_id, interview_date, round_type, meeting_link, interview_notes } = req.body;

    const application = await Application.findById(application_id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const interview = await Interview.create({
      application_id,
      interview_date,
      round_type,
      meeting_link,
      interview_notes,
    });

    res.status(201).json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

// @desc    Get interviews (filter by application_id, status, or upcoming for calendar view)
// @route   GET /api/interviews?application_id=...&status=scheduled
// @access  Private
export const getInterviews = async (req, res, next) => {
  try {
    const { application_id, status } = req.query;
    const query = {};

    if (application_id) query.application_id = application_id;
    if (status) query.status = status;

    let interviews = await Interview.find(query)
      .populate({
        path: "application_id",
        select: "user_id company_id role",
        populate: [
          { path: "user_id", select: "fullName email" },
          { path: "company_id", select: "name" },
        ],
      })
      .sort({ interview_date: 1 });

    // Students only see interviews tied to their own applications
    if (req.user.role === "student") {
      interviews = interviews.filter(
        (i) => i.application_id?.user_id?._id.toString() === req.user.id
      );
    }

    res.status(200).json({ success: true, count: interviews.length, interviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single interview by id
// @route   GET /api/interviews/:id
// @access  Private
export const getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id).populate("application_id");
    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }
    res.status(200).json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

// @desc    Update interview (reschedule, add notes, change status)
// @route   PUT /api/interviews/:id
// @access  Private (admin/mentor)
export const updateInterview = async (req, res, next) => {
  try {
    const allowedFields = ["interview_date", "round_type", "meeting_link", "status", "interview_notes"];
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) interview[field] = req.body[field];
    });

    await interview.save();
    res.status(200).json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/cancel an interview
// @route   DELETE /api/interviews/:id
// @access  Private (admin/mentor)
export const deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);
    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }
    res.status(200).json({ success: true, message: "Interview deleted" });
  } catch (error) {
    next(error);
  }
};