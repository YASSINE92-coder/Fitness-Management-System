// controllers/transactionController.js
import  Transaction from "../models/Transaction.js"
const getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ date: -1 })
      .limit(10)
      .select('-__v'); // Optionnel : exclut le champ __v de Mongoose

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};

export default getRecentTransactions;