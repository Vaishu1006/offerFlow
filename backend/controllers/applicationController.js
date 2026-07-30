import Company from "../models/Company.js";
import Application from "../models/Application.js";
import Resume from "../models/Resume.js";
import Notification from "../models/Notification.js"
// @desc    Create a new application (select existing company OR add new one)
// @route   POST /api/applications
// @access  Private (Student)
export const createApplication = async (req, res, next) => {
  try {
    const {
      companyId,
      companyName,
      category,
      location_type,
      resume_id,
      role,
      job_link,
      location,
      salary,
    } = req.body;

    // Verify that the selected resume belongs to the logged-in user
    const resume = await Resume.findOne({
      _id: resume_id,
      user_id: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Selected resume not found or doesn't belong to you.",
      });
    }

    let company = null;
    let approvalStatus = "Approved";
    let requestedCompany = null;

    // User selected an existing company
    if (companyId) {
      company = await Company.findById(companyId);

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found.",
        });
      }
    }

    // User entered a new company
    else if (companyName) {
      const trimmedName = companyName.trim();

      company = await Company.findOne({
        name: {
          $regex: `^${trimmedName}$`,
          $options: "i",
        },
      });

      if (company) {
        approvalStatus = "Approved";
      } else {
        approvalStatus = "Pending";

        requestedCompany = {
          name: trimmedName,
          category: category || "startup",
          location_type: location_type || "onsite",
        };
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Either companyId or companyName is required.",
      });
    }

    const application = await Application.create({
      user_id: req.user._id, // Logged-in user becomes the owner
      company_id: company ? company._id : null,
      requested_company: requestedCompany,
      approval_status: approvalStatus,
      resume_id: resume._id,
      role,
      job_link,
      location,
      salary,
      status: "Applied",
    });
    return res.status(201).json({
      success: true,
      application,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Application already exists.",
      });
    }

    next(error);
  }
};

// @desc    Get applications
// @route   GET /api/applications
// @access  Private
export const getApplications = async (req, res, next) => {
  try {
    const query = {};

    // -----------------------------
    // Ownership Filter
    // -----------------------------

    // Student can only view their own applications
    if (req.user.role === "student") {
      query.user_id = req.user._id;
    }

    // Admin can filter applications by any user
    if (req.user.role === "admin" && req.query.user_id) {
      query.user_id = req.query.user_id;
    }

    // -----------------------------
    // Optional Filters
    // -----------------------------

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.company_id) {
      query.company_id = req.query.company_id;
    }

    const applications = await Application.find(query)
      .populate("company_id", "name category location_type")
      .populate("resume_id", "resume_name version")
      .sort({ date_applied: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get a single application by ID
// @route   GET /api/applications/:id
// @access  Private
export const getApplicationById = async (req, res, next) => {
  try {
    let application;

    // Student can only access their own application
    if (req.user.role === "student") {
      application = await Application.findOne({
        _id: req.params.id,
        user_id: req.user._id,
      })
        .populate("company_id")
        .populate("resume_id");
    }

    // Admin can access any application
    else {
      application = await Application.findById(req.params.id)
        .populate("company_id")
        .populate("resume_id")
        .populate("user_id", "fullName email");
    }

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, rejection_reason } = req.body; // 👈 rejection_reason bhi liya

    let application;

    if (req.user.role === "student") {
      application = await Application.findOne({
        _id: req.params.id,
        user_id: req.user._id,
      });
    } else {
      application = await Application.findById(req.params.id);
    }

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (req.user.role === "student") {
      const allowedStatuses = ["Selected", "Rejected"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Only Selected and Rejected can be updated manually. Other statuses are managed automatically.",
        });
      }
    }

    application.status = status;

    // 👇 Naya block — Rejected hone pe reason bhi save karo
    if (status === "Rejected" && rejection_reason) {
      application.rejection_reason = rejection_reason;
    }

    await application.save();

    // Rejected hone pe interview-related notifications clean up karo
    if (status === "Rejected") {
      await Notification.deleteMany({
        application_id: application._id,
        type: {
          $in: ["interview_scheduled", "interview_updated", "interview_reminder"],
        },
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update editable application fields
// @route   PUT /api/applications/:id
// @access  Private
export const updateApplication = async (req, res, next) => {
  try {
    const allowedFields = [
      "role",
      "job_link",
      "location",
      "salary",
    ];

    let application;

    // Student can update only their own application
    if (req.user.role === "student") {
      application = await Application.findOne({
        _id: req.params.id,
        user_id: req.user._id,
      });
    }

    // Admin can update any application
    else {
      application = await Application.findById(req.params.id);
    }

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // Update only allowed fields
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        application[field] = req.body[field];
      }
    });

    await application.save();

    return res.status(200).json({
      success: true,
      application,
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Private
export const deleteApplication = async (req, res, next) => {
  try {
    let application;

    // Student can delete only their own application
    if (req.user.role === "student") {
      application = await Application.findOne({
        _id: req.params.id,
        user_id: req.user._id,
      });
    }

    // Admin can delete any application
    else {
      application = await Application.findById(req.params.id);
    }

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    await application.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully.",
    });

  } catch (error) {
    next(error);
  }
};

export const getPendingApplications = async (req, res, next) => {
  try {

    const applications = await Application.find({
      approval_status: "Pending",
    })
      .populate("user_id", "fullName email")
      .populate("resume_id", "resume_name version")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {
    next(error);
  }
};

export const approveApplication = async (req, res, next) => {
  try {

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.approval_status === "Approved") {
      return res.status(400).json({
        success: false,
        message: "Application is already approved.",
      });
    }

    const company = await Company.create({
      name: application.requested_company.name,
      category: application.requested_company.category,
      location_type: application.requested_company.location_type,
      website: `https://www.google.com/search?q=${encodeURIComponent(
        application.requested_company.name
      )}`,
    });

    application.company_id = company._id;
    application.approval_status = "Approved";
    application.requested_company = undefined;

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application approved successfully.",
      application,
    });

  } catch (error) {
    next(error);
  }
};