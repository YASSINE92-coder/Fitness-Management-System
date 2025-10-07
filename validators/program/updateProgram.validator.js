import { checkSchema } from "express-validator";

const updateProgramValidator = checkSchema({
  title: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Title must be a string",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Title must be at least 3 characters long",
    },
  },

  program_goals: {
    in: ["body"],
    optional: true,
    isArray: {
      errorMessage: "program_goals must be an array",
    },
  },

  "program_goals.*": {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Each program goal must be a string",
    },
  },

  price: {
    in: ["body"],
    optional: true,
    isFloat: {
      options: { min: 0 },
      errorMessage: "Price must be a positive number",
    },
  },

  period: {
    in: ["body"],
    optional: true,
    isInt: {
      errorMessage: "Period must be a valid number",
    },
  },

  active: {
    optional: true,
    isBoolean: {
      errorMessage: "active state accept only true or false",
    },
  },
});

export default updateProgramValidator;
