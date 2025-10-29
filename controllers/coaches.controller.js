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

    const { password: _, ...coachResponse } = coach.toObject();
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
    // Exclure les champs d'athlète + mot de passe
    const coaches = await User.find({ role: 'coach' })
      .select('-password -height -weight -fitness_level -allergies -activity_frequency -goals -bought_programs');
    res.json(coaches);
  } catch (error) {
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