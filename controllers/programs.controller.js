import Program from "../models/Program.js";
import validate from "../utils/validate.js";

const programController = {
  index: async (req, res) => {},
  store: async (req, res) => {
    const data = validate(req);
    data.creator = req.user.id;
    const program = await Program.insertOne(data);
    return res.send(program);
  },
  update: async (req, res) => {},
  delete: async (req, res) => {},
};
export default programController;
