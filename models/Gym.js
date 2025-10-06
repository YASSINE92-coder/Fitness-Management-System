import mongoose from 'mongoose';

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
    required: true
  },

  // Tarification
  pricing: {
    type: Number,
    required: true,
    min: 0
  },

  // Équipements disponibles
  equipements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment'
  }],

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

  // Propriétaire du gym
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // ✅ Association avec les coachs
  coaches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Référence vers les utilisateurs avec rôle 'coach'
  }],

  // ✅ Statut d’approbation par un admin
  is_approved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Gym', gymSchema);
