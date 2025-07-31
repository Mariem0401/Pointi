import { useParams, Link } from 'react-router-dom';

const Teams = () => {
  const { id } = useParams();
  
  // Données simulées avec plus d'informations
  const teams = [
    { 
      id: 1, 
      name: 'Recrutement', 
      leader: 'Alice Martin', 
      memberCount: 4,
      progress: 85,
      avatarColor: 'bg-blue-500'
    },
    { 
      id: 2, 
      name: 'Formation', 
      leader: 'Bob Dupuis', 
      memberCount: 3,
      progress: 60,
      avatarColor: 'bg-green-500'
    },
    { 
      id: 3, 
      name: 'Paie', 
      leader: 'Claire Leroy', 
      memberCount: 5,
      progress: 45,
      avatarColor: 'bg-purple-500'
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Équipes</h1>
          <p className="text-gray-600 mt-1">Département #{id} - {teams.length} équipes enregistrées</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to={`/dashboard/departments/${id}`} 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Retour
          </Link>
          <Link 
            to={`/dashboard/departments/${id}/teams/new`} 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all shadow hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nouvelle Équipe
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${team.avatarColor} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}>
                    {team.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{team.name}</h3>
                    <p className="text-gray-500 text-sm">{team.memberCount} membre{team.memberCount > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                  {team.progress}% complété
                </span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Responsable</span>
                  <span className="text-gray-800 font-medium">{team.leader}</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div 
                    className={`h-2 rounded-full ${team.progress > 70 ? 'bg-green-500' : team.progress > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                    style={{ width: `${team.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-6 flex justify-between gap-3">
                <Link 
                  to={`/dashboard/departments/${id}/teams/${team.id}/members`}
                  className="flex-1 text-center text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                >
                  Membres
                </Link>
                <Link 
                  to={`/dashboard/departments/${id}/teams/${team.id}`}
                  className="flex-1 text-center text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-all"
                >
                  Détails
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Version alternative pour les grands tableaux */}
      {teams.length > 5 && (
        <div className="mt-8 bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Équipe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membres</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teams.map((team) => (
                  <tr key={team.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/dashboard/departments/${id}/teams/${team.id}`} className="flex items-center space-x-3 group">
                        <div className={`${team.avatarColor} flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white font-medium`}>
                          {team.name.charAt(0)}
                        </div>
                        <span className="text-gray-900 font-medium group-hover:text-indigo-600 transition-colors">
                          {team.name}
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {team.leader}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {team.memberCount} membre{team.memberCount > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 mr-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${team.progress > 70 ? 'bg-green-500' : team.progress > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                              style={{ width: `${team.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{team.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/dashboard/departments/${id}/teams/${team.id}`} 
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Voir
                      </Link>
                      <Link 
                        to={`/dashboard/departments/${id}/teams/${team.id}/edit`} 
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Modifier
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;