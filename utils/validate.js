import { matchedData, validationResult } from "express-validator";
import AppError from "../errors/AppError.js";

const validate = (req) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = {};
    result.array().forEach((error) => {
      errors[error.path] = error.msg;
    });
    throw new AppError("validation error", 400, errors, "validation");
  }
  return matchedData(req);
};

export default validate;
