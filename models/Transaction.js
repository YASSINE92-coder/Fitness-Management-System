// models/Transaction.js
import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    trim: true,
  },
  programTitle: {
    type: String,
    required: true,
    trim: true,
  },
  creator: {
    type: String,
    required: true,
    trim: true,
  },
  billing: {
    type: String,
    required: true,
    enum: ["Auto debit", "Manual - PayPal", "Manual- cash"],
  },
  paidBy: {
    type: String,
    required: true,
    enum: ["VISA", "Mastercard", "PayPal", "Cash"],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
