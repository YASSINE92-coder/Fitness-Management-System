// models/Gym.js
import mongoose from 'mongoose';

const gymSchema = new mongoose.Schema({

    location: {
        type: String,
        required: true
    },
    equipements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment'
    }],
    coach: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
      is_approved: {
      type: Boolean,
      default: false,
    },
    schedule: {
        type: String,
        required: true
    },
    mix: {
        type: Boolean,
        default: true
    },
    avtivities: [{
        type: String
    }]
  // Nom de la salle (implicite dans le cahier : "fiche détaillée d’un gym")
  name: {
    type: String,
    required: true,
    trim: true
  },

  // Localisation (textuelle + optionnellement géo pour plus tard)
  location: {
    type: String,
    required: true,
    trim: true
  },

  // Horaires (le cahier demande "horaires" → on garde en String pour MVP simple)
  schedule: {
    type: String,
    required: true
  },

  // Tarifs (le cahier demande "tarifs" → on ajoute un champ pricing)
  pricing: {
    type: Number,
    required: true,
    min: 0
  },

  // Équipements disponibles (référence vers Equipment)
  equipements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment'
  }],

  // Activités proposées (correction de "avtivities" → "activities")
  activities: [{
    type: String,
    trim: true
  }],

  // Salle mixte ou non
  mix: {
    type: Boolean,
    default: true
  },

  // Photos (le cahier demande "photos")
  photos: [{
    type: String // URLs des images (ex: Cloudinary, S3, ou chemin local)
  }],

  // Référence à l'utilisateur propriétaire (User avec rôle 'gym')
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Gym', gymSchema);