import Company from "../models/Company.js";
import Application from "../models/Application.js";
import Resume from "../models/Resume.js";
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
        message: "Selected resume not found.",
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
          message: "Company not found",
        });
      }
    }

    // User typed a company name
    else if (companyName) {
      const trimmedName = companyName.trim();

      company = await Company.findOne({
        name: {
          $regex: `^${trimmedName}$`,
          $options: "i",
        },
      });

      // Existing company
      if (company) {
        approvalStatus = "Approved";
      }

      // New company request
      else {
        approvalStatus = "Pending";

        requestedCompany = {
          name: trimmedName,
          category: category || "startup",
          location_type: location_type || "onsite",
        };
      }
    }

    // Neither companyId nor companyName received
    else {
      return res.status(400).json({
        success: false,
        message: "companyId or companyName is required",
      });
    }

    const application = await Application.create({
      user_id: req.user._id,
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

    res.status(201).json({
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

// @desc    Get all applications (student sees own, admin can filter by user_id)
// @route   GET /api/applications
// @access  Private
export const getApplications = async (req, res, next) => {
  try {
    const query = {};

    if (req.user.role === "student") {
      query.user_id = req.user.id;
    } else if (req.query.user_id) {
      query.user_id = req.query.user_id;
    }

    if (req.query.status) query.status = req.query.status;
    if (req.query.company_id) query.company_id = req.query.company_id;

    const applications = await Application.find(query)
      .populate("company_id", "name category location_type")
      .populate("resume_id", "resume_name version")
      .sort({ date_applied: -1 });

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single application by ID
// @route   GET /api/applications/:id
// @access  Private
export const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("company_id")
      .populate("resume_id")
      .populate("user_id", "fullName email");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (req.user.role === "student" && application.user_id._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Applied -> Interview -> Selected/Rejected etc.)
// @route   PATCH /api/applications/:id/status
// @access  Private
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (req.user.role === "student" && application.user_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Update editable application fields
// @route   PUT /api/applications/:id
// @access  Private
export const updateApplication = async (req, res, next) => {
  try {
    const allowedFields = ["role", "job_link", "location", "salary"];
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (req.user.role === "student" && application.user_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) application[field] = req.body[field];
    });

    await application.save();
    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Private
export const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (req.user.role === "student" && application.user_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await application.deleteOne();
    res.status(200).json({ success: true, message: "Application deleted" });
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