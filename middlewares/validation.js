import { body, validationResult } from "express-validator";

// Centralized validation error handler
export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const mapped = errors.array().map((e) => ({ field: e.path, message: e.msg }));
  return res.status(422).json({ errors: mapped });
};

// Common sanitizers against basic XSS vectors and trimming
const commonSanitizers = () => [
  body(["name", "email", "role"]).trim().escape(),
];

// Strong password policy
// At least 8 chars, one uppercase, one lowercase, one number, one special
const strongPasswordRule = body("password")
  .exists({ checkFalsy: true }).withMessage("Password is required")
  .isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .withMessage("Password must be strong (8+ chars, upper, lower, number, symbol)");

export const validateSignup = [
  ...commonSanitizers(),
  body("name").exists({ checkFalsy: true }).isLength({ min: 2, max: 80 }).withMessage("Name must be 2-80 chars"),
  body("email").exists({ checkFalsy: true }).isEmail().withMessage("Valid email is required").normalizeEmail(),
  strongPasswordRule,
  body("role").optional().isIn(["athlete", "coach", "admin" , "gym"]).withMessage("Invalid role"),
  handleValidation,
];

export const validateLogin = [
  body("email").exists({ checkFalsy: true }).isEmail().withMessage("Valid email is required").normalizeEmail(),
  strongPasswordRule,
  handleValidation,
];


