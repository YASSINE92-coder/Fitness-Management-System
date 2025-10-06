import qs from "qs";

const filterQuery = (req, allowedFields = {}, searchableFields = []) => {
  const query = qs.parse(req.query);
  const filteredQuery = {};
  Object.keys(query).forEach((key) => {
    if (allowedFields[key]) {
      const Parser = allowedFields[key];
      let fieldValue = query[key];
      if (typeof fieldValue === "object" && fieldValue !== null) {
        const operators = Object.keys(fieldValue);
        operators.forEach((operator) => {
          fieldValue[operator] = Parser(fieldValue[operator]);
        });
        filteredQuery[key] = fieldValue;
      } else {
        filteredQuery[key] = Parser(fieldValue);
      }
    }
  });

  const parsed = JSON.parse(
    JSON.stringify(filteredQuery).replace(
      /\b(gt|gte|lt|lte|in|ne|nin|eq|regex)\b/g,
      (match) => `$${match}`
    )
  );
  if (query?.search) {
    parsed.$or = searchableFields.map((field) => ({
      [field]: { $regex: query.search, $options: "i" },
    }));
  }

  return parsed;
};
const ObjectId = (value) => {
  return value.padStart(24, "0");
};
export { ObjectId };
export default filterQuery;
