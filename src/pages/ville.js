import React, { useEffect, useState } from "react";
import { getVilles, getVillesByGouvernorat, createVille, updateVille, deleteVille } from "../services/villeService";
import { getGouvernorats } from "../services/gouvernoratService"; // Importer le service des gouvernorats
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

function Ville() {
  const [villes, setVilles] = useState([]);
  const [gouvernorats, setGouvernorats] = useState([]);
  const [newVille, setNewVille] = useState("");
  const [editVilleId, setEditVilleId] = useState(null);
  const [editVilleName, setEditVilleName] = useState("");
  const [gouvernoratIdForFilter, setGouvernoratIdForFilter] = useState(""); // Gouvernorat sélectionné pour le filtre
  const [gouvernoratIdForAddUpdate, setGouvernoratIdForAddUpdate] = useState(""); // Gouvernorat pour l'ajout et la mise à jour

  // Lors de l'initialisation du composant, charger les villes et gouvernorats
  useEffect(() => {
    fetchVilles();
    fetchGouvernorats();
  }, []);

  const fetchVilles = async () => {
    try {
      const res = await getVilles();
      console.log("villes ",res)
      setVilles(res);
    } catch (err) {
      console.error("Erreur lors du chargement des villes :", err);
    }
  };

  const fetchVillesByGouvernorat = async (gouvernoratId) => {
    try {
      const res = await getVillesByGouvernorat(gouvernoratId);
      console.log("Villes par gouvernorat :", res);
      setVilles(res);
    } catch (err) {
      console.error("Erreur lors du chargement des villes par gouvernorat :", err);
    }
  };

  const fetchGouvernorats = async () => {
    try {
      const res = await getGouvernorats();
      setGouvernorats(res);
    } catch (err) {
      console.error("Erreur lors du chargement des gouvernorats :", err);
    }
  };

  const handleAddVille = async () => {
    if (!newVille.trim() || !gouvernoratIdForAddUpdate) return; // Vérifie si la ville et le gouvernorat sont sélectionnés
    try {
      await createVille({ nom: newVille, gouvernorat: gouvernoratIdForAddUpdate }); // Inclure gouvernorat
      setNewVille("");
      setGouvernoratIdForAddUpdate(""); // Réinitialiser après l'ajout
      fetchVilles();
    } catch (err) {
      console.error("Erreur lors de l'ajout de la ville :", err);
    }
  };

  const handleDeleteVille = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await deleteVille(id);
      fetchVilles();
    } catch (err) {
      console.error("Erreur lors de la suppression de la ville :", err);
    }
  };

  const handleEditVille = (id, name, gouvernorat) => {
    setEditVilleId(id);
    setEditVilleName(name);
    setGouvernoratIdForAddUpdate(gouvernorat._id); // Charger l'ID du gouvernorat lors de l'édition
  };

  const handleUpdateVille = async () => {
    try {
      await updateVille(editVilleId, { nom: editVilleName, gouvernorat: gouvernoratIdForAddUpdate });
      setEditVilleId(null);
      setEditVilleName("");
      setGouvernoratIdForAddUpdate(""); // Réinitialiser après la mise à jour
      fetchVilles();
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la ville :", err);
    }
  };

  // Fonction pour gérer le filtre par gouvernorat
  const handleSelectGouvernoratForFilter = (event) => {
    const selectedGouvernoratId = event.target.value;
    setGouvernoratIdForFilter(selectedGouvernoratId);

    if (selectedGouvernoratId) {
      fetchVillesByGouvernorat(selectedGouvernoratId);
    } else {
      fetchVilles(); // Si aucun gouvernorat n'est sélectionné, on récupère toutes les villes
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="container-fluid p-4 w-100">



          <h2>Gestion des Villes</h2>

          {/* Sélectionner un gouvernorat pour filtrer les villes */}


          {/* Ajouter une ville */}
          <div className="card p-3 mb-4 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Ajouter une ville</h5>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Nom de la ville"
                  value={newVille}
                  onChange={(e) => setNewVille(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddVille()}
                />
                <select
                  className="form-control"
                  value={gouvernoratIdForAddUpdate}
                  onChange={(e) => setGouvernoratIdForAddUpdate(e.target.value)}
                >
                  <option value="">-- Sélectionner un Gouvernorat --</option>
                  {gouvernorats.map((gouvernorat) => (
                    <option key={gouvernorat._id} value={gouvernorat._id}>
                      {gouvernorat.nom}
                    </option>
                  ))}
                </select>
                <button className="btn btn-success" onClick={handleAddVille}>
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* Liste des villes */}
          <div className="table-responsive">
            <div className="filter-section mb-4">
              <label>Filtrer par Gouvernorat</label>
              <select
                className="form-control"
                value={gouvernoratIdForFilter}
                onChange={handleSelectGouvernoratForFilter}
              >
                <option value="">-- Choisir un Gouvernorat --</option>
                {gouvernorats.map((gouvernorat) => (
                  <option key={gouvernorat._id} value={gouvernorat._id}>
                    {gouvernorat.nom}
                  </option>
                ))}
              </select>
            </div>
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nom</th>
                  <th>Gouvernorat</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {villes.length > 0 ? (
                  villes.map((ville) => (
                    <tr key={ville._id}>
                      <td>
                        {editVilleId === ville._id ? (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={editVilleName}
                            onChange={(e) => setEditVilleName(e.target.value)}
                          />
                        ) : (
                          ville.nom
                        )}
                      </td>
                      <td>
                        {editVilleId === ville._id ? (
                          <select
                            className="form-control form-control-sm"
                            value={gouvernoratIdForAddUpdate}
                            onChange={(e) => setGouvernoratIdForAddUpdate(e.target.value)}
                          >
                            <option value="">-- Sélectionner un Gouvernorat --</option>
                            {gouvernorats.map((gouvernorat) => (
                              <option key={gouvernorat._id} value={gouvernorat._id}>
                                {ville.gouvernorat.nom? ville.gouvernorat.nom : "Gouvernorat non trouvé"}
                              </option>
                            ))}
                          </select>
                        ) : (
                          ville.gouvernorat.nom? ville.gouvernorat.nom : "Gouvernorat non trouvé"
                        )}
                      </td>
                      <td>
                        {editVilleId === ville._id ? (
                          <>
                            <button
                              className="btn btn-sm btn-primary me-2"
                              onClick={handleUpdateVille}
                            >
                              Enregistrer
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setEditVilleId(null);
                                setEditVilleName("");
                                setGouvernoratIdForAddUpdate(""); // Réinitialiser après annulation
                              }}
                            >
                              Annuler
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => handleEditVille(ville._id, ville.nom, ville.gouvernorat)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteVille(ville._id)}
                            >
                              <FaTrashAlt />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">Aucune ville trouvée</td>
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

export default Ville;