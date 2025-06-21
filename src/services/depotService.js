import axios from 'axios';

const API_URL = 'http://localhost:4000/api/depots';

// Obtenir tous les dépôts
export const getDepots = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la récupération des dépôts :", err);
    throw err;
  }
};

// Créer un nouveau dépôt
export const createDepot = async (depotData) => {
  try {
    console.log("createDepot",depotData);
    const res = await axios.post(API_URL, depotData);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la création du dépôt :", err);
    throw err;
  }
};

// Mettre à jour un dépôt
export const updateDepot = async (id, depotData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, depotData);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la mise à jour du dépôt :", err);
    throw err;
  }
};

// Supprimer un dépôt
export const deleteDepot = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la suppression du dépôt :", err);
    throw err;
  }
}; 