import axios from 'axios';

const API_URL = 'http://localhost:4000/api/chat';

class ChatService {
    // Récupérer tous les messages
    async getAllMessages() {
        try {
            const response = await axios.get(`${API_URL}/messages`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    // Envoyer un message
    async sendMessage(messageData) {
        try {
            const response = await axios.post(`${API_URL}/messages`, messageData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    // Envoyer un message privé
    async sendPrivateMessage(messageData) {
        try {
            const response = await axios.post(`${API_URL}/messages/private`, messageData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    // Récupérer une conversation privée
    async getPrivateConversation(userId1, userId2) {
        try {
            const response = await axios.get(`${API_URL}/conversations/${userId1}/${userId2}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    // Récupérer toutes les conversations d'un utilisateur
    async getUserConversations(userId) {
        try {
            const response = await axios.get(`${API_URL}/conversations/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    // Marquer une conversation comme lue
    async markConversationAsRead(userId1, userId2) {
        try {
            const response = await axios.put(`${API_URL}/conversations/${userId1}/${userId2}/read`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    // Modifier un message
    async updateMessage(messageId, userId, newContent) {
        try {
            const response = await axios.put(`${API_URL}/messages/${messageId}`, {
                userId,
                newContent
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    // Supprimer un message
    async deleteMessage(messageId) {
        try {
            const response = await axios.delete(`${API_URL}/messages/${messageId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    // Récupérer l'historique des modifications d'un message
    async getMessageEditHistory(messageId) {
        try {
            const response = await axios.get(`${API_URL}/messages/${messageId}/edit-history`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}

export default new ChatService();
