// src/models/equipmentSchema.js
import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  // The name/title of the equipment
  title: {
    type: String,
    required: true,
    trim: true
  },
  // The URL or path to the equipment's image
  picture: {
    type: String,
    required: true // Assuming an image is always required for an equipment entry
  },
  // Optional: details or description of the equipment
  details: {
    type: String,
    trim: true
  },
  // Optional: category/type of equipment (e.g., cardio, strength, free-weights)
  type: {
    type: String,
    trim: true
  }
  // Note: No timestamps needed here as it's embedded within a Gym document
});

// We export the schema, not a model
export default equipmentSchema;