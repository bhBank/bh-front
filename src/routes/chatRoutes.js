import React from 'react';
import { Route } from 'react-router-dom';
import ChatPrive from '../pages/ChatPrive';
import ChatAgence from '../pages/ChatAgence';

const chatRoutes = [
    <Route key="chat-agence" path="/chat-agence" element={<ChatAgence />} />,
    <Route key="chat-prive" path="/chat-prive/:receiverId" element={<ChatPrive />} />
];

export default chatRoutes; 