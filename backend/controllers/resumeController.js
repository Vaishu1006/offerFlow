import Resume from "../models/Resume.js";

// @desc    Upload new resume (creates a new version for the user)
// @route   POST /api/resumes
// @access  Private (student)
export const uploadResume = async (req, res, next) => {
  try {
    const { resume_name, file_url, category } = req.body;

    const lastResume = await Resume.findOne({ user_id: req.user.id }).sort({ version: -1 });
    const nextVersion = lastResume ? lastResume.version + 1 : 1;

    const resume = await Resume.create({
      user_id: req.user.id,
      resume_name,
      file_url,
      category,
      version: nextVersion,
    });

    res.status(201).json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all resumes of logged-in user (or any user if admin)
// @route   GET /api/resumes?user_id=...
// @access  Private
export const getResumes = async (req, res, next) => {
  try {
    const userId = req.user.role === "admin" && req.query.user_id ? req.query.user_id : req.user.id;

    const resumes = await Resume.find({ user_id: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: resumes.length, resumes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume by id
// @route   GET /api/resumes/:id
// @access  Private
export const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    if (req.user.role === "student" && resume.user_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a resume version
// @route   DELETE /api/resumes/:id
// @access  Private (owner or admin)
export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    if (req.user.role === "student" && resume.user_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await resume.deleteOne();
    res.status(200).json({ success: true, message: "Resume deleted" });
  } catch (error) {
    next(error);
  }
};