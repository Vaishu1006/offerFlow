import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    resume_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      minlength: 2, 
      maxlength: 100,
    },
    job_link: {
      type: String,
      required: true,
      validate: {
        validator: (v) => {
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
    location: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: Number,
      min: 0,
    },
    date_applied: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: [
        "Saved",
        "Applied",
        "OA Scheduled",
        "OA Cleared",
        "Interview Round 1",
        "Interview Round 2",
        "HR Round",
        "Selected",
        "Rejected",
      ],
      default: "Saved",
    },
  },
  { timestamps: true }
);

applicationSchema.index({ user_id: 1, status: 1 });
applicationSchema.index({ company_id: 1 });
applicationSchema.index({ user_id: 1, company_id: 1, role: 1 }, { unique: true });
applicationSchema.index({ user_id: 1, date_applied: -1 });

const Application = mongoose.model("Application", applicationSchema);
export default Application;