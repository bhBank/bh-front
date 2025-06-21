import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/acceuil bh.jpg";
import {
  getCategories,
  createCategorie,
  deleteCategorie,
  updateCategorie,
} from "../services/categorieService";
import {
  FaBuilding,
  FaUserTie,
  FaMoneyBillWave,
  FaListUl,
  FaChartLine,
  FaEnvelope,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";

function ProductCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [showAgencies, setShowAgencies] = useState(false);
  const navigate = useNavigate();

  const agencies = [
    "Agence Tunis Centre", "Agence Tunis Sud", "Agence Bizerte THAALBI",
    "Agence MENZEL BOURGUIBA", "Agence Bizerte IBN KHALDOUN", "Agence AOUSJA",
    "Agence RAFRAF", "Agence MATEUR", "Agence SFAX THYNA",
    "Agence SFAX MAHRES", "Agence CHEDLY KALLALA", "Agence SFAX CHIHIA",
    "Agence SBEITLA", "Agence METLAOUI", "Agence Bizerte ERRAWABI",
    "Agence MENZEL ABDERRAHMEN", "Agence RAS JEBEL", "Agence MENZAH 8",
    "Agence MANZAH 5", "Agence ENNASR 2"
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res);
    } catch (err) {
      console.error("Erreur lors du chargement des catégories :", err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await createCategorie({ nom: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error("Erreur lors de l'ajout :", err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await deleteCategorie(id);
      fetchCategories();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const handleEditCategory = (id, name) => {
    setEditCategoryId(id);
    setEditCategoryName(name);
  };

  const handleUpdateCategory = async () => {
    try {
      await updateCategorie(editCategoryId, { nom: editCategoryName });
      setEditCategoryId(null);
      setEditCategoryName("");
      fetchCategories();
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar identique à Home */}
     <Sidebar />

      {/* Contenu principal original */}
      <main className="main-content">
        <div className="container-fluid p-4 w-100">
          <h2 className="mb-4">Gestion des Catégories</h2>

          <div className="card p-3 mb-4 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title text-center mb-3">Ajouter une catégorie</h5>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Nouvelle catégorie"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                <button className="btn btn-success" onClick={handleAddCategory}>
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nom</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((cat) => (
                    <tr key={cat._id}>
                      <td>
                        {editCategoryId === cat._id ? (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={editCategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                          />
                        ) : (
                          cat.nom
                        )}
                      </td>
                      <td>
                        {editCategoryId === cat._id ? (
                          <>
                            <button
                              className="btn btn-sm btn-primary me-2"
                              onClick={handleUpdateCategory}
                            >
                              Enregistrer
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setEditCategoryId(null);
                                setEditCategoryName("");
                              }}
                            >
                              Annuler
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => handleEditCategory(cat._id, cat.nom)}
                            >
                              Modifier
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteCategory(cat._id)}
                            >
                              Supprimer
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center">Aucune catégorie disponible</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductCategories;