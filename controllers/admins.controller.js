import User from "../models/User.js";
import Program from "../models/Program.js";
import Gym from "../models/Gym.js";

// Lister tous les utilisateurs avec pagination
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ role: "athlete" }).skip(skip).limit(limit);
    const totalUsers = await User.countDocuments({ role: "athlete" }); 

    res.json({
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Activer un compte
export const activateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    user.isActive = true;
    await user.save();

    res.json({ message: "Compte activé avec succès", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Désactiver un compte
export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    user.isActive = false;
    await user.save();

    res.json({ message: "Compte désactivé avec succès", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fonction utilitaire pour les stats programmes
const getProgramStatsData = async () => {
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

// Statistiques pour dashboard
export const getStats = async (req, res) => {
  try {
    const totalAthletes = await User.countDocuments({role:"athlete"});
    const activeAthletes = await User.countDocuments({ role: "athlete", isActive: true });
    const inactiveAthletes = await User.countDocuments({ role: "athlete", isActive: false });
    const totalCoaches = await User.countDocuments({ role: "coach" });
    const totalGyms = await Gym.countDocuments();
    
    // Utilisez la fonction utilitaire pour les stats programmes
    const programStats = await getProgramStatsData();

    res.json({
      totalAthletes,
      activeAthletes,
      inactiveAthletes,
      totalCoaches,
      totalGyms,
      totalPrograms: programStats.totalPrograms,
      pendingPrograms: programStats.pendingPrograms,
      approvedPrograms: programStats.approvedPrograms,
      rejectedPrograms: programStats.rejectedPrograms,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lister tous les programmes
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

// Valider un programme
export const approveProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program)
      return res.status(404).json({ message: "Programme non trouvé" });

    program.status = "approved";
    await program.save();

    res.json({ message: "Programme validé avec succès ", program });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Rejeter un programme
export const rejectProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program)
      return res.status(404).json({ message: "Programme non trouvé" });

    program.status = "rejected";
    await program.save();

    res.json({ message: "Programme rejeté ", program });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};