import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

const RecentRequests = ({ darkMode, approved, pending, rejected }) => {
  const navigate = useNavigate();
  const requests = [
    { id: 1, employee: 'Jean Dupont', type: 'Congé annuel', status: 'approved', date: '2023-06-15', days: 5 },
    { id: 2, employee: 'Marie Lambert', type: 'Congé maladie', status: 'approved', date: '2023-06-16', days: 2 },
    { id: 3, employee: 'Pierre Martin', type: 'Télétravail', status: 'pending', date: '2023-06-17', days: 1 },
    { id: 4, employee: 'Sophie Bernard', type: 'Congé sans solde', status: 'rejected', date: '2023-06-18', days: 3 },
    { id: 5, employee: 'Lucie Petit', type: 'RTT', status: 'pending', date: '2023-06-19', days: 1 }
  ];

  const statusColors = {
    approved: darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800',
    pending: darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
    rejected: darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Demandes récentes
        </h2>
        <button
          onClick={() => navigate('/dashboard/leave/new-request')}
          className={`flex items-center px-4 py-2 rounded-lg ${
            darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          <FiPlus className="mr-2" />
          Nouvelle demande
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-2">
        <div className={`p-2 rounded text-center ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
          <div className="font-medium">{approved}</div>
          <div className="text-xs">Approuvés</div>
        </div>
        <div className={`p-2 rounded text-center ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
          <div className="font-medium">{pending}</div>
          <div className="text-xs">En attente</div>
        </div>
        <div className={`p-2 rounded text-center ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
          <div className="font-medium">{rejected}</div>
          <div className="text-xs">Rejetés</div>
        </div>
        <div className={`p-2 rounded text-center ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
          <div className="font-medium">{approved + pending + rejected}</div>
          <div className="text-xs">Total</div>
        </div>
      </div>

      <div className="space-y-3">
        {requests.map(request => (
          <div key={request.id} className={`p-3 rounded-lg border ${
            darkMode ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {request.employee}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  {request.type} · {request.days} jour(s)
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[request.status]}`}>
                  {request.status === 'approved' && 'Approuvé'}
                  {request.status === 'pending' && 'En attente'}
                  {request.status === 'rejected' && 'Rejeté'}
                </span>
                <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  {new Date(request.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentRequests;