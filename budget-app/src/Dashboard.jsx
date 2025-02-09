import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EEC', '#FF6666'];

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [view, setView] = useState('weekly');

  // Function to fetch dashboard data from backend
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/dashboard');
      // Debug log: console.log("Fetched Data:", response.data);
      if (view === 'weekly') {
        setChartData(formatData(response.data.expenses.weekly));
      } else {
        setChartData(formatData(response.data.expenses.monthly));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [view]);

  // Helper function to format expense data into an array with calculated percentages
  const formatData = (expenseData) => {
    const total = Object.values(expenseData).reduce((sum, val) => sum + val, 0);
    return Object.entries(expenseData).map(([category, value]) => ({
      category,
      value,
      percentage: total ? ((value / total) * 100).toFixed(1) : 0
    }));
  };

  return (
    <div className="dashboard-container">
      <h2>Budget Breakdown</h2>

      <div className="toggle">
        <button onClick={() => setView('weekly')} className={view === 'weekly' ? 'active' : ''}>
          Weekly
        </button>
        <button onClick={() => setView('monthly')} className={view === 'monthly' ? 'active' : ''}>
          Monthly
        </button>
      </div>

      <div className="chart-wrapper">
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label={({ percentage }) => `${percentage}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>

        {/* Floating info card overlay */}
        <div className="floating-card">
          <ul>
            {chartData.map((entry, index) => (
              <li key={index} style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                <div className="bar-value">${entry.value}</div>
                <div className="bar-name">{entry.category}</div>
                <div className="bar-percentage">{entry.percentage}%</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
