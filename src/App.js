import React, { useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { getCurrentUser } from "./services/authService";

import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import ProductCategories from "./pages/ProductCategories";
import Dashboard from "./pages/Dashboard";
import ChefsAgence from "./pages/ChefsAgence";
import DepotList from "./pages/DepotList";
import ChatAgence from './pages/ChatAgence';
// import ChatPrive from './pages/ChatPrive';
import Messenger from './pages/Messenger';
import Produit from "./pages/Produit";
import Agence from "./pages/Agence";
import AgencesChefs from "./pages/AgencesChefs";
import Gouvernorat from "./pages/Gouvernorat";
import Ville from "./pages/ville";
import RegionMonde from "./pages/RegionMonde";
import Devise from "./pages/Devise";
import Depot from "./pages/Depot";
import Users from "./pages/Users";
import ResetPassword from './pages/ResetPassword';
import Logs from './pages/Logs';
import 'bootstrap/dist/css/bootstrap.min.css';
import { compareSync } from "bcryptjs";

// Création du contexte d'authentification
export const AuthContext = createContext();

// Composant pour protéger les routes
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const currentUser = getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Vérifier si un token existe dans le localStorage au chargement
    return !!localStorage.getItem('user');
  });
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (token) => {
    // console.log("data",token);
    // localStorage.setItem('token', token);
    // console.log("token ahahhaha",token);
    console.log("from app.js")
     setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, handleLogin, handleLogout }}>
      <Router>
        <div className="App">
          <Routes>
            {/* Route publique pour reset password */}
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* Routes publiques */}
            <Route path="/login" element={
              showRegister ? <Register onRegisterSuccess={() => setShowRegister(false)} /> : <Login onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />
            } />
            {/* Routes protégées */}
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/contact" element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            } />

            {/* Routes admin */}
            <Route path="/categories" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProductCategories />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/agences" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Agence />
              </ProtectedRoute>
            } />
            <Route path="/agences-chefs" element={
              <ProtectedRoute allowedRoles={['admin', 'chef_agence']}>
                <AgencesChefs />
              </ProtectedRoute>
            } />
            <Route path="/gouvernorats" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Gouvernorat />
              </ProtectedRoute>
            } />
            <Route path="/villes" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Ville />
              </ProtectedRoute>
            } />
            <Route path="/chefs-agence" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ChefsAgence />
              </ProtectedRoute>
            } />
            <Route path="/produits" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Produit />
              </ProtectedRoute>
            } />
            <Route path="/regionsMonde" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <RegionMonde />
              </ProtectedRoute>
            } />
            <Route path="/devises" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Devise />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="/logs" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Logs />
              </ProtectedRoute>
            } />

            {/* Routes chat */}
            <Route path="/chat-agence" element={
              <ProtectedRoute allowedRoles={['admin', 'chef_agence']}>
                <ChatAgence />
              </ProtectedRoute>
            } />
            {/* <Route path="/chat-prive/:receiverId" element={
              <ProtectedRoute allowedRoles={['admin', 'chef_agence']}>
                <ChatPrive />
              </ProtectedRoute>
            } /> */}
            <Route path="/messenger" element={
              <ProtectedRoute allowedRoles={['admin', 'chef_agence']}>
                <Messenger />
              </ProtectedRoute>
            } />

            {/* Routes partagées */}
            <Route path="/depot-list" element={
              <ProtectedRoute allowedRoles={['admin', 'chef_agence']}>
                <DepotList />
              </ProtectedRoute>
            } />
            <Route path="/depots" element={
              <ProtectedRoute allowedRoles={['admin', 'chef_agence']}>
                <Depot />
              </ProtectedRoute>
            } />

            {/* Route par défaut */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
