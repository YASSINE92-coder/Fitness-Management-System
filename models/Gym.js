// src/models/Gym.js
import mongoose from 'mongoose';
import equipmentSchema from './equipmentSchema.js'; // Import the schema

const gymSchema = new mongoose.Schema({
  // Nom de la salle
  name: {
    type: String,
    required: true,
    trim: true
  },

  // Localisation
  location: {
    type: String,
    required: true,
    trim: true
  },

  // Horaires
  schedule: {
    type: String,
    // required: true
  },

  // Tarification
  pricing: {
    type: Number,
    // required: true,
    min: 0
  },

  // Équipements disponibles - CHANGED: Now an array of embedded documents
  equipements: [equipmentSchema], // Use the imported schema as the type for array elements

  // Activités proposées
  activities: [{
    type: String,
    trim: true
  }],

  // Mixité (salle mixte ou non)
  mix: {
    type: Boolean,
    default: true
  },

  // Photos du gym
  photos: [{
    type: String
  }],

  // Informations de contact
  contact: {
    phone: { type: String, trim: true },
    website: { type: String, trim: true },
  },
   

  // Propriétaire du gym
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  },

  // ✅ Association avec les coachs
  coaches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Référence vers les utilisateurs avec rôle 'coach'
  }],

  athletes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // ✅ Statut d’approbation par un admin
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Gym', gymSchema);