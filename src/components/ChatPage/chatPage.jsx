import React, { useState, useRef, useEffect } from 'react';
import './chatPage.css';
import { 
  FiSend, FiEdit2, FiTrash2, FiPlus, 
  FiMoon, FiSun, FiLogOut, 
  FiChevronDown, FiChevronUp,
  FiThumbsUp, FiThumbsDown 
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { generateResponse } from '../../api/generate';

/**
 * ChatPage Component
 * 
 * Komponen utama untuk halaman chat yang menangani percakapan,
 * interaksi dengan AI, dan tampilan UI chat.
 * 
 * @param {Object} props - Properties yang diterima komponen
 * @param {Function} props.onLogout - Handler saat user logout
 */
const ChatPage = ({ onLogout }) => {
  const navigate = useNavigate();
  
  // ========== State Management ==========
  // UI States
  const [darkMode, setDarkMode] = useState(true);
  const [currentClass, setCurrentClass] = useState('MTK');
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);
  const [showClassMenu, setShowClassMenu] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Content States
  const [newMessage, setNewMessage] = useState('');
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

  // Refs
  const messagesEndRef = useRef(null);
  const subjectRef = useRef(null);
  const classRef = useRef(null);

  // Content Data
  const subjects = ['MTK', 'IPA', 'IPS', 'Bahasa Indonesia', 'Bahasa Inggris', 'PKN', 'Seni Budaya', 'Penjas', 'TIK'];
  const classes = ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6', 'Kelas 7', 'Kelas 8', 'Kelas 9'];

  // ========== Effects ==========
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close dropdown menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (subjectRef.current && !subjectRef.current.contains(event.target)) {
        setShowSubjectMenu(false);
      }
      
      if (classRef.current && !classRef.current.contains(event.target)) {
        setShowClassMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ========== Helper Functions ==========
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ========== Event Handlers ==========
  /**
   * Mengirim pesan dan mendapatkan respons dari AI
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    // Create and add user message
    const userMessage = createMessage('user', newMessage);
    setMessages([...messages, userMessage]);
    setNewMessage('');
    setIsGenerating(true);

    try {
      console.log('Sending message to AI:', newMessage);
      
      // Call the generate API with proper parameters
      const result = await generateResponse(newMessage, {
        max_length: 100,
        temperature: 0.7,
        top_p: 0.9
      });
      
      console.log('Full API response from backend:', result);
      
      // Format and add AI response
      const responseContent = formatResponseContent(result);
      const botMessage = createMessage('bot', responseContent);
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Detailed error:', error);
      
      // Handle error and display message
      const errorMessage = createMessage('bot', getErrorMessage(error));
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Create a message object with standard format
   */
  const createMessage = (type, content) => ({
    id: messages.length + 1,
    type,
    content,
    timestamp: new Date()
  });

  /**
   * Format response content from API
   */
  const formatResponseContent = (result) => {
    let responseContent = "Sorry, I couldn't generate a response. Please try again.";
    
    if (result.success && result.data) {
      responseContent = result.data;
      console.log('Extracted response content:', responseContent);
    } else {
      console.warn('Result was successful but no data:', result);
    }
    
    return responseContent;
  };

  /**
   * Get appropriate error message based on error type
   */
  const getErrorMessage = (error) => {
    // Log error details
    let errorDetails = '';
    if (error.response) {
      errorDetails = `Status: ${error.response.status}`;
      console.error('Response error details:', errorDetails);
    } else if (error.request) {
      errorDetails = 'No response received from server';
      console.error('Request was made but no response received');
    } else {
      errorDetails = error.message;
      console.error('Error setting up request:', error.message);
    }
    
    // Return user-friendly error message
    if (error.message?.includes('ECONNREFUSED')) {
      return "The backend server isn't running. Please make sure the backend is started (see README.md for instructions).";
    } else if (error.message?.includes('timeout')) {
      return "The AI service took too long to respond. Please try again later.";
    }
    
    return "Sorry, there was a problem connecting to the AI service.";
  };

  // ========== Chat Management ==========
  /**
   * Create a new chat conversation
   */
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

  /**
   * Delete a chat conversation
   */
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

  /**
   * Select a chat conversation
   */
  const handleSelectChat = (id) => {
    const updatedConversations = conversations.map(conv => ({
      ...conv,
      active: conv.id === id
    }));
    
    setConversations(updatedConversations);
    
    // In a real app, you would load the messages for this conversation
    // For this demo, we'll just keep the current messages
  };

  // ========== UI Controls ==========
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const toggleSubjectMenu = () => {
    setShowSubjectMenu(!showSubjectMenu);
    if (showClassMenu) setShowClassMenu(false);
  };

  const toggleClassMenu = () => {
    setShowClassMenu(!showClassMenu);
    if (showSubjectMenu) setShowSubjectMenu(false);
  };

  const selectSubject = (subject) => {
    setCurrentClass(subject);
    setShowSubjectMenu(false);
  };

  const selectClass = (className) => {
    setShowClassMenu(false);
    // Lakukan logika lain yang diperlukan saat kelas dipilih
  };

  // ========== Render UI ==========
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
          <div className="subject-selector" ref={subjectRef}>
            <div className="subject-dropdown" onClick={toggleSubjectMenu}>
              <span>{currentClass}</span>
              {showSubjectMenu ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {showSubjectMenu && (
              <div className="subject-menu">
                {subjects.map((subject, index) => (
                  <div 
                    key={index} 
                    className={`subject-item ${currentClass === subject ? 'active' : ''}`}
                    onClick={() => selectSubject(subject)}
                  >
                    {subject}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="class-selector" ref={classRef}>
            <div className="class-dropdown" onClick={toggleClassMenu}>
              <span>Pilih Kelas</span>
              {showClassMenu ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {showClassMenu && (
              <div className="class-menu">
                {classes.map((className, index) => (
                  <div 
                    key={index} 
                    className="class-item"
                    onClick={() => selectClass(className)}
                  >
                    {className}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">{message.content}</div>
              <div className="message-timestamp">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              {message.type === 'bot' && (
                <div className="message-actions">
                  <button className="action-btn like-btn" title="Like">
                    <FiThumbsUp size={16} />
                  </button>
                  <button className="action-btn dislike-btn" title="Dislike">
                    <FiThumbsDown size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
          {isGenerating && (
            <div className="message bot generating">
              <div className="message-content">Generating response...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form className="chat-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Ketik pesan..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isGenerating}
          />
          <button type="submit" className="send-btn" disabled={isGenerating}>
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;