import Gym from '../models/Gym.js';

// @desc    Create a new gym
// @route   POST /gyms
// @access  Private (gym owner or admin)
export const createGym = async (req, res) => {
  try {
    const gym = new Gym(req.body);
    await gym.save();
    res.status(201).json(gym);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all gyms (with optional filters)
// @route   GET /gyms
// @access  Public
export const getAllGyms = async (req, res) => {
  try {
    const { location, equipment, activities, 'price[min]': priceMin, 'price[max]': priceMax } = req.query;

    // Build filter object
    const filter = {};

    // Filter by location (case-insensitive partial match)
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Filter by activities (exact match in array)
    if (activities) {
      filter.activities = { $in: [activities] };
    }

    // Filter by equipment (ObjectId match)
    if (equipment) {
      filter.equipements = equipment; // Mongoose handle single ID in array field
    }

    // Filter by price range
    if (priceMin || priceMax) {
      filter.pricing = {};
      if (priceMin) filter.pricing.$gte = parseFloat(priceMin);
      if (priceMax) filter.pricing.$lte = parseFloat(priceMax);
    }

    const gyms = await Gym.find(filter)

    res.json(gyms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get gym by ID
// @route   GET /gyms/:id
// @access  Public
export const getGymById = async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id);

    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }
    res.json(gym);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update gym by ID
// @route   PATCH /gyms/:id
// @access  Private (gym owner or admin)
export const updateGym = async (req, res) => {
  try {
    const gym = await Gym.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }
    res.json(gym);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete gym by ID
// @route   DELETE /gyms/:id
// @access  Private (gym owner or admin)
export const deleteGym = async (req, res) => {
  try {
    const gym = await Gym.findByIdAndDelete(req.params.id);
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }
    res.json({ message: 'Gym deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};