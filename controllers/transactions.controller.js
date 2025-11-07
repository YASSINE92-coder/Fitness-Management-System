const Transaction = require('../models/Transaction');
const catchAsync = require('../errors/globalTryCatch');

exports.getTransactionsStats = catchAsync(async (req, res) => {
  // Récupérer les transactions des derniers 90 jours pour le graphique
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const dailyRevenue = await Transaction.aggregate([
    {
      $match: {
        createdAt: { $gte: ninetyDaysAgo }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$amount" }
      }
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        revenue: 1
      }
    },
    {
      $sort: { date: 1 }
    }
  ]);

  // Récupérer les dernières transactions
  const recentTransactions = await Transaction.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate({
      path: 'user',
      select: 'name email'
    })
    .populate({
      path: 'program',
      select: 'title period price'
    });

  // Calculer les statistiques générales
  const totalRevenue = await Transaction.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ]);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const dailyStats = await Transaction.aggregate([
    {
      $match: {
        createdAt: { $gte: todayStart }
      }
    },
    {
      $group: {
        _id: null,
        dailyRevenue: { $sum: "$amount" },
        transactionCount: { $sum: 1 }
      }
    }
  ]);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  
  const monthlyGrowth = await Transaction.aggregate([
    {
      $match: {
        createdAt: { $gte: monthStart }
      }
    },
    {
      $group: {
        _id: null,
        monthlyRevenue: { $sum: "$amount" }
      }
    }
  ]);

  // Formater les données pour le frontend
  const formattedTransactions = recentTransactions.map(t => ({
    orderId: t._id,
    productImage: "/placeholder.svg?height=40&width=40", // À remplacer par l'image réelle du programme
    productName: t.program.title,
    productSpec: `${t.program.period} jours`,
    price: t.amount,
    customerName: t.user.name,
    dateCheckout: t.createdAt.toLocaleString(),
    paymentMethod: t.paymentMethod || "Card",
    email: t.user.email
  }));

  res.status(200).json({
    status: 'success',
    data: {
      revenueChart: dailyRevenue,
      recentTransactions: formattedTransactions,
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        dailyRevenue: dailyStats[0]?.dailyRevenue || 0,
        transactionCount: dailyStats[0]?.transactionCount || 0,
        monthlyGrowth: ((monthlyGrowth[0]?.monthlyRevenue || 0) / (totalRevenue[0]?.total || 1) * 100).toFixed(1)
      }
    }
  });
});