import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ChatInterface from './ChatInterface';
import Dashboard from './Dashboard';
import './App.css';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<ChatInterface />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
