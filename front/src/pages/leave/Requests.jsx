import React, { useState } from 'react';
import { FiInbox, FiCheck, FiX, FiClock, FiPlus, FiMail, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeaveRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([
    {
      id: 1,
      employee: "Jean Dupont",
      employeeId: 101,
      type: "Congé payé",
      startDate: "2023-06-15",
      endDate: "2023-06-20",
      status: "pending",
      reason: "Vacances en famille à la montagne",
      rejectionReason: ""
    },
    {
      id: 2,
      employee: "Marie Martin",
      employeeId: 102,
      type: "Maladie",
      startDate: "2023-06-10",
      endDate: "2023-06-12",
      status: "approved",
      reason: "Certificat médical fourni",
      rejectionReason: ""
    },
    {
      id: 3,
      employee: "Pierre Lambert",
      employeeId: 103,
      type: "Formation",
      startDate: "2023-07-01",
      endDate: "2023-07-03",
      status: "rejected",
      reason: "Formation certifiante",
      rejectionReason: "Pas dans le budget formation"
    },
    {
      id: 4,
      employee: "Sophie Bernard",
      employeeId: 104,
      type: "Télétravail",
      startDate: "2023-06-25",
      endDate: "2023-06-25",
      status: "pending",
      reason: "Travaux à domicile",
      rejectionReason: ""
    }
  ]);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = (id) => {
    setRequests(requests.map(request =>
      request.id === id ? { ...request, status: "approved" } : request
    ));
  };

  const openRejectModal = (id) => {
    setCurrentRequestId(id);
    setIsRejectModalOpen(true);
    setRejectionReason('');
  };

  const handleReject = () => {
    setRequests(requests.map(request =>
      request.id === currentRequestId
        ? { ...request, status: "rejected", rejectionReason }
        : request
    ));
    setIsRejectModalOpen(false);
  };

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  };

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' ||
      (filter === 'pending' && request.status === 'pending') ||
      (filter === 'approved' && request.status === 'approved') ||
      (filter === 'rejected' && request.status === 'rejected');

    const matchesSearch = request.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestion des Congés</h1>
            <p className="text-gray-600 mt-2">Suivi et validation des demandes d'absence</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiUser className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="w-20 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 mt-4 rounded-full"></div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg transition-all ${filter === 'all' ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
            Toutes
          </button>
          <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'pending' ? 'bg-yellow-100 text-yellow-800 font-medium' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
            <FiClock size={16} /> En attente
          </button>
          <button onClick={() => setFilter('approved')} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'approved' ? 'bg-green-100 text-green-800 font-medium' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
            <FiCheck size={16} /> Approuvées
          </button>
          <button onClick={() => setFilter('rejected')} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'rejected' ? 'bg-red-100 text-red-800 font-medium' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
            <FiX size={16} /> Rejetées
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all hover:shadow-sm">
            <FiInbox size={16} /> <span>Exporter</span>
          </button>
          <button onClick={() => navigate('/dashboard/leave/new-request')} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg">
            <FiPlus size={16} /> <span>Nouvelle demande</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jours</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredRequests.map((request) => (
                <motion.tr key={request.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.employee}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100">{request.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.startDate).toLocaleDateString('fr-FR')} - {new Date(request.endDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                    {calculateDays(request.startDate, request.endDate)} jours
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status === 'approved' ? 'Approuvé' :
                         request.status === 'rejected' ? 'Rejeté' : 'En attente'}
                      </span>
                      {request.status === 'rejected' && request.rejectionReason && (
                        <div className="mt-1 text-xs text-red-600 line-clamp-1" title={request.rejectionReason}>
                          {request.rejectionReason}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {request.status === 'pending' && (
                        <>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleApprove(request.id)} className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50 transition-colors" title="Approuver">
                            <FiCheck size={18} />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openRejectModal(request.id)} className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors" title="Refuser">
                            <FiX size={18} />
                          </motion.button>
                        </>
                      )}
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate(`/dashboard/leave/${request.id}`)} className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors" title="Voir les détails">
                        <FiClock size={18} />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate(`/dashboard/messages/new?employeeId=${request.employeeId}`)} className="text-purple-600 hover:text-purple-900 p-2 rounded-full hover:bg-purple-50 transition-colors" title="Envoyer un message">
                        <FiMail size={18} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isRejectModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setIsRejectModalOpen(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', damping: 25 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">Refuser la demande</h3>
                    <p className="mt-1 opacity-90">
                      {requests.find(r => r.id === currentRequestId)?.employee}
                    </p>
                  </div>
                  <button onClick={() => setIsRejectModalOpen(false)} className="text-white hover:text-gray-200 transition-colors p-1">
                    <FiX size={24} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <p className="text-gray-600 mb-2">Type: <span className="font-medium">{requests.find(r => r.id === currentRequestId)?.type}</span></p>
                  <p className="text-gray-600">Période: <span className="font-medium">{new Date(requests.find(r => r.id === currentRequestId)?.startDate).toLocaleDateString('fr-FR')} - {new Date(requests.find(r => r.id === currentRequestId)?.endDate).toLocaleDateString('fr-FR')}</span></p>
                </div>
                <label className="block text-gray-700 mb-2 font-medium">Motif du refus</label>
                <textarea className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all" rows="4" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Ex: Période de forte activité, manque de personnel..." />
                <div className="mt-8 flex justify-end space-x-4">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => setIsRejectModalOpen(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium">
                    Annuler
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={handleReject} disabled={!rejectionReason} className={`px-6 py-2.5 rounded-lg text-white transition-all font-medium ${!rejectionReason ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg'}`}>
                    Confirmer le refus
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
