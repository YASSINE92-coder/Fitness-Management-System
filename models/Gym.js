// models/Gym.js
import mongoose from 'mongoose';

const gymSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  schedule: {
    type: String,
    required: true
  },
  pricing: {
    type: Number,
    required: true,
    min: 0
  },
  equipements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment'
  }],
  activities: [{
    type: String,
    trim: true
  }],
  mix: {
    type: Boolean,
    default: true
  },
  photos: [{
    type: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // ✅ Ajout du champ pour les coachs
  coaches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Référence vers les Users avec rôle 'coach'
  }]
}, {
  timestamps: true
});

export default mongoose.model('Gym', gymSchema);