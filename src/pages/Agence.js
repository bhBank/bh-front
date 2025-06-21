import React, { useEffect, useState } from 'react';
import { createAgence, getAgences, updateAgence, deleteAgence } from '../services/agenceService'; // Services pour l'API
import { getVilles } from '../services/villeService'; // Service pour récupérer les villes
import { getGouvernorats } from '../services/gouvernoratService'; // Service pour récupérer les gouvernorats
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Icônes pour modifier et supprimer
import $ from 'jquery'; // Importer jQuery pour Select2
import 'select2/dist/css/select2.min.css'; // Importer le style de Select2
import 'select2'; // Importer Select2
import Sidebar from '../components/Sidebar';
import "../styles/Agence.css";


function Agence() {
  const [agences, setAgences] = useState([]);
  const [villes, setVilles] = useState([]);
  const [gouvernorats, setGouvernorats] = useState([]);
  const [newAgenceName, setNewAgenceName] = useState('');
  const [editAgenceId, setEditAgenceId] = useState(null);
  const [editAgenceName, setEditAgenceName] = useState('');
  const [editAgenceCode, setEditAgenceCode] = useState('');
  const [villeIdForAdd, setVilleIdForAdd] = useState('');
  const [villeIdForAddUpdate, setVilleIdForAddUpdate] = useState(''); // Ville sélectionnée pour l'ajout ou la mise à jour
  const [villeIdForFilter, setVilleIdForFilter] = useState(''); // Ville sélectionnée pour filtrer
  const [codeAgence, setCodeAgence] = useState('');
  const [existingCodes, setExistingCodes] = useState([]);

  // Lors de l'initialisation du composant, charger les agences, villes et gouvernorats
  useEffect(() => {
    fetchAgences();
    fetchVilles();
    fetchGouvernorats();
  }, []);

  const fetchAgences = async () => {
    try {
      const res = await getAgences();
      setAgences(res);
      const codes = res.map(agence => agence.codeAgence);
      setExistingCodes(codes);
    } catch (err) {
      console.error('Erreur lors du chargement des agences :', err);
    }
  };

  const fetchVilles = async () => {
    try {
      const res = await getVilles();
      setVilles(res);
    } catch (err) {
      console.error('Erreur lors du chargement des villes :', err);
    }
  };

  const fetchGouvernorats = async () => {
    try {
      const res = await getGouvernorats();
      setGouvernorats(res);
    } catch (err) {
      console.error('Erreur lors du chargement des gouvernorats :', err);
    }
  };

  // Fonction pour organiser les villes par gouvernorat
  const groupVillesByGouvernorat = () => {
    const groupedVilles = {};
    villes.forEach(ville => {
      const gouvernoratId = ville.gouvernorat._id;
      if (!groupedVilles[gouvernoratId]) {
        groupedVilles[gouvernoratId] = {
          gouvernorat: ville.gouvernorat.nom,
          villes: []
        };
      }
      groupedVilles[gouvernoratId].villes.push(ville);
    });
    return groupedVilles;
  };

  // Mettre à jour les agences en fonction de la ville filtrée
  const fetchAgencesByVille = async (villeId) => {
    try {
      const res = await getAgences();
      setAgences(res.filter((agence) => agence.ville._id === villeId));
    } catch (err) {
      console.error('Erreur lors du chargement des agences par ville :', err);
    }
  };

  // Ajouter une agence
  const handleAddAgence = async () => {
    if (!newAgenceName.trim() || !villeIdForAdd || !codeAgence) return; // Vérifie si la ville et le code sont remplis
    try {
      if (existingCodes.includes(parseInt(codeAgence))) {
        alert("Le code d'agence existe déjà. Veuillez choisir un autre code.");
        return;
      }
      await createAgence({ nom: newAgenceName, ville: villeIdForAdd, codeAgence });
      setNewAgenceName('');
      setCodeAgence('');
      setVilleIdForAddUpdate('');
      fetchAgences(); // Recharger les agences
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'agence :', err);
    }
  };

  // Modifier une agence
  const handleEditAgence = (id, name, ville, codeAgence) => {
    setEditAgenceId(id);
    setEditAgenceName(name);
    setEditAgenceCode(codeAgence); // Assurez-vous que le codeAgence est également passé à l'édition
    setVilleIdForAddUpdate(ville._id); // Charger l'ID de la ville lors de l'édition
  };

  // Vérifier si le codeAgence existe
  const isCodeExists = (code) => {
    return existingCodes.includes(code);
  };

  // Mettre à jour une agence
  const handleUpdateAgence = async () => {
    if (!editAgenceName.trim() || !villeIdForAddUpdate || !editAgenceCode) return; // Vérifie si les champs sont remplis
    try {
      if (existingCodes.includes(parseInt(editAgenceCode))) {
        alert("Le code d'agence existe déjà. Veuillez choisir un autre code.");
        return;
      }

      await updateAgence(editAgenceId, { nom: editAgenceName, ville: villeIdForAddUpdate, codeAgence: editAgenceCode });
      setEditAgenceId(null);
      setEditAgenceName('');
      setEditAgenceCode('');
      setVilleIdForAddUpdate('');
      fetchAgences(); // Recharger les agences
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'agence :', err);
    }
  };

  // Supprimer une agence
  const handleDeleteAgence = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    try {
      await deleteAgence(id);
      fetchAgences();
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'agence :', err);
    }
  };

  // Filtrer par ville
  const handleSelectVilleForFilter = (event) => {
    const selectedVilleId = event.target.value;
    setVilleIdForFilter(selectedVilleId);

    if (selectedVilleId) {
      fetchAgencesByVille(selectedVilleId);
    } else {
      fetchAgences(); // Si aucune ville n'est sélectionnée, on récupère toutes les agences
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="container-fluid p-4 w-100">
          <h2>Gestion des Agences</h2>

          {/* Sélectionner une ville pour filtrer les agences */}
          <div className="filter-section mb-4">
            <label>Filtrer par Ville</label>
            <select
              id="ville-select"
              className="form-control"
              value={villeIdForFilter}
              onChange={handleSelectVilleForFilter}
            >
              <option value="">-- Choisir une Ville --</option>
              {villes.map((ville) => (
                <option key={ville._id} value={ville._id}>
                  {ville.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Ajouter une agence */}
          <div className="card p-3 mb-4 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Ajouter une agence</h5>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Nom de l'agence"
                  value={newAgenceName}
                  onChange={(e) => setNewAgenceName(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control me-2"
                  placeholder="Code de l'agence"
                  value={codeAgence}
                  onChange={(e) => setCodeAgence(e.target.value)} // Assurez-vous que le codeAgence est bien géré
                />
                <select
                  className="form-control ville-select"
                  value={villeIdForAdd}
                  onChange={(e) => setVilleIdForAdd(e.target.value)}
                >
                  <option value="">-- Sélectionner une Ville --</option>
                  {Object.keys(groupVillesByGouvernorat()).map(gouvernoratId => (
                    <optgroup key={gouvernoratId} label={groupVillesByGouvernorat()[gouvernoratId].gouvernorat}>
                      {groupVillesByGouvernorat()[gouvernoratId].villes.map(ville => (
                        <option key={ville._id} value={ville._id}>
                          {ville.nom}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <button className="btn btn-success" onClick={handleAddAgence}>
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* Liste des agences */}
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nom</th>
                  <th>Code Agence</th>
                  <th>Ville</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {agences.length > 0 ? (
                  agences.map((agence) => (
                    <tr key={agence._id}>
                      <td>
                        {editAgenceId === agence._id ? (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={editAgenceName}
                            onChange={(e) => setEditAgenceName(e.target.value)}
                          />
                        ) : (
                          agence.nom
                        )}
                      </td>
                      <td>
                        {editAgenceId === agence._id ? (
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={editAgenceCode}
                            onChange={(e) => setEditAgenceCode(e.target.value)}
                          />
                        ) : (
                          agence.codeAgence
                        )}
                      </td>
                      <td>
                        {editAgenceId === agence._id ? (
                          <select
                            className="form-control form-control-sm ville-select"
                            value={villeIdForAddUpdate}
                            onChange={(e) => setVilleIdForAddUpdate(e.target.value)}
                          >
                            <option value="">-- Sélectionner une Ville --</option>
                            {Object.keys(groupVillesByGouvernorat()).map(gouvernoratId => (
                              <optgroup key={gouvernoratId} label={groupVillesByGouvernorat()[gouvernoratId].gouvernorat}>
                                {groupVillesByGouvernorat()[gouvernoratId].villes.map(ville => (
                                  <option key={ville._id} value={ville._id}>
                                    {ville.nom}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        ) : (
                          agence.ville.nom
                        )}
                      </td>
                      <td>
                        {editAgenceId === agence._id ? (
                          <>
                            <button className="btn btn-sm btn-primary me-2" onClick={handleUpdateAgence}>
                              Enregistrer
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setEditAgenceId(null);
                                setEditAgenceName('');
                                setEditAgenceCode('');
                                setVilleIdForAddUpdate('');
                              }}
                            >
                              Annuler
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditAgence(agence._id, agence.nom, agence.ville, agence.codeAgence)}>
                              <FaEdit />
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteAgence(agence._id)}>
                              <FaTrashAlt />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      Aucune agence trouvée
                    </td>
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

export default Agence;
