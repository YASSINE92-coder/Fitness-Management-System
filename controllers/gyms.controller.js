// controllers/gyms.controller.js
import Gym from '../models/Gym.js';
import { handleUpload } from '../utils/cloudinary.js'; // Import the new upload handler

// @desc    Create a new gym
// @route   POST /gyms
// @access  Private (gym owner or admin)
export const createGym = async (req, res) => {
  if (req.files && req.files.length > 0) {
    console.log("First file object structure:", JSON.stringify(req.files[0], null, 2));
    console.log("First file buffer length:", req.files[0]?.buffer?.length); // Log buffer length
    console.log("First file original name:", req.files[0]?.originalname);
  } else {
    console.log("No files uploaded.");
  }
  console.log("--- CREATE GYM DEBUG END ---");

  try {
    const { name, location, schedule, pricing, activities, mix, equipements, owner } = req.body;

    // --- FILE UPLOAD LOGIC ---
    // Process files uploaded via multer.memoryStorage
    const photoUploadPromises = (req.files || [])
      .map(file => handleUpload(file.buffer)); // Pass the buffer to handleUpload

    // Wait for all uploads to complete
    const uploadResults = await Promise.allSettled(photoUploadPromises);

    // Extract URLs from successful uploads
    const photoUrls = uploadResults
      .filter(result => result.status === 'fulfilled') // Only successful uploads
      .map(result => result.value?.secure_url) // Get the secure_url from the result
      .filter(url => url); // Remove any undefined/empty URLs

    console.log("Uploaded photo URLs:", photoUrls); // Log the URLs we are about to save
    // --- END FILE UPLOAD LOGIC ---

    // 3. Parse equipements if sent as a string (from FormData)
    let parsedEquipements = [];
    if (equipements) {
      if (typeof equipements === 'string') {
        try {
          parsedEquipements = JSON.parse(equipements);
          // Validate the parsed array structure if necessary
          if (!Array.isArray(parsedEquipements)) {
             console.warn("Parsed equipements is not an array, defaulting to empty array.");
             parsedEquipements = [];
          }
        } catch (e) {
          console.error("Error parsing equipements:", e);
          return res.status(400).json({ message: "Invalid equipements format." });
        }
      } else if (Array.isArray(equipements)) {
        parsedEquipements = equipements;
      } else {
        console.warn("Equipements is not a string or array, ignoring.");
        // Default to empty array if invalid type
        parsedEquipements = [];
      }
    }

    console.log("Parsed equipment ", parsedEquipements);

    // 4. Build gym object
    const gymData = {
      name,
      location,
      schedule,
      pricing: parseFloat(pricing) || 0,
      activities: activities ? activities.split(',').map(a => a.trim()).filter(Boolean) : [],
      mix: mix === 'true',
      equipements: parsedEquipements, // Use the parsed array
      owner,
      photos: photoUrls // Use the URLs from handleUpload
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
  if (req.files && req.files.length > 0) {
    console.log("First file object structure:", JSON.stringify(req.files[0], null, 2)); // Log structure of first file
    console.log("First file buffer length:", req.files[0]?.buffer?.length); // Log buffer length
    console.log("First file original name:", req.files[0]?.originalname);
  } else {
    console.log("No new files uploaded.");
  }
  console.log("--- UPDATE GYM DEBUG END ---");

  try {
    const { id } = req.params;
    const { name, location, schedule } = req.body;
    const pricingRaw = req.body?.pricing;
    const activitiesRaw = req.body?.activities;
    const mixRaw = req.body?.mix;
    const equipementsRaw = req.body?.equipements;

    // Get existing gym to merge photos
    const existingGym = await Gym.findById(id);
    if (!existingGym) {
      return res.status(404).json({ message: 'Gym not found' });
    }

    // --- PHOTO MANAGEMENT LOGIC ---
    // New photos from upload - use 'path' instead of 'secure_url' and add safety filter
    // Process files uploaded via multer.memoryStorage
    const photoUploadPromises = (req.files || [])
      .map(file => handleUpload(file.buffer)); // Pass the buffer to handleUpload

    // Wait for all uploads to complete
    const uploadResults = await Promise.allSettled(photoUploadPromises);

    // Extract URLs from successful uploads
    const newPhotoUrls = uploadResults
      .filter(result => result.status === 'fulfilled') // Only successful uploads
      .map(result => result.value?.secure_url) // Get the secure_url from the result
      .filter(url => url); // Remove any undefined/empty URLs

    console.log("Uploaded new photo URLs:", newPhotoUrls);

    // Attempt to get the final list of photos to keep from the request body.
    // The frontend should send this as a JSON string via formData.append('finalPhotos', JSON.stringify(photoList))
    let finalPhotoUrls = [...existingGym.photos.filter(Boolean)]; // Default: keep existing, filtered
    if (req.body.finalPhotos) {
      try {
        // Attempt to parse finalPhotos if sent as a string from FormData
        const parsedFinalPhotos = JSON.parse(req.body.finalPhotos);
        if (Array.isArray(parsedFinalPhotos)) {
          // Filter to ensure only valid, non-empty strings are included
          finalPhotoUrls = parsedFinalPhotos.filter(url => url && typeof url === 'string');
          console.log("Using finalPhotos from body:", finalPhotoUrls);
        } else {
          console.warn("finalPhotos from body is not an array, using default existing photos.");
        }
      } catch (e) {
        console.warn("Could not parse finalPhotos from body, using default existing photos.", e);
      }
    } else {
       console.log("No finalPhotos found in body, using default existing photos.");
    }

    // Append newly uploaded photos to the final list determined above
    const updatedPhotos = [...finalPhotoUrls, ...newPhotoUrls];

    console.log("Calculated updatedPhotos array (kept existing + new):", updatedPhotos); // Log the final array before update
    // --- END PHOTO MANAGEMENT LOGIC ---

    // Safe parsers
    const parsePricing = (val) => {
      if (val === undefined || val === null || val === "") return existingGym.pricing;
      const n = parseFloat(val);
      return Number.isFinite(n) ? n : existingGym.pricing;
    };
    const parseActivities = (val) => {
      if (!val) return existingGym.activities;
      if (Array.isArray(val)) return val.filter(Boolean).map((a) => String(a).trim());
      return String(val)
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);
    };
    const parseMix = (val) => {
      if (val === undefined || val === null || val === "") return existingGym.mix;
      if (typeof val === 'boolean') return val;
      const s = String(val).toLowerCase();
      if (s === 'true' || s === '1' || s === 'yes') return true;
      if (s === 'false' || s === '0' || s === 'no') return false;
      return existingGym.mix;
    };
    // --- UPDATED EQUIPEMENTS PARSER ---
    // This function now handles both the old boolean object format (sent by old frontend)
    // and the new array of equipment objects format (sent by new frontend).
    const parseEquipements = (val) => {
        // Default: keep existing equipment list
        let result = existingGym.equipements;

        if (val) {
            if (typeof val === 'string') {
                try {
                    const parsed = JSON.parse(val);
                    // Check if the parsed value is an array (new format)
                    if (Array.isArray(parsed)) {
                        result = parsed;
                    } else if (parsed && typeof parsed === 'object') {
                        // Check if the parsed value is an object (old format)
                        // If it's the old boolean object, we can't directly convert it here
                        // without knowing the full catalog. For now, log a warning and keep existing.
                        // In a future update, the frontend should send the new format.
                        console.warn("Received old equipment format object, keeping existing array.", parsed);
                        // Optional: Convert old boolean object to new format if catalog is available
                        // This requires the EQUIPMENT_CATALOG or similar mapping.
                        // For now, keep as is.
                        // result = convertOldFormatToObject(parsed); // Implement if needed
                    } else {
                        console.warn("Parsed equipements is neither an array nor an object, keeping existing.");
                    }
                } catch (e) {
                    console.error("Error parsing equipements:", e);
                    // Keep existing if parsing fails
                }
            } else if (Array.isArray(val)) {
                // If it's already an array (new format from frontend), use it
                result = val;
            } else if (val && typeof val === 'object') {
                // If it's an object (old format from frontend via FormData, unlikely but possible if key is not stringified),
                // log a warning and keep existing.
                 console.warn("Received old equipment format object directly (not stringified), keeping existing array.", val);
                 // Optional: Convert old boolean object to new format if catalog is available
                 // result = convertOldFormatToObject(val); // Implement if needed
            } else {
                console.warn("Equipements is not a string, array, or object, keeping existing.");
            }
        }

        // Validate equipment objects (only applies to the new array format)
        // Ensure each object in the array has 'title' and 'picture' properties.
        if (Array.isArray(result)) {
            return result.filter(eq => eq && typeof eq === 'object' && eq.title && eq.picture);
        } else {
            // If result is not an array (e.g., kept old format), return it as is or an empty array
            // Returning an empty array might be safer if the expectation is always an array.
            // For now, keep the old value to avoid data loss if it was somehow an object/array previously.
            console.warn("Final equipment result is not an array, returning as is.", result);
            return result; // Or return [] if you strictly want an array
        }
    };
    // --- END UPDATED EQUIPEMENTS PARSER ---

    const updateData = {
      name: name !== undefined ? name : existingGym.name,
      location: location !== undefined ? location : existingGym.location,
      schedule: schedule !== undefined ? schedule : existingGym.schedule,
      pricing: parsePricing(pricingRaw),
      activities: parseActivities(activitiesRaw),
      mix: parseMix(mixRaw),
      equipements: parseEquipements(equipementsRaw), // Use the updated parser
      photos: updatedPhotos // Use the calculated final array
    };

    console.log("Final updateData being saved:", updateData); // Log the final data before saving

    const gym = await Gym.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true
    });

    if (!gym) {
        // This should ideally not happen if findById succeeded earlier, but good to check
        return res.status(404).json({ message: 'Gym not found after update attempt' });
    }

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