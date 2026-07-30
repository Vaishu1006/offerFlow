import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Will be null until admin approves a new company
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
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

    // User updates this throughout the recruitment process
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

    // Only set when status is "Rejected" — used for Rejection Analysis dashboard
    rejection_reason: {
      type: String,
      enum: [
        "DSA",
        "Communication",
        "Resume",
        "System Design",
        "Projects",
        "Unknown",
      ],
      default: null,
    },
    
    // Only populated if the company doesn't exist
    requested_company: {
      name: {
        type: String,
        trim: true,
      },

      category: {
        type: String,
        default: "startup",
      },

      location_type: {
        type: String,
        default: "onsite",
      },
    },

    // Used only for admin verification
    approval_status: {
      type: String,
      enum: ["Approved", "Pending"],
      default: "Approved",
    },
  },
  {
    timestamps: true,
  }
);

// -------------------- INDEXES --------------------

applicationSchema.index({ user_id: 1, status: 1 });

applicationSchema.index({ company_id: 1 });

applicationSchema.index(
  { user_id: 1, company_id: 1, role: 1 },
  { unique: true, partialFilterExpression: { company_id: { $exists: true } } }
);

applicationSchema.index({ user_id: 1, date_applied: -1 });

applicationSchema.index({ approval_status: 1 });

// -------------------------------------------------

const Application = mongoose.model("Application", applicationSchema);

export default Application;