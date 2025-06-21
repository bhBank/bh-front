import axios from 'axios';

// URL de base de ton API (ajusté en fonction de ton backend)
const API_URL = 'http://localhost:4000/api/devises'; // Remplace avec ton URL de production

// Obtenir toutes les devises
export const getDevises = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la récupération des devises :", err);
    throw err;
  }
};


// Créer une nouvelle devise
export const createDevise = async (deviseData) => {
    try {
      console.log(" for create devise ",deviseData)
      const res = await axios.post(API_URL, deviseData); // inclut region dans deviseData
      return res.data;
    } catch (err) {
      console.error("Erreur lors de la création de la devise :", err);
      throw err;
    }
  };
  
  // Mettre à jour une devise
  export const updateDevise = async (id, deviseData) => {
    try {
      console.log(" for update devise ",deviseData)
      const res = await axios.put(`${API_URL}/${id}`, deviseData); // inclut region dans deviseData
      return res.data;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la devise :", err);
      throw err;
    }
  };

// Supprimer une devise
export const deleteDevise = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la suppression de la devise :", err);
    throw err;
  }
};

export const getDevisesByRegion = async(regionId)=>{
    try {
        console.log("getDevisesByRegion", regionId);
        const res=await axios.get(`${API_URL}/by-region/${regionId}`);
        return res.data;
    } catch (error) {
        console.log("Erreur lors de la get des devises avec la governorat :", error);
    }

}
