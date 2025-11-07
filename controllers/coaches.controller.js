// controllers/coaches.controller.js
import User from '../models/User.js';

/**
 * @desc    Create a new coach
 * @route   POST /coaches
 * @access  Public (for MVP - secure later)
 */
export const createCoach = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      cin,
      years_of_experience,
      certificates = [],
      specialization,
      profile = {},
      is_approved = false,
      programs = []
    } = req.body;

    // Ne conserver que les champs pertinents pour un coach
    const coachData = {
      name,
      email,
      password,
      gender,
      cin,
      years_of_experience,
      certificates,
      specialization,
      profile,
      is_approved,
      programs,
      role: 'coach' // forcé
    };

    const coach = new User(coachData);
    await coach.save();

    const {  ...coachResponse } = coach.toObject();
    res.status(201).json(coachResponse);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Get all coaches
 * @route   GET /coaches
 * @access  Public
 */
export const getAllCoaches = async (req, res) => {
  try {
    const { page = 1, limit = 12, q = "", specialty } = req.query;

    const query = { role: "coach" };

    // --- SEARCH by name or speciality ---
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { speciality: { $regex: q, $options: "i" } },
      ];
    }

    // --- FILTER by specialty ---
    if (specialty && specialty !== "all") {
      query.speciality = { $regex: specialty, $options: "i" };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // --- Execute Query ---
    const [coaches, total] = await Promise.all([
      User.find(query)
        .select("-password -refreshTokens")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      coaches,
    });
  } catch (error) {
    console.error("Error fetching coaches:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get coach by ID
 * @route   GET /coaches/:id
 * @access  Public
 */
export const getCoachById = async (req, res) => {
  try {
    const coach = await User.findOne({ 
      _id: req.params.id, 
      role: 'coach' 
    }).select('-password -height -weight -fitness_level -allergies -activity_frequency -goals -bought_programs');

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    res.json(coach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update coach by ID
 * @route   PATCH /coaches/:id
 * @access  Public (for MVP)
 */
export const updateCoach = async (req, res) => {
  try {
    const {
      name,
      email,
      gender,
      cin,
      years_of_experience,
      certificates,
      profile,
      is_Approved,
      specialization,
      programs
    } = req.body;

    // Seuls ces champs peuvent être mis à jour
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (gender !== undefined) updateData.gender = gender;
    if (cin !== undefined) updateData.cin = cin;
    if (years_of_experience !== undefined) updateData.years_of_experience = years_of_experience;
    if (certificates !== undefined) updateData.certificates = certificates;
    if (specialization !== undefined) updateData.specialization = specialization;
    if (profile !== undefined) updateData.profile = profile;
    if (is_Approved !== undefined) updateData.is_Approved = is_Approved;
    if (programs !== undefined) updateData.programs = programs;

    const coach = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'coach' },
      updateData,
      { new: true, runValidators: true }
    ).select('-password -height -weight -fitness_level -allergies -activity_frequency -goals -bought_programs');

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    res.json(coach);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Delete coach by ID
 * @route   DELETE /coaches/:id
 * @access  Public (for MVP)
 */
export const approveCoach = async (req, res) => {
  const { id } = req.params;

  try {
    const coach = await User.findOneAndUpdate(
      { _id: id, role: 'coach' },
      { is_Approved: true, rejectedAt: null, approvedAt: new Date() },
      { new: true }
    ).select('-password -refreshTokens');

    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    res.status(200).json(coach);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Rejeter un coach
export const rejectCoach = async (req, res) => {
  const { id } = req.params;

  try {
    const coach = await User.findOneAndUpdate(
      { _id: id, role: 'coach' },
      { is_Approved: false, approvedAt: null, rejectedAt: new Date() },
      { new: true }
    ).select('-password -refreshTokens');

    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    res.status(200).json(coach);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};







export const deleteCoach = async (req, res) => {
  try {
    const coach = await User.findOneAndDelete({ 
      _id: req.params.id, 
      role: 'coach' 
    });

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    res.json({ message: 'Coach deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};