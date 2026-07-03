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
    console.log("Local file path:", req.file.path);
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
    console.log("UPLOAD SUCCESS");
  console.log(result);
  } catch (err) {
    console.log("FULL CLOUDINARY ERROR:");
  console.dir(err, { depth: null });
  throw err;
}
};

export const getResumes = async (req, res, next) => {
  try {
    const userId = req.user.role === "admin" && req.query.user_id ? req.query.user_id : req.user.id;

    const resumes = await Resume.find({ user_id: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: resumes.length, resumes });
  } catch (error) {
    next(error);
  }
};

export const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    if (req.user.role !== "admin" && resume.user_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    if (req.user.role !== "admin" && resume.user_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await cloudinary.uploader.destroy(resume.file_public_id, { resource_type: "raw" });
    if (resume.file_public_id) {
  await cloudinary.uploader.destroy(resume.file_public_id, { resource_type: "raw" });
}
await resume.deleteOne();

    res.status(200).json({ success: true, message: "Resume deleted" });
  } catch (error) {
    next(error);
  }
};

