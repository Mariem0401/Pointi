import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LeaveManagement = ({ darkMode }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  useEffect(() => {
    const mockData = [
      { 
        id: 1, 
        employee: 'Jean Dupont', 
        type: 'Congé annuel', 
        startDate: '2023-06-15', 
        endDate: '2023-06-20', 
        status: 'pending', 
        days: 5,
        reason: 'Vacances en famille',
        avatar: 'JD'
      },
      { 
        id: 2, 
        employee: 'Marie Martin', 
        type: 'Congé maladie', 
        startDate: '2023-06-10', 
        endDate: '2023-06-12', 
        status: 'approved', 
        days: 2,
        reason: 'Grippe saisonnière',
        avatar: 'MM'
      },
      { 
        id: 3, 
        employee: 'Pierre Lambert', 
        type: 'Congé sans solde', 
        startDate: '2023-07-01', 
        endDate: '2023-07-05', 
        status: 'pending', 
        days: 4,
        reason: 'Déménagement',
        avatar: 'PL'
      },
      { 
        id: 4, 
        employee: 'Sophie Leroy', 
        type: 'Congé maternité', 
        startDate: '2023-08-01', 
        endDate: '2023-10-30', 
        status: 'approved', 
        days: 90,
        reason: 'Congé maternité',
        avatar: 'SL'
      },
      { 
        id: 5, 
        employee: 'Thomas Moreau', 
        type: 'Télétravail', 
        startDate: '2023-06-05', 
        endDate: '2023-06-05', 
        status: 'rejected', 
        days: 1,
        reason: 'Travail à domicile',
        avatar: 'TM'
      },
    ];
    setRequests(mockData);
  }, []);

  const filteredRequests = activeFilter === 'all' 
    ? requests 
    : requests.filter(req => req.status === activeFilter);

  const handleStatusChange = (id, newStatus) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
  };

  const statusColors = {
    pending: { bg: 'bg-yellow-500', text: 'text-yellow-500' },
    approved: { bg: 'bg-green-500', text: 'text-green-500' },
    rejected: { bg: 'bg-red-500', text: 'text-red-500' }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Gestion des congés
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}
          >
            Approuvez ou rejetez les demandes de congés
          </motion.p>
        </div>
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center px-4 py-2 rounded-md ${
            darkMode 
              ? 'bg-indigo-600 hover:bg-indigo-700' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white`}
        >
          <i className="fas fa-plus mr-2" /> Nouvelle demande
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex space-x-2 overflow-x-auto pb-2"
      >
        {['all', 'pending', 'approved', 'rejected'].map((filter) => (
          <motion.button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            whileHover={{ y: -2 }}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeFilter === filter
                ? filter === 'pending' 
                  ? darkMode 
                    ? 'bg-yellow-900 text-yellow-300' 
                    : 'bg-yellow-100 text-yellow-800'
                  : filter === 'approved' 
                    ? darkMode 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-green-100 text-green-800'
                    : filter === 'rejected' 
                      ? darkMode 
                        ? 'bg-red-900 text-red-300' 
                        : 'bg-red-100 text-red-800'
                      : darkMode 
                        ? 'bg-indigo-900 text-indigo-300' 
                        : 'bg-indigo-100 text-indigo-800'
                : darkMode 
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter === 'all' && 'Tous'}
            {filter === 'pending' && 'En attente'}
            {filter === 'approved' && 'Approuvés'}
            {filter === 'rejected' && 'Rejetés'}
            <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
              darkMode ? 'bg-black bg-opacity-20' : 'bg-white'
            }`}>
              {filter === 'all' ? requests.length : 
               requests.filter(req => req.status === filter).length}
            </span>
          </motion.button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`lg:col-span-2 rounded-xl border ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
          } overflow-hidden`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className={`${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    <span className={darkMode ? 'text-slate-400' : 'text-gray-500'}>Employé</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    <span className={darkMode ? 'text-slate-400' : 'text-gray-500'}>Type</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    <span className={darkMode ? 'text-slate-400' : 'text-gray-500'}>Dates</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    <span className={darkMode ? 'text-slate-400' : 'text-gray-500'}>Statut</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    <span className={darkMode ? 'text-slate-400' : 'text-gray-500'}>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-gray-200 dark:divide-slate-700 ${
                darkMode ? 'bg-slate-800' : 'bg-white'
              }`}>
                {filteredRequests.map((request) => (
                  <motion.tr 
                    key={request.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`hover:${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          darkMode ? 'bg-slate-600' : 'bg-indigo-100'
                        }`}>
                          <span className={`font-medium ${
                            darkMode ? 'text-indigo-300' : 'text-indigo-600'
                          }`}>
                            {request.avatar}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm font-medium ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {request.employee}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${
                        darkMode ? 'text-slate-300' : 'text-gray-500'
                      }`}>
                        {request.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${
                        darkMode ? 'text-slate-300' : 'text-gray-500'
                      }`}>
                        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'approved' 
                          ? darkMode 
                            ? 'bg-green-900 text-green-300' 
                            : 'bg-green-100 text-green-800'
                          : request.status === 'rejected' 
                            ? darkMode 
                              ? 'bg-red-900 text-red-300' 
                              : 'bg-red-100 text-red-800'
                            : darkMode 
                              ? 'bg-yellow-900 text-yellow-300' 
                              : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status === 'approved' ? 'Approuvé' : 
                         request.status === 'rejected' ? 'Rejeté' : 'En attente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {request.status === 'pending' && (
                        <>
                          <motion.button 
                            onClick={() => handleStatusChange(request.id, 'approved')}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`${
                              darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'
                            }`}
                          >
                            <i className="fas fa-check" />
                          </motion.button>
                          <motion.button 
                            onClick={() => handleStatusChange(request.id, 'rejected')}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`${
                              darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
                            }`}
                          >
                            <i className="fas fa-times" />
                          </motion.button>
                        </>
                      )}
                      <motion.button 
                        onClick={() => setSelectedRequest(request)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`${
                          darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
                        }`}
                      >
                        <i className="fas fa-eye" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <AnimatePresence>
          {selectedRequest ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`rounded-xl border ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
              } p-6 h-fit sticky top-6`}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Détails de la demande
                </h3>
                <button 
                  onClick={() => setSelectedRequest(null)}
                  className={`p-1 rounded-full ${
                    darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <i className={`fas fa-times ${darkMode ? 'text-slate-400' : 'text-gray-500'}`} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`flex-shrink-0 h-14 w-14 rounded-full flex items-center justify-center ${
                    darkMode ? 'bg-slate-600' : 'bg-indigo-100'
                  }`}>
                    <span className={`text-xl font-medium ${
                      darkMode ? 'text-indigo-300' : 'text-indigo-600'
                    }`}>
                      {selectedRequest.avatar}
                    </span>
                  </div>
                  <div>
                    <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedRequest.employee}
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      {selectedRequest.type}
                    </p>
                  </div>
                </div>

                <div className={`space-y-4 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  <div className="flex justify-between">
                    <span>Date de début:</span>
                    <span className="font-medium">
                      {new Date(selectedRequest.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date de fin:</span>
                    <span className="font-medium">
                      {new Date(selectedRequest.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Durée:</span>
                    <span className="font-medium">
                      {selectedRequest.days} jour(s)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statut:</span>
                    <span className={`font-medium ${
                      statusColors[selectedRequest.status].text
                    }`}>
                      {selectedRequest.status === 'approved' ? 'Approuvé' : 
                       selectedRequest.status === 'rejected' ? 'Rejeté' : 'En attente'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className={`font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Raison:
                  </h5>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    {selectedRequest.reason}
                  </p>
                </div>

                {selectedRequest.status === 'pending' && (
                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleStatusChange(selectedRequest.id, 'approved')}
                      className="flex-1 bg-green-600 text-white py-2 rounded-md flex items-center justify-center space-x-2"
                    >
                      <i className="fas fa-check" />
                      <span>Approuver</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleStatusChange(selectedRequest.id, 'rejected')}
                      className="flex-1 bg-red-600 text-white py-2 rounded-md flex items-center justify-center space-x-2"
                    >
                      <i className="fas fa-times" />
                      <span>Rejeter</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`rounded-xl border ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
              } p-6 h-fit sticky top-6 flex flex-col items-center justify-center text-center`}
            >
              <div className={`p-4 rounded-full ${
                darkMode ? 'bg-slate-700' : 'bg-gray-100'
              } mb-4`}>
                <i className={`fas fa-info-circle text-3xl ${
                  darkMode ? 'text-indigo-400' : 'text-indigo-600'
                }`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Aucune demande sélectionnée
              </h3>
              <p className={`text-sm ${
                darkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Cliquez sur une demande dans la liste pour voir les détails
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LeaveManagement;