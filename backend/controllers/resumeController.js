import Resume from "../models/Resume.js";
import cloudinary from "../config/cloudinary.js";

import fs from "fs";


export const uploadResume = async (req, res, next) => {
  try {
    const { resume_name, category } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a resume file" });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "internship-tracker/resumes",   // 👈 sirf yahi line change hui
      resource_type: "raw",
    });
    fs.unlinkSync(req.file.path);

    const lastResume = await Resume.findOne({
      user_id: req.user.id,
      category,
    }).sort({ version: -1 });

    const nextVersion = lastResume ? lastResume.version + 1 : 1;

    const resume = await Resume.create({
      user_id: req.user.id,
      resume_name,
      file_url: result.secure_url,
      file_public_id: result.public_id,
      category,
      version: nextVersion,
    });

    res.status(201).json({ success: true, resume });
  console.log(result);
  } catch (err) {
  throw err;
}
};

// @desc    Get resumes
// @route   GET /api/resumes
// @access  Private
export const getResumes = async (req, res, next) => {
  try {
    const query = {};

    // Student can view only their own resumes
    if (req.user.role === "student") {
      query.user_id = req.user._id;
    }

    // Admin can filter resumes by a specific user
    if (req.user.role === "admin" && req.query.user_id) {
      query.user_id = req.query.user_id;
    }

    const resumes = await Resume.find(query)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get a single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
export const getResumeById = async (req, res, next) => {
  try {
    let resume;

    // Student can access only their own resume
    if (req.user.role === "student") {
      resume = await Resume.findOne({
        _id: req.params.id,
        user_id: req.user._id,
      });
    }

    // Admin can access any resume
    else {
      resume = await Resume.findById(req.params.id);
    }

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    return res.status(200).json({
      success: true,
      resume,
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req, res, next) => {
  try {
    let resume;

    // Student can delete only their own resume
    if (req.user.role === "student") {
      resume = await Resume.findOne({
        _id: req.params.id,
        user_id: req.user._id,
      });
    }

    // Admin can delete any resume
    else {
      resume = await Resume.findById(req.params.id);
    }

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    // Delete file from Cloudinary
    if (resume.file_public_id) {
      await cloudinary.uploader.destroy(resume.file_public_id, {
        resource_type: "raw",
      });
    }

    // Delete document from MongoDB
    await resume.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully.",
    });

  } catch (error) {
    next(error);
  }
};

