// adminProgram.controller.js
import Program from "../models/Program.js";

// Fonction réutilisable pour les stats programmes
export const getProgramStatsData = async () => {
  try {
    const totalPrograms = await Program.countDocuments();
    const pendingPrograms = await Program.countDocuments({ status: "pending" });
    const approvedPrograms = await Program.countDocuments({ status: "approved" });
    const rejectedPrograms = await Program.countDocuments({ status: "rejected" });

    return {
      totalPrograms,
      pendingPrograms,
      approvedPrograms,
      rejectedPrograms,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getProgramStats = async (req, res) => {
  try {
    const stats = await getProgramStatsData();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllPrograms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const programs = await Program.find()
      .populate("creator", "username email")
      .skip(skip)
      .limit(limit);

    const totalPrograms = await Program.countDocuments();

    res.json({
      page,
      limit,
      totalPrograms,    
      totalPages: Math.ceil(totalPrograms / limit),
      programs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProgramStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Le status doit être 'approved' ou 'rejected'" });
    }

    const program = await Program.findById(id);
    if (!program) return res.status(404).json({ message: "Programme introuvable" });

    program.status = status;
    await program.save();

    res.json({ message: `Programme ${status} avec succès` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};