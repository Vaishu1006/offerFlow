import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      unique: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "ai",
        "automotive",
        "tech",
        "consulting",
        "retail",
        "education",
        "finance",
        "gaming",
        "healthcare",
        "startup",
        "telecom"

      ],
    },

    location_type: {
      type: String,
      required: true,
      enum: ["remote", "onsite", "hybrid"],
    },

    website: {
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
        message: "Invalid Website URL",
      },
    },

    career_page: {
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
        message: "Invalid Career Page URL",
      },
    },

    founded_year: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear(),
    },

    employee_count: {
      type: Number,
      min: 1,
    },
  },
  { timestamps: true }
);

// Fast searching by company name
companySchema.index({ name: "text" });

// Prevent duplicate company + website combinations
companySchema.index(
  { name: 1, website: 1 },
  { unique: true }
);

const Company = mongoose.model("Company", companySchema);

export default Company;