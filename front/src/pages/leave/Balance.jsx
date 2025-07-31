import React, { useState } from 'react';
import { FiUser, FiCalendar, FiRefreshCw, FiDownload } from 'react-icons/fi';
import ProgressBar from '/src/components/charts/ProgressBar.jsx';

export default function LeaveBalance() {
  const initialBalances = [
    { id: 1, employee: "Jean Dupont", total: 25, taken: 12, remaining: 13 },
    { id: 2, employee: "Marie Martin", total: 25, taken: 8, remaining: 17 },
    { id: 3, employee: "Pierre Lambert", total: 25, taken: 20, remaining: 5 }
  ];

  const [year, setYear] = useState(new Date().getFullYear());
  const [balances, setBalances] = useState(initialBalances);

  // Calcule la progression en pourcentage arrondie
  const getProgressPercent = (taken, total) => {
    if (total === 0) return 0;
    return Math.round((taken / total) * 100);
  };

  // Détermine la couleur selon la progression / solde restant
  const getProgressColor = (remaining) => {
    if (remaining <= 3) return 'red';
    if (remaining <= 7) return 'orange';
    return 'green';
  };

  // Fonction Actualiser (simule recharge des données)
  const handleRefresh = () => {
    // Ici tu peux appeler une API pour récupérer les données fraîches
    // Pour l'instant, on remet juste les données initiales
    setBalances(initialBalances);
  };

  // Fonction Exporter au format CSV
  const handleExport = () => {
    const headers = ['Employé', 'Congés acquis', 'Congés pris', 'Solde restant'];
    const rows = balances.map(b => [
      b.employee,
      b.total,
      b.taken,
      b.remaining
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map(e => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `soldes_conges_${year}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Soldes de Congés</h1>
        <p className="text-gray-600">Suivi des congés acquis et consommés</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center bg-white p-2 rounded-lg shadow-sm border">
          <FiCalendar className="text-gray-500 mr-2" />
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border-none focus:outline-none text-gray-700"
          >
            {[2023, 2024, 2025].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <FiRefreshCw size={18} />
            <span>Actualiser</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
          >
            <FiDownload size={18} />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Congés acquis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Congés pris</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solde restant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {balances.map((balance) => {
                const percent = getProgressPercent(balance.taken, balance.total);
                const color = getProgressColor(balance.remaining);

                return (
                  <tr key={balance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <FiUser className="text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{balance.employee}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{balance.total} jours</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{balance.taken} jours</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{balance.remaining} jours</td>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                      <div className="w-full md:w-48">
                        <ProgressBar value={percent} color={color} />
                      </div>
                      <div className={`text-sm font-semibold ${
                        color === 'red' ? 'text-red-600' :
                        color === 'orange' ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {percent}% utilisé
                        {color === 'red' && ' - Attention, solde faible !'}
                        {color === 'orange' && ' - Prudence'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total congés acquis</h3>
          <p className="text-2xl font-semibold text-gray-800">
            {balances.reduce((sum, b) => sum + b.total, 0)} jours
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total congés pris</h3>
          <p className="text-2xl font-semibold text-gray-800">
            {balances.reduce((sum, b) => sum + b.taken, 0)} jours
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Solde global</h3>
          <p className="text-2xl font-semibold text-blue-800">
            {balances.reduce((sum, b) => sum + b.remaining, 0)} jours
          </p>
        </div>
      </div>
    </div>
  );
}
