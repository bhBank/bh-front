import React, { useEffect, useState } from "react";
import { getDevises, getDevisesByRegion, createDevise, updateDevise, deleteDevise } from "../services/deviseService";
import { getRegions } from "../services/regionService"; // Importer le service des regions
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

function Devise() {
  const [devises, setDevises] = useState([]);
  const [regions, setRegions] = useState([]);
  const [newDevise, setNewDevise] = useState("");
  const [newTauxConversion, setNewTauxConversion] = useState(1);
  const [editDeviseId, setEditDeviseId] = useState(null);
  const [editDeviseName, setEditDeviseName] = useState("");
  const [editTauxConversion, setEditTauxConversion] = useState(1);
  const [regionIdForFilter, setRegionIdForFilter] = useState(""); // Region sélectionné pour le filtre
  const [regionIdForAddUpdate, setRegionIdForAddUpdate] = useState(""); // Region pour l'ajout et la mise à jour

  // Lors de l'initialisation du composant, charger les devises et regions
  useEffect(() => {
    fetchDevises();
    fetchRegions();
  }, []);

  const fetchDevises = async () => {
    try {
      const res = await getDevises();
      console.log("getDevises", res);
      setDevises(res);
    } catch (err) {
      console.error("Erreur lors du chargement des devises :", err);
    }
  };

  const fetchDevisesByRegion = async (regionId) => {
    try {
      const res = await getDevisesByRegion(regionId);
      setDevises(res);
    } catch (err) {
      console.error("Erreur lors du chargement des devises par region :", err);
    }
  };

  const fetchRegions = async () => {
    try {
      const res = await getRegions();
      console.log("getRegions", res);
      setRegions(res);
    } catch (err) {
      console.error("Erreur lors du chargement des regions :", err);
    }
  };

  const handleAddDevise = async () => {
    if (!newDevise.trim() || !regionIdForAddUpdate) return;
    try {
      await createDevise({ 
        nom: newDevise, 
        regionMonde: regionIdForAddUpdate,
        tauxConversion: newTauxConversion 
      });
      setNewDevise("");
      setNewTauxConversion(1);
      setRegionIdForAddUpdate("");
      window.location.reload();
      fetchDevises();
    } catch (err) {
      console.error("Erreur lors de l'ajout de la devise :", err);
    }
  };

  const handleDeleteDevise = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await deleteDevise(id);
      fetchDevises();
    } catch (err) {
      console.error("Erreur lors de la suppression de la devise :", err);
    }
  };

  const handleEditDevise = (id, name, region, tauxConversion) => {
    setEditDeviseId(id);
    setEditDeviseName(name);
    setEditTauxConversion(tauxConversion);
    setRegionIdForAddUpdate(region._id);
  };

  const handleUpdateDevise = async () => {
    try {
      await updateDevise(editDeviseId, { 
        nom: editDeviseName, 
        regionMonde: regionIdForAddUpdate,
        tauxConversion: editTauxConversion 
      });
      setEditDeviseId(null);
      setEditDeviseName("");
      setEditTauxConversion(1);
      setRegionIdForAddUpdate("");
      fetchDevises();
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la devise :", err);
    }
  };

  // Fonction pour gérer le filtre par region
  const handleSelectRegionForFilter = (event) => {
    const selectedRegionId = event.target.value;
    setRegionIdForFilter(selectedRegionId);

    if (selectedRegionId) {
      fetchDevisesByRegion(selectedRegionId);
    } else {
      fetchDevises(); // Si aucun region n'est sélectionné, on récupère toutes les devises
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="container-fluid p-4 w-100">



          <h2>Gestion des Devises</h2>

          {/* Sélectionner un region pour filtrer les devises */}


          {/* Ajouter une devise */}
          <div className="card p-3 mb-4 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Ajouter une devise</h5>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Nom de la devise"
                  value={newDevise}
                  onChange={(e) => setNewDevise(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDevise()}
                />
                <input
                  type="number"
                  className="form-control me-2"
                  placeholder="Taux de conversion"
                  value={newTauxConversion}
                  onChange={(e) => setNewTauxConversion(parseFloat(e.target.value))}
                  step="0.01"
                  min="0"
                />
                <select
                  className="form-control me-2"
                  value={regionIdForAddUpdate}
                  onChange={(e) => setRegionIdForAddUpdate(e.target.value)}
                >
                  <option value="">-- Sélectionner un Region --</option>
                  {regions.map((region) => (
                    <option key={region._id} value={region._id}>
                      {region.nom}
                    </option>
                  ))}
                </select>
                <button className="btn btn-success" onClick={handleAddDevise}>
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* Liste des devises */}
          <div className="table-responsive">
            <div className="filter-section mb-4">
              <label>Filtrer par Region</label>
              <select
                className="form-control"
                value={regionIdForFilter}
                onChange={handleSelectRegionForFilter}
              >
                <option value="">-- Choisir un Region --</option>
                {regions.map((region) => (
                  <option key={region._id} value={region._id}>
                    {region.nom}
                  </option>
                ))}
              </select>
            </div>
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nom</th>
                  <th>Taux de conversion</th>
                  <th>Region</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {devises.length > 0 ? (
                  devises.map((devise) => (
                    <tr key={devise._id}>
                      <td>
                        {editDeviseId === devise._id ? (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={editDeviseName}
                            onChange={(e) => setEditDeviseName(e.target.value)}
                          />
                        ) : (
                          devise.nom
                        )}
                      </td>
                      <td>
                        {editDeviseId === devise._id ? (
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={editTauxConversion}
                            onChange={(e) => setEditTauxConversion(parseFloat(e.target.value))}
                            step="0.01"
                            min="0"
                          />
                        ) : (
                          devise.tauxConversion
                        )}
                      </td>
                      <td>
                        {editDeviseId === devise._id ? (
                          <select
                            className="form-control form-control-sm"
                            value={regionIdForAddUpdate}
                            onChange={(e) => setRegionIdForAddUpdate(e.target.value)}
                          >
                            <option value="">-- Sélectionner un Region --</option>
                            {regions.map((region) => (
                              <option key={region._id} value={region._id} defaultValue={devise.regionMonde._id===region._id}>
                                {region.nom}
                              </option>
                            ))}
                          </select>
                        ) : (
                          devise.regionMonde? devise.regionMonde.nom : "Region non trouvé"
                        )}
                      </td>
                      <td>
                        {editDeviseId === devise._id ? (
                          <>
                            <button
                              className="btn btn-sm btn-primary me-2"
                              onClick={handleUpdateDevise}
                            >
                              Enregistrer
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setEditDeviseId(null);
                                setEditDeviseName("");
                                setEditTauxConversion(1);
                                setRegionIdForAddUpdate("");
                              }}
                            >
                              Annuler
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => handleEditDevise(devise._id, devise.nom, devise.regionMonde, devise.tauxConversion)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteDevise(devise._id)}
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
                    <td colSpan="4" className="text-center">Aucune devise trouvée</td>
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

export default Devise;