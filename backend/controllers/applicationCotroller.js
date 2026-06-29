import Application from "../models/Application.js";

// @desc    Create new application (student applies to a company/role)
// @route   POST /api/applications
// @access  Private (student)
export const createApplication = async (req, res, next) => {
  try {
    const { company_id, resume_id, role, job_link, location, salary } = req.body;

    const application = await Application.create({
      user_id: req.user.id,
      company_id,
      resume_id,
      role,
      job_link,
      location,
      salary,
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this role at this company",
      });
    }
    next(error);
  }
};

// @desc    Get applications (student sees own; admin sees all, filterable)
// @route   GET /api/applications?status=Applied&company_id=...
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

// @desc    Get single application by id
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

// @desc    Update application status
// @route   PUT /api/applications/:id/status
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

// @desc    Update application details
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