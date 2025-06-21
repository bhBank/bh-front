import React, { useState, useEffect } from 'react';
import { getUsers, updateUser, deleteUser, createUser, updatePassword } from '../services/userService';
import { getAgencesWithoutChef } from '../services/agenceService';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../styles/Users.css';

const MySwal = withReactContent(Swal);

const Users = () => {
  const [users, setUsers] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("this is users page");
    fetchUsers();
    fetchAgencies();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      console.log("debug users", data);
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      setLoading(false);
    }
  };

  const fetchAgencies = async () => {
    try {
      const data = await getAgencesWithoutChef();
      console.log("debug agencies ", data);
      setAgencies(data);
    } catch (err) {
      console.error("Erreur lors du chargement des agences :", err);
    }
  };

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    });
    if (result.isConfirmed) {
      try {
        await deleteUser(userId);
        fetchUsers();
        Swal.fire('Supprimé !', 'L\'utilisateur a été supprimé.', 'success');
      } catch (err) {
        setError('Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };

const handleCreateUser = () => {
  MySwal.fire({
    title: 'Créer un Utilisateur',
    html: (
      <div style={{ textAlign: 'left' }}>
        <label htmlFor="swal-fullname" style={{ display: 'block', marginBottom: 4 }}>Nom complet :</label>
        <input type="text" id="swal-fullname" className="swal2-input" placeholder="Nom complet" />
        <label htmlFor="swal-email" style={{ display: 'block', marginTop: 8, marginBottom: 4 }}>Email :</label>
        <input type="email" id="swal-email" className="swal2-input" placeholder="Email" />
        <label htmlFor="swal-password" style={{ display: 'block', marginTop: 8, marginBottom: 4 }}>Mot de passe :</label>
        <input type="password" id="swal-password" className="swal2-input" placeholder="Mot de passe" />
        <label htmlFor="swal-matricule" style={{ display: 'block', marginTop: 8, marginBottom: 4 }}>Matricule :</label>
        <input type="text" id="swal-matricule" className="swal2-input" placeholder="Matricule (MAJ uniquement)" />
        <label htmlFor="swal-role" style={{ display: 'block', marginTop: 8, marginBottom: 4 }}>Rôle :</label>
        <select id="swal-role" className="swal2-input">
          <option value="">Sélectionner un rôle</option>
          <option value="admin">Admin</option>
          <option value="chef_agence">Chef d'Agence</option>
        </select>
      </div>
    ),
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Créer',
    cancelButtonText: 'Annuler',
    preConfirm: () => {
      const fullname = document.getElementById('swal-fullname').value.trim();
      const email = document.getElementById('swal-email').value.trim();
      const password = document.getElementById('swal-password').value;
      const matricule = document.getElementById('swal-matricule').value.trim();
      const role = document.getElementById('swal-role').value;

      // Validations personnalisées
      if (!fullname || !/^[A-Za-z\s]+$/.test(fullname)) {
        Swal.showValidationMessage('Le nom ne doit contenir que des lettres.');
        return false;
      }

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        Swal.showValidationMessage('Veuillez entrer une adresse email valide.');
        return false;
      }

      if (!password || password.length < 8) {
        Swal.showValidationMessage('Le mot de passe doit contenir au moins 8 caractères.');
        return false;
      }

      if (!matricule || !/^[A-Z]+$/.test(matricule)) {
        Swal.showValidationMessage('Le matricule doit être en lettres majuscules uniquement.');
        return false;
      }

      if (!role) {
        Swal.showValidationMessage('Veuillez sélectionner un rôle.');
        return false;
      }

      return { fullname, email, password, matricule, role };
    },
  }).then(async (result) => {
    if (result.isConfirmed && result.value) {
      try {
        await createUser(result.value);
        fetchUsers();
        Swal.fire('Succès', 'Utilisateur créé avec succès', 'success');
      } catch (err) {
        if (err.code === 'ERR_NETWORK') {
          Swal.fire('Erreur', 'Erreur de connexion au serveur', 'error');
        } else if (err.response && err.response.data && err.response.data.message) {
          Swal.fire('Erreur', err.response.data.message, 'error');
        } else {
          Swal.fire('Erreur', 'Une erreur est survenue', 'error');
        }
      }
    }
  });
};


 const openPasswordModal = (user) => {
  MySwal.fire({
    title: 'Changer le mot de passe',
    html: (
      <div style={{ textAlign: 'left' }}>
        <label htmlFor="swal-input1" style={{ display: 'block', marginBottom: 4 }}>Nouveau mot de passe :</label>
        <input
          type="password"
          id="swal-input1"
          className="swal2-input"
          placeholder="Nouveau mot de passe"
        />
        <label htmlFor="swal-input2" style={{ display: 'block', marginTop: 8, marginBottom: 4 }}>Confirmer le mot de passe :</label>
        <input
          type="password"
          id="swal-input2"
          className="swal2-input"
          placeholder="Confirmer le mot de passe"
        />
      </div>
    ),
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Enregistrer',
    cancelButtonText: 'Annuler',
    preConfirm: () => {
      const newPassword = document.getElementById('swal-input1').value;
      const confirmPassword = document.getElementById('swal-input2').value;

      if (!newPassword || !confirmPassword) {
        Swal.showValidationMessage('Veuillez remplir les deux champs.');
        return false;
      }

      if (newPassword.length < 8) {
        Swal.showValidationMessage('Le mot de passe doit contenir au moins 8 caractères.');
        return false;
      }

      if (newPassword !== confirmPassword) {
        Swal.showValidationMessage('Les mots de passe ne correspondent pas.');
        return false;
      }

      return { newPassword };
    },
  }).then(async (result) => {
    if (result.isConfirmed && result.value) {
      try {
        await updatePassword(user._id, result.value.newPassword);
        Swal.fire('Succès', 'Mot de passe modifié avec succès', 'success');
      } catch (err) {
        Swal.fire('Erreur', 'Erreur lors du changement de mot de passe.', 'error');
      }
    }
  });
};


const handleEditUser = (user) => {
  MySwal.fire({
    title: "Modifier l'utilisateur",
    html: (
      <div style={{ textAlign: 'left' }}>
        <label htmlFor="swal-fullname-edit" style={{ display: 'block', marginBottom: 4 }}>Nom complet :</label>
        <input
          type="text"
          id="swal-fullname-edit"
          className="swal2-input"
          placeholder="Nom complet"
          defaultValue={user.fullname}
        />
        <label htmlFor="swal-email-edit" style={{ display: 'block', marginTop: 8, marginBottom: 4 }}>Email :</label>
        <input
          type="email"
          id="swal-email-edit"
          className="swal2-input"
          placeholder="Email"
          defaultValue={user.email}
        />
        <label htmlFor="swal-matricule-edit" style={{ display: 'block', marginTop: 8, marginBottom: 4 }}>Matricule :</label>
        <input
          type="text"
          id="swal-matricule-edit"
          className="swal2-input"
          placeholder="Matricule"
          defaultValue={user.matricule}
        />
        <label htmlFor="swal-role-edit" style={{ display: 'block', marginTop: 8, marginBottom: 4 }}>Rôle :</label>
        <select id="swal-role-edit" className="swal2-input" defaultValue={user.role}>
          <option value="">Sélectionner un rôle</option>
          <option value="admin">Admin</option>
          <option value="chef_agence">Chef d'Agence</option>
        </select>
      </div>
    ),
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Enregistrer',
    cancelButtonText: 'Annuler',
    preConfirm: () => {
      const fullname = document.getElementById('swal-fullname-edit').value.trim();
      const email = document.getElementById('swal-email-edit').value.trim();
      const matricule = document.getElementById('swal-matricule-edit').value.trim();
      const role = document.getElementById('swal-role-edit').value;

      // Validations personnalisées
      if (!fullname || !/^[A-Za-z\s]+$/.test(fullname)) {
        Swal.showValidationMessage('Le nom ne doit contenir que des lettres.');
        return false;
      }

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        Swal.showValidationMessage('Veuillez entrer une adresse email valide.');
        return false;
      }

      if (!matricule || !/^[A-Z]+$/.test(matricule)) {
        Swal.showValidationMessage('Le matricule doit être en lettres majuscules uniquement.');
        return false;
      }

      if (!role) {
        Swal.showValidationMessage('Veuillez sélectionner un rôle.');
        return false;
      }

      return { fullname, email, matricule, role };
    },
  }).then(async (result) => {
    if (result.isConfirmed && result.value) {
      try {
        await updateUser(user._id, result.value);
        fetchUsers();
        Swal.fire('Succès', 'Utilisateur modifié avec succès', 'success');
      } catch (err) {
        Swal.fire('Erreur', "Erreur lors de la modification de l'utilisateur.", 'error');
      }
    }
  });
};


  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="container-fluid p-4 w-100">
          <h2>Gestion des Utilisateurs</h2>
          <div className="actions">
            <button className="btn btn-primary" onClick={handleCreateUser}>
              Créer un Utilisateur
            </button>
          </div>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nom Complet</th>
                  <th>Matricule</th>
                  <th>Rôle</th>
                  <th>Agence</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.fullname}</td>
                    <td>{user.matricule}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.role === 'admin'
                        ? ''
                        : user.agenceCode
                          ? `${user.agenceCode.nom}`
                          : 'Non assigné'
                      }
                    </td>
                    <td>
                      <button onClick={() => handleEditUser(user)} className="edit-btn">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(user._id)} className="delete-btn">
                        <FaTrash />
                      </button>
                      <button onClick={() => openPasswordModal(user)} className="password-btn">
                        Changer mot de passe
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Users;

