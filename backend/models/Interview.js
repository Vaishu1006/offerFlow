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
        "Interview Round 1",
        "Interview Round 2",
        "System Design",
        "Managerial",
        "HR Round",
        "Other",
      ],
      required: true,
    },

    custom_round_name: {
      type: String,
      trim: true,
      maxlength: 100,
      required: function () {
        return this.round_type === "Other";
      },
      validate: {
        validator: function (value) {
          if (this.round_type !== "Other") {
            return !value;
          }
          return true;
        },
        message:
          "Custom round name can only be provided when round type is 'Other'.",
      },
    },

    meeting_url: {
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
        message: "Invalid meeting URL.",
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
    reminder_sent:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

// Indexes
interviewSchema.index({
  application_id: 1,
  interview_date: 1,
});

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;