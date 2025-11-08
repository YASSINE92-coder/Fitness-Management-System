// controllers/equipment.controller.js
import { handleUpload } from '../utils/cloudinary.js'; // Import the upload handler

export const addCustomEquipment = async (req, res) => {
  try {
    const { title, details, type } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    let cloudinaryUrl = '';

    if (req.file) { // Check if a file was uploaded
      // Upload the file buffer to Cloudinary
      const uploadResult = await handleUpload(req.file.buffer);
      cloudinaryUrl = uploadResult.secure_url;
    } else {
      // If no file was provided, maybe return an error or a default URL
      return res.status(400).json({ message: 'Picture is required.' });
    }

    // Construct the equipment object to return
    const customEquipment = {
      title,
      picture: cloudinaryUrl, // Use the URL from Cloudinary
      details: details || '',
      type: type || ''
    };

    // You might want to save this custom equipment to a database here if needed for persistence
    // const newEquipmentEntry = new Equipment(customEquipment);
    // await newEquipmentEntry.save();

    res.status(201).json(customEquipment);
  } catch (error) {
    console.error('Add custom equipment error:', error);
    res.status(500).json({ message: 'Server error while adding custom equipment.', error: error.message });
  }
};