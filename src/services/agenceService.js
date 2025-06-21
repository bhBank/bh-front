import axios from 'axios';

// URL de base de ton API (ajusté en fonction de ton backend)
const API_URL = 'http://localhost:4000/api/agences'; // Remplace avec ton URL de production

// Récupérer toutes les agences
export const getAgences = async () => {
  try {
    const res = await axios.get(API_URL);
    console.log("getAgences", res.data);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la récupération des agences :", err);
    throw err;
  }
};

// Créer une nouvelle agence
export const createAgence = async (agenceData) => {
  try {
   
    console.log("Appel à createAgence avec les données :", agenceData); // Log des données envoyées
    const res = await axios.post(API_URL, agenceData); // Envoie le nom de l'agence et la ville
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la création de l'agence :", err);
    throw err;
  }
};

// Mettre à jour une agence
export const updateAgence = async (id, agenceData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, agenceData); // Envoie les données de mise à jour
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'agence :", err);
    throw err;
  }
};

// Supprimer une agence
export const deleteAgence = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la suppression de l'agence :", err);
    throw err;
  }
};


export const getAgencesWithoutChef = async () => {
  try {
    const res = await axios.get(`${API_URL}/without-chef`);
    console.log("getAgencesWithoutChef", res.data);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la récupération des agences sans chef :", err);
    throw err;
  }
};

export const getAgencesWithChefs = async () => {
  try {
    const res = await axios.get(`${API_URL}/with-chefs`);
    console.log("getAgencesWithChefs response:", res); // Pour déboguer
    return res.data; // Retourne directement les données
  } catch (err) {
    console.error("Erreur lors de la récupération des agences avec leurs chefs :", err);
    throw err;
  }
};
