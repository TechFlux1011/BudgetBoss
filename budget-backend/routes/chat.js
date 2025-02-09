const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_FILE = path.join(__dirname, '../data/user_data.json');

// Define the sequence of prompts and their associated keys.
const categories = [
  { key: "income", prompt: "Hi, I'm your friendly accountant. What is your weekly net income in dollars?" },
  { key: "housing", prompt: "What is your monthly housing expense in dollars?" },
  { key: "utilities", prompt: "What is your monthly utilities expense in dollars?" },
  { key: "food", prompt: "What is your weekly food expense in dollars?" },
  { key: "transportation", prompt: "What is your weekly transportation expense in dollars?" }
];

// Helper: Load user data from the JSON file.
const loadUserData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
    // Return default structure if file doesn't exist.
    return { income: 0, expenses: { weekly: {}, monthly: {} } };
  } catch (error) {
    console.error("Error reading user data:", error);
    return { income: 0, expenses: { weekly: {}, monthly: {} } };
  }
};

// Helper: Save user data to the JSON file.
const saveUserData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required and cannot be empty." });
    }

    // Determine the conversation step by counting user messages.
    const userResponses = messages.filter(msg => msg.sender === 'user');
    const step = userResponses.length;

    // If all questions are answered, send a completion prompt.
    if (step > categories.length) {
      return res.json({ prompt: "Thank you! Your budget data has been recorded. Check your dashboard for insights." });
    }

    let userData = loadUserData();
    // Extract the numerical value from the last user response.
    const lastResponse = userResponses[step - 1]?.text || "";
    const numericValue = parseFloat(lastResponse.replace(/[^0-9.]/g, "")) || 0;

    // Update userData based on the current step.
    if (step === 1) {
      // Weekly income provided; convert to monthly.
      userData.income = Math.round((numericValue * 52) / 12);
    } else if (step === 2 || step === 3) {
      // For housing and utilities, ask monthly and convert to weekly.
      const categoryKey = categories[step - 1].key;
      userData.expenses.monthly[categoryKey] = numericValue;
      userData.expenses.weekly[categoryKey] = Math.round((numericValue * 12) / 52);
    } else {
      // For food and transportation, treat the value as weekly; approximate monthly value using 4.33.
      const categoryKey = categories[step - 1].key;
      userData.expenses.weekly[categoryKey] = numericValue;
      userData.expenses.monthly[categoryKey] = Math.round(numericValue * 4.33);
    }

    saveUserData(userData);

    // Determine and return the next prompt.
    let nextPrompt = "";
    if (step < categories.length) {
      nextPrompt = categories[step].prompt;
    } else {
      nextPrompt = "Thank you! Your budget data has been recorded. Check your dashboard for insights.";
    }
    
    res.json({ prompt: nextPrompt });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
});

module.exports = router;
