import { body } from "express-validator";
import AppError from "../errors/AppError.js";
import Program from "../models/Program.js";
import User from "../models/User.js";
import filterQuery, { ObjectId } from "../utils/filter.js";
import paginate from "../utils/paginate.js";
import validate from "../utils/validate.js";
import { handleUpload } from "../utils/cloudinary.js";
const programController = {
  index: async (req, res) => {
    const allowedFields = {
      title: Number,
      price: Number,
      period: Number,
      creator: ObjectId,
    };
    const searchableFields = ["title"];
    const filters = filterQuery(req, allowedFields, searchableFields);
    const { page = 1, limit = 10 } = req.query || {};
    const data = await paginate(Program, page, limit, filters);
    res.json(data);
  },

  show: async (req, res) => {
    const { id } = req.params;
    if (id.length !== 24) throw new AppError("invalid program id");
    const program = await Program.findById(id).populate({
      path: "bought_by",
      select: "-password",
    });
    if (!program) throw new AppError("program does not exist", 404);
    res.json(program);
  },

  store: async (req, res) => {
    handleUpload(req.files.file.buffer);
    handleUpload(req.files.image.buffer);

    console.log(req.files);
    return res.json({ message: "hello" });
    const data = validate(req);
    const userId = req.user.id;
    console.log("here");
    data.goals = data.goals.split(",").map((goal) => goal.trim());
    data.creator = userId;
    if (!req.files || !req.files.file || !req.files.image) {
      throw new AppError(
        "file and image are required",
        400,
        null,
        "file upload error"
      );
    }

    data.file = req.files.file[0].path;
    data.image = req.files.image[0].path;
    console.log(data);
    const program = await Program.create(data);
    program.file = undefined;
    const user = await User.findById(userId);
    user.programs.push(program._id);
    await user.save();

    return res.status(201).json(program);
  },

  update: async (req, res) => {
    const data = validate(req);
    const programId = req.params?.id || null;

    await ownIt(programId, req.user);

    // Update the program
    const updatedProgram = await Program.findByIdAndUpdate(
      programId,
      { $set: data },
      { new: true, runValidators: true }
    );

    return res.json(updatedProgram);
  },

  delete: async (req, res) => {
    const programId = req.params?.id || null;
    const program = await Program.findById(programId);
    if (!program) throw new AppError("program doesn't exist");

    if (req.user.role !== "admin" && req.user.id !== program.creator) {
      throw new AppError("this action not allowed", 400);
    }

    if (program.bought_by.length !== 0) {
      throw new AppError("program is already bought by some users", 400);
    }
    await Program.findByIdAndDelete(programId);

    return res.sendStatus(204);
  },
};

const ownIt = async (programId, user) => {
  // Find the program and verify ownership
  const program = await Program.findById(programId);
  if (!program) throw new AppError("program does not exist", 404);

  // Verify the coach owns this program
  if (program.creator.toString() !== user.id)
    throw new AppError("action not allowed", 403);
  return program;
};

export default programController;
