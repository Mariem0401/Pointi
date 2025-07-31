import { useParams, Link, useNavigate } from 'react-router-dom';

const TeamDetail = () => {
  const { id, teamId } = useParams();
  const navigate = useNavigate();

  // Données simulées
  const team = {
    id: teamId,
    name: 'Recrutement',
    leader: 'Alice Martin',
    description: 'Équipe chargée du recrutement des nouveaux employés',
    members: [
      { id: 1, name: 'Alice Martin', position: 'Responsable' },
      { id: 2, name: 'Paul Durand', position: 'Recruteur' },
      { id: 3, name: 'Sophie Lambert', position: 'Recruteuse' },
      { id: 4, name: 'Thomas Moreau', position: 'Chargé de sourcing' }
    ]
  };

  const handleAddMember = () => {
    navigate(`/dashboard/departments/${id}/teams/${teamId}/add-member`);
  };

  const handleEditTeam = () => {
    navigate(`/dashboard/departments/${id}/teams/${teamId}/edit`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <nav className="flex mb-2" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 text-sm">Tableau de bord</Link>
              </li>
              <li>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li>
                <Link to={`/dashboard/departments/${id}`} className="text-gray-600 hover:text-blue-600 text-sm">Département</Link>
              </li>
              <li>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li>
                <Link to={`/dashboard/departments/${id}/teams`} className="text-gray-600 hover:text-blue-600 text-sm">Équipes</Link>
              </li>
              <li>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-blue-600 font-medium text-sm" aria-current="page">
                {team.name}
              </li>
            </ol>
          </nav>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Équipe {team.name}</h1>
            <button 
              onClick={handleEditTeam}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Modifier l'équipe
            </button>
          </div>
        </div>
        <button 
          onClick={() => navigate(`/dashboard/departments/${id}/teams`)} 
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 shadow-sm transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour aux équipes
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations de l'équipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Responsable</p>
                <p className="text-base font-medium text-gray-800 mt-1">{team.leader}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre de membres</p>
                <p className="text-base font-medium text-gray-800 mt-1">{team.members.length}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-base text-gray-600 mt-1">{team.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Membres de l'équipe</h2>
          <button 
            onClick={handleAddMember}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Ajouter un membre
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {team.members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Actif
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      to={`/dashboard/employees/${member.id}`} 
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Voir profil
                    </Link>
                    <button 
                      onClick={() => navigate(`/dashboard/departments/${id}/teams/${teamId}/members/${member.id}/edit`)}
                      className="text-gray-600 hover:text-gray-900 mr-4"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => navigate(`/dashboard/departments/${id}/teams/${teamId}/members/${member.id}/remove`)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Retirer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Affichage de <span className="font-medium">1</span> à <span className="font-medium">{team.members.length}</span> sur <span className="font-medium">{team.members.length}</span> membres
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
              Précédent
            </button>
            <button className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;