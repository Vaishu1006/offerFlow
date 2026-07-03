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