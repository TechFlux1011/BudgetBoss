// Dashboard.js
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EEC'];

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [period, setPeriod] = useState('monthly');
  // For demonstration, we use a static userId. In a real app, get this from your auth/session.
  const userId = "YOUR_USER_ID_HERE";

  useEffect(() => {
    axios
      .get(`http://localhost:5000/dashboard?period=${period}&userId=${userId}`)
      .then((response) => setChartData(response.data))
      .catch((error) => console.error('Error fetching dashboard data:', error));
  }, [period, userId]);

  return (
    <div className="dashboard-container">
      <h2>Budget Breakdown</h2>
      <div className="toggle">
        <button onClick={() => setPeriod('weekly')} className={period === 'weekly' ? 'active' : ''}>
          Weekly
        </button>
        <button onClick={() => setPeriod('monthly')} className={period === 'monthly' ? 'active' : ''}>
          Monthly
        </button>
      </div>
      <PieChart width={400} height={400}>
        <Pie
          data={chartData}
          dataKey="percentage"  // Using calculated percentage for slice sizes
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          label={({ category, percentage, amount }) =>
            `${category}: $${amount} (${percentage}%)`
          }
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
      {chartData.find((d) => d.category === 'leftover') && (
        <div className="sponsored-suggestion">
          <p>
            You have extra funds! Consider saving your leftover money in a high-yield savings account from [Sponsor Bank].
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
