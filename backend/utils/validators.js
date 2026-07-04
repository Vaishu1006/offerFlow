import { body, validationResult } from "express-validator";

// Reusable middleware to check validation results and short-circuit with 400
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Validation chain for POST /api/applications
export const validateCreateApplication = [
  body("companyId")
    .optional()
    .isMongoId()
    .withMessage("Invalid companyId"),

  body("companyName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("companyName must be between 2 and 100 characters"),

  body().custom((value) => {
    if (!value.companyId && !value.companyName) {
      throw new Error("Either companyId or companyName is required");
    }
    return true;
  }),

  body("category")
    .optional()
    .isIn([
      "ai", "automotive", "tech", "consulting", "retail",
      "education", "finance", "gaming", "healthcare", "startup", "telecom",
    ])
    .withMessage("Invalid category"),

  body("location_type")
    .optional()
    .isIn(["remote", "onsite", "hybrid"])
    .withMessage("Invalid location_type"),

  body("resume_id")
    .notEmpty()
    .withMessage("resume_id is required")
    .isMongoId()
    .withMessage("Invalid resume_id"),

  body("role")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("role must be between 2 and 100 characters"),

  body("job_link")
    .notEmpty()
    .withMessage("job_link is required")
    .isURL()
    .withMessage("job_link must be a valid URL"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("location is required"),

  body("salary")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("salary must be a positive number"),

  handleValidationErrors,
];

// Validation chain for PUT /api/applications/:id/status
export const validateUpdateStatus = [
  body("status")
    .notEmpty()
    .withMessage("status is required")
    .isIn([
      "Saved", "Applied", "OA Scheduled", "OA Cleared",
      "Interview Round 1", "Interview Round 2", "HR Round",
      "Selected", "Rejected",
    ])
    .withMessage("Invalid status value"),

  handleValidationErrors,
];

// Validation chain for PUT /api/applications/:id
export const validateUpdateApplication = [
  body("role")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("role must be between 2 and 100 characters"),

  body("job_link")
    .optional()
    .isURL()
    .withMessage("job_link must be a valid URL"),

  body("location")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("location cannot be empty"),

  body("salary")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("salary must be a positive number"),

  handleValidationErrors,
];

// ====================== INTERVIEW VALIDATOR ======================

export const interviewValidator = [

  // Validate application_id
  // Why?
  // Every interview must belong to an existing application.
  body("application_id")
    .notEmpty()
    .withMessage("Application ID is required.")
    .isMongoId()
    .withMessage("Invalid Application ID."),

  // Validate interview_date
  // Why?
  // Every interview must have a valid scheduled date.
  body("interview_date")
    .notEmpty()
    .withMessage("Interview date is required.")
    .isISO8601()
    .withMessage("Invalid interview date.")
    .toDate(),

  // Validate round_type
  // Why?
  // Prevent users from sending random interview round names.
  body("round_type")
    .notEmpty()
    .withMessage("Round type is required.")
    .isIn([
      "OA",
      "Interview Round 1",
      "Interview Round 2",
      "System Design",
      "Managerial",
      "HR Round",
      "Other",
    ])
    .withMessage("Invalid round type."),

  // Validate custom_round_name
  // Why?
  // Required only when round_type = "Other".
  // Also prevents sending custom_round_name for predefined rounds.
  body("custom_round_name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Custom round name cannot exceed 100 characters.")
    .custom((value, { req }) => {

      if (req.body.round_type === "Other" && !value) {
        throw new Error(
          "Custom round name is required when round type is 'Other'."
        );
      }

      if (req.body.round_type !== "Other" && value) {
        throw new Error(
          "Custom round name should only be provided when round type is 'Other'."
        );
      }

      return true;
    }),

  // Validate meeting_url
  // Why?
  // Meeting URL is optional but if provided, it must be valid.
  body("meeting_url")
    .optional()
    .isURL()
    .withMessage("Invalid meeting URL."),

  // Validate interview status
  // Why?
  // Prevent invalid status values.
  body("status")
    .optional()
    .isIn([
      "scheduled",
      "completed",
      "passed",
      "failed",
    ])
    .withMessage("Invalid interview status."),

  // Validate interview notes
  // Why?
  // Keeps notes meaningful while avoiding huge text.
  body("interview_notes")
    .optional()
    .trim()
    .isLength({
      min: 10,
      max: 2000,
    })
    .withMessage(
      "Interview notes must be between 10 and 2000 characters."
    ),
];

export const updateInterviewValidator = [

  // application_id (optional in update)
  body("application_id")
    .optional()
    .isMongoId()
    .withMessage("Invalid Application ID."),

  // interview_date (optional)
  body("interview_date")
    .optional()
    .isISO8601()
    .withMessage("Invalid interview date format.")
    .toDate(),

  // round_type (optional)
  body("round_type")
    .optional()
    .isIn([
      "OA",
      "Interview Round 1",
      "Interview Round 2",
      "System Design",
      "Managerial",
      "HR Round",
      "Other",
    ])
    .withMessage("Invalid round type."),

  // custom_round_name validation logic
  // Why?
  // Same rule as create:
  // - required only when round_type = "Other"
  // - not allowed otherwise
  body("custom_round_name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Custom round name cannot exceed 100 characters.")
    .custom((value, { req }) => {

      if (req.body.round_type === "Other" && !value) {
        throw new Error(
          "Custom round name is required when round type is 'Other'."
        );
      }

      if (req.body.round_type !== "Other" && value) {
        throw new Error(
          "Custom round name is only allowed when round type is 'Other'."
        );
      }

      return true;
    }),

  // meeting_url (optional)
  body("meeting_url")
    .optional()
    .isURL()
    .withMessage("Invalid meeting URL."),

  // status (optional)
  body("status")
    .optional()
    .isIn([
      "scheduled",
      "completed",
      "passed",
      "failed",
    ])
    .withMessage("Invalid interview status."),

  // interview_notes (optional)
  body("interview_notes")
    .optional()
    .trim()
    .isLength({
      min: 10,
      max: 2000,
    })
    .withMessage(
      "Interview notes must be between 10 and 2000 characters."
    ),
];