// Dashboard.js
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EEC'];

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [period, setPeriod] = useState('monthly');

  // For demonstration, we can use static data.
  // In a real app, you would fetch this data from your backend.
  useEffect(() => {
    // Uncomment the following lines to fetch from an API endpoint:
    // axios.get('http://localhost:5000/dashboard?period=monthly')
    //   .then(response => setChartData(response.data))
    //   .catch(error => console.error('Error fetching dashboard data:', error));

    // Static data example:
    setChartData([
      { category: 'housing', value: 1200 },
      { category: 'utilities', value: 300 },
      { category: 'food', value: 800 },
      { category: 'transportation', value: 400 },
      { category: 'leftover', value: 300 }
      ]);
    }, []);

  return (
    <div className="dashboard-container">
      <h2>Budget Breakdown</h2>
      <div className="toggle">
        {/* Toggle buttons can be added here to switch between weekly and monthly */}
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
