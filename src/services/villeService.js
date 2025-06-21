import axios from 'axios';

// URL de base de ton API (ajusté en fonction de ton backend)
const API_URL = 'http://localhost:4000/api/villes'; // Remplace avec ton URL de production

// Obtenir toutes les villes
export const getVilles = async () => {
  try {
    const res = await axios.get(API_URL);
    console.log("getVilles", res.data);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la récupération des villes :", err);
    throw err;
  }
};


// Créer une nouvelle ville
export const createVille = async (villeData) => {
    try {
      const res = await axios.post(API_URL, villeData); // inclut gouvernorat dans villeData
      return res.data;
    } catch (err) {
      console.error("Erreur lors de la création de la ville :", err);
      throw err;
    }
  };
  
  // Mettre à jour une ville
  export const updateVille = async (id, villeData) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, villeData); // inclut gouvernorat dans villeData
      return res.data;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la ville :", err);
      throw err;
    }
  };

// Supprimer une ville
export const deleteVille = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la suppression de la ville :", err);
    throw err;
  }
};

export const getVillesByGouvernorat = async(gouvernoratId)=>{
    try {
        console.log("getVillesByGouvernorat", gouvernoratId);
        const res=await axios.get(`${API_URL}/by-gouvernorat/${gouvernoratId}`);
        return res.data;
    } catch (error) {
        console.log("Erreur lors de la get des villes avec la governorat :", error);
    }

}
