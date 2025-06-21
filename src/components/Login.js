import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { login } from "../services/authService";

const Login = ({ onLogin, onSwitchToRegister }) => {
  const navigate = useNavigate();
  const [matricule, setMatricule] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Vérifie si l'utilisateur est déjà connecté
  useEffect(() => {
    // if (localStorage.getItem("token")) {
    //   navigate("/depots");  // Redirige vers la page des dépôts si déjà connecté
    // }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Vérifier le matricule (même règle que l'inscription)
    const matriculeRegex = /^[a-zA-Z0-9]{5}$/;
    // if (!matriculeRegex.test(matricule)) {
    //   setError("Matricule invalide. Il doit contenir exactement 5 caractères (lettres et chiffres).");
    //   return;
    // }

    try {
      await login(matricule, password); // Appel au backend via le service
      setError("");
      if (onLogin) onLogin();
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      {error && <span className="error">{error}</span>}
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Matricule" value={matricule} onChange={(e) => setMatricule(e.target.value)} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Se connecter</button>
      </form>
      <div style={{ marginTop: 16 }}>
        <button type="button" className="link-btn" onClick={() => navigate('/reset-password')}>
          Mot de passe oublié ?
        </button>
      </div>
    </div>
  );
};

export default Login;
