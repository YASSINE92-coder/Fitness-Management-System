import { checkSchema } from "express-validator";

const getProgramValidator = checkSchema({
  search: {
    in: ["query"],
    isString: true,
    optional: true,
  },
  creator: {
    in: ["query"],
    isString: true,
    optional: true,
  },
  "price": {
    in: ["query"],
    isString: true,
    optional: true,
  },
  sortOrder: {
    in: ["query"],
    isInt: true,
    toInt: true,
    optional: true,
    isIn: {
      options: [1, -1],
    },
  },
});
export default getProgramValidator;
