import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },

    file_url: {
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

    version: {
      type: Number,
      required: true,
      min: 1,
    },

    category: {
      type: String,
      enum: ["General", "WebDev", "Backend", "Frontend", "ML"],
      default: "General",
    },
  },
  { timestamps: true }
);

// Prevent duplicate versions for the same user
resumeSchema.index(
  { user_id: 1, version: 1 },
  { unique: true }
);

// Optimize fetching user's resumes sorted by latest
resumeSchema.index({
  user_id: 1,
  createdAt: -1,
});

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;