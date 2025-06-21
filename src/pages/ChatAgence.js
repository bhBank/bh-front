import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  FaBuilding,
  FaUserTie,
  FaMoneyBillWave,
  FaListUl,
  FaChartLine,
  FaEnvelope,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaPaperPlane,
  FaUser,
  FaTrashAlt
} from "react-icons/fa";
import logo from "../assets/acceuil bh.jpg";
import "../styles/ChatAgence.css";
import Sidebar from '../components/Sidebar';

const ChatAgence = () => {
  const navigate = useNavigate();
  const [showAgencies, setShowAgencies] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({ username: '', agence: '' });
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  const agencies = [
    "Agence Tunis Centre", "Agence Tunis Sud", "Agence Bizerte THAALBI",
    "Agence MENZEL BOURGUIBA", "Agence Bizerte IBN KHALDOUN", "Agence AOUSJA",
    "Agence RAFRAF", "Agence MATEUR", "Agence SFAX THYNA",
    "Agence SFAX MAHRES", "Agence CHEDLY KALLALA", "Agence SFAX CHIHIA",
    "Agence SBEITLA", "Agence METLAOUI", "Agence Bizerte ERRAWABI",
    "Agence MENZEL ABDERRAHMEN", "Agence RAS JEBEL", "Agence MENZAH 8",
    "Agence MANZAH 5", "Agence ENNASR 2"
  ];

  useEffect(() => {
    socketRef.current = io('http://localhost:5001');
    const currentUser = JSON.parse(localStorage.getItem('user'));

    if (currentUser) {
      setUserData({
        username: currentUser.nom,
        agence: currentUser.agence
      });

      socketRef.current.emit('register-user', {
        username: currentUser.nom,
        agence: currentUser.agence
      });
    }

    socketRef.current.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('user-list', (userList) => {
      setUsers(userList);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && userData.username) {
      socketRef.current.emit('send-message', {
        text: messageInput,
        agence: userData.agence
      });
      setMessageInput('');
    }
  };

  const handleDeleteMessage = (messageToDelete) => {
    setMessages(prevMessages => prevMessages.filter(msg => msg !== messageToDelete));
    // Optionnellement émettre un événement pour supprimer le message côté serveur
    socketRef.current.emit('delete-message', messageToDelete);
  };

  return (
    <div className="app-layout">
     <Sidebar />

      {/* Contenu principal : Chat */}
      <main className="main-content">
        <div className="chat-container">
          <div className="chat-header">
            <h2>Chat Inter-Agences</h2>
            <div className="user-info">
              <FaUser /> {userData.username} - {userData.agence}
            </div>
          </div>

          <div className="chat-content">
            <div className="users-sidebar">
              <h3>Chefs connectés</h3>
              <ul>
                {users.map(user => (
                  <li key={user.id}>
                    <FaUser /> {user.username} ({user.agence})
                  </li>
                ))}
              </ul>
            </div>

            <div className="messages-container">
              <div className="messages-list">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${msg.sender?.username === userData.username ? 'sent' : 'received'}`}
                  >
                    <div className="message-header">
                      <strong>{msg.sender?.username} ({msg.sender?.agence})</strong>
                      <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      {msg.sender?.username === userData.username && (
                        <FaTrashAlt
                          className="delete-icon"
                          onClick={() => handleDeleteMessage(msg)}
                        />
                      )}
                    </div>
                    <div className="message-text">{msg.text}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="message-form">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Écrivez votre message..."
                />
                <button type="submit">
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatAgence;
