import React, { useState } from 'react';
import axios from 'axios';
import './ChatInterface.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hi, I'm your friendly accountant. What is your weekly net income in dollars?" }
  ]);
  const [input, setInput] = useState('');

  // Function to send a message
  const sendMessage = async () => {
    if (!input.trim()) return; // Ignore empty messages

    const newMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput(''); // Clear input field

    try {
      const response = await axios.post('http://localhost:5000/chat', { messages: updatedMessages });

      const botMessage = { sender: 'ai', text: response.data.prompt };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error communicating with the backend:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'ai', text: 'Oops! Something went wrong. Please try again.' }
      ]);
    }
  };

  // Function to handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents form submission (if inside a form)
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress} // Handle Enter key
          placeholder="Type your response..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;
