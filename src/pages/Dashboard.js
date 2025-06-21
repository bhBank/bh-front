import React, { useState } from "react";
import '../styles/Dashboard.css';
import Sidebar from "../components/Sidebar";
import { FaArrowLeft } from "react-icons/fa";

const Dashboards = () => {
  const [selectedDashboard, setSelectedDashboard] = useState(null);

  const dashboards = {
    vue: {
      title: "Dépôts à vue",
      url: "https://app.powerbi.com/view?r=eyJrIjoiYmE5MmE3YWYtMDQzOC00M2FlLWIxMGQtZWNiZGFhYTk4ZTg5IiwidCI6ImRiZDY2NjRkLTRlYjktNDZlYi05OWQ4LTVjNDNiYTE1M2M2MSIsImMiOjl9"
    },
    epargne: {
      title: "Dépôts d'épargne",
      url: "https://app.powerbi.com/view?r=eyJrIjoiYzgzNGZjNWUtMmVmNC00NzdkLTgyM2ItMjUwNjEzMmEzYzg1IiwidCI6ImRiZDY2NjRkLTRlYjktNDZlYi05OWQ4LTVjNDNiYTE1M2M2MSIsImMiOjl9"
    }
  };

  const handleBackToDashboards = () => {
    setSelectedDashboard(null);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        {selectedDashboard ? (
          <div className="dashboard-header">
            <button onClick={handleBackToDashboards} className="back-button">
              <FaArrowLeft /> Retour aux tableaux
            </button>
            <h1 className="dashboard-title">{dashboards[selectedDashboard].title}</h1>
          </div>
        ) : (
          <h1 className="dashboard-title">Tableaux de bord</h1>
        )}

        {!selectedDashboard && (
          <div className="dashboard-grid">
            {Object.entries(dashboards).map(([key, dash]) => (
              <div className="dashboard-card" key={key}>
                <h2>{dash.title}</h2>
                <button 
                  onClick={() => setSelectedDashboard(key)}
                  className="dashboard-button"
                >
                  Afficher le Dashboard
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedDashboard && (
          <div className="powerbi-fullwidth">
            <iframe
              title={`Power BI - ${dashboards[selectedDashboard].title}`}
              src={dashboards[selectedDashboard].url}
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboards;