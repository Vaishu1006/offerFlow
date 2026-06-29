import AIAnalysis from "../models/AIAnalysis.js";
import Application from "../models/Application.js";

// @desc Generate/save AI match score + missing skills for an application
export const analyzeApplication = async (req, res, next) => {
  try {
    const { application_id, match_score, missing_skills } = req.body;

    const application = await Application.findById(application_id);
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    const analysis = await AIAnalysis.create({ application_id, match_score, missing_skills });
    res.status(201).json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};

export const getAnalysisByApplication = async (req, res, next) => {
  try {
    const analysis = await AIAnalysis.findOne({ application_id: req.params.applicationId });
    if (!analysis) return res.status(404).json({ success: false, message: "Analysis not found" });
    res.status(200).json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};