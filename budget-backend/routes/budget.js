const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/user_data.json');

router.post('/', (req, res) => {
  try {
    const { income, expenses } = req.body;
    const data = { income, expenses };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    res.json({ message: "Budget data saved successfully", data });
  } catch (error) {
    console.error("Error saving budget data:", error);
    res.status(500).json({ error: "Failed to save budget data" });
  }
});

module.exports = router;
