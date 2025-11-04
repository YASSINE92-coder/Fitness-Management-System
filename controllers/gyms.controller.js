// controllers/gyms.controller.js
import Gym from '../models/Gym.js';

// @desc    Create a new gym
// @route   POST /gyms
// @access  Private (gym owner or admin)
export const createGym = async (req, res) => {
  // Debug logs for creation
  console.log("--- CREATE GYM DEBUG START ---");
  console.log("Raw req.body:", req.body);
  console.log("Raw req.files:", req.files);
  if (req.files && req.files.length > 0) {
    console.log("First file object structure:", JSON.stringify(req.files[0], null, 2));
    console.log("First file path:", req.files[0]?.path);
    console.log("First file secure_url:", req.files[0]?.secure_url); // This should be undefined now
  } else {
    console.log("No files uploaded.");
  }
  console.log("--- CREATE GYM DEBUG END ---");

  try {
    const { name, location, schedule, pricing, activities, mix, equipements, owner } = req.body;

    // 2. Extract Cloudinary URLs from uploaded files using 'path'
    const photoUrls = (req.files || []) // Handle case where no files are uploaded
      .map(file => file.path) // Use 'path' which contains the Cloudinary URL
      .filter(Boolean); // Remove any null/undefined paths

    console.log("Extracted photoUrls:", photoUrls); // Log the URLs we are about to save

    // 3. Build gym object
    const gymData = {
      name,
      location,
      schedule,
      pricing: parseFloat(pricing) || 0,
      activities: activities ? activities.split(',').map(a => a.trim()).filter(Boolean) : [],
      mix: mix === 'true',
      equipements: typeof equipements === 'string'
        ? JSON.parse(equipements)
        : equipements || {},
      owner,
      photos: photoUrls
    };

    console.log("Final gymData being saved:", gymData); // Log the final data before saving

    const gym = new Gym(gymData);
    await gym.save();
    res.status(201).json(gym);
  } catch (error) {
    console.error('Create gym error:', error); // Log the specific error
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all gyms (with optional filters)
// @route   GET /gyms
// @access  Public
export const getAllGyms = async (req, res) => {
  try {
    const { location, equipment, activities, 'price[min]': priceMin, 'price[max]': priceMax, owner } = req.query;

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

    // Filter by owner (ObjectId match) - FIX: Add to main filter object
    if (owner) {
      filter.owner = owner;
    }

    // Filter by price range
    if (priceMin || priceMax) {
      filter.pricing = {};
      if (priceMin) filter.pricing.$gte = parseFloat(priceMin);
      if (priceMax) filter.pricing.$lte = parseFloat(priceMax);
    }

    const gyms = await Gym.find(filter);
    res.json(gyms); // Send response only once here
  } catch (error) {
    console.error('Get all gyms error:', error); // Log the specific error
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
    console.error('Get gym by ID error:', error); // Log the specific error
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update gym by ID
// @route   PATCH /gyms/:id
// @access  Private (gym owner or admin)
export const updateGym = async (req, res) => {
  // Your existing debug logs are preserved
  console.log("--- UPDATE GYM DEBUG START ---");
  console.log("Gym ID:", req.params.id);
  console.log("Raw req.body:", req.body);
  console.log("Raw req.files:", req.files);
  if (req.files && req.files.length > 0) {
    console.log("First file object structure:", JSON.stringify(req.files[0], null, 2)); // Log structure of first file
    console.log("First file path:", req.files[0]?.path); // Log path instead
    console.log("First file secure_url:", req.files[0]?.secure_url); // This should be undefined now
  } else {
    console.log("No new files uploaded.");
  }
  console.log("--- UPDATE GYM DEBUG END ---");

  try {
    const { id } = req.params;
    const { name, location, schedule, pricing, activities, mix, equipements } = req.body;

    // Get existing gym to merge photos
    const existingGym = await Gym.findById(id);
    if (!existingGym) {
      return res.status(404).json({ message: 'Gym not found' });
    }

    // New photos from upload - use 'path' instead of 'secure_url' and add safety filter
    const newPhotoUrls = (req.files || []) // Handle case where no files are uploaded
      .map(file => file.path) // Use 'path' which contains the Cloudinary URL
      .filter(Boolean); // Remove any null/undefined paths

    console.log("Existing photos (before filtering nulls):", existingGym.photos);
    const existingFiltered = existingGym.photos.filter(Boolean); // Filter existing as well
    console.log("Existing photos (after filtering nulls):", existingFiltered);
    console.log("New photoUrls:", newPhotoUrls);

    // Combine with existing photos
    const updatedPhotos = [...existingFiltered, ...newPhotoUrls];

    console.log("Final updatedPhotos array:", updatedPhotos); // Log the final array before update

    const updateData = {
      name,
      location,
      schedule,
      pricing: pricing ? parseFloat(pricing) : existingGym.pricing,
      activities: activities
        ? activities.split(',').map(a => a.trim()).filter(Boolean)
        : existingGym.activities,
      mix: mix !== undefined ? (mix === 'true') : existingGym.mix,
      equipements: typeof equipements === 'string'
        ? JSON.parse(equipements)
        : equipements || existingGym.equipements,
      photos: updatedPhotos // Use the filtered/combined array
    };

    console.log("Final updateData being saved:", updateData); // Log the final data before saving

    const gym = await Gym.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true
    });

    res.json(gym);
  } catch (error) {
    console.error('Update gym error:', error); // Log the specific error
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
    console.error('Delete gym error:', error); // Log the specific error
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a gym (admin only)
// @route   PUT /gyms/:id/approve
// @access  Private (admin only)
export const approveGym = async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id);

    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }

    // Mettez à jour le statut d'approbation
    gym.isApproved = true;
    gym.approvedAt = new Date();
    gym.approvedBy = req.user.id; // L'admin qui approuve

    await gym.save();

    res.json({
      message: 'Gym approved successfully',
      gym
    });
  } catch (error) {
    console.error('Approve gym error:', error); // Log the specific error
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject a gym (admin only)
// @route   PUT /gyms/:id/reject
// @access  Private (admin only)
export const rejectGym = async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id);

    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }

    gym.isApproved = false;
    gym.rejectedAt = new Date();
    gym.rejectedBy = req.user.id;

    await gym.save();

    res.json({
      message: 'Gym rejected successfully',
      gym
    });
  } catch (error) {
    console.error('Reject gym error:', error); // Log the specific error
    res.status(500).json({ message: error.message });
  }
};