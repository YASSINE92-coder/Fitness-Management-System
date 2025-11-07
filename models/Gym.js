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
    // required: true
  },

  // Tarification
  pricing: {
    type: Number,
    // required: true,
    min: 0
  },

  // Équipements disponibles
  equipements: {
    // Cardio
    treadmill: { type: Boolean, default: false },
    elliptical: { type: Boolean, default: false },
    stationary_bike: { type: Boolean, default: false },
    rowing_machine: { type: Boolean, default: false },
    
    // Free Weights
    dumbbells: { type: Boolean, default: false },
    barbells: { type: Boolean, default: false },
    kettlebells: { type: Boolean, default: false },
    squat_rack: { type: Boolean, default: false },
    bench_press: { type: Boolean, default: false },
    pull_up_bar: { type: Boolean, default: false },
    
    // Machines
    cable_machine: { type: Boolean, default: false },
    lat_pulldown: { type: Boolean, default: false },
    leg_press: { type: Boolean, default: false },
    pec_deck: { type: Boolean, default: false },
    shoulder_press_machine: { type: Boolean, default: false },
    
    // Functional
    resistance_bands: { type: Boolean, default: false },
    medicine_balls: { type: Boolean, default: false },
    stability_ball: { type: Boolean, default: false },
    battle_ropes: { type: Boolean, default: false },
    yoga_mats: { type: Boolean, default: false }
  },

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
