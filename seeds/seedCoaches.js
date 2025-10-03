// seeds/seedCoaches.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const coachesData = [
  {
    name: "Amira Ben Salah",
    email: "amira.coach@example.com",
    password: "password123",
    gender: "female",
    cin: "AB123456",
    years_of_experience: 5,
    profile: {
      avatar: "https://example.com/avatars/amira.jpg",
      bio: "Coach certifiée ISSA spécialisée en musculation et perte de poids."
    },
    certificats: [
      {
        title: "Certified Personal Trainer",
        assigned_by: "ISSA",
        issued_at: "2019-06-15"
      }
    ]
  },
  {
    name: "Karim Zidi",
    email: "karim.coach@example.com",
    password: "password123",
    gender: "male",
    cin: "KZ789012",
    years_of_experience: 4,
    profile: {
      avatar: "https://example.com/avatars/karim.jpg",
      bio: "Expert en préparation physique et crossfit."
    },
    certificats: [
      {
        title: "CrossFit Level 1 Trainer",
        assigned_by: "CrossFit Inc.",
        issued_at: "2020-08-10"
      }
    ]
  },
  {
    name: "Leila Mansour",
    email: "leila.coach@example.com",
    password: "password123",
    gender: "female",
    cin: "LM456789",
    years_of_experience: 7,
    profile: {
      avatar: "https://example.com/avatars/leila.jpg",
      bio: "Coach nutrition et fitness holistique."
    },
    certificats: [
      {
        title: "Nutrition Specialist",
        assigned_by: "NASM",
        issued_at: "2018-03-22"
      }
    ]
  },
  {
    name: "Youssef Trabelsi",
    email: "youssef.coach@example.com",
    password: "password123",
    gender: "male",
    cin: "YT234567",
    years_of_experience: 6,
    profile: {
      avatar: "https://example.com/avatars/youssef.jpg",
      bio: "Spécialiste en force athlétique et haltérophilie."
    },
    certificats: [
      {
        title: "Strength and Conditioning Coach",
        assigned_by: "NSCA",
        issued_at: "2017-11-05"
      }
    ]
  },
  {
    name: "Sarah Dubois",
    email: "sarah.coach@example.com",
    password: "password123",
    gender: "female",
    cin: "SD890123",
    years_of_experience: 3,
    profile: {
      avatar: "https://example.com/avatars/sarah.jpg",
      bio: "Coach yoga et pilates certifiée."
    },
    certificats: [
      {
        title: "Yoga Instructor Certification",
        assigned_by: "Yoga Alliance",
        issued_at: "2021-01-15"
      }
    ]
  },
  {
    name: "Mehdi Benali",
    email: "mehdi.coach@example.com",
    password: "password123",
    gender: "male",
    cin: "MB345678",
    years_of_experience: 8,
    profile: {
      avatar: "https://example.com/avatars/mehdi.jpg",
      bio: "Préparateur physique pour sportifs de haut niveau."
    },
    certificats: [
      {
        title: "Advanced Sports Performance",
        assigned_by: "UEFA",
        issued_at: "2016-09-30"
      }
    ]
  },
  {
    name: "Noura Karray",
    email: "noura.coach@example.com",
    password: "password123",
    gender: "female",
    cin: "NK567890",
    years_of_experience: 2,
    profile: {
      avatar: "https://example.com/avatars/noura.jpg",
      bio: "Coach débutante passionnée par le fitness fonctionnel."
    },
    certificats: [
      {
        title: "Functional Training Specialist",
        assigned_by: "ACE",
        issued_at: "2022-07-12"
      }
    ]
  },
  {
    name: "Omar Gharbi",
    email: "omar.coach@example.com",
    password: "password123",
    gender: "male",
    cin: "OG678901",
    years_of_experience: 5,
    profile: {
      avatar: "https://example.com/avatars/omar.jpg",
      bio: "Spécialiste en coaching en ligne et motivation."
    },
    certificats: [
      {
        title: "Online Fitness Coach Certification",
        assigned_by: "ISSA",
        issued_at: "2020-04-18"
      }
    ]
  },
  {
    name: "Fatma Ben Romdhane",
    email: "fatma.coach@example.com",
    password: "password123",
    gender: "female",
    cin: "FBR123789",
    years_of_experience: 4,
    profile: {
      avatar: "https://example.com/avatars/fatma.jpg",
      bio: "Coach en rééducation post-partum et fitness féminin."
    },
    certificats: [
      {
        title: "Women's Fitness Specialist",
        assigned_by: "AFPA",
        issued_at: "2021-05-20"
      }
    ]
  },
  {
    name: "Rami Jarraya",
    email: "rami.coach@example.com",
    password: "password123",
    gender: "male",
    cin: "RJ234890",
    years_of_experience: 6,
    profile: {
      avatar: "https://example.com/avatars/rami.jpg",
      bio: "Coach en musculation et prise de masse."
    },
    certificats: [
      {
        title: "Bodybuilding Coach Certification",
        assigned_by: "IFBB",
        issued_at: "2019-12-10"
      }
    ]
  }
];

const seedCoaches = async () => {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/training_app');

    console.log('🗑️  Suppression des coachs existants...');
    await User.deleteMany({ role: 'coach' });

    console.log('📥 Insertion des 10 coachs...');
    for (const coachData of coachesData) {
      const coach = new User({
        ...coachData,
        role: 'coach'
      });
      await coach.save();
    }

    console.log('✅ 10 coachs insérés avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed :', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedCoaches();