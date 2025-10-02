// seeds/seedGyms.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Gym from '../models/Gym.js';

// Charger les variables d'environnement
dotenv.config();

// Données des gyms (intégrées directement pour éviter les problèmes d'import JSON)
const gymsData = [
  {
    "name": "FitLife Lyon",
    "location": "15 Rue de la République, Lyon",
    "schedule": "Lun-Ven: 06:00-23:00, Sam-Dim: 08:00-20:00",
    "pricing": 29.99,
    "activities": ["musculation", "cardio", "yoga"],
    "equipements": [],
    "owner": "660000000000000000000001"
  },
  {
    "name": "PowerGym Paris",
    "location": "22 Avenue des Champs-Élysées, Paris",
    "schedule": "24/7",
    "pricing": 49.99,
    "activities": ["musculation", "crossfit", "boxe"],
    "equipements": [],
    "owner": "660000000000000000000002"
  },
  {
    "name": "ZenFitness Marseille",
    "location": "8 Cours Julien, Marseille",
    "schedule": "Lun-Sam: 07:00-21:00",
    "pricing": 24.99,
    "activities": ["yoga", "pilates", "danse"],
    "equipements": [],
    "owner": "660000000000000000000003"
  },
  {
    "name": "IronCore Toulouse",
    "location": "34 Rue d'Alsace, Toulouse",
    "schedule": "Lun-Ven: 05:30-22:30, Sam: 07:00-20:00",
    "pricing": 34.99,
    "activities": ["musculation", "haltérophilie", "cardio"],
    "equipements": [],
    "owner": "660000000000000000000004"
  },
  {
    "name": "FlexStudio Bordeaux",
    "location": "12 Place de la Bourse, Bordeaux",
    "schedule": "Mar-Dim: 09:00-20:00",
    "pricing": 19.99,
    "activities": ["yoga", "stretching", "danse"],
    "equipements": [],
    "owner": "660000000000000000000005"
  },
  {
    "name": "EliteFit Lille",
    "location": "5 Rue Faidherbe, Lille",
    "schedule": "Lun-Sam: 06:00-22:00",
    "pricing": 39.99,
    "activities": ["musculation", "crossfit", "nutrition coaching"],
    "equipements": [],
    "owner": "660000000000000000000006"
  },
  {
    "name": "UrbanGym Nantes",
    "location": "27 Quai des Antilles, Nantes",
    "schedule": "Lun-Ven: 07:00-23:00, Sam-Dim: 09:00-19:00",
    "pricing": 27.50,
    "activities": ["cardio", "musculation", "cycling"],
    "equipements": [],
    "owner": "660000000000000000000007"
  },
  {
    "name": "BodyShape Strasbourg",
    "location": "9 Avenue de la Liberté, Strasbourg",
    "schedule": "Lun-Sam: 08:00-21:00",
    "pricing": 22.99,
    "activities": ["musculation", "yoga", "pilates"],
    "equipements": [],
    "owner": "660000000000000000000008"
  },
  {
    "name": "Apex Fitness Nice",
    "location": "45 Promenade des Anglais, Nice",
    "schedule": "Lun-Dim: 06:00-22:00",
    "pricing": 44.99,
    "activities": ["musculation", "boxe", "cardio", "natation"],
    "equipements": [],
    "owner": "660000000000000000000009"
  },
  {
    "name": "VitalClub Rennes",
    "location": "3 Place Sainte-Anne, Rennes",
    "schedule": "Mar-Sam: 07:30-20:30",
    "pricing": 18.99,
    "activities": ["yoga", "marche nordique", "renforcement"],
    "equipements": [],
    "owner": "660000000000000000000010"
  }
];

const seedGyms = async () => {
  try {
    // Se connecter à MongoDB
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/training_app');

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