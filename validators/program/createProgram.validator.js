import { checkSchema } from "express-validator";
// Validation middleware
const createProgramValidator = checkSchema({
  title: {
    in: ["body"],
    exists: {
      errorMessage: "Title is required",
    },
    isString: {
      errorMessage: "Title must be a string",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Title must be at least 3 characters long",
    },
  },

  goals: {
    in: ["body"],
    isArray: {
      errorMessage: "goals must be a some text",
    },
  },
  

  price: {
    in: ["body"],
    exists: {
      errorMessage: "Price is required",
    },
    isFloat: {
      options: { min: 0 },
      errorMessage: "Price must be a positive number",
    },
  },

  period: {
    in: ["body"],
    exists: {
      errorMessage: "Period is required",
    },
    isInt: {
      errorMessage: "Period must be a valid number",
    },
  },

  status: {
    in: ["body"],
    optional: true,
    isIn: {
      options: [["pending", "approved", "rejected"]],
      errorMessage: "Status must be one of: pending, approved, rejected",
    },
  },
});

export default createProgramValidator;
