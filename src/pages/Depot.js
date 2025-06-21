import React, { useEffect, useState } from "react";
import { getDepots, createDepot, updateDepot, deleteDepot } from "../services/depotService";
import { getAgences } from "../services/agenceService";
import { getDevises } from "../services/deviseService";
import { getProduits } from "../services/produitService";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import { getCurrentUser } from "../services/authService";
import { imprimerDepots } from "../services/imprimerService";
import { FaPrint } from "react-icons/fa"; // Pour l'icône d'impression
import Swal from 'sweetalert2';


function Depot() {
  const [depots, setDepots] = useState([]);
  const [agences, setAgences] = useState([]);
  const [devises, setDevises] = useState([]);
  const [produits, setProduits] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  // États pour l'ajout
  const [newSolde, setNewSolde] = useState("");
  const [newSensSolde, setNewSensSolde] = useState("C");
  const [newAgence, setNewAgence] = useState("");
  const [newDevise, setNewDevise] = useState("");
  const [newProduit, setNewProduit] = useState("");

  // États pour l'édition
  const [editDepotId, setEditDepotId] = useState(null);
  const [editSolde, setEditSolde] = useState("");
  const [editSensSolde, setEditSensSolde] = useState("C");
  const [editAgence, setEditAgence] = useState("");
  const [editDevise, setEditDevise] = useState("");
  const [editProduit, setEditProduit] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    // Vérifier si c'est un chef d'agence sans agenceCode
    if (user && user.role === 'chef_agence' && !user.agenceCode) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Vous êtes chef d\'agence mais aucune agence ne vous a été assignée. Veuillez contacter l\'administrateur.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    if (user && user.role === 'chef_agence') {
      setNewAgence(user.agenceCode);
      setEditAgence(user.agenceCode);
    }
    fetchAgences();
    fetchDevises();
    fetchProduits();
    fetchDepots();
  }, []);
  const handlePrint = () => {
    imprimerDepots(depots);
  };
  const fetchDepots = async () => {
    try {
      const res = await getDepots();
      console.log("newAgence", newAgence);
      console.log("currentUser", getCurrentUser());
      // Filtrer les dépôts en fonction du rôle de l'utilisateur
      if (getCurrentUser() && getCurrentUser().role === 'chef_agence') {
        console.log("newAgence", newAgence);
        const filteredDepots = res.filter(depot => depot.agence._id == getCurrentUser().agenceCode);
        setDepots(filteredDepots);
      } else {
        setDepots(res);
      } 
    } catch (err) {
      console.error("Erreur lors du chargement des dépôts :", err);
    }
  };

  const fetchAgences = async () => {
    try {
      const res = await getAgences();
      // Si l'utilisateur est chef d'agence, ne montrer que son agence
      if (getCurrentUser() && getCurrentUser().role === 'chef_agence') {
        const userAgence = res.find(agence => agence._id == getCurrentUser().agenceCode);
        setAgences(userAgence ? [userAgence] : []);


        // Afficher le nom de l'agence dans le sélecteur
        // if (userAgence) {
        //   setNewAgence(userAgence._id);
        // }
      } else {
        setAgences(res);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des agences :", err);
    }
  };

  const fetchDevises = async () => {
    try {
      const res = await getDevises();
      setDevises(res);
    } catch (err) {
      console.error("Erreur lors du chargement des devises :", err);
    }
  };

  const fetchProduits = async () => {
    try {
      const res = await getProduits();
      setProduits(res);
    } catch (err) {
      console.error("Erreur lors du chargement des produits :", err);
    }
  };

  const handleAddDepot = async () => {
    if (!newSolde || !newAgence || !newDevise || !newProduit) {

      alert("Veuillez remplir tous les champs");
      console.log("newSolde", newSolde);
      console.log("newAgence", newAgence);
      console.log("newDevise", newDevise);
      console.log("newProduit", newProduit);
      return;
    };
    try {
      await createDepot({
        solde: parseFloat(newSolde),
        sensSolde: newSensSolde,
        agence: newAgence,
        devise: newDevise,
        produit: newProduit
      });
      setNewSolde("");
      setNewSensSolde("C");
      setNewDevise("");
      setNewProduit("");
      window.location.reload();
      // fetchDepots();
    } catch (err) {
      console.error("Erreur lors de l'ajout du dépôt :", err);
    }
  };

  const handleDeleteDepot = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await deleteDepot(id);
      window.location.reload();
    } catch (err) {
      console.error("Erreur lors de la suppression du dépôt :", err);
    }
  };

  const handleEditDepot = (depot) => {
    setEditDepotId(depot._id);
    setEditSolde(depot.solde);
    setEditSensSolde(depot.sensSolde);
    setEditAgence(depot.agence._id);
    setEditDevise(depot.devise._id);
    setEditProduit(depot.produit._id);
  };

  const handleUpdateDepot = async () => {
    try {
      await updateDepot(editDepotId, {
        solde: parseFloat(editSolde),
        sensSolde: editSensSolde,
        agence: editAgence,
        devise: editDevise,
        produit: editProduit
      });
      setEditDepotId(null);
      setEditSolde("");
      setEditSensSolde("C");
      setEditAgence("");
      setEditDevise("");
      setEditProduit("");
      window.location.reload();

      // fetchDepots();
    } catch (err) {
      console.error("Erreur lors de la mise à jour du dépôt :", err);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="container-fluid p-4 w-100">
          <h2>Gestion des Dépôts</h2>
          <button
            className="btn btn-primary"
            onClick={handlePrint}
          >
            <FaPrint className="me-2" />
            Imprimer la liste
          </button>

          {/* Formulaire d'ajout */}
          <div className="card p-3 mb-4 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Ajouter un dépôt</h5>
              <div className="d-flex flex-wrap gap-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Solde"
                  value={newSolde}
                  onChange={(e) => setNewSolde(e.target.value)}
                  step="0.01"
                  min="0"
                />
                <select
                  className="form-control"
                  value={newSensSolde}
                  onChange={(e) => setNewSensSolde(e.target.value)}
                >
                  <option value="C">Crédit</option>
                  <option value="D">Débit</option>
                </select>
                <select
                  className="form-control"
                  value={newAgence}
                  onChange={(e) => setNewAgence(e.target.value)}
                  disabled={currentUser?.role === 'chef_agence'}
                >
                  {currentUser?.role === 'chef_agence' ? (
                    <option value={newAgence}>
                      Mon agence
                    </option>
                  ) : (
                    <>
                      <option value="">-- Sélectionner une Agence --</option>
                      {agences.map((agence) => (
                        <option key={agence._id} value={agence._id}>
                          {agence.nom}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <select
                  className="form-control"
                  value={newDevise}
                  onChange={(e) => setNewDevise(e.target.value)}
                >
                  <option value="">-- Sélectionner une Devise --</option>
                  {devises.map((devise) => (
                    <option key={devise._id} value={devise._id}>
                      {devise.nom}
                    </option>
                  ))}
                </select>
                <select
                  className="form-control"
                  value={newProduit}
                  onChange={(e) => setNewProduit(e.target.value)}
                >
                  <option value="">-- Sélectionner un Produit --</option>
                  {produits.map((produit) => (
                    <option key={produit._id} value={produit._id}>
                      {produit.nom}
                    </option>
                  ))}
                </select>
                <button className="btn btn-success" onClick={handleAddDepot}>
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* Liste des dépôts */}
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Solde</th>
                  <th>Solde Converti</th>
                  <th>Sens</th>
                  <th>Agence</th>
                  <th>Devise</th>
                  <th>Produit</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {depots.length > 0 ? (
                  depots.map((depot) => (
                    <tr key={depot._id}>
                      <td>
                        {editDepotId === depot._id ? (
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={editSolde}
                            onChange={(e) => setEditSolde(e.target.value)}
                            step="0.01"
                            min="0"
                          />
                        ) : (
                          depot.solde
                        )}
                      </td>
                      <td>{depot.soldeConverti}</td>
                      <td>
                        {editDepotId === depot._id ? (
                          <select
                            className="form-control form-control-sm"
                            value={editSensSolde}
                            onChange={(e) => setEditSensSolde(e.target.value)}
                          >
                            <option value="C">Crédit</option>
                            <option value="D">Débit</option>
                          </select>
                        ) : (
                          depot.sensSolde === "C" ? "Crédit" : "Débit"
                        )}
                      </td>
                      <td>
                        {editDepotId === depot._id ? (
                          <select
                            className="form-control form-control-sm"
                            value={editAgence}
                            onChange={(e) => setEditAgence(e.target.value)}
                            disabled={currentUser?.role === 'chef_agence'}
                          >
                            {agences.map((agence) => (
                              <option key={agence._id} value={agence._id}>
                                {agence.nom}
                              </option>
                            ))}
                          </select>
                        ) : (
                          depot.agence?.nom
                        )}
                      </td>
                      <td>
                        {editDepotId === depot._id ? (
                          <select
                            className="form-control form-control-sm"
                            value={editDevise}
                            onChange={(e) => setEditDevise(e.target.value)}
                          >
                            {devises.map((devise) => (
                              <option key={devise._id} value={devise._id}>
                                {devise.nom}
                              </option>
                            ))}
                          </select>
                        ) : (
                          depot.devise?.nom
                        )}
                      </td>
                      <td>
                        {editDepotId === depot._id ? (
                          <select
                            className="form-control form-control-sm"
                            value={editProduit}
                            onChange={(e) => setEditProduit(e.target.value)}
                          >
                            {produits.map((produit) => (
                              <option key={produit._id} value={produit._id}>
                                {produit.nom}
                              </option>
                            ))}
                          </select>
                        ) : (
                          depot.produit?.nom
                        )}
                      </td>
                      <td>{new Date(depot.date).toLocaleDateString()}</td>
                      <td>
                        {editDepotId === depot._id ? (
                          <>
                            <button
                              className="btn btn-sm btn-primary me-2"
                              onClick={handleUpdateDepot}
                            >
                              Enregistrer
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setEditDepotId(null);
                                setEditSolde("");
                                setEditSensSolde("C");
                                setEditAgence("");
                                setEditDevise("");
                                setEditProduit("");
                              }}
                            >
                              Annuler
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => handleEditDepot(depot)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteDepot(depot._id)}
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
                    <td colSpan="8" className="text-center">Aucun dépôt trouvé</td>
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

export default Depot; 