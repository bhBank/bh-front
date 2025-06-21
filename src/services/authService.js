import axios from "axios";

const API_URL = "http://localhost:4000/api/auth"; // URL de ton API


export const login = async (matricule, password) => {
  try {
    console.log("login", matricule, password);
    const response = await axios.post(`${API_URL}/login`, { matricule, password });
    console.log("response", response);
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    console.log("debug logout");
    const user = getCurrentUser();
    if (user) {
     
      console.log("user", user);
      await axios.post(`${API_URL}/logout`, { userId: user._id });
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    // On supprime quand même les données locales même en cas d'erreur
    localStorage.removeItem("user");
    localStorage.removeItem("token");

  };
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  return null;
};

export const resetPassword = async (matricule) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, { matricule });
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      console.log("Utilisateur non trouvé");
      throw new Error("Utilisateur non trouvé");
    }
    const message = error.response?.data?.message || "Erreur lors de la réinitialisation du mot de passe";
    throw new Error(message);
  }
};