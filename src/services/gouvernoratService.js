import axios from 'axios';

// URL de base de ton API (ajusté en fonction de ton backend)
const API_URL = 'http://localhost:4000/api/gouvernorats'; // Remplace avec ton URL de production

// Obtenir tous les gouvernorats
export const getGouvernorats = async () => {
  try {
    const res = await axios.get(API_URL);
    console.log("getGouvernorats", res.data);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la récupération des gouvernorats :", err);
    throw err;
  }
};

// Créer un nouveau gouvernorat
export const createGouvernorat = async (gouvernoratData) => {
  try {
    const res = await axios.post(API_URL, gouvernoratData);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la création du gouvernorat :", err);
    throw err;
  }
};

// Mettre à jour un gouvernorat
export const updateGouvernorat = async (id, gouvernoratData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, gouvernoratData);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la mise à jour du gouvernorat :", err);
    throw err;
  }
};

// Supprimer un gouvernorat
export const deleteGouvernorat = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la suppression du gouvernorat :", err);
    throw err;
  }
};
