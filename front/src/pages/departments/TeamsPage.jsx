import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simuler un chargement asynchrone
    const timer = setTimeout(() => {
      try {
        // Données mock pour le test
        const mockTeams = [
          {
            id: 1,
            name: "Équipe Marketing",
            description: "Équipe en charge des campagnes publicitaires",
            members_count: 5,
            department_id: 1,
            department_name: "Marketing"
          },
          {
            id: 2,
            name: "Équipe Développement",
            description: "Équipe en charge du développement produit",
            members_count: 8,
            department_id: 2,
            department_name: "Technologie"
          },
          {
            id: 3,
            name: "Équipe RH",
            description: "Équipe des ressources humaines",
            members_count: 3,
            department_id: 3,
            department_name: "Ressources Humaines"
          }
        ];
        
        setTeams(mockTeams);
        setLoading(false);
      } catch (err) {
        setError("Erreur de chargement des données mock");
        setLoading(false);
      }
    }, 1000); // Délai simulé de 1 seconde

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-100 text-red-700">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Toutes les équipes</h1>
        <Link
          to="/dashboard/departments/teams/new"
          className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
        >
          <i className="fas fa-plus"></i>
          <span>Nouvelle équipe</span>
        </Link>
      </div>

      {teams.length === 0 ? (
        <div className="p-8 text-center rounded-lg bg-gray-100 text-gray-600">
          <i className="fas fa-users-slash text-4xl mb-4 text-indigo-500"></i>
          <p className="text-xl">Aucune équipe trouvée</p>
          <p className="mt-2">Commencez par créer une nouvelle équipe</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <motion.div
              key={team.id}
              whileHover={{ y: -5 }}
              className="rounded-lg overflow-hidden shadow-md bg-white border border-gray-200"
            >
              <div className="p-4 bg-indigo-50">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{team.name}</h3>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                    {team.members_count} membre{team.members_count !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-sm mt-1 text-gray-600">
                  {team.description || 'Aucune description'}
                </p>
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Département:</p>
                    <Link
                      to={`/dashboard/departments/${team.department_id}`}
                      className="font-medium hover:underline text-indigo-600"
                    >
                      {team.department_name}
                    </Link>
                  </div>

                  <Link
                    to={`/dashboard/departments/${team.department_id}/teams/${team.id}`}
                    className="px-3 py-1 rounded text-sm bg-gray-100 hover:bg-gray-200 text-gray-800"
                  >
                    Voir détails
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamsPage;