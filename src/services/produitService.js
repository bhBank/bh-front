import axios from "axios";

const API_URL = "http://localhost:4000/api/produits";

export const getProduits = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.error("Erreur lors du chargement des produits", err);
    return [];
  }
};

export const createProduit = async (data) => {
  try {
    const res = await axios.post(API_URL, data);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de l'ajout du produit", err);
    return null;
  }
};

export const updateProduit = async (id, data) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la mise à jour du produit", err);
    return null;
  }
};

export const deleteProduit = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la suppression du produit", err);
    return null;
  }
};
