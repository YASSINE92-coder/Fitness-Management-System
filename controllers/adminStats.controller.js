// controllers/adminStats.controller.js
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Gym from "../models/Gym.js";

// ✅ Toutes les données viennent maintenant de MongoDB (plus de mock data)

// Données factices pour les meilleurs programmes (TODO: connecter avec la vraie DB)
const mockBestPrograms = [
  { title: "Fat Loss 8 Weeks", creator: "Coach Ahmed", sales: 42 },
  { title: "Muscle Builder", creator: "Coach Youssef", sales: 38 },
  { title: "Beginner Plan", creator: "Coach Lina", sales: 29 },
];

export const getDashboardStats = async (req, res) => {
  try {
    const totalAthletes = await User.countDocuments({ role: "athlete" });
    const totalCoaches = await User.countDocuments({ role: "coach" });
    // Compter les gyms depuis la collection Gym (pas les users avec role gymOwner)
    const totalGyms = await Gym.countDocuments();
    
    // Calcul du revenue RÉEL depuis la base de données Transaction
    const totalRevenueResult = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$price" }
        }
      }
    ]);
    
    const totalRevenue = totalRevenueResult.length > 0 
      ? Math.round(totalRevenueResult[0].total * 100) / 100 
      : 0;

    // Compter le nombre total de transactions
    const transactionCount = await Transaction.countDocuments();

    const response = {
      totalAthletes,
      totalCoaches,
      totalGyms,
      totalRevenue,
      transactionCount, // Pour info
    };

    console.log("📊 Dashboard Stats (from MongoDB):", response);
    res.json(response);
  } catch (err) {
    console.error("❌ Error in getDashboardStats:", err);
    res.status(500).json({ message: err.message });
  }
};

// Graphique de revenue - Données réelles depuis la base de données
export const getRevenueChartData = async (req, res) => {
  try {
    const { days = 30 } = req.query; // Par défaut 30 jours
    const daysToFetch = parseInt(days);
    
    // Date de début
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToFetch);
    startDate.setHours(0, 0, 0, 0);

    // Agrégation des transactions par jour
    const revenueByDay = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          revenue: { $sum: "$price" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Créer un tableau avec tous les jours (même ceux sans transactions)
    const data = [];
    for (let i = daysToFetch - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Chercher le revenue pour ce jour
      const dayData = revenueByDay.find(item => item._id === dateString);
      
      data.push({
        date: dateString,
        revenue: dayData ? Math.round(dayData.revenue * 100) / 100 : 0
      });
    }

    console.log(`📊 Revenue Chart Data - ${daysToFetch} days: ${data.length} points`);
    res.json(data);
  } catch (err) {
    console.error("❌ Error in getRevenueChartData:", err);
    res.status(500).json({ message: err.message });
  }
};

// Répartition des rôles
export const getRoleDistribution = async (req, res) => {
  try {
    const [athletes, coaches, gymOwners, admins] = await Promise.all([
      User.countDocuments({ role: "athlete" }),
      User.countDocuments({ role: "coach" }),
      User.countDocuments({ role: "gymOwner" }),
      User.countDocuments({ role: "admin" }),
    ]);

    res.json([
      { name: "Athletes", value: athletes },
      { name: "Coaches", value: coaches },
      { name: "Gym Owners", value: gymOwners },
      { name: "Admins", value: admins },
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dernières transactions - Récupérer les 3 dernières depuis MongoDB
export const getLastTransactions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3; // Par défaut 3 transactions
    
    const transactions = await Transaction.find()
      .sort({ date: -1 }) // Trier par date décroissante (plus récentes d'abord)
      .limit(limit)
      .populate('user', 'name email') // Récupérer le nom de l'utilisateur
      .lean();

    // Formater les données pour le frontend
    const formattedTransactions = transactions.map(t => ({
      _id: t._id,
      athlete: t.user?.name || t.billing?.name || 'Unknown',
      program: t.programTitle,
      price: t.price,
      date: t.date,
      creator: t.creator
    }));

    console.log(`📋 Last ${limit} transactions fetched from MongoDB`);
    res.json(formattedTransactions);
  } catch (err) {
    console.error("❌ Error in getLastTransactions:", err);
    res.status(500).json({ message: err.message });
  }
};

// Meilleurs programmes (mock)
export const getBestPrograms = async (req, res) => {
  // Optionnel : vous pouvez aussi les récupérer depuis la base
  res.json(mockBestPrograms);
};
export const getRevenueStats = async (req, res) => {
  try {
    // Données factices — remplacez par vos vraies données
    const stats = {
      totalEarning: 5729,
      pageviews: 293878,
      downloads: 582920,
      trendData: [
        { date: "Jan 1", revenue: 1000 },
        { date: "Jan 2", revenue: 1200 },
        { date: "Jan 3", revenue: 900 },
        { date: "Jan 4", revenue: 1100 },
        { date: "Jan 5", revenue: 1300 },
      ],
      dailyData: [
        { date: "19 December", revenue: 293.97, isToday: false },
        { date: "20 December", revenue: 402.16, isToday: true },
        { date: "21 December", revenue: 398.21, isToday: false },
      ],
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Statistiques des transactions avec calculs réels depuis la DB
export const getTransactionStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);

    // 1. Revenue Total - somme de tous les prix
    const totalRevenueResult = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$price" }
        }
      }
    ]);
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    // 2. Revenue Journalier (aujourd'hui)
    const dailyRevenueResult = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startOfToday }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$price" }
        }
      }
    ]);
    const dailyRevenue = dailyRevenueResult.length > 0 ? dailyRevenueResult[0].total : 0;

    // 3. Revenue du mois en cours
    const currentMonthRevenueResult = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startOfThisMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$price" }
        }
      }
    ]);
    const currentMonthRevenue = currentMonthRevenueResult.length > 0 ? currentMonthRevenueResult[0].total : 0;

    // 4. Revenue du mois dernier
    const lastMonthRevenueResult = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startOfLastMonth, $lte: endOfLastMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$price" }
        }
      }
    ]);
    const lastMonthRevenue = lastMonthRevenueResult.length > 0 ? lastMonthRevenueResult[0].total : 0;

    // 5. Calcul de la croissance mensuelle (%)
    let monthlyGrowth = 0;
    if (lastMonthRevenue > 0) {
      monthlyGrowth = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    } else if (currentMonthRevenue > 0) {
      monthlyGrowth = 100; // Si pas de revenue le mois dernier mais oui ce mois
    }
    monthlyGrowth = Math.round(monthlyGrowth * 10) / 10; // Arrondir à 1 décimale

    // 6. Nouveaux clients (nouveaux utilisateurs cette semaine)
    const newClients = await User.countDocuments({
      createdAt: { $gte: startOfThisWeek }
    });

    // 7. Nombre total de transactions
    const transactionCount = await Transaction.countDocuments();

    // 8. Récupérer TOUTES les transactions (triées par date décroissante)
    // La pagination est gérée côté frontend
    const recentTransactions = await Transaction.find()
      .sort({ date: -1 })
      .populate('user', 'name email') // Récupérer le nom de l'utilisateur
      .select('-__v')
      .lean();
    
    // Formater les données pour le frontend
    const formattedTransactions = recentTransactions.map(t => ({
      _id: t._id,
      user: t.user?.name || t.billing?.name || 'Unknown',
      programTitle: t.programTitle,
      creator: t.creator,
      billing: t.billing?.name || 'N/A',
      paidBy: t.paidBy || 'Cash',
      price: t.price,
      date: t.date
    }));

    // Réponse avec toutes les statistiques
    res.status(200).json({
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        dailyRevenue: Math.round(dailyRevenue * 100) / 100,
        monthlyGrowth,
        transactionCount,
        newClients,
        currentMonthRevenue: Math.round(currentMonthRevenue * 100) / 100,
        lastMonthRevenue: Math.round(lastMonthRevenue * 100) / 100,
      },
      recentTransactions: formattedTransactions // Toutes les transactions formatées
    });
    
    console.log(`📊 Transaction Stats: ${formattedTransactions.length} transactions returned`);
  } catch (err) {
    console.error('Error fetching transaction stats:', err);
    res.status(500).json({ message: err.message });
  }
};