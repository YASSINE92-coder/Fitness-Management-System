import Transaction from '../models/Transaction.js';
import Program from '../models/Program.js';

// @desc    Get program revenue statistics by goals
// @route   GET /api/stats/program-revenue
// @access  Private (Admin)
export const getProgramRevenueStats = async (req, res) => {
  try {
    const timeRange = req.query.range || '30'; // default 30 days
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));

    // Get all transactions in the time range
    const transactions = await Transaction.find({
      date: { $gte: daysAgo }
    }).populate({
      path: 'programId',
      select: 'goals title price'
    });

    // Group by goals and calculate revenue
    const revenueByGoal = {};
    
    transactions.forEach(transaction => {
      if (transaction.programId && transaction.programId.goals) {
        transaction.programId.goals.forEach(goal => {
          if (!revenueByGoal[goal]) {
            revenueByGoal[goal] = {
              goal,
              totalRevenue: 0,
              transactions: 0
            };
          }
          revenueByGoal[goal].totalRevenue += transaction.price;
          revenueByGoal[goal].transactions += 1;
        });
      }
    });

    // Format for chart display
    const chartData = Object.values(revenueByGoal).map(data => ({
      goal: data.goal,
      revenue: data.totalRevenue,
      transactions: data.transactions
    }));

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};