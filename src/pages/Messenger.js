import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import chatService from '../services/chatService';
import { getCurrentUser } from '../services/authService';
import userService from '../services/userService';
import {
    Box,
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    Divider,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    Badge,
    Grid,
    Tabs,
    Tab
} from '@mui/material';
import {
    MoreVert,
    Edit,
    Delete,
    Send,
    Search,
    Person,
    Chat
} from '@mui/icons-material';
import './Messenger.css';
import Sidebar from '../components/Sidebar';

function Messenger() {
    const [socket, setSocket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [messageForUpdate, setMessageForUpdate] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Fonction pour normaliser les IDs de room
    const getNormalizedRoomId = (id1, id2) => {
        const [smallerId, largerId] = [id1, id2].sort();
        return `private_${smallerId}_${largerId}`;
    };

    useEffect(() => {
        const initializeUser = async () => {
            try {
                const user = getCurrentUser();
                console.log("User from getCurrentUser:", user);
                
                if (!user) {
                    console.log("No user found, redirecting to login");
                    navigate('/login');
                    return;
                }
                
                setCurrentUser(user);
                console.log("Current user set to:", user);

                // Initialiser la connexion socket
                const newSocket = io('http://localhost:4000', {
                    transports: ['websocket', 'polling'],
                    autoConnect: true,
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                    timeout: 10000,
                    forceNew: true
                });

                // Authentifier l'utilisateur
                newSocket.emit('authenticate', user._id);
                console.log('🔐 Authentification envoyée pour l\'utilisateur:', user._id);

                // Gestion des événements de connexion
                newSocket.on('connect', () => {
                    console.log('✅ Socket connecté avec succès');
                    console.log('Socket ID:', newSocket.id);
                    console.log('Socket connecté:', newSocket.connected);
                });

                newSocket.on('connect_error', (error) => {
                    console.error('❌ Erreur de connexion socket:', error.message);
                    setError('Erreur de connexion au serveur de chat');
                });

                // Écouter les nouveaux messages
                newSocket.on('new-message', (message) => {
                    console.log('📨 Nouveau message reçu:', message);
                    // console.log('Utilisateur courant:', currentUser._id);
                    console.log('Message sender:', message.sender);
                    console.log('Message receiver:', message.receiver);
                    
                    // Mettre à jour les messages si nous sommes dans la bonne conversation
                    if (selectedConversation && 
                        (message.sender === selectedConversation.user._id || 
                         message.receiver === selectedConversation.user._id)) {
                        console.log('✅ Message ajouté à la conversation actuelle');
                        setMessages(prev => [...prev, message]);
                        scrollToBottom();
                    } else {
                        console.log('⚠️ Message reçu mais pas dans la conversation actuelle');
                    }

                    // Mettre à jour la liste des conversations
                    setConversations(prev => {
                        const conversationIndex = prev.findIndex(
                            conv => conv.user._id === message.sender || conv.user._id === message.receiver
                        );

                        if (conversationIndex === -1) {
                            console.log('🆕 Nouvelle conversation créée');
                            // Nouvelle conversation
                            const newConversation = {
                                user: message.sender === getCurrentUser()._id ? 
                                    users.find(u => u._id === message.receiver) :
                                    users.find(u => u._id === message.sender),
                                lastMessage: message,
                                unreadCount: message.sender !== getCurrentUser()._id ? 1 : 0
                            };
                            return [newConversation, ...prev];
                        } else {
                            console.log('📝 Conversation existante mise à jour');
                            console.log("currentUser", getCurrentUser())
                            // Mettre à jour la conversation existante
                            const updatedConversations = [...prev];
                            updatedConversations[conversationIndex] = {
                                ...updatedConversations[conversationIndex],
                                lastMessage: message,
                                unreadCount: message.sender !== getCurrentUser()._id ? 
                                    (updatedConversations[conversationIndex].unreadCount + 1) : 
                                    updatedConversations[conversationIndex].unreadCount
                            };
                            return updatedConversations;
                        }
                    });
                });

                // Écouter la confirmation d'envoi
                newSocket.on('message-sent', (message) => {
                    console.log('✅ Message envoyé avec succès:', message);
                });

                // Écouter les notifications de nouveaux messages
                newSocket.on('message-notification', (data) => {
                    console.log('🔔 Notification de nouveau message:', data);
                });

                setSocket(newSocket);

                // Charger les utilisateurs et conversations
                await Promise.all([
                    loadUsers(user),
                    loadConversations(user)
                ]);

                return () => {
                    if (newSocket) {
                        newSocket.disconnect();
                    }
                };
            } catch (error) {
                console.error("Error initializing user:", error);
                setError('Erreur lors de l\'initialisation de l\'utilisateur');
            }
        };

        initializeUser();
    }, []);

    // Rejoindre la conversation privée quand une conversation est sélectionnée
    useEffect(() => {
        if (selectedConversation && socket && getCurrentUser()) {
            const room = getNormalizedRoomId(getCurrentUser()._id, selectedConversation.user._id);
            console.log('🏠 Rejoindre la room:', room);
            socket.emit('join-private-chat', {
                userId: getCurrentUser()._id,
                otherUserId: selectedConversation.user._id
            });
        }
    }, [selectedConversation, socket, getCurrentUser()]);

    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation.user._id);
        }
    }, [selectedConversation]);

    const loadConversations = async (user) => {
        try {
            setLoading(true);
            console.log("📋 Chargement des conversations pour l'utilisateur:", user._id);
            const userConversations = await chatService.getUserConversations(user._id);
            console.log("💬 Conversations chargées: ahhahahahhahah", userConversations);
            console.log("📊 Nombre total de conversations:", userConversations.length);
            
            // Log détaillé de chaque conversation
            userConversations.forEach((conv, index) => {
                console.log(`\n📱 Conversation ${index + 1}:`, {
                    utilisateur: conv.user.fullname,
                    id: conv.user._id,
                    dernierMessage: conv.lastMessage ? {
                        contenu: conv.lastMessage.content,
                        date: new Date(conv.lastMessage.timestamp).toLocaleString(),
                        expediteur: conv.lastMessage.sender._id === user._id ? 'moi' : 'autre',
                        nonLus: conv.unreadCount
                    } : 'Aucun message',
                    messagesNonLus: conv.unreadCount
                });
            });
            
            setConversations(userConversations);
        } catch (error) {
            console.error("❌ Erreur lors du chargement des conversations:", error);
            setError('Erreur lors du chargement des conversations');
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (userId) => {
        try {
            setLoading(true);
            const user = getCurrentUser();
            console.log('📱 Chargement des messages pour la conversation avec:', userId);
            console.log('👤 Utilisateur courant:', user._id);
            const conversation = await chatService.getPrivateConversation(user._id, userId);
            let conversation2= await chatService.getPrivateConversation(userId,user._id)
            let convs=[];
            if(conversation2.length>=conversation.length){
                convs=conversation2
                
            }else {
                convs=conversation
            }
            console.log('💬💬💬💬💬 Messages reçus:', convs);
            console.log('📊 Nombre total de messages:', convs.length);
            
            // Vérifier la structure des messages
            convs.forEach((msg, index) => {
                console.log(`\n🔍 Message ${index + 1}:`, {
                    id: msg._id,
                    contenu: msg.content,
                    expediteur: {
                        id: msg.sender._id,
                        nom: msg.sender.fullname || `${msg.sender.nom} ${msg.sender.prenom}`
                    },
                    destinataire: {
                        id: msg.receiver._id,
                        nom: msg.receiver.fullname || `${msg.receiver.nom} ${msg.receiver.prenom}`
                    },
                    date: new Date(msg.timestamp).toLocaleString(),
                    estLu: msg.isRead
                });
            });
            
            // Trier les messages par date (du plus ancien au plus récent)
            const sortedMessages = convs.sort((a, b) => 
                new Date(a.timestamp) - new Date(b.timestamp)
            );
            
            setMessages(sortedMessages);
            
            // Marquer la conversation comme lue
            await chatService.markConversationAsRead(user._id, userId);
            console.log('✅ Conversation marquée comme lue');
            
            // Mettre à jour le compteur de messages non lus dans la liste des conversations
            setConversations(prev => {
                const updatedConversations = prev.map(conv => {
                    if (conv.user._id === userId) {
                        console.log('🔄 Mise à jour du compteur de messages non lus pour:', conv.user._id);
                        return { ...conv, unreadCount: 0 };
                    }
                    return conv;
                });
                console.log('📋 Conversations mises à jour:', updatedConversations);
                return updatedConversations;
            });
            
            scrollToBottom();
            console.log('⬇️ Défilement vers le bas effectué');
        } catch (error) {
            console.error('❌ Erreur lors du chargement des messages:', error);
            setError('Erreur lors du chargement des messages');
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async (user) => {
        try {
            setLoading(true);
            console.log("Loading users for user:", user);
            const allUsers = await userService.getAllUsers();
            console.log("All users from API:", allUsers);
            
            // Filtrer l'utilisateur courant de la liste
            const filteredUsers = allUsers.filter(u => u._id !== user._id);
            console.log("Filtered users:", filteredUsers);
            
            setUsers(filteredUsers);
        } catch (error) {
            console.error("Error loading users:", error);
            setError('Erreur lors du chargement des utilisateurs');
        } finally {
            setLoading(false);
        }
    };

    const startNewConversation = async (userId) => {
        try {
            setLoading(true);
            console.log("🆕 Démarrage d'une nouvelle conversation avec:", userId);
            
            // Vérifier si une conversation existe déjà
            const existingConversation = conversations.find(
                conv => conv.user._id === userId
            );

            if (existingConversation) {
                console.log("✅ Conversation existante trouvée:", existingConversation);
                setSelectedConversation(existingConversation);
            } else {
                console.log("🆕 Création d'une nouvelle conversation");
                // Créer une nouvelle conversation
                const user = users.find(u => u._id === userId);
                const newConversation = {
                    user,
                    lastMessage: null,
                    unreadCount: 0
                };
                console.log("📝 Nouvelle conversation créée:", newConversation);
                setSelectedConversation(newConversation);
                setConversations(prev => [newConversation, ...prev]);
            }
            
            // Charger les messages
            await loadMessages(userId);
        } catch (error) {
            console.error("❌ Erreur lors de la création de la conversation:", error);
            setError('Erreur lors de la création de la conversation');
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation || !getCurrentUser()) {
            console.log('❌ Impossible d\'envoyer le message:', {
                messageEmpty: !newMessage.trim(),
                noConversation: !selectedConversation,
                noUser: !getCurrentUser()
            });
            return;
        }

        try {
            const messageData = {
                sender: getCurrentUser()._id,
                receiver: selectedConversation.user._id,
                content: newMessage
            };

            console.log('📤 Envoi du message:', messageData);

            // Émettre le message via socket
            socket.emit('send-message', messageData);
            
            // Ajouter le message à la liste locale immédiatement
            const localMessage = {
                _id: Date.now().toString(), // ID temporaire
                sender: getCurrentUser()._id,
                receiver: selectedConversation.user._id,
                content: newMessage,
                timestamp: new Date(),
                isRead: false
            };
            
            setMessages(prev => [...prev, localMessage]);
            setNewMessage('');

            // Mettre à jour la conversation dans la liste
            setConversations(prev => {
                const updatedConversations = prev.map(conv => {
                    if (conv.user._id === selectedConversation.user._id) {
                        return {
                            ...conv,
                            lastMessage: localMessage,
                            unreadCount: 0
                        };
                    }
                    return conv;
                });
                return updatedConversations;
            });

            scrollToBottom();
        } catch (error) {
            console.error('❌ Erreur lors de l\'envoi du message:', error);
            setError('Erreur lors de l\'envoi du message');
        }
    };

    const handleMessageMenu = (event, message) => {
        setAnchorEl(event.currentTarget);
        setSelectedMessage(message);
        
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedMessage(null);
    };

    const handleEditClick = () => {
        console.log("selectedMessage",  selectedMessage);
        setMessageForUpdate(selectedMessage);
        setEditedContent(selectedMessage.content);
        setEditDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteClick = async () => {
        try {
            console.log('🗑️ Suppression du message:', selectedMessage);
            await chatService.deleteMessage(selectedMessage._id);
            setMessages(prev => prev.filter(msg => msg._id !== selectedMessage._id));
        } catch (error) {
            setError('Erreur lors de la suppression du message');
            console.error(error);
        }
        handleMenuClose();
    };

    const handleEditSubmit = async () => {
        try {
            console.log('=========================================')
            console.log('📝 Modification du message:', messageForUpdate,', user : ', getCurrentUser()._id, ", edited version: ",editedContent);
            const updatedMessage = await chatService.updateMessage(
                messageForUpdate._id,
                getCurrentUser()._id,
                editedContent
            );
            setMessageForUpdate(null);
            setMessages(prev => prev.map(msg => 
                msg._id === messageForUpdate._id ? updatedMessage : msg
            ));
            setEditDialogOpen(false);
        } catch (error) {
            setError('Erreur lors de la modification du message');
            console.error(error);
        }
    };

    const filteredUsers = users.filter(user => {
        if (!user || !user.fullname) {
            console.log('User with missing properties:', user);
            return false;
        }
        const searchLower = searchTerm.toLowerCase();
        return user.fullname.toLowerCase().includes(searchLower) 
    });
    console.log('Conversations:', conversations);
    const filteredConversations = conversations.filter(conv => {
        if (!conv || !conv.user || !conv.user.fullname) {
            console.log('Conversation with missing properties:', conv);
            return false;
        }
        const searchLower = searchTerm.toLowerCase();
        return conv.user.fullname.toLowerCase().includes(searchLower) 
    });

    // Vérifier si l'utilisateur est connecté
    useEffect(() => {
        const checkUser = () => {
            const user = getCurrentUser();
            if (!user) {
                console.log('⚠️ Utilisateur non connecté, redirection vers login');
                navigate('/login');
            }
        };

        checkUser();
        // Vérifier toutes les 30 secondes
        const interval = setInterval(checkUser, 30000);

        return () => clearInterval(interval);
    }, [navigate]);

    // Ajouter des logs pour le rendu des messages
    useEffect(() => {
        if (messages.length > 0) {
            console.log('🎨 Rendu des messages:');
            console.log('📝 Nombre de messages à afficher:', messages.length);
            console.log('👥 Messages par expéditeur:', {
                currentUser: messages.filter(m => m.sender._id === getCurrentUser()._id).length,
                otherUser: messages.filter(m => m.sender._id !== getCurrentUser()._id).length
            });
        }
    }, [messages, currentUser]);

    // Ajouter un effet pour logger les changements de conversation sélectionnée
    useEffect(() => {
        if (selectedConversation) {
            console.log("\n🎯 Conversation sélectionnée:", {
                utilisateur: selectedConversation.user.fullname,
                id: selectedConversation.user._id,
                dernierMessage: selectedConversation.lastMessage ? {
                    contenu: selectedConversation.lastMessage.content,
                    date: new Date(selectedConversation.lastMessage.timestamp).toLocaleString(),
                    expediteur: selectedConversation.lastMessage.sender._id === getCurrentUser()._id ? 'moi' : 'autre'
                } : 'Aucun message',
                messagesNonLus: selectedConversation.unreadCount
            });
        }
    }, [selectedConversation]);

    // Modifier la partie du rendu des messages
    const renderMessage = (message) => {
        const currentUserId = getCurrentUser()._id;
        const isCurrentUser = message.sender._id == currentUserId;
        
        console.log('🎨 Rendu du message:', {
            id: message._id,
            contenu: message.content,
            expediteur: message.sender._id,
            destinataire: message.receiver._id,
            estExpediteur: isCurrentUser,
            date: new Date(message.timestamp).toLocaleString()
        });

        return (
            <Box
                key={message._id}
                sx={{
                    display: 'flex',
                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                    mb: 1
                }}
            >
                <Paper
                    elevation={1}
                    sx={{
                        p: 1,
                        maxWidth: '70%',
                        backgroundColor: isCurrentUser ? 'primary.main' : 'grey.100',
                        color: isCurrentUser ? 'white' : 'text.primary',
                        borderRadius: 2,
                        position: 'relative',
                        boxShadow: isCurrentUser ? 2 : 1
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1">{message.content}</Typography>
                        {isCurrentUser && (
                            <IconButton
                                size="small"
                                onClick={(e) => handleMessageMenu(e, message)}
                                sx={{ color: 'inherit' }}
                            >
                                <MoreVert />
                            </IconButton>
                        )}
                    </Box>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            display: 'block',
                            mt: 0.5,
                            color: isCurrentUser ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
                        }}
                    >
                        {new Date(message.timestamp).toLocaleTimeString()}
                        {message.isEdited && ' (modifié)'}
                    </Typography>
                </Paper>
            </Box>
        );
    };

    if (loading && !selectedConversation) {
        return (
            <Container>
                <Typography>Chargement...</Typography>
            </Container>
        );
    }

    return (
        <div className="app-layout">
            {/* Sidebar fixe */}
            <Sidebar />
            {/* Contenu principal */}
            <main className="main-content">
                <Container maxWidth="xl" sx={{ height: '100vh', py: 2 }}>
                    {!getCurrentUser() ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <Typography>Chargement...</Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2} sx={{ height: '100%' }}>
                            {/* Liste des conversations et utilisateurs */}
                            <Grid item xs={12} md={4}>
                                <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                                        <Typography variant="h6">Messages</Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Rechercher..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            sx={{ mt: 1 }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Search />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>
                                    <Tabs
                                        value={activeTab}
                                        onChange={(e, newValue) => setActiveTab(newValue)}
                                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                                    >
                                        <Tab label="Conversations" />
                                        <Tab label="Utilisateurs" />
                                    </Tabs>
                                    <List sx={{ flex: 1, overflow: 'auto' }}>
                                        {activeTab === 0 ? (
                                            // Liste des conversations
                                            filteredConversations.length > 0 ? (
                                                filteredConversations.map((conversation) => (
                                                    <ListItem
                                                        key={conversation.user._id}
                                                        button
                                                        selected={selectedConversation?.user._id === conversation.user._id}
                                                        onClick={() => setSelectedConversation(conversation)}
                                                    >
                                                        <ListItemAvatar>
                                                            <Badge
                                                                color="error"
                                                                badgeContent={conversation.unreadCount}
                                                                invisible={conversation.unreadCount === 0}
                                                            >
                                                                <Avatar>
                                                                    <Person />
                                                                </Avatar>
                                                            </Badge>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={`${conversation.user.fullname} `}
                                                            secondary={conversation.lastMessage?.content || 'Aucun message'}
                                                        />
                                                    </ListItem>
                                                ))
                                            ) : (
                                                <ListItem>
                                                    <ListItemText 
                                                        primary="Aucune conversation" 
                                                        secondary="Commencez une nouvelle conversation"
                                                    />
                                                </ListItem>
                                            )
                                        ) : (
                                            // Liste des utilisateurs
                                            filteredUsers.length > 0 ? (
                                                filteredUsers.map((user) => (
                                                    <ListItem
                                                        key={user._id}
                                                        button
                                                        onClick={() => startNewConversation(user._id)}
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <Person />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={`${user.fullname}`}
                                                            secondary={user.role || 'Utilisateur'}
                                                        />
                                                        <IconButton size="small">
                                                            <Chat />
                                                        </IconButton>
                                                    </ListItem>
                                                ))
                                            ) : (
                                                <ListItem>
                                                    <ListItemText 
                                                        primary="Aucun utilisateur trouvé" 
                                                        secondary="Essayez une autre recherche"
                                                    />
                                                </ListItem>
                                            )
                                        )}
                                    </List>
                                </Paper>
                            </Grid>

                            {/* Zone de chat */}
                            <Grid item xs={12} md={8}>
                                {selectedConversation ? (
                                    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        {/* En-tête de la conversation */}
                                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                                            <Typography variant="h6">
                                                {selectedConversation.user.fullname} 
                                            </Typography>
                                        </Box>

                                        {/* Zone des messages avec scroll */}
                                        <Box sx={{ 
                                            flex: 1, 
                                            overflowY: 'auto', // Ajout du scroll vertical
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1,
                                            minHeight: 0 // Pour que le scroll fonctionne bien dans flex
                                        }}>
                                            {messages.map(renderMessage)}
                                            <div ref={messagesEndRef} />
                                        </Box>

                                        {/* Formulaire d'envoi de message */}
                                        <Box
                                            component="form"
                                            onSubmit={handleSendMessage}
                                            sx={{
                                                p: 2,
                                                borderTop: 1,
                                                borderColor: 'divider',
                                                display: 'flex',
                                                gap: 1,
                                                backgroundColor: 'background.paper'
                                            }}
                                        >
                                            <TextField
                                                fullWidth
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Écrivez votre message..."
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                disabled={!newMessage.trim()}
                                                endIcon={<Send />}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                Envoyer
                                            </Button>
                                        </Box>
                                    </Paper>
                                ) : (
                                    <Paper 
                                        elevation={3} 
                                        sx={{ 
                                            height: '100%', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center' 
                                        }}
                                    >
                                        <Typography variant="h6" color="text.secondary">
                                            Sélectionnez une conversation pour commencer
                                        </Typography>
                                    </Paper>
                                )}
                            </Grid>
                        </Grid>
                    )}

                    {/* Menu contextuel des messages */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleEditClick}>
                            <Edit fontSize="small" sx={{ mr: 1 }} />
                            Modifier
                        </MenuItem>
                        <MenuItem onClick={handleDeleteClick}>
                            <Delete fontSize="small" sx={{ mr: 1 }} />
                            Supprimer
                        </MenuItem>
                    </Menu>

                    {/* Dialogue de modification */}
                    <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                        <DialogTitle>Modifier le message</DialogTitle>
                        <DialogContent>
                            <TextField
                                fullWidth
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                multiline
                                rows={4}
                                sx={{ mt: 1 }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
                            <Button onClick={handleEditSubmit} variant="contained">
                                Enregistrer
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </main>
        </div>
    );
}

export default Messenger;