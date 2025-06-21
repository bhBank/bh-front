import axios from "axios";

const API_URL = "http://localhost:4000/api/users"; // URL de ton API


export const createChefAgence = async (user,agence) => {
   try {
    let data={agenceCode:agence}
    axios.put(`${API_URL}/${user}`, data);
   } catch (error) {
    
   }  
}


export const getChefsAgence = async () => {
   try {
    const response = await axios.get(`${API_URL}/chefs-agence`);
    return response.data;
   } catch (error) {
    
   }
}


export const updateChefAgence = async (id, data) => {
  try {
    console.log("update chef agence", id);
    const response = await axios.put(`${API_URL}/chefs-agence/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors de la mise à jour du chef d'agence");
  }
};