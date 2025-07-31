import { useParams, Link } from 'react-router-dom';

// Données simulées pour tous les départements
const allDepartments = [
  { 
    id: 1, 
    name: 'Ressources Humaines', 
    manager: 'Jean Dupont', 
    description: 'Département chargé de la gestion du personnel, du recrutement, de la formation et du bien-être des employés.',
    employeeCount: 12,
    teams: ['Recrutement', 'Formation', 'Paie'],
    budget: '1.2M €',
    location: 'Siège social, étage 3'
  },
  { 
    id: 2, 
    name: 'Informatique', 
    manager: 'Marie Martin', 
    description: 'Département en charge du développement, de la maintenance et de la sécurité des systèmes informatiques.',
    employeeCount: 25,
    teams: ['Développement', 'Infrastructure', 'Sécurité'],
    budget: '2.5M €',
    location: 'Siège social, étage 2'
  },
  { 
    id: 3, 
    name: 'Marketing', 
    manager: 'Pierre Durand', 
    description: 'Département responsable de la stratégie marketing, de la communication et des relations publiques.',
    employeeCount: 8,
    teams: ['Digital', 'Événementiel', 'Communication'],
    budget: '800K €',
    location: 'Siège social, étage 1'
  }
];

const DepartmentDetail = () => {
  const { id } = useParams();
  
  // Trouver le département correspondant à l'ID dans l'URL
  const department = allDepartments.find(dept => dept.id === parseInt(id));

  // Si le département n'existe pas, afficher un message
  if (!department) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Département non trouvé</h1>
          <p className="text-gray-600 mb-6">Le département que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link 
            to="/dashboard/departments" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center"
          >
            Retour à la liste des départements
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link 
              to="/dashboard/departments" 
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">{department.name}</h1>
          </div>
          <p className="text-gray-500">Détails et informations du département</p>
        </div>
        
        <div className="flex gap-3">
          <Link 
            to={`/dashboard/departments/${id}/edit`} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Modifier
          </Link>
        </div>
      </div>

      {/* Main information cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Department info card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Informations</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Responsable</p>
              <div className="flex items-center mt-1">
                <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-sm font-medium">
                    {department.manager.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <p className="font-medium text-gray-900">{department.manager}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Employés</p>
              <p className="font-medium text-gray-900">{department.employeeCount} membres</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Localisation</p>
              <p className="font-medium text-gray-900">{department.location}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Budget annuel</p>
              <p className="font-medium text-gray-900">{department.budget}</p>
            </div>
          </div>
        </div>

        {/* Description card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Description</h2>
          </div>
          
          <p className="text-gray-700 leading-relaxed">{department.description}</p>
        </div>
      </div>

      {/* Teams section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Équipes</h2>
            </div>
            
            <Link 
              to={`/dashboard/departments/${id}/teams/new`} 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Nouvelle équipe
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {department.teams.map((team, index) => (
              <Link 
                key={index} 
                to={`/dashboard/departments/${id}/teams/${index+1}`} 
                className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600">{team}</h3>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>5 membres</span>
                  <span className="text-blue-600 font-medium">Voir détails →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;