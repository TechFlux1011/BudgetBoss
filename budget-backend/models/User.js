const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: String,
  income: Number,
  expenses: [expenseSchema]
});

module.exports = mongoose.model('User', userSchema);
