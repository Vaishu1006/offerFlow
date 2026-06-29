import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    application_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    interview_date: {
      type: Date,
      required: true,
    },
    round_type: {
      type: String,
      enum: [
        "OA",
        "Technical Round 1",
        "Technical Round 2",
        "System Design",
        "Managerial",
        "HR",
      ],
      required: true,
    },
    meeting_link: {
      type: String,
      validate: {
        validator: (v) => {
          if (!v) return true; 
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: "Invalid URL",
      },
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "passed", "failed"],
      default: "scheduled",
    },
    interview_notes: {
      type: String,
      trim: true,
      minlength: 10, 
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

interviewSchema.index({
  application_id: 1,
  interview_date: 1,
});

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;