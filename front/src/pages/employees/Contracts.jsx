import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiPlus, 
  FiDownload, 
  FiTrash2, 
  FiFileText,
  FiEdit2,
  FiSearch,
  FiUser,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import EmptyState from '../../components/common/EmptyState';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const AllContracts = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Jean Dupont",
      position: "Développeur Senior",
      department: "IT",
      contracts: [
        { 
          id: 1, 
          type: "CDI", 
          startDate: "2020-01-15", 
          endDate: null, 
          file: "contrat_cdi.pdf",
          status: "active",
          salary: "45000€"
        },
        { 
          id: 2, 
          type: "Alternance", 
          startDate: "2023-09-01", 
          endDate: "2024-08-31", 
          file: "contrat_alternance.pdf",
          status: "active",
          salary: "18000€"
        }
      ]
    },
    {
      id: 2,
      name: "Marie Lambert",
      position: "Designer UX",
      department: "Marketing",
      contracts: [
        { 
          id: 3, 
          type: "CDD", 
          startDate: "2023-01-10", 
          endDate: "2023-12-31", 
          file: "contrat_cdd.pdf",
          status: "expired",
          salary: "38000€"
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all', contractType: 'all' });
  const [expandedEmployees, setExpandedEmployees] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);

  const filterContracts = (employee) => {
    return employee.contracts.filter(contract => {
      const matchesSearch = 
        contract.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filters.status === 'all' || contract.status === filters.status;
      const matchesType = filters.contractType === 'all' || contract.type === filters.contractType;
      return matchesSearch && matchesStatus && matchesType;
    });
  };

  const filteredEmployees = employees
    .map(employee => ({ ...employee, contracts: filterContracts(employee) }))
    .filter(employee => employee.contracts.length > 0);

  const toggleEmployee = (employeeId) => {
    setExpandedEmployees(prev => 
      prev.includes(employeeId) ? prev.filter(id => id !== employeeId) : [...prev, employeeId]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Indéterminé";
    return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleDeleteClick = (contract) => {
    setContractToDelete(contract);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setEmployees(prevEmployees =>
      prevEmployees.map(employee => ({
        ...employee,
        contracts: employee.contracts.filter(c => c.id !== contractToDelete.id)
      }))
    );
    setShowDeleteModal(false);
  };

  const getStatusBadge = (status) => {
    let badgeClass = '';
    let icon = null;
    let text = '';
    switch(status) {
      case 'active':
        badgeClass = 'bg-green-100 text-green-800';
        icon = <FiCheckCircle className="mr-1" />;
        text = 'Actif';
        break;
      case 'expired':
        badgeClass = 'bg-red-100 text-red-800';
        icon = <FiAlertCircle className="mr-1" />;
        text = 'Expiré';
        break;
      default:
        badgeClass = 'bg-gray-100 text-gray-800';
        text = status;
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
        {icon}
        {text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Contrats</h1>
          <p className="text-gray-600">Liste complète des contrats</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/employees/new-contracts')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
        >
          <FiPlus size={18} />
          <span>Ajouter un contrat</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un contrat ou employé..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">Tous statuts</option>
            <option value="active">Actif</option>
            <option value="expired">Expiré</option>
          </select>
          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.contractType}
            onChange={(e) => setFilters({ ...filters, contractType: e.target.value })}
          >
            <option value="all">Tous types</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Stage">Stage</option>
            <option value="Alternance">Alternance</option>
          </select>
        </div>
      </div>

      {/* Liste des contrats */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredEmployees.length === 0 ? (
          <EmptyState 
            title="Aucun contrat trouvé"
            description={searchTerm ? "Aucun résultat pour votre recherche." : "Aucun contrat n'a été enregistré."}
            action={
              <button 
                onClick={() => navigate('/dashboard/employees/new-contracts')}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
              >
                <FiPlus className="mr-2" />
                Créer un contrat
              </button>
            }
          />
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredEmployees.map(employee => (
              <div key={employee.id} className="p-6">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleEmployee(employee.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800">
                      <FiUser />
                    </div>
                    <div>
                      <h3 className="font-medium">{employee.name}</h3>
                      <p className="text-sm text-gray-500">{employee.position} • {employee.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      {employee.contracts.length} contrat{employee.contracts.length > 1 ? 's' : ''}
                    </span>
                    {expandedEmployees.includes(employee.id) 
                      ? <FiChevronUp className="text-gray-400" /> 
                      : <FiChevronDown className="text-gray-400" />}
                  </div>
                </div>

                {expandedEmployees.includes(employee.id) && (
                  <div className="mt-4 pl-14">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salaire</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {employee.contracts.map(contract => (
                            <tr key={contract.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">{contract.type}</td>
                              <td className="px-6 py-4 text-gray-500">
                                <div>Début: {formatDate(contract.startDate)}</div>
                                <div>Fin: {formatDate(contract.endDate)}</div>
                              </td>
                              <td className="px-6 py-4">{contract.salary}</td>
                              <td className="px-6 py-4">{getStatusBadge(contract.status)}</td>
                              <td className="px-6 py-4">
                                <a 
                                  href={`/documents/${contract.file}`} 
                                  className="flex items-center text-blue-600 hover:text-blue-900"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FiFileText className="mr-2" />
                                  {contract.file}
                                </a>
                              </td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <button className="text-blue-600 hover:text-blue-900"><FiDownload size={18} /></button>
                                <button className="text-blue-600 hover:text-blue-900"><FiEdit2 size={18} /></button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(contract);
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <FiTrash2 size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de suppression */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirmer la suppression"
        message={`Supprimer le contrat ${contractToDelete?.type} de ${contractToDelete ? employees.find(e => e.contracts.some(c => c.id === contractToDelete.id))?.name : ''} ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
};

export default AllContracts;
