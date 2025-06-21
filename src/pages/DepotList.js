import React, { useEffect, useState } from 'react';
import { imprimerDepots } from '../services/imprimerService';
import { getDepots } from '../services/depotService';
import { getAgences } from '../services/agenceService';
import { getDevises } from '../services/deviseService';
import { getProduits } from '../services/produitService';
import { getCurrentUser } from '../services/authService';
import Sidebar from '../components/Sidebar';
import '../styles/DepotList.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Swal from 'sweetalert2';

const DepotList = () => {
  const [depots, setDepots] = useState([]);
  const [agences, setAgences] = useState([]);
  const [devises, setDevises] = useState([]);
  const [produits, setProduits] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [filterSens, setFilterSens] = useState('');
  const [filterAgence, setFilterAgence] = useState('');
  const [filterDevise, setFilterDevise] = useState('');
  const [filterProduit, setFilterProduit] = useState('');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');

  const [soldeRange, setSoldeRange] = useState([0, 10000]);
  const [soldeConvertiRange, setSoldeConvertiRange] = useState([0, 10000]);
  const [soldeMinMax, setSoldeMinMax] = useState([0, 10000]);
  const [soldeConvertiMinMax, setSoldeConvertiMinMax] = useState([0, 10000]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
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

        const [depotsData, agencesData, devisesData, produitsData] = await Promise.all([
          getDepots(),
          getAgences(),
          getDevises(),
          getProduits()
        ]);
        console.log("user", user);

        // Filtrer les dépôts si l'utilisateur est un chef d'agence
        if (user && user.role === 'chef_agence') {
          const filteredDepots = depotsData.filter(depot => depot.agence._id === user.agenceCode);
          setDepots(filteredDepots);
          setFilterAgence(user.agenceCode); // Définir l'agence par défaut
        } else {
          setDepots(depotsData);
        }

        // Filtrer les agences pour un chef d'agence
        if (user && user.role === 'chef_agence') {
          const userAgence = agencesData.find(agence => agence._id === user.agenceCode);
          setAgences(userAgence ? [userAgence] : []);
        } else {
          setAgences(agencesData);
        }

        setDevises(devisesData);
        setProduits(produitsData);
      } catch (err) {
        console.error('Erreur lors du chargement des données :', err);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (depots.length > 0) {
      const soldeVals = depots.map(d => d.solde || 0);
      const soldeConvVals = depots.map(d => d.soldeConverti || 0);
      setSoldeMinMax([Math.min(...soldeVals), Math.max(...soldeVals)]);
      setSoldeConvertiMinMax([Math.min(...soldeConvVals), Math.max(...soldeConvVals)]);
      setSoldeRange([Math.min(...soldeVals), Math.max(...soldeVals)]);
      setSoldeConvertiRange([Math.min(...soldeConvVals), Math.max(...soldeConvVals)]);
    }
  }, [depots]);

  const filteredDepots = depots.filter((depot) => {
    const soldeMatch = depot.solde >= soldeRange[0] && depot.solde <= soldeRange[1];
    const soldeConvertiMatch = depot.soldeConverti >= soldeConvertiRange[0] && depot.soldeConverti <= soldeConvertiRange[1];
    const sensMatch = filterSens === '' || depot.sensSolde === filterSens;
    const agenceMatch = filterAgence === '' || (depot.agence?._id || depot.agence) === filterAgence;
    const deviseMatch = filterDevise === '' || (depot.devise?._id || depot.devise) === filterDevise;
    const produitMatch = filterProduit === '' || (depot.produit?._id || depot.produit) === filterProduit;
    let dateMatch = true;
    if (filterDateStart) {
      dateMatch = dateMatch && new Date(depot.date) >= new Date(filterDateStart);
    }
    if (filterDateEnd) {
      // Pour inclure toute la journée de la date de fin
      const endDate = new Date(filterDateEnd);
      endDate.setHours(23,59,59,999);
      dateMatch = dateMatch && new Date(depot.date) <= endDate;
    }
    return soldeMatch && soldeConvertiMatch && sensMatch && agenceMatch && deviseMatch && produitMatch && dateMatch;
  });

  const getAgenceName = (id) => agences.find(a => a._id === id)?.nom || '';
  const getDeviseName = (id) => devises.find(d => d._id === id)?.nom || '';
  const getProduitName = (id) => produits.find(p => p._id === id)?.nom || '';

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="container-fluid p-4 w-100">
          <h2>Liste des Dépôts</h2>
          <button
            className="btn btn-primary mb-3"
            onClick={() => imprimerDepots(filteredDepots, {
              sens: filterSens,
              agence: filterAgence ? (agences.find(a => a._id === filterAgence)?.nom || filterAgence) : '',
              devise: filterDevise ? (devises.find(d => d._id === filterDevise)?.nom || filterDevise) : '',
              produit: filterProduit ? (produits.find(p => p._id === filterProduit)?.nom || filterProduit) : '',
              dateStart: filterDateStart,
              dateEnd: filterDateEnd,
              soldeMin: soldeRange[0],
              soldeMax: soldeRange[1],
              soldeConvertiMin: soldeConvertiRange[0],
              soldeConvertiMax: soldeConvertiRange[1]
            })}
          >
            Imprimer la liste filtrée
          </button>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>
                    Solde
                    <div className="px-2 mt-1">
                      <Slider
                        range
                        min={soldeMinMax[0]}
                        max={soldeMinMax[1]}
                        value={soldeRange}
                        onChange={setSoldeRange}
                        allowCross={false}
                        marks={{ [soldeMinMax[0]]: soldeMinMax[0], [soldeMinMax[1]]: soldeMinMax[1] }}
                        step={1}
                      />
                      <div className="d-flex justify-content-between small">
                        <span>{soldeRange[0]}</span>
                        <span>{soldeRange[1]}</span>
                      </div>
                    </div>
                  </th>
                  <th>
                    Solde Converti
                    <div className="px-2 mt-1">
                      <Slider
                        range
                        min={soldeConvertiMinMax[0]}
                        max={soldeConvertiMinMax[1]}
                        value={soldeConvertiRange}
                        onChange={setSoldeConvertiRange}
                        allowCross={false}
                        marks={{ [soldeConvertiMinMax[0]]: soldeConvertiMinMax[0], [soldeConvertiMinMax[1]]: soldeConvertiMinMax[1] }}
                        step={1}
                      />
                      <div className="d-flex justify-content-between small">
                        <span>{soldeConvertiRange[0]}</span>
                        <span>{soldeConvertiRange[1]}</span>
                      </div>
                    </div>
                  </th>
                  <th>
                    Sens
                    <select className="form-control form-control-sm mt-1" value={filterSens} onChange={e => setFilterSens(e.target.value)}>
                      <option value="">Tous</option>
                      <option value="C">Crédit</option>
                      <option value="D">Débit</option>
                    </select>
                  </th>
                  <th>
                    Agence
                    <select 
                      className="form-control form-control-sm mt-1" 
                      value={filterAgence} 
                      onChange={e => setFilterAgence(e.target.value)}
                      disabled={currentUser?.role === 'chef_agence'}
                    >
                      {currentUser?.role === 'chef_agence' ? (
                        <option value={filterAgence}>
                          {agences.length > 0 ? agences[0].nom : 'Mon agence'}
                        </option>
                      ) : (
                        <>
                          <option value="">Toutes</option>
                          {agences.map(agence => (
                            <option key={agence._id} value={agence._id}>{agence.nom}</option>
                          ))}
                        </>
                      )}
                    </select>
                  </th>
                  <th>
                    Devise
                    <select className="form-control form-control-sm mt-1" value={filterDevise} onChange={e => setFilterDevise(e.target.value)}>
                      <option value="">Toutes</option>
                      {devises.map(devise => (
                        <option key={devise._id} value={devise._id}>{devise.nom}</option>
                      ))}
                    </select>
                  </th>
                  <th>
                    Produit
                    <select className="form-control form-control-sm mt-1" value={filterProduit} onChange={e => setFilterProduit(e.target.value)}>
                      <option value="">Tous</option>
                      {produits.map(produit => (
                        <option key={produit._id} value={produit._id}>{produit.nom}</option>
                      ))}
                    </select>
                  </th>
                  <th>
                    Date
                    <div className="d-flex gap-1 mt-1">
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={filterDateStart}
                        onChange={e => setFilterDateStart(e.target.value)}
                        title="Date début"
                      />
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={filterDateEnd}
                        onChange={e => setFilterDateEnd(e.target.value)}
                        title="Date fin"
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDepots.length > 0 ? (
                  filteredDepots.map((depot) => (
                    <tr key={depot._id}>
                      <td>{depot.solde}</td>
                      <td>{depot.soldeConverti}</td>
                      <td>{depot.sensSolde === 'C' ? 'Crédit' : 'Débit'}</td>
                      <td>{depot.agence?.nom || getAgenceName(depot.agence?._id || depot.agence)}</td>
                      <td>{depot.devise?.nom || getDeviseName(depot.devise?._id || depot.devise)}</td>
                      <td>{depot.produit?.nom || getProduitName(depot.produit?._id || depot.produit)}</td>
                      <td>{new Date(depot.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">Aucun dépôt trouvé</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DepotList;
