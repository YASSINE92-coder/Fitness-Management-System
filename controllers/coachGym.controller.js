// controllers/coachGym.controller.js
import Gym from '../models/Gym.js';
import User from '../models/User.js';

/**
 * @desc    Attach a coach to a gym
 * @route   PATCH /coaches/:id/gym
 * @access  Public (for MVP)
 */
export const attachCoachToGym = async (req, res) => {
  try {
    const { id } = req.params;
    const { gymId } = req.body;

    const coach = await User.findOne({ _id: id, role: 'coach' });
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }

    // Utilise "coaches" (pluriel) partout
    await Gym.updateMany(
      { coaches: id }, // ← ici
      { $pull: { coaches: id } } // ← ici
    );

    if (!gym.coaches.includes(id)) { // ← ici
      gym.coaches.push(id); // ← ici
      await gym.save();
    }

    res.json({ message: 'Coach attached to gym successfully', gymId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Detach a coach from any gym
 * @route   PATCH /coaches/:id/gym/remove
 * @access  Public
 */
export const detachCoachFromGym = async (req, res) => {
  try {
    const { id } = req.params;

    const coach = await User.findOne({ _id: id, role: 'coach' });
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    // Utilise "coaches"
    const result = await Gym.updateMany(
      { coaches: id }, // ← ici
      { $pull: { coaches: id } } // ← ici
    );

    res.json({ 
      message: 'Coach detached from gym(s) successfully',
      gymsUpdated: result.modifiedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all coaches of a gym
 * @route   GET /gyms/:id/coaches
 * @access  Public
 */
export const getCoachesOfGym = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }

    // Utilise "coaches"
    const coaches = await User.find({
      _id: { $in: gym.coaches }, // ← ici
      role: 'coach'
    }).select('-password -height -weight -fitness_level -allergies -activity_frequency -goals -bought_programs');

    res.json(coaches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};