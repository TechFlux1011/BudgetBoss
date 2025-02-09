const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_FILE = path.join(__dirname, '../data/user_data.json');

router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return res.status(404).json({ error: "No budget data found." });
    }

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const { income, expenses } = data;

    // Calculate total expenses
    const totalWeeklyExpenses = Object.values(expenses.weekly || {}).reduce((sum, val) => sum + val, 0);
    const totalMonthlyExpenses = Object.values(expenses.monthly || {}).reduce((sum, val) => sum + val, 0);

    // Calculate leftover funds
    const leftoverWeekly = Math.max(0, Math.round((income / 4.33) - totalWeeklyExpenses)); // Approximate weekly income
    const leftoverMonthly = Math.max(0, income - totalMonthlyExpenses);

    // Add leftover funds to expenses data
    const formattedData = {
      expenses: {
        weekly: { ...expenses.weekly, leftover: leftoverWeekly },
        monthly: { ...expenses.monthly, leftover: leftoverMonthly }
      }
    };

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
