module.exports = ({ employee, rh, contract, company, date }) => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Contrat de Travail - ${contract.contractType}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.7; 
          color: #2c3e50; 
          background: #fff;
          max-width: 210mm;
          margin: 0 auto;
          padding: 20mm;
        }

        .document-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 3px solid #3498db;
        }

        .company-info {
          flex: 1;
        }

        .company-name { 
          font-size: 24px; 
          font-weight: 700; 
          color: #2c3e50;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        .company-details {
          color: #7f8c8d;
          font-size: 14px;
          line-height: 1.4;
        }

        .document-info {
          text-align: right;
          color: #7f8c8d;
          font-size: 14px;
        }

        .main-title {
          text-align: center;
          margin: 40px 0;
          padding: 25px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .main-title h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }

        .main-title .subtitle {
          font-size: 16px;
          opacity: 0.9;
        }

        .contract-type-badge {
          display: inline-block;
          background: #e8f5e8;
          color: #27ae60;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 14px;
          border: 2px solid #27ae60;
          margin: 20px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .section {
          margin-bottom: 35px;
          background: #fafbfc;
          padding: 25px;
          border-radius: 8px;
          border-left: 4px solid #3498db;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #ecf0f1;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .parties-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-top: 15px;
        }

        .party-info {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e1e8ed;
        }

        .party-label {
          font-weight: 700;
          color: #3498db;
          font-size: 16px;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .party-details {
          color: #2c3e50;
          line-height: 1.6;
        }

        .article-content {
          color: #34495e;
          line-height: 1.8;
        }

        .article-content p {
          margin-bottom: 12px;
        }

        .highlight {
          background: #fff3cd;
          padding: 2px 6px;
          border-radius: 3px;
          font-weight: 600;
          color: #856404;
        }

        .salary-highlight {
          background: #d4edda;
          color: #155724;
          padding: 8px 12px;
          border-radius: 5px;
          font-weight: 700;
          font-size: 18px;
          display: inline-block;
          margin: 10px 0;
        }

        .signature-section {
          margin-top: 60px;
          padding-top: 30px;
          border-top: 2px solid #ecf0f1;
        }

        .signature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          margin-top: 40px;
        }

        .signature-box {
          text-align: center;
          padding: 30px 20px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 2px dashed #bdc3c7;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .signature-title {
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 15px;
          font-size: 16px;
        }

        .signature-name {
          color: #7f8c8d;
          margin-bottom: 20px;
        }

        .signature-date {
          color: #95a5a6;
          font-size: 14px;
          margin-top: auto;
        }

        .footer {
          margin-top: 50px;
          text-align: center;
          color: #95a5a6;
          font-size: 12px;
          padding-top: 20px;
          border-top: 1px solid #ecf0f1;
        }

        .duration-info {
          background: #e8f4f8;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #3498db;
          margin: 15px 0;
        }

        .trial-period {
          background: #fff3cd;
          padding: 12px;
          border-radius: 6px;
          border-left: 4px solid #ffc107;
          margin-top: 15px;
          color: #856404;
        }

        @media print {
          body { 
            padding: 0;
            box-shadow: none;
          }
          .section {
            box-shadow: none;
            border: 1px solid #ddd;
          }
        }
      </style>
    </head>
    <body>
      <div class="document-header">
        <div class="company-info">
          <div class="company-name">${company?.name || 'GPRO Consulting'}</div>
          <div class="company-details">
            ${company?.address || 'Adresse de l\'entreprise'}<br>
            ${company?.registrationNumber ? `N° d'enregistrement: ${company.registrationNumber}` : 'N° d\'enregistrement: XXXXXXX'}<br>
            ${company?.city || 'Sousse'}, ${company?.country || 'Tunisie'}
          </div>
        </div>
        <div class="document-info">
          <strong>Document généré le:</strong><br>
          ${new Date().toLocaleDateString('fr-FR')}<br><br>
          <strong>Référence:</strong><br>
          CT-${Date.now().toString().slice(-6)}
        </div>
      </div>

      <div class="main-title">
        <h1>CONTRAT DE TRAVAIL</h1>
        <div class="subtitle">Fait à ${company?.city || 'Sousse'}, le ${date}</div>
      </div>

      <div style="text-align: center;">
        <div class="contract-type-badge">
          ${contract.contractType === 'CDI' ? 'Contrat à Durée Indéterminée' : 
            contract.contractType === 'CDD' ? 'Contrat à Durée Déterminée' : 
            contract.contractType === 'Stage' ? 'Convention de Stage' : 'Contrat de Travail'}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Entre les soussignés</div>
        <div class="parties-grid">
          <div class="party-info">
            <div class="party-label">L'Employeur</div>
            <div class="party-details">
              <strong>${company?.name || 'GPRO Consulting'}</strong><br>
              Représentée par: <strong>${rh.name}</strong><br>
              Qualité: ${rh.position || 'Directeur des Ressources Humaines'}<br>
              Siège social: ${company?.address || 'Adresse, Sousse, Tunisie'}
            </div>
          </div>
          <div class="party-info">
            <div class="party-label">L'Employé(e)</div>
            <div class="party-details">
              <strong>${employee.name}</strong><br>
              Né(e) le: ${new Date(employee.birthdate).toLocaleDateString('fr-FR')}<br>
              Adresse: ${employee.address || 'Adresse de l\'employé'}<br>
              Nationalité: ${employee.nationality || 'Française'}
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Article 1 - Fonction et Poste</div>
        <div class="article-content">
          <p>L'employé(e) est engagé(e) en qualité de <span class="highlight">${contract.position}</span>.</p>
          <p>Il/Elle exercera ses fonctions sous l'autorité hiérarchique de ${rh.name} et sera rattaché(e) au service ${contract.department || 'concerné'}.</p>
          <p>L'employé(e) s'engage à respecter le règlement intérieur de l'entreprise et à exercer ses fonctions avec diligence et loyauté.</p>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Article 2 - Durée du Contrat</div>
        <div class="article-content">
          <div class="duration-info">
            ${contract.contractType === 'CDI' ? 
              `<p><strong>Durée:</strong> Le présent contrat est conclu pour une durée indéterminée.</p>
               <p><strong>Prise d'effet:</strong> ${new Date(contract.startDate).toLocaleDateString('fr-FR')}</p>` : 
              `<p><strong>Durée:</strong> Le présent contrat est conclu pour une durée déterminée.</p>
               <p><strong>Début:</strong> ${new Date(contract.startDate).toLocaleDateString('fr-FR')}</p>
               <p><strong>Fin:</strong> ${new Date(contract.endDate).toLocaleDateString('fr-FR')}</p>`}
          </div>
          
          ${contract.trialPeriod ? 
            `<div class="trial-period">
              <strong>Période d'essai:</strong> ${contract.trialPeriod} jours à compter de la date de début.
              <br>Cette période pourra être renouvelée une fois dans la limite légale.
            </div>` : ''}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Article 3 - Rémunération</div>
        <div class="article-content">
          <p>La rémunération brute mensuelle est fixée à:</p>
          <div class="salary-highlight">
            ${contract.salary.toFixed(2)} € brut/mois
          </div>
          <p>Cette rémunération sera versée mensuellement, sous déduction des cotisations sociales obligatoires.</p>
          <p>L'employé(e) bénéficiera des avantages sociaux prévus par la convention collective applicable.</p>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Article 4 - Temps de Travail</div>
        <div class="article-content">
          <p>La durée du travail est fixée à <span class="highlight">${contract.workingHours || '35'} heures par semaine</span>, réparties du lundi au vendredi.</p>
          <p>Les horaires de travail sont: ${contract.schedule || '9h00 - 17h00'} avec une pause déjeuner d'une heure.</p>
          <p>L'employé(e) bénéficie de ${contract.vacationDays || '25'} jours de congés payés par an.</p>
        </div>
      </div>

      <div class="signature-section">
        <div class="section-title">Signatures</div>
        <div class="signature-grid">
          <div class="signature-box">
            <div class="signature-title">Pour l'Entreprise</div>
            <div class="signature-name">${rh.name}</div>
            <div class="signature-date">Date et signature</div>
          </div>
          <div class="signature-box">
            <div class="signature-title">L'Employé(e)</div>
            <div class="signature-name">${employee.name}</div>
            <div class="signature-date">Date et signature</div>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>Ce document a été généré automatiquement le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
        <p>Conforme au Code du travail français - Version ${new Date().getFullYear()}</p>
      </div>
    </body>
    </html>
  `;
};