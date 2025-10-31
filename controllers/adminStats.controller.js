// controllers/adminStats.controller.js
import User from "../models/User.js";

// Données factices pour les transactions (à remplacer plus tard par un vrai modèle)
const mockTransactions = [
  { athlete: "Youssef A.", program: "Fat Loss 8 Weeks", price: 299, date: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { athlete: "Sarah M.", program: "Muscle Builder", price: 399, date: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  { athlete: "Ali R.", program: "Beginner Plan", price: 199, date: new Date(Date.now() - 1000 * 60 * 60 * 10) },
  { athlete: "Lina K.", program: "Endurance Pro", price: 349, date: new Date(Date.now() - 1000 * 60 * 60 * 20) },
];

// Données factices pour les meilleurs programmes
const mockBestPrograms = [
  { title: "Fat Loss 8 Weeks", creator: "Coach Ahmed", sales: 42 },
  { title: "Muscle Builder", creator: "Coach Youssef", sales: 38 },
  { title: "Beginner Plan", creator: "Coach Lina", sales: 29 },
];

export const getDashboardStats = async (req, res) => {
  try {
    const totalAthletes = await User.countDocuments({ role: "athlete" });
    const totalCoaches = await User.countDocuments({ role: "coach" });
    const totalGyms = await User.countDocuments({ role: "gymOwner" });
    
    // Calcul du revenue factice (à remplacer par une vraie somme plus tard)
    const totalRevenue = mockTransactions.reduce((sum, t) => sum + t.price, 0);

    res.json({
      totalAthletes,
      totalCoaches,
      totalGyms,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Données factices pour le graphique de revenue (derniers 30 jours)
export const getRevenueChartData = (req, res) => {
  const now = new Date();
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    // Génère un revenue aléatoire entre 0 et 500 MAD
    const revenue = Math.floor(Math.random() * 500);
    data.push({
      date: date.toISOString().split('T')[0],
      revenue,
    });
  }
  res.json(data);
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

// Dernières transactions (mock)
export const getLastTransactions = (req, res) => {
  res.json(mockTransactions);
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