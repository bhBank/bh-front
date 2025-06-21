import axios from 'axios';

// URL de base de ton API (ajusté en fonction de ton backend)
const API_URL = 'http://localhost:4000/api/regions-monde'; // Remplace avec ton URL de production

// Obtenir tous les Regions
export const getRegions = async () => {
  try {
    const res = await axios.get(API_URL);
    console.log("regions ",res.data);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la récupération des Regions :", err);
    throw err;
  }
};

// Créer un nouveau Region
export const createRegion = async (RegionData) => {
  try {
    const res = await axios.post(API_URL, RegionData);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la création du Region :", err);
    throw err;
  }
};

// Mettre à jour un Region
export const updateRegion = async (id, RegionData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, RegionData);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la mise à jour du Region :", err);
    throw err;
  }
};

// Supprimer un Region
export const deleteRegion = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la suppression du Region :", err);
    throw err;
  }
};
