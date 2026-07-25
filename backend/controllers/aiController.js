// aiController.js
import AIAnalysis from "../models/AIAnalysis.js";
import Application from "../models/Application.js";

// Maps a raw score into v1's status color language (gold/teal/coral)
// so the frontend can render a badge without any extra logic.
const getMatchLevel = (score) => {
  if (score >= 75) return { match_level: "Strong Match", level_color: "gold" };
  if (score >= 50) return { match_level: "Good Match", level_color: "teal" };
  return { match_level: "Needs Work", level_color: "coral" };
};

// @desc Generate/save AI match score + missing skills for an application
// @route POST /api/ai/analyze
// @access Private
export const analyzeApplication = async (req, res, next) => {
  try {
    const { application_id, match_score, missing_skills } = req.body;

    const application = await Application.findById(application_id);
    if (!application)
      return res.status(404).json({ success: false, message: "Application not found" });

    const analysis = await AIAnalysis.create({ application_id, match_score, missing_skills });

    res.status(201).json({
      success: true,
      analysis: {
        ...analysis.toObject(),
        ...getMatchLevel(analysis.match_score),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get saved AI analysis for an application
// @route GET /api/ai/analysis/:applicationId
// @access Private
export const getAnalysisByApplication = async (req, res, next) => {
  try {
    const analysis = await AIAnalysis.findOne({ application_id: req.params.applicationId });
    if (!analysis)
      return res.status(404).json({ success: false, message: "Analysis not found" });

    res.status(200).json({
      success: true,
      analysis: {
        ...analysis.toObject(),
        ...getMatchLevel(analysis.match_score),
      },
    });
  } catch (error) {
    next(error);
  }
};