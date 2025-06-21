import React, { useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PrintDepotList = ({ depotList, filters, printTrigger, onPrintEnd }) => {
  const printRef = useRef();

  useEffect(() => {
    if (!printTrigger) return;
    const handlePrint = async () => {
      try {
        // Rendre le conteneur visible
        if (printRef.current) {
          printRef.current.style.display = 'block';
        }
        await new Promise(r => setTimeout(r, 100)); // Laisse le temps au DOM de s'afficher
        const canvas = await html2canvas(printRef.current);
        const img = canvas.toDataURL('image/png');
        const doc = new jsPDF();
        const width = doc.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;
        doc.addImage(img, 'PNG', 0, 0, width, height);
        doc.save('depot-list.pdf');
      } catch (error) {
        console.error('Erreur lors de l\'impression:', error);
      } finally {
        // Cache le conteneur après impression
        if (printRef.current) {
          printRef.current.style.display = 'none';
        }
        onPrintEnd && onPrintEnd();
      }
    };
    handlePrint();
    // eslint-disable-next-line
  }, [printTrigger]);

  return (
    <div ref={printRef} style={{ display: 'none', padding: 20, background: '#fff', color: '#000', zIndex: 9999 }}>
      {/* Tableau des filtres amélioré */}
      <div style={{ width: 'fit-content', minWidth: 220, margin: '0 auto 18px auto', fontSize: 13 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f7f7f7', borderRadius: 6, boxShadow: '0 1px 4px #ddd', marginBottom: 0 }}>
          <tbody>
            {Object.entries(filters).map(([key, value]) => (
              value && value !== '' ? (
                <tr key={key}>
                  <th style={{ textAlign: 'left', border: '1px solid #e0e0e0', padding: '2px 8px', background: '#f0f0f0', fontWeight: 500 }}>{key}</th>
                  <td style={{ border: '1px solid #e0e0e0', padding: '2px 8px', background: '#fff' }}>{value}</td>
                </tr>
              ) : null
            ))}
          </tbody>
        </table>
      </div>
      {/* Tableau des dépôts */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
        <thead>
          <tr style={{ background: '#e9ecef' }}>
            {['Solde', 'Solde Converti', 'Sens', 'Agence', 'Devise', 'Produit', 'Date'].map(h => (
              <th key={h} style={{ border: '1px solid #ccc', padding: '6px 8px', fontSize: 14 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {depotList.map((item, idx) => (
            <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#f8f9fa' }}>
              <td style={{ border: '1px solid #ccc', padding: '4px 8px' }}>{item.solde}</td>
              <td style={{ border: '1px solid #ccc', padding: '4px 8px' }}>{item.soldeConverti}</td>
              <td style={{ border: '1px solid #ccc', padding: '4px 8px' }}>{item.sensSolde === 'C' ? 'Crédit' : item.sensSolde === 'D' ? 'Débit' : item.sensSolde}</td>
              <td style={{ border: '1px solid #ccc', padding: '4px 8px' }}>{item.agence?.nom || item.agence}</td>
              <td style={{ border: '1px solid #ccc', padding: '4px 8px' }}>{item.devise?.nom || item.devise}</td>
              <td style={{ border: '1px solid #ccc', padding: '4px 8px' }}>{item.produit?.nom || item.produit}</td>
              <td style={{ border: '1px solid #ccc', padding: '4px 8px' }}>{new Date(item.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrintDepotList;

