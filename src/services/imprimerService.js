export const imprimerDepots = (depots, filters = {}) => {
    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    
    // Générer le tableau des filtres (affiche seulement les filtres renseignés)
    const filtersTable = Object.entries(filters).filter(([_, v]) => v !== '' && v !== undefined && v !== null)
        .map(([k, v]) => `<tr><th style='text-align:left;padding:2px 8px;background:#f0f0f0;border:1px solid #e0e0e0;font-weight:500'>${k}</th><td style='border:1px solid #e0e0e0;padding:2px 8px;background:#fff'>${v}</td></tr>`)
        .join('');

    // Créer le contenu HTML pour l'impression
    const content = `
        <html>
            <head>
                <title>Liste des Dépôts</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    h1 { text-align: center; color: #333; }
                    .header { margin-bottom: 20px; }
                    .date { text-align: right; margin-bottom: 20px; }
                    .filters-table { width: fit-content; min-width: 220px; margin: 0 auto 10px auto; font-size: 13px; background: #f7f7f7; border-radius: 6px; box-shadow: 0 1px 4px #ddd; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Liste des Dépôts</h1>
                    <div class="date">Date d'impression: ${new Date().toLocaleDateString()}</div>
                </div>
                ${filtersTable ? `<table class='filters-table'><tbody>${filtersTable}</tbody></table>` : ''}
                <table>
                    <thead>
                        <tr>
                            <th>Solde</th>
                            <th>Solde Converti</th>
                            <th>Sens</th>
                            <th>Agence</th>
                            <th>Devise</th>
                            <th>Produit</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${depots.map(depot => `
                            <tr>
                                <td>${depot.solde}</td>
                                <td>${depot.soldeConverti}</td>
                                <td>${depot.sensSolde === "C" ? "Crédit" : "Débit"}</td>
                                <td>${depot.agence?.nom || ''}</td>
                                <td>${depot.devise?.nom || ''}</td>
                                <td>${depot.produit?.nom || ''}</td>
                                <td>${new Date(depot.date).toLocaleDateString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
        </html>
    `;

    // Écrire le contenu dans la nouvelle fenêtre
    printWindow.document.write(content);
    printWindow.document.close();

    // Attendre que le contenu soit chargé avant d'imprimer
    printWindow.onload = function() {
        printWindow.print();
        // Fermer la fenêtre après l'impression
        printWindow.onafterprint = function() {
            printWindow.close();
        };
    };
};
