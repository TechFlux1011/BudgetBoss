import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [period, setPeriod] = useState('monthly');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/dashboard?period=${period}`)
      .then((response) => setChartData(response.data))
      .catch((error) => console.error('Error fetching dashboard data:', error));
  }, [period]);

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
          dataKey="value"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          label
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
