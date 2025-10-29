// src/controllers/athleteGym.controller.js
import User from '../models/User.js';
import Gym from '../models/Gym.js'; 

export const getAthletesOfGym = async (req, res) => {
  try {
    const { id } = req.params;

    // This will fail with "Gym is not defined" if Gym is not imported
    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }

    const athletes = await User.find({
      _id: { $in: gym.athletes || [] },
      role: 'athlete'
    }).select('-password -refreshTokens -__v -height -weight -fitness_level -allergies -activity_frequency -goals -bought_programs');

    res.json(athletes);
  } catch (error) {
    console.error('Error in getAthletesOfGym:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};