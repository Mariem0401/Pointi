import React, { useState } from 'react';
import { FiUser, FiCheck, FiDollarSign, FiTrendingUp, FiUsers } from 'react-icons/fi';

export default function PayrollHistory() {
  const [payments, setPayments] = useState([
    { id: 1, name: "Jean Dupont", month: "Janvier 2023", amount: 3200, status: "payé" },
    { id: 2, name: "Marie Martin", month: "Janvier 2023", amount: 3600, status: "non payé" },
    { id: 3, name: "Pierre Lambert", month: "Janvier 2023", amount: 2950, status: "payé" },
    { id: 4, name: "Nada Messaoudi", month: "Janvier 2023", amount: 3100, status: "non payé" },
    { id: 5, name: "Omar Khaled", month: "Janvier 2023", amount: 2800, status: "payé" },
  ]);

  const [selectedMonth, setSelectedMonth] = useState("Tous les mois");
  const [searchTerm, setSearchTerm] = useState("");

  const markAsPaid = (id) => {
    setPayments(payments.map(emp =>
      emp.id === id ? { ...emp, status: 'payé' } : emp
    ));
  };

  // Filtrer les données
  const filteredPayments = payments.filter(payment => {
    const matchesMonth = selectedMonth === "Tous les mois" || payment.month.includes(selectedMonth);
    const matchesSearch = payment.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMonth && matchesSearch;
  });

  const paidEmployees = filteredPayments.filter(p => p.status === 'payé');
  const totalPaid = paidEmployees.reduce((sum, p) => sum + p.amount, 0);
  const avgPerMonth = totalPaid / 12;
  const percentPaid = filteredPayments.length > 0 
    ? Math.round((paidEmployees.length / filteredPayments.length) * 100)
    : 0;

  // Options de mois pour le filtre
  const months = ["Tous les mois", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin"];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Historique de Paie</h1>
          <p className="text-gray-500 mt-1">Statut des paiements des employés</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un employé..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiUser className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <select
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard 
          icon={<FiDollarSign className="text-blue-500" size={24} />}
          title="Total versé"
          value={`€${totalPaid.toLocaleString('fr-FR', {minimumFractionDigits: 2})}`}
          change={`${paidEmployees.length} employés`}
          color="blue"
        />
        <StatCard 
          icon={<FiTrendingUp className="text-green-500" size={24} />}
          title="Moyenne mensuelle"
          value={`€${avgPerMonth.toLocaleString('fr-FR', {minimumFractionDigits: 2})}`}
          change="Par employé"
          color="green"
        />
        <StatCard 
          icon={<FiUsers className="text-purple-500" size={24} />}
          title="Employés payés"
          value={paidEmployees.length}
          change={`${percentPaid}% du total`}
          color="purple"
        />
        <StatCard 
          icon={<FiCheck className="text-emerald-500" size={24} />}
          title="Paiements complétés"
          value={`${percentPaid}%`}
          change="Taux de réussite"
          color="emerald"
        />
      </div>

      {/* Tableau avec colonne Payer */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employé</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mois</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Payer</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                          <FiUser className="text-blue-500" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {emp.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                      €{emp.amount.toLocaleString('fr-FR', {minimumFractionDigits: 2})}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        emp.status === 'payé' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {emp.status === 'payé' ? 'Payé' : 'En attente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {emp.status === 'non payé' && (
                        <button
                          onClick={() => markAsPaid(emp.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-lg shadow-sm transition-colors"
                        >
                          Payer
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Aucun résultat trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-500 text-center">
        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
      </div>
    </div>
  );
}

// Composant pour les cartes de statistiques
function StatCard({ icon, title, value, change, color }) {
  const colorClasses = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    emerald: 'bg-emerald-50'
  };

  return (
    <div className={`${colorClasses[color]} p-5 rounded-xl shadow-sm border border-gray-100`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1 text-gray-800">{value}</p>
          <p className="text-xs mt-1 text-gray-500">{change}</p>
        </div>
        <div className="p-3 rounded-lg bg-white shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}