import React, { useEffect, useState } from "react";
import { getRegions, createRegion, updateRegion, deleteRegion } from "../services/regionService";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

function Region() {
  const [Regions, setRegions] = useState([]);
  const [newRegion, setNewRegion] = useState("");
  const [editRegionId, setEditRegionId] = useState(null);
  const [editRegionName, setEditRegionName] = useState("");

  // Charger les Regions à l'initialisation
  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const res = await getRegions();
      setRegions(res);
    } catch (err) {
      console.error("Erreur lors du chargement des Regions :", err);
    }
  };

  const handleAddRegion = async () => {
    if (!newRegion.trim()) return;
    try {
      await createRegion({ nom: newRegion });
      setNewRegion("");
      fetchRegions();
    } catch (err) {
      console.error("Erreur lors de l'ajout du Region :", err);
    }
  };

  const handleDeleteRegion = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await deleteRegion(id);
      fetchRegions();
    } catch (err) {
      console.error("Erreur lors de la suppression du Region :", err);
    }
  };

  const handleEditRegion = (id, name) => {
    setEditRegionId(id);
    setEditRegionName(name);
  };

  const handleUpdateRegion = async () => {
    try {
      await updateRegion(editRegionId, { nom: editRegionName });
      setEditRegionId(null);
      setEditRegionName("");
      fetchRegions();
    } catch (err) {
      console.error("Erreur lors de la mise à jour du Region :", err);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="container-fluid p-4 w-100">
          <h2>Gestion des Regions</h2>

          {/* Ajouter un Region */}
          <div className="card p-3 mb-4 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Ajouter un Region</h5>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Nom du Region"
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddRegion()}
                />
                <button className="btn btn-success" onClick={handleAddRegion}>
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* Liste des Regions */}
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nom</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Regions.length > 0 ? (
                  Regions.map((gov) => (
                    <tr key={gov._id}>
                      <td>
                        {editRegionId === gov._id ? (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={editRegionName}
                            onChange={(e) => setEditRegionName(e.target.value)}
                          />
                        ) : (
                          gov.nom
                        )}
                      </td>
                      <td>
                        {editRegionId === gov._id ? (
                          <>
                            <button
                              className="btn btn-sm btn-primary me-2"
                              onClick={handleUpdateRegion}
                            >
                              Enregistrer
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setEditRegionId(null);
                                setEditRegionName("");
                              }}
                            >
                              Annuler
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => handleEditRegion(gov._id, gov.nom)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteRegion(gov._id)}
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
                    <td colSpan="2" className="text-center">Aucun Region trouvé</td>
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

export default Region;
