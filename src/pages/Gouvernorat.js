import React, { useEffect, useState } from "react";
import { getGouvernorats, createGouvernorat, updateGouvernorat, deleteGouvernorat } from "../services/gouvernoratService";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

function Gouvernorat() {
  const [gouvernorats, setGouvernorats] = useState([]);
  const [newGouvernorat, setNewGouvernorat] = useState("");
  const [editGouvernoratId, setEditGouvernoratId] = useState(null);
  const [editGouvernoratName, setEditGouvernoratName] = useState("");

  // Charger les gouvernorats à l'initialisation
  useEffect(() => {
    fetchGouvernorats();
  }, []);

  const fetchGouvernorats = async () => {
    try {
      const res = await getGouvernorats();
      setGouvernorats(res);
    } catch (err) {
      console.error("Erreur lors du chargement des gouvernorats :", err);
    }
  };

  const handleAddGouvernorat = async () => {
    if (!newGouvernorat.trim()) return;
    try {
      await createGouvernorat({ nom: newGouvernorat });
      setNewGouvernorat("");
      fetchGouvernorats();
    } catch (err) {
      console.error("Erreur lors de l'ajout du gouvernorat :", err);
    }
  };

  const handleDeleteGouvernorat = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await deleteGouvernorat(id);
      fetchGouvernorats();
    } catch (err) {
      console.error("Erreur lors de la suppression du gouvernorat :", err);
    }
  };

  const handleEditGouvernorat = (id, name) => {
    setEditGouvernoratId(id);
    setEditGouvernoratName(name);
  };

  const handleUpdateGouvernorat = async () => {
    try {
      await updateGouvernorat(editGouvernoratId, { nom: editGouvernoratName });
      setEditGouvernoratId(null);
      setEditGouvernoratName("");
      fetchGouvernorats();
    } catch (err) {
      console.error("Erreur lors de la mise à jour du gouvernorat :", err);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="container-fluid p-4 w-100">
          <h2>Gestion des Gouvernorats</h2>

          {/* Ajouter un gouvernorat */}
          <div className="card p-3 mb-4 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Ajouter un gouvernorat</h5>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Nom du gouvernorat"
                  value={newGouvernorat}
                  onChange={(e) => setNewGouvernorat(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddGouvernorat()}
                />
                <button className="btn btn-success" onClick={handleAddGouvernorat}>
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* Liste des gouvernorats */}
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nom</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {gouvernorats.length > 0 ? (
                  gouvernorats.map((gov) => (
                    <tr key={gov._id}>
                      <td>
                        {editGouvernoratId === gov._id ? (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={editGouvernoratName}
                            onChange={(e) => setEditGouvernoratName(e.target.value)}
                          />
                        ) : (
                          gov.nom
                        )}
                      </td>
                      <td>
                        {editGouvernoratId === gov._id ? (
                          <>
                            <button
                              className="btn btn-sm btn-primary me-2"
                              onClick={handleUpdateGouvernorat}
                            >
                              Enregistrer
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setEditGouvernoratId(null);
                                setEditGouvernoratName("");
                              }}
                            >
                              Annuler
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => handleEditGouvernorat(gov._id, gov.nom)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteGouvernorat(gov._id)}
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
                    <td colSpan="2" className="text-center">Aucun gouvernorat trouvé</td>
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

export default Gouvernorat;
