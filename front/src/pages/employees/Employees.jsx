import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiSearch, 
  FiUserPlus, 
  FiEdit2, 
  FiTrash2, 
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiPrinter
} from 'react-icons/fi';
import StatCard from '../../components/common/StatCard';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import EmptyState from '../../components/common/EmptyState';

export default function Employees() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  
  // Simuler un chargement asynchrone
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simuler une API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockEmployees = [
        { id: 1, name: "Jean Dupont", position: "Développeur Frontend", department: "IT", contract: "CDI", hireDate: "2021-05-15", email: "jean.dupont@example.com" },
        { id: 2, name: "Marie Martin", position: "Responsable RH", department: "RH", contract: "CDI", hireDate: "2020-02-10", email: "marie.martin@example.com" },
        { id: 3, name: "Pierre Lambert", position: "Commercial", department: "Ventes", contract: "CDD", hireDate: "2023-01-05", email: "pierre.lambert@example.com" },
        { id: 4, name: "Sophie Bernard", position: "Développeuse Backend", department: "IT", contract: "CDI", hireDate: "2022-03-20", email: "sophie.bernard@example.com" },
        { id: 5, name: "Thomas Leroy", position: "Chef de Projet", department: "IT", contract: "CDI", hireDate: "2020-11-15", email: "thomas.leroy@example.com" },
        { id: 6, name: "Laura Petit", position: "Assistante Marketing", department: "Marketing", contract: "CDD", hireDate: "2023-02-28", email: "laura.petit@example.com" },
      ];
      
      setEmployees(mockEmployees);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  const itemsPerPage = 5;
  
  const filteredEmployees = employees.filter(employee => {
    return employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
           employee.department.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Tri des employés
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const handleExport = () => {
    // Créer un CSV des données
    const headers = ["Nom", "Email", "Poste", "Département", "Contrat", "Date d'embauche"];
    const csvContent = [
      headers.join(","),
      ...sortedEmployees.map(employee => 
        [
          `"${employee.name}"`,
          `"${employee.email}"`,
          `"${employee.position}"`,
          `"${employee.department}"`,
          `"${employee.contract}"`,
          `"${employee.hireDate}"`
        ].join(",")
      )
    ].join("\n");

    // Créer un blob et le télécharger
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `employes_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    // Créer une nouvelle fenêtre avec le contenu à imprimer
    const printWindow = window.open("", "_blank");
    
    // Style pour l'impression
    const styles = `
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .print-header { margin-bottom: 20px; }
        .print-title { font-size: 24px; font-weight: bold; }
        .print-date { color: #666; margin-bottom: 10px; }
      </style>
    `;
    
    // Contenu HTML pour l'impression
    const content = `
      <div class="print-header">
        <div class="print-title">Liste des employés</div>
        <div class="print-date">${new Date().toLocaleDateString()}</div>
        <div>Total: ${sortedEmployees.length} employés</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Poste</th>
            <th>Département</th>
            <th>Contrat</th>
            <th>Date d'embauche</th>
          </tr>
        </thead>
        <tbody>
          ${sortedEmployees.map(employee => `
            <tr>
              <td>${employee.name}</td>
              <td>${employee.email}</td>
              <td>${employee.position}</td>
              <td>${employee.department}</td>
              <td>${employee.contract}</td>
              <td>${new Date(employee.hireDate).toLocaleDateString()}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Liste des employés</title>
          ${styles}
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const stats = [
    { 
      label: "Total employés", 
      value: employees.length, 
      icon: "fas fa-users",
      trend: { value: 10 }, // +10%
      description: "+2 ce mois"
    },
    { 
      label: "CDD", 
      value: employees.filter(e => e.contract === 'CDD').length,
      icon: "fas fa-file-contract",
      trend: { value: 0 }, // stable
      description: "Contrats à durée déterminée"
    },
    { 
      label: "Nouveaux cette année", 
      value: employees.filter(e => new Date(e.hireDate) > new Date('2023-01-01')).length,
      icon: "fas fa-user-plus",
      trend: { value: 15 }, // +15%
      description: "Nouveaux embauchés"
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Employés</h1>
        <p className="text-gray-600">Liste complète de vos collaborateurs</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse h-32 bg-gray-200 rounded"></div>
          ))
        ) : (
          stats.map((stat, index) => (
            <StatCard 
              key={index}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              description={stat.description}
              darkMode={false}
            />
          ))
        )}
      </div>

      {/* Barre de contrôle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un employé..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
          >
            <FiDownload size={18} />
            <span>Exporter</span>
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
          >
            <FiPrinter size={18} />
            <span>Imprimer</span>
          </button>
          <Link
            to="/dashboard/employees/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 justify-center"
          >
            <FiUserPlus size={18} />
            <span>Nouvel employé</span>
          </Link>
        </div>
      </div>

      {/* Tableau des employés */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-pulse flex flex-col space-y-4 w-full">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('name')}
                    >
                      <div className="flex items-center">
                        Nom
                        {sortConfig.key === 'name' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('position')}
                    >
                      <div className="flex items-center">
                        Poste
                        {sortConfig.key === 'position' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('department')}
                    >
                      <div className="flex items-center">
                        Département
                        {sortConfig.key === 'department' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrat</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedEmployees.length > 0 ? (
                    paginatedEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link 
                            to={`/dashboard/employees/${employee.id}`}
                            className="flex items-center hover:text-blue-800"
                          >
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                              {employee.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">{employee.name}</div>
                              <div className="text-xs text-gray-500">{employee.email}</div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.position}</div>
                          <div className="text-xs text-gray-500">Embauché le {new Date(employee.hireDate).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.contract}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/dashboard/employees/${employee.id}/edit`}
                            className="text-blue-600 hover:text-blue-900 mr-3 inline-block"
                            title="Modifier"
                          >
                            <FiEdit2 size={18} />
                          </Link>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteClick(employee)}
                            title="Supprimer"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <EmptyState 
                          title="Aucun employé trouvé"
                          description="Essayez de modifier vos critères de recherche ou ajoutez un nouvel employé."
                          icon="users"
                          action={
                            <Link
                              to="/dashboard/employees/new"
                              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
                            >
                              <FiUserPlus className="mr-2" />
                              Ajouter un employé
                            </Link>
                          }
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {paginatedEmployees.length > 0 && (
              <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Suivant
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, sortedEmployees.length)}
                      </span> sur <span className="font-medium">{sortedEmployees.length}</span> employés
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Première page</span>
                        <FiChevronLeft className="h-5 w-5" />
                        <FiChevronLeft className="h-5 w-5 -ml-2" />
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Précédent</span>
                        <FiChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNum
                                ? 'bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Suivant</span>
                        <FiChevronRight className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Dernière page</span>
                        <FiChevronRight className="h-5 w-5" />
                        <FiChevronRight className="h-5 w-5 -ml-2" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer l'employé ${employeeToDelete?.name} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        danger={true}
      />
    </div>
  );
}