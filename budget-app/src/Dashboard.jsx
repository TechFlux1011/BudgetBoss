import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EEC', '#FF6666']; // Added a new color for "Leftover"

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [view, setView] = useState('weekly');

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/dashboard');
      console.log("Fetched Data:", response.data);
      
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
  }, [view]); // Fetch data when the view changes

  // Format data for PieChart
  const formatData = (expenseData) => {
    return Object.entries(expenseData).map(([category, amount]) => ({
      category,
      value: amount
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

      <PieChart width={400} height={400}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          label={({ category, value }) => `${category}: $${value}`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </div>
  );
};

export default Dashboard;
