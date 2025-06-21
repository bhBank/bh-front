import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/acceuil bh.jpg";
import {
  getProduits,
  createProduit,
  updateProduit,
  deleteProduit,
} from "../services/produitService";
import { getCategories } from "../services/categorieService";
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
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";

function Produit() {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAgencies, setShowAgencies] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nom: "",
    prix: "",
    categorie: ""
  });
  const [editProductId, setEditProductId] = useState(null);
  const [editProductData, setEditProductData] = useState({
    nom: "",
    prix: "",
    categorie: ""
  });

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
    fetchProduits();
    fetchCategories();
  }, []);

  const fetchProduits = async () => {
    const data = await getProduits();
    console.log("debug produits", data);
    setProduits(data);
  };

  const fetchCategories = async () => {
    const data = await getCategories();

    setCategories(data);
  };

  const handleAdd = async () => {
    if (!newProduct.nom || !newProduct.categorie) return;
    await createProduit(newProduct);
    setNewProduct({ nom: "", categorie: "" });
    fetchProduits();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    await deleteProduit(id);
    fetchProduits();
  };

  const handleEdit = (prod) => {
    setEditProductId(prod._id);
    setEditProductData({
      nom: prod.nom,
      categorie: prod.categorie
    });
  };

  const handleUpdate = async () => {
    await updateProduit(editProductId, editProductData);
    setEditProductId(null);
    setEditProductData({ nom: "", categorie: "" });
    fetchProduits();
  };

  return (
    <div className="app-layout">
      {/* Sidebar identique */}
    <Sidebar />
      {/* Main content */}
      <main className="main-content">
        <div className="container-fluid p-4 w-100">
          <h2 className="mb-4">Gestion des Produits </h2>

          {/* Formulaire d'ajout */}
          <div className="card p-3 mb-4 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title text-center mb-3">Ajouter un produit</h5>
              <div className="row g-2">
                <div className="col-md-4">
                  <input
                    type="text"
                    placeholder="Nom du produit"
                    className="form-control"
                    value={newProduct.nom}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, nom: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={newProduct.categorie}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, categorie: e.target.value })
                    }
                  >
                    <option value="">-- Choisir une catégorie --</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <button className="btn btn-success w-100" onClick={handleAdd}>
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tableau des produits */}
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {produits.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      {editProductId === prod._id ? (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={editProductData.nom}
                          onChange={(e) =>
                            setEditProductData({ ...editProductData, nom: e.target.value })
                          }
                        />
                      ) : (
                        prod.nom
                      )}
                    </td>
                    <td>
                      {editProductId === prod._id ? (
                        <select
                          className="form-select form-select-sm"
                          value={editProductData.categorie}
                          onChange={(e) =>
                            setEditProductData({ ...editProductData, categorie: e.target.value })
                          }
                        >
                          <option value="">-- Choisir --</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.nom}
                            </option>
                          ))}
                        </select>
                      ) : (
                        // categories.find((cat) => cat._id === prod.categorie)?.nom || "N/A"
                        prod.categorie.nom
                      )}
                    </td>
                    <td>
                      {editProductId === prod._id ? (
                        <>
                          <button className="btn btn-sm btn-primary me-2" onClick={handleUpdate}>
                            Enregistrer
                          </button>
                          <button className="btn btn-sm btn-secondary" onClick={() => setEditProductId(null)}>
                            Annuler
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(prod)}>
                            Modifier
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(prod._id)}>
                            Supprimer
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {produits.length === 0 && (
              <div className="text-center text-muted mt-3">Aucun produit trouvé.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Produit;
