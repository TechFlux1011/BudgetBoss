require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Import routes
const chatRoute = require('./routes/chat');
const dashboardRoute = require('./routes/dashboard');
const budgetRoute = require('./routes/budget');

app.use('/chat', chatRoute);
app.use('/dashboard', dashboardRoute);
app.use('/save-budget', budgetRoute);

app.get('/', (req, res) => {
  res.send("Budget API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
