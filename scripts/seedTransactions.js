// Script pour insérer des transactions de test dans MongoDB
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

dotenv.config();

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connecté');
  } catch (err) {
    console.error('❌ Erreur de connexion MongoDB:', err);
    process.exit(1);
  }
};

// Créer des transactions de test
const seedTransactions = async () => {
  try {
    await connectDB();

    // Supprimer les anciennes transactions de test (optionnel)
    // await Transaction.deleteMany({});
    // console.log('🗑️  Anciennes transactions supprimées');

    // Récupérer quelques users pour les transactions
    const users = await User.find().limit(5);
    
    if (users.length === 0) {
      console.log('⚠️  Aucun utilisateur trouvé. Créez d\'abord des utilisateurs.');
      process.exit(0);
    }

    // Générer des transactions sur les 30 derniers jours
    const transactions = [];
    const now = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Créer 1-3 transactions par jour
      const numTransactions = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < numTransactions; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const programs = [
          { title: 'Fat Loss 8 Weeks', price: 299 },
          { title: 'Muscle Builder', price: 399 },
          { title: 'Beginner Plan', price: 199 },
          { title: 'Endurance Pro', price: 349 },
          { title: 'Advanced Training', price: 449 },
        ];
        const randomProgram = programs[Math.floor(Math.random() * programs.length)];

        transactions.push({
          user: randomUser._id,
          programTitle: randomProgram.title,
          creator: randomUser.name || 'Coach Test',
          billing: {
            name: randomUser.name || 'Test User',
            email: randomUser.email,
            phone: '0612345678',
            address: 'Test Address',
          },
          paidBy: randomUser._id,
          price: randomProgram.price,
          date: date,
        });
      }
    }

    // Insérer les transactions
    await Transaction.insertMany(transactions);

    console.log(`✅ ${transactions.length} transactions insérées avec succès!`);
    
    // Calculer le total
    const total = transactions.reduce((sum, t) => sum + t.price, 0);
    console.log(`💰 Revenue total: ${total} MAD`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur lors du seed:', err);
    process.exit(1);
  }
};

seedTransactions();
