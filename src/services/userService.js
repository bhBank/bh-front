import axios from 'axios';

// URL de base de ton API (ajusté en fonction de ton backend)
const API_URL_BASE = 'http://localhost:4000/api/users'; // Remplace avec ton URL de production

const getAllUsers = async () => {
    try {
        const response = await axios.get(`http://localhost:4000/api/users`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        throw error;
    }
};

const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${API_URL_BASE}/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        throw error;
    }
};

const userService = {
    getAllUsers,
    getUserById
};

export default userService;

export const getUsers = async () => {
    try {
        const res = await axios.get(API_URL_BASE);
        console.log("getUsers", res.data);
        return res.data;
    } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs :", err);
        throw err;
    }
};

export const getUsersWithoutagences = async () => {
    try {
        const res = await axios.get(`${API_URL_BASE}/without-agence`);
        console.log("getUsersWithoutagences", res.data);
        return res.data;
    } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs sans agences :", err);
        throw err;
    }
}

export const updateUser = async (userId, userData) => {
    try {
        console.log("updateUser", userData);
        const res = await axios.put(`${API_URL_BASE}/${userId}`, userData);
        return res.data;
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
        throw err;
    }
};

export const updatePassword=async (userId, password) => {
    try {
        console.log("updatePassword", password);
        const res = await axios.put(`${API_URL_BASE}/password/${userId}`, {password});
        return res.data;
    }catch(err) {
        console.error("erreur lors de la mise à jour du mot de passe de l'utilisateur :", err);
        throw err;
    }
}

export const deleteUser = async (userId) => {
    try {
        const res = await axios.delete(`${API_URL_BASE}/${userId}`);
        return res.data;
    } catch (err) {
        console.error("Erreur lors de la suppression de l'utilisateur :", err);
        throw err;
    }
};

export const createUser = async (userData) => {
    console.log("createUser", userData);
    try {
        const res = await axios.post(API_URL_BASE, userData);
        return res.data;
    } catch (err) {
        console.error("Erreur lors de la création de l'utilisateur :", err);
        throw err;
    }
};