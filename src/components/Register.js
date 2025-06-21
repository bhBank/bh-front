import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import "./Register.css";


const Register = ({ onRegisterSuccess }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    agence: "",
    email: "",
    matricule: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  
  // Vérification des champs
  const validateForm = () => {
    let newErrors = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom est obligatoire.";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est obligatoire.";
    if (!formData.agence.trim()) newErrors.agence = "L'agence est obligatoire.";
    if (!formData.email.includes("@")) newErrors.email = "Email invalide.";
    
    // Vérifier que le matricule fait exactement 5 caractères (lettres et chiffres)
    const matriculeRegex = /^[a-zA-Z0-9]{5}$/;
    if (!matriculeRegex.test(formData.matricule)) {
      newErrors.matricule = "Le matricule doit contenir exactement 5 lettres ou chiffres.";
    }

    // Vérifier que le mot de passe fait au moins 6 caractères
    if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retourne true si pas d'erreurs
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Hachage du mot de passe avant envoi
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    const userData = {
      ...formData,
      password: hashedPassword, // Remplace le mot de passe par sa version hashée
    };

    console.log("Données envoyées :", userData);

    // Simuler enregistrement réussi (remplace par une requête API)
    alert("Compte créé avec succès !");
    onRegisterSuccess();
    navigate("/"); // Retourne à la connexion
  };

  return (
    <div className="register-container">
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} />
        {errors.nom && <span className="error">{errors.nom}</span>}
        
        <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} />
        {errors.prenom && <span className="error">{errors.prenom}</span>}

        <input type="text" name="agence" placeholder="Agence" value={formData.agence} onChange={handleChange} />
        {errors.agence && <span className="error">{errors.agence}</span>}

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        {errors.email && <span className="error">{errors.email}</span>}

        <input type="text" name="matricule" placeholder="Matricule" value={formData.matricule} onChange={handleChange} />
        {errors.matricule && <span className="error">{errors.matricule}</span>}

        <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} />
        {errors.password && <span className="error">{errors.password}</span>}

        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
