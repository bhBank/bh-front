import axios from "axios";

const API_URL = "http://localhost:4000/api/categories"; // URL de ton API

export const getCategories = async () => {
    try {
        const res = await axios.get(API_URL);
        return res.data;
    } catch (err) {
        console.error("Erreur lors du chargement des catégories", err);
        return [];
    }
};

export const createCategorie = async (categoryData) => {
    try {
        const res = await axios.post(API_URL, categoryData);
        return res.data;
    } catch (err) {
        console.error("Erreur lors de l'ajout de la  catégorie", err);
        return null;
    }
};

export const updateCategorie = async (id, updatedData) => {
    try {
        const res = await axios.put(`${API_URL}/${id}`, updatedData);
        return res.data;
    } catch (err) {
        console.error("Erreur lors de la mise à jour de la catégorie", err);
        return null;
    }
};

export const deleteCategorie = async (id) => {
    try {
        const res = await axios.delete(`${API_URL}/${id}`);
        return res.data;
    } catch (err) {
        console.error("Erreur lors de la suppression de la catégorie", err);
        return null;
    }
};
