import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/acceuil bh.jpg";
import "../styles/Contact.css";
import {
  FaBuilding,
  FaUserTie,
  FaMoneyBillWave,
  FaListUl,
  FaChartLine,
  FaEnvelope,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";

function Contact() {
  const navigate = useNavigate();
  const [showAgencies, setShowAgencies] = useState(false);

  const agencies = [
    "Agence Tunis Centre", "Agence Tunis Sud", "Agence Bizerte THAALBI",
    "Agence MENZEL BOURGUIBA", "Agence Bizerte IBN KHALDOUN", "Agence AOUSJA",
    "Agence RAFRAF", "Agence MATEUR", "Agence SFAX THYNA",
    "Agence SFAX MAHRES", "Agence CHEDLY KALLALA", "Agence SFAX CHIHIA",
    "Agence SBEITLA", "Agence METLAOUI", "Agence Bizerte ERRAWABI",
    "Agence MENZEL ABDERRAHMEN", "Agence RAS JEBEL", "Agence MENZAH 8",
    "Agence MANZAH 5", "Agence ENNASR 2"
  ];

  return (
    <div className="app-layout">
      {/* Sidebar fixe */}
     <Sidebar />

      {/* Contenu principal */}
      <main className="main-content">
        <div className="content-container">
          <h1>Contactez-nous</h1>
          <p>Pour toute question, veuillez nous contacter via nos réseaux sociaux :</p>

          <ul className="contact-info">
            <li>Email : contact@bhbank.com</li>
            <li>Téléphone : +216 71 123 456</li>
            <li>Adresse : Avenue de la République, Tunis</li>
          </ul>

          <div className="Social-links">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="social-icon facebook" />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="social-icon twitter" />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="social-icon linkedin" />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="social-icon instagram" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Contact;
