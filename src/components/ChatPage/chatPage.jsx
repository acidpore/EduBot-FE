import React, { useState, useRef, useEffect } from 'react';
import './chatPage.css';
import { FiSend, FiEdit2, FiTrash2, FiPlus, FiMoon, FiSun, FiLogOut } from 'react-icons/fi';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ChatPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Chatbot definition expl', active: true }
  ]);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'user', 
      content: 'What is a Chatbot?',
      timestamp: new Date() 
    },
    { 
      id: 2, 
      type: 'bot', 
      content: 'A chatbot is a computer program that simulates human conversation through voice commands or text chats or both. It can be integrated with various messaging platforms like Facebook Messenger, WhatsApp, WeChat, etc. and can be used for a variety of purposes, such as customer service, entertainment, and e-commerce.',
      timestamp: new Date() 
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [currentClass, setCurrentClass] = useState('MTK');
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: `This is a simulated response to: "${newMessage}"`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleNewChat = () => {
    const newChat = {
      id: conversations.length + 1,
      name: `New chat ${conversations.length + 1}`,
      active: true
    };

    // Set all other conversations to inactive
    const updatedConversations = conversations.map(conv => ({
      ...conv,
      active: false
    }));

    setConversations([...updatedConversations, newChat]);
    setMessages([]);
  };

  const handleDeleteChat = (id, e) => {
    e.stopPropagation();
    if (conversations.length === 1) return;

    const updatedConversations = conversations.filter(conv => conv.id !== id);
    
    // If deleted the active chat, set the first one as active
    if (conversations.find(conv => conv.id === id).active && updatedConversations.length > 0) {
      updatedConversations[0].active = true;
    }
    
    setConversations(updatedConversations);
  };

  const handleSelectChat = (id) => {
    const updatedConversations = conversations.map(conv => ({
      ...conv,
      active: conv.id === id
    }));
    
    setConversations(updatedConversations);
    
    // In a real app, you would load the messages for this conversation
    // For this demo, we'll just keep the current messages
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className={`chat-container ${darkMode ? 'dark' : 'light'}`}>
      {/* Sidebar */}
      <div className="sidebar">
        <button className="new-chat-btn" onClick={handleNewChat}>
          <FiPlus /> New chat
        </button>
        
        <div className="conversations">
          {conversations.map(conv => (
            <div 
              key={conv.id} 
              className={`conversation-item ${conv.active ? 'active' : ''}`}
              onClick={() => handleSelectChat(conv.id)}
            >
              <div className="conversation-icon">
                <FiEdit2 />
              </div>
              <div className="conversation-name">{conv.name}</div>
              <button 
                className="delete-btn"
                onClick={(e) => handleDeleteChat(conv.id, e)}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button className="footer-btn" onClick={toggleDarkMode}>
            {darkMode ? <FiSun /> : <FiMoon />} 
            {darkMode ? 'Mode terang' : 'Mode gelap'}
          </button>
          <button className="footer-btn" onClick={handleLogout}>
            <FiLogOut /> Log out
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {/* Header */}
        <div className="chat-header">
          <div className="course-tabs">
            <div className={`tab ${currentClass === 'MTK' ? 'active' : ''}`} onClick={() => setCurrentClass('MTK')}>
              MTK
            </div>
            <div className={`tab ${currentClass === 'IPA' ? 'active' : ''}`} onClick={() => setCurrentClass('IPA')}>
              IPA
            </div>
          </div>
          <div className="class-selector">
            <select>
              <option>Pilih Kelas</option>
              <option>Kelas 10</option>
              <option>Kelas 11</option>
              <option>Kelas 12</option>
            </select>
          </div>
        </div>

        {/* Messages */}
        <div className="messages-container">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === 'user' ? 
                  <div className="user-avatar">👤</div> :
                  <div className="bot-avatar">📚</div>
                }
              </div>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                {message.type === 'bot' && (
                  <div className="message-actions">
                    <button className="action-btn">
                      <FiThumbsUp />
                    </button>
                    <button className="action-btn">
                      <FiThumbsDown />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-container">
          <button className="regenerate-btn">
            Buat ulang respons
          </button>
          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ketik pesan..."
              className="message-input"
            />
            <button type="submit" className="send-btn">
              <FiSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;