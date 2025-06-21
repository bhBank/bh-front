import axios from 'axios';

const API_URL = 'http://localhost:4000/api/logs';

export const getAllLogs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des logs:', error);
    throw error;
  }
};

export const getLogsByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des logs utilisateur:', error);
    throw error;
  }
};

export const getLogsByDateRange = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_URL}/date-range`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des logs par date:', error);
    throw error;
  }
}; 