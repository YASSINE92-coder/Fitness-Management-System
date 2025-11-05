// seeds/seedGyms.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Gym from '../models/Gym.js';

// Charger les variables d'environnement
dotenv.config();

// Données des gyms (intégrées directement pour éviter les problèmes d'import JSON)
const gymsData = [
  {
    "name": "PowerBoost Gym",
    "location": "Casablanca, Morocco",
    "schedule": "Mon - Sat: 6:00 AM - 10:00 PM",
    "pricing": 250,
    "equipements": {
      "treadmill": true,
      "elliptical": true,
      "stationary_bike": true,
      "rowing_machine": true,
      "dumbbells": true,
      "barbells": true,
      "squat_rack": true,
      "bench_press": true,
      "cable_machine": true,
      "lat_pulldown": true,
      "leg_press": true,
      "yoga_mats": true
    },
    "activities": ["Cardio", "Bodybuilding", "Yoga"],
    "mix": true,
    "photos": [
      "https://images.pexels.com/photos/4874188/pexels-photo-4874188.jpeg",
      "https://images.pexels.com/photos/416780/pexels-photo-416780.jpeg",
      "https://images.pexels.com/photos/834031/pexels-photo-834031.jpeg"
    ],
    "isApproved": true
  },
  {
    "name": "Iron Temple Fitness",
    "location": "Marrakech, Morocco",
    "schedule": "Mon - Sun: 7:00 AM - 11:00 PM",
    "pricing": 300,
    "equipements": {
      "treadmill": true,
      "stationary_bike": true,
      "dumbbells": true,
      "barbells": true,
      "bench_press": true,
      "shoulder_press_machine": true,
      "resistance_bands": true,
      "battle_ropes": true
    },
    "activities": ["CrossFit", "HIIT", "Functional Training"],
    "mix": true,
    "photos": [
      "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg",
      "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg",
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg"
    ],
    "isApproved": true
  },
  {
    "name": "ZenMotion Studio",
    "location": "Rabat, Morocco",
    "schedule": "Mon - Fri: 8:00 AM - 9:00 PM",
    "pricing": 200,
    "equipements": {
      "yoga_mats": true,
      "stability_ball": true,
      "medicine_balls": true,
      "resistance_bands": true
    },
    "activities": ["Yoga", "Pilates", "Stretching"],
    "mix": true,
    "photos": [
      "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg",
      "https://images.pexels.com/photos/3823063/pexels-photo-3823063.jpeg",
      "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg"
    ],
    "isApproved": true
  },
  {
    "name": "Alpha Strength Center",
    "location": "Agadir, Morocco",
    "schedule": "Mon - Sat: 5:00 AM - 11:00 PM",
    "pricing": 350,
    "equipements": {
      "barbells": true,
      "dumbbells": true,
      "squat_rack": true,
      "bench_press": true,
      "lat_pulldown": true,
      "leg_press": true,
      "shoulder_press_machine": true
    },
    "activities": ["Bodybuilding", "Powerlifting"],
    "mix": false,
    "photos": [
      "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg",
      "https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg",
      "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg"
    ],
    "isApproved": true
  },
  {
    "name": "CardioZone Club",
    "location": "Tanger, Morocco",
    "schedule": "Everyday: 6:00 AM - 10:00 PM",
    "pricing": 280,
    "equipements": {
      "treadmill": true,
      "elliptical": true,
      "stationary_bike": true,
      "rowing_machine": true
    },
    "activities": ["Cardio", "Aerobics", "Spin Class"],
    "mix": true,
    "photos": [
      "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg",
      "https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg",
      "https://images.pexels.com/photos/4167544/pexels-photo-4167544.jpeg"
    ],
    "isApproved": true
  }
];

const seedGyms = async () => {
  try {
    // Se connecter à MongoDB
    console.log('🔌 Connexion à MongoDB...');
    const uri = process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/training_app';
    await mongoose.connect(uri);

    console.log('🗑️  Suppression des gyms existants...');
    await Gym.deleteMany({});

    console.log('📥 Insertion des 10 gyms...');
    await Gym.insertMany(gymsData);

    console.log('✅ 10 gyms insérés avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed :', error.message);
    process.exit(1);
  } finally {
    // Fermer la connexion proprement
    await mongoose.connection.close();
  }
};

// Lancer le seed
seedGyms();