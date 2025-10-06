// controllers/athleteConsultation.controller.js
import Gym from '../models/Gym.js';
import User from '../models/User.js';

/**
 * @desc    Get all gyms for an athlete
 * @route   GET /athletes/:id/gyms
 * @access  Public
 */
export const getGymsForAthlete = async (req, res) => {
  try {
    const athlete = await User.findOne({ _id: req.params.id, role: 'athlete' });
    if (!athlete) return res.status(404).json({ message: 'Athlete not found' });

    const gyms = await Gym.find().select('-owner'); // optionnel: masquer le owner
    res.json(gyms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all coaches for an athlete
 * @route   GET /athletes/:id/coaches
 * @access  Public
 */
export const getCoachesForAthlete = async (req, res) => {
  try {
    const athlete = await User.findOne({ _id: req.params.id, role: 'athlete' });
    if (!athlete) return res.status(404).json({ message: 'Athlete not found' });

    const coaches = await User.find({ role: 'coach' })
      .select('-password -height -weight -fitness_level -allergies -activity_frequency -goals -bought_programs');
    res.json(coaches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};