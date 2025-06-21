// Sidebar.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/acceuil bh.jpg";
import "./sideBar.css";
import { logout } from "../services/authService";
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
  FaCity, FaRocketchat, FaHistory, FaMapMarkedAlt,
  FaFilter
} from "react-icons/fa";
import { RiMoneyDollarBoxLine } from "react-icons/ri";

import { IoMapSharp } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";

import { BiCategory } from "react-icons/bi";
import { BsCreditCard2FrontFill, BsBank } from "react-icons/bs";
import { getCurrentUser } from "../services/authService";

function Sidebar() {
  const navigate = useNavigate();
  const [showLocations, setShowLocations] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showCurrencies, setShowCurrencies] = useState(false);
  const [showDeposits, setShowDeposits] = useState(false);
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';
  const isChefAgence = user?.role === 'chef_agence';

  const onLogout = () => {
    logout();
  };

  const startPrivateChat = (userId) => {
    navigate(`/chat-prive/${userId}`);
  };

  return (
    <div className="app-sidebar">
      <div className="sidebar-header" onClick={() => navigate('/')}>
        <img src={logo} alt="Banque BH Logo" className="sidebar-logo" />
        <h4>BH Bank</h4>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-user-section">
          <div className="user-avatar">
            <FaUserTie size={24} />
          </div>
          <div className="user-details">
            <strong>{user?.fullname}</strong>
            <span>{user?.role}</span>
          </div>
        </div>

        {isAdmin && (
          <>
            <div className="nav-item" onClick={() => navigate('/users')}>
              <FaListUl className="nav-icon" />
              <span>Utilisateurs</span>
            </div>

            <div className={`nav-item ${showLocations ? 'active' : ''}`} onClick={() => setShowLocations(!showLocations)}>
              <FaMapMarkedAlt className="nav-icon" />
              <span>Gestion des Agences</span>
              <span className="nav-arrow">{showLocations ? <FaChevronUp /> : <FaChevronDown />}</span>
            </div>

            {showLocations && (
              <div className="nav-submenu">
                <div className="nav-item submenu-item" onClick={() => navigate('/agences')}>
                  <BsBank className="nav-icon" />
                  <span>Agences</span>
                </div>
                <div className="nav-item submenu-item" onClick={() => navigate('/chefs-agence')}>
                  <FaUserTie className="nav-icon" />
                  <span>Chefs d'Agence</span>
                </div>
                <div className="nav-item submenu-item" onClick={() => navigate('/agences-chefs')}>
                  <FaBuilding className="nav-icon" />
                  <span>Agences & Chefs</span>
                </div>
                <div className="nav-item submenu-item" onClick={() => navigate('/gouvernorats')}>
                  <IoMapSharp className="nav-icon" />
                  <span>Gouvernorats</span>
                </div>
                <div className="nav-item submenu-item" onClick={() => navigate('/villes')}>
                  <FaCity className="nav-icon" />
                  <span>Villes</span>
                </div>
              </div>
            )}


            <div className={`nav-item ${showProducts ? 'active' : ''}`} onClick={() => setShowProducts(!showProducts)}>
              <BsCreditCard2FrontFill className="nav-icon" />
              <span>Gestion des Produits</span>
              <span className="nav-arrow">{showProducts ? <FaChevronUp /> : <FaChevronDown />}</span>
            </div>

            {showProducts && (
              <div className="nav-submenu">
                <div className="nav-item submenu-item" onClick={() => navigate('/produits')}>
                  <BsCreditCard2FrontFill className="nav-icon" />
                  <span>Produits</span>
                </div>
                <div className="nav-item submenu-item" onClick={() => navigate('/categories')}>
                  <BiCategory className="nav-icon" />
                  <span>Catégories</span>
                </div>
              </div>
            )}

            <div className={`nav-item ${showCurrencies ? 'active' : ''}`} onClick={() => setShowCurrencies(!showCurrencies)}>
              <RiMoneyDollarBoxLine className="nav-icon" />
              <span>Gestion des Devises</span>
              <span className="nav-arrow">{showCurrencies ? <FaChevronUp /> : <FaChevronDown />}</span>
            </div>

            {showCurrencies && (
              <div className="nav-submenu">
                <div className="nav-item submenu-item" onClick={() => navigate('/devises')}>
                  <RiMoneyDollarBoxLine className="nav-icon" />
                  <span>Devises</span>
                </div>
                <div className="nav-item submenu-item" onClick={() => navigate('/regionsMonde')}>
                  <IoMapSharp className="nav-icon" />
                  <span>Regions Monde</span>
                </div>
              </div>
            )}

            <div className="nav-item" onClick={() => navigate('/logs')}>
              <FaHistory className="nav-icon" />
              <span>Journaux d'activité</span>
            </div>

            <div className="nav-item" onClick={() => navigate('/dashboard')}>
              <FaChartLine className="nav-icon" />
              <span>Tableau de Bord</span>
            </div>
          </>
        )}

        {(isAdmin || isChefAgence) && (
          <>
            <div className={`nav-item ${showDeposits ? 'active' : ''}`} onClick={() => setShowDeposits(!showDeposits)}>
              <FaMoneyBillWave className="nav-icon" />
              <span>Gestion des Dépôts</span>
              <span className="nav-arrow">{showDeposits ? <FaChevronUp /> : <FaChevronDown />}</span>
            </div>

            {showDeposits && (
              <div className="nav-submenu">

                <div className="nav-item submenu-item" onClick={() => navigate('/depots')}>
                  <FaMoneyBillWave className="nav-icon" />
                  <span>Gestion Dépôts</span>
                </div>
                <div className="nav-item submenu-item" onClick={() => navigate('/depot-list')}>
                  <FaFilter className="nav-icon" />
                  <span>Liste des Dépôts</span>
                </div>
              </div>
            )}

            <div className="nav-item" onClick={() => navigate('/messenger')}>
              <FaRocketchat className="nav-icon" />
              <span>Messenger</span>
            </div>
          </>
        )}

        <div className="nav-item" onClick={() => navigate('/contact')}>
          <IoMdInformationCircleOutline className="nav-icon" />
          <span>Contact</span>
        </div>

        <div className="nav-item logout-item" onClick={() => {
          onLogout();
          navigate('/login');
        }}>
          <FaSignOutAlt className="nav-icon" />
          <span>Déconnexion</span>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
