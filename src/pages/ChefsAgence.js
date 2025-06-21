import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import logo from "../assets/acceuil bh.jpg";
import {
  FaUserPlus,
  FaTrash,
  FaUserEdit,
} from "react-icons/fa";
import "../styles/Home.css";
import "../styles/ChefsAgence.css";
import Sidebar from "../components/Sidebar";

import { getUsersWithoutagences } from "../services/userService";
import { getAgencesWithoutChef } from "../services/agenceService";
import { createChefAgence } from "../services/chefAgencesService";
import { getChefsAgence } from "../services/chefAgencesService";
import { updateChefAgence } from "../services/chefAgencesService";

function ChefsAgence() {
  const navigate = useNavigate();
  const [showAgencies, setShowAgencies] = useState(false);
  const [agencies, setAgencies] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [agence, setAgence] = useState("");
  const [matricule, setMatricule] = useState("");

  const [editChefId, setEditChefId] = useState(null);
  const [editChefData, setEditChefData] = useState({
    fullname: "",
    email: "",
    agenceCode: "",
    matricule: ""
  });

  useEffect(() => {
    fetchAgencies();
    fetchUsers();
    fetchChefs();
  }, []);

  const fetchAgencies = async () => {
    try {
      const data = await getAgencesWithoutChef(); // Fetch agencies from the service
      setAgencies(data)
    } catch (error) {
      console.error("Erreur lors du chargement des agneces :", error);

    }

  };
  const fetchUsers = async () => {
    try {
      const data = await getUsersWithoutagences(); // Fetch agencies from the service
      setUsers(data)
      console.log("users", data);
    } catch (error) {
      console.error("Erreur lors du chargement des agneces :", error);
    }
  }
  const fetchChefs = async () => {
    try {
      const data = await getChefsAgence();
      console.log("debug chefs ", data) // Fonction à implémenter dans le service
      setChefs(data);
    } catch (error) {
      console.error("Erreur lors du chargement des chefs d'agence :", error);
    }
  };

  const ajouterChef = () => {
    if (user && agence) {
      // setChefs([...chefs, { user, email, agence, matricule }]);
      createChefAgence(user, agence);
      window.location.reload();
      setUser("");
      setAgence("");
    }
  };

  const supprimerChef = (index) => {
    setChefs(chefs.filter((_, i) => i !== index));
  };

  const handleEditChef = async (chef) => {
    console.log("debug editChefData", editChefData)
    try {
      await updateChefAgence(editChefId, editChefData);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du chef d'agence :", error);
    }

    // setEditChefId(chef._id);
    // setEditChefData({
    //   fullname: chef.fullname,
    //   email: chef.email,
    //   agenceCode: chef.agenceCode?._id || "",
    //   matricule: chef.matricule
    // });
  };
  const handleCancelEdit = () => {
    setEditChefId(null);
    setEditChefData({ fullname: "", email: "", agenceCode: "", matricule: "" });
  };


  return (
    <div className="app-layout">
      <Sidebar />

      {/* Contenu principal */}
      <main className="main-content">
        <div className="container-fluid p-4 w-100">
          <h2>Gestion des Chefs d'agence</h2>

          <div className="form-chef">
            <select value={user} onChange={(e) => setUser(e.target.value)}>
              <option value="">Sélectionner un chef</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullname}
                </option>
              ))}
            </select>
            <select value={agence} onChange={(e) => setAgence(e.target.value)}>
              <option value="">Sélectionner une agence</option>
              {agencies.map((agence) => (
                <option key={agence._id} value={agence._id}>
                  {agence.nom}
                </option>
              ))}
            </select>

            <button onClick={ajouterChef}>
              <FaUserPlus /> Ajouter
            </button>
          </div>

          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Agence</th>
                <th>Matricule</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chefs.map((chef, index) => (
                <tr key={index}>
                  <td>
                    {editChefId === chef._id ? (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editChefData.fullname}
                        onChange={e => {
                          console.log("editChefData", editChefData);
                          setEditChefData({ ...editChefData, fullname: e.target.value })
                        }}
                      />
                    ) : (
                      chef.fullname
                    )}
                  </td>
                  <td>
                    {editChefId === chef._id ? (
                      <input
                        type="email"
                        className="form-control form-control-sm"
                        value={editChefData.email}
                        onChange={e => {
                          setEditChefData({ ...editChefData, email: e.target.value })
                        }}
                      />
                    ) : (
                      chef.email
                    )}
                  </td>
                  <td>
                    {editChefId === chef._id ? (
                      <select
                        className="form-control form-control-sm"
                        value={editChefData.agenceCode || ""}
                        onChange={e => {
                          const value = e.target.value === "null" ? "" : e.target.value;  // Mettre "" à la place de null
                          setEditChefData({
                            ...editChefData,
                            agenceCode: e.target.value
                          });
                          console.log("Agence Code après sélection:", e.target.value); // Vérifier dans la console
                        }}
                      >
                        {(editChefData.agenceCode == "undefined") ?
                          <option value="null" defaultValue >Aucune agence ❌</option>
                          : <>
                            <option defaultValue={chef.agenceCode?._id} key={chef.agenceCode?._id} >{chef.agenceCode?.nom} </option>

                            <option value="null"  >Aucune agence ❌</option>
                          </>
                        }

                        {agencies.map((agence) => (
                          <option key={agence._id} value={agence._id}>
                            {agence.nom}
                          </option>
                        ))}
                      </select>
                    ) : (
                      chef.agenceCode && chef.agenceCode.nom
                        ? chef.agenceCode.nom
                        : <span style={{ color: 'red', fontSize: '1.2em' }} title="Aucune agence attribuée">❌</span>
                    )}
                  </td>

                  <td>
                    {editChefId === chef._id ? (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editChefData.matricule}
                        onChange={e => setEditChefData({ ...editChefData, matricule: e.target.value })}
                      />
                    ) : (
                      chef.matricule
                    )}
                  </td>
                  <td>
                    {editChefId === chef._id ? (
                      <>
                        <button className="btn btn-sm btn-primary me-2" onClick={handleEditChef}>
                          Enregistrer
                        </button>
                        <button className="btn btn-sm btn-secondary" onClick={handleCancelEdit}>
                          Annuler
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => {
                          setEditChefId(chef._id);
                          setEditChefData({
                            fullname: chef.fullname,
                            email: chef.email,
                            agenceCode: chef.agenceCode ? chef.agenceCode._id : "undefined",
                            matricule: chef.matricule
                          });
                        }}>
                          <FaUserEdit /> {/* ou <FaEdit /> si tu veux */}
                        </button>
                        <button onClick={() => supprimerChef(index)} className="btn btn-danger btn-sm">
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {chefs.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">Aucun chef d'agence trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default ChefsAgence;
