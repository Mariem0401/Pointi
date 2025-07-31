import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiUser, FiPhone, FiMail, FiHome, FiCalendar, FiFileText } from 'react-icons/fi';
import DonutChart from '../../components/charts/DonutChart';
import  ProgressBar from '../../components/charts/ProgressBar';

export default function EmployeeDetail() {
  const { id } = useParams();
  
  // Données simulées - à remplacer par un appel API
  const employee = {
    id,
    name: "Jean Dupont",
    position: "Développeur Senior",
    department: "IT",
    email: "jean.dupont@entreprise.com",
    phone: "+33 6 12 34 56 78",
    address: "12 Rue de la Paix, 75001 Paris",
    hireDate: "15/01/2020",
    contractType: "CDI",
    skills: [
      { name: "JavaScript", level: 90 },
      { name: "React", level: 85 },
      { name: "Node.js", level: 75 }
    ],
    leaveBalance: {
      total: 25,
      taken: 12,
      remaining: 13
    },
    performance: 87
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/dashboard/employees"
          className="flex items-center text-blue-800 hover:text-blue-900"
        >
          <FiArrowLeft className="mr-2" />
          Retour à la liste
        </Link>
      </div>

      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Fiche Employé</h1>
          <Link
            to={`/dashboard/employees/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 text-sm"
          >
            <FiEdit size={16} />
            Modifier
          </Link>
        </div>

        {/* Section principale */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne de gauche - Infos personnelles */}
          <div className="col-span-1">
            <div className="flex flex-col items-center mb-6">
              <div className="h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-4xl font-bold mb-4">
                {employee.name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-center">{employee.name}</h2>
              <p className="text-gray-500 text-center">{employee.position}</p>
              <p className="text-sm text-gray-400 mt-1">{employee.department}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <FiMail className="text-gray-500 mr-3" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center">
                <FiPhone className="text-gray-500 mr-3" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center">
                <FiHome className="text-gray-500 mr-3" />
                <span>{employee.address}</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="text-gray-500 mr-3" />
                <span>Embauché le {employee.hireDate} ({employee.contractType})</span>
              </div>
            </div>
          </div>

          {/* Colonne centrale - Compétences */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Compétences</h3>
            <div className="h-64 mb-6">
              <DonutChart 
                data={employee.skills.map(skill => ({
                  label: skill.name,
                  value: skill.level
                }))} 
                colors={['#4f46e5', '#6366f1', '#818cf8']}
              />
            </div>

            <h3 className="text-lg font-semibold mb-4">Performance</h3>
            <div className="flex items-center gap-4">
              <div className="w-full">
                <ProgressBar value={employee.performance} color="green" />
              </div>
              <span className="font-bold">{employee.performance}%</span>
            </div>
          </div>

          {/* Colonne droite - Congés et documents */}
          <div className="col-span-1">
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-3">Congés</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total acquis:</span>
                  <span className="font-medium">{employee.leaveBalance.total} jours</span>
                </div>
                <div className="flex justify-between">
                  <span>Congés pris:</span>
                  <span className="font-medium text-red-600">{employee.leaveBalance.taken} jours</span>
                </div>
                <div className="flex justify-between">
                  <span>Solde restant:</span>
                  <span className="font-medium text-green-600">{employee.leaveBalance.remaining} jours</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                to={`/dashboard/employees/${id}/contracts`}
                className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
              >
                <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                  <FiFileText size={20} />
                </div>
                <span className="font-medium">Contrats et documents</span>
              </Link>
              <Link
                to={`/dashboard/attendance/daily?employee=${id}`}
                className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
              >
                <div className="p-2 rounded-lg bg-purple-100 text-purple-800">
                  <FiCalendar size={20} />
                </div>
                <span className="font-medium">Historique de présence</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section historique */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Historique récent</h2>
        <div className="space-y-4">
          <div className="flex items-start p-3 border-b border-gray-100">
            <div className="p-2 rounded-lg bg-green-100 text-green-800 mr-3">
              <FiCalendar size={16} />
            </div>
            <div>
              <p className="font-medium">Congé approuvé</p>
              <p className="text-sm text-gray-500">15-20 juin 2023 (5 jours)</p>
            </div>
          </div>
          <div className="flex items-start p-3 border-b border-gray-100">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-800 mr-3">
              <FiFileText size={16} />
            </div>
            <div>
              <p className="font-medium">Contrat renouvelé</p>
              <p className="text-sm text-gray-500">CDI signé le 01/01/2023</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}