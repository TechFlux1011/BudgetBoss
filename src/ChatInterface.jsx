import React, { useState } from 'react';
import axios from 'axios';
import './ChatInterface.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hi, I'm your friendly accountant. What is your weekly net income in dollars?" }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Append the user's message to the chat history
    const newMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput(''); // Clear input field

    try {
      // Send the entire conversation to the backend
      const response = await axios.post('http://localhost:5000/chat', {
        messages: updatedMessages
      });

      // Append AI's response to the chat
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
          placeholder="Type your response..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;
