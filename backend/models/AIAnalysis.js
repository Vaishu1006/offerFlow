import mongoose from "mongoose";

const aiAnalysisSchema = new mongoose.Schema(
  {
    application_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    match_score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    missing_skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const AIAnalysis = mongoose.model("AIAnalysis", aiAnalysisSchema);

export default AIAnalysis;