import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCalendar, FiDownload, FiUsers, FiClock, FiCheckCircle, FiXCircle, FiEye, FiX } from 'react-icons/fi';
import ProgressCircle from '/src/components/common/ProgressCircle';

export default function MonthlyAttendance() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);

  // Charger la liste des employés à chaque changement de mois
  useEffect(() => {
  async function fetchEmployees() {
    setLoadingEmployees(true);
    setError(null);
    try {
      const response = await axios.get(`/api/attendance/monthly-summary?month=${month}`);

      // ✅ Force le format tableau
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      setEmployees(data);
      console.log("🎯 Données reçues :", data); // ← ici
    } catch (err) {
      setError('Erreur lors du chargement des employés.');
      setEmployees([]); // ⛑️ évite les erreurs de reduce
    } finally {
      setLoadingEmployees(false);
    }
  }

  fetchEmployees();
}, [month]);

  // Quand on ouvre le modal, charger les détails d'assiduité de l'employé
  const openModal = async (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
    setLoadingDetails(true);
    setAttendanceDetails([]);
    setError(null);
    try {
      const response = await axios.get(`/api/attendance-details?employeeId=${employee.id}&month=${month}`);
      setAttendanceDetails(response.data); // adapte selon la réponse de ton API
    } catch (err) {
      setError("Erreur lors du chargement des détails d'assiduité.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setAttendanceDetails([]);
  };

  // Calculs, si les données ont la même structure
  const safeEmployees = Array.isArray(employees) ? employees : [];

const totalPresent = safeEmployees.reduce((sum, emp) => sum + (emp.present || 0), 0);
const totalAbsent = safeEmployees.reduce((sum, emp) => sum + (emp.absent || 0), 0);
const totalLate = safeEmployees.reduce((sum, emp) => sum + (emp.late || 0), 0);
const totalOvertime = safeEmployees.reduce((sum, emp) => sum + (emp.overtime || 0), 0);
const averagePresence = totalPresent + totalAbsent === 0
  ? 0
  : Math.round((totalPresent / (totalPresent + totalAbsent)) * 100);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Synthèse Mensuelle</h1>
          <p className="text-gray-600">
            Analyse des présences pour {new Date(month).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex items-center bg-white p-2 rounded-lg shadow-sm border w-full md:w-64">
            <FiCalendar className="text-gray-500 mr-2" />
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border-none focus:outline-none text-gray-700 w-full"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <FiDownload size={18} />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Gestion erreurs / loading */}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loadingEmployees ? (
        <div>Chargement des employés...</div>
      ) : (
        <>
          {/* Key Metrics Cards */}
          {/* ... (identique à ton code actuel, avec employés de state) */}

          {/* Table des employés */}
          {/* ... (identique, remplace employees statiques par state employees) */}
        </>
      )}

      {/* Modal */}
      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold">
                Détails de présence - {selectedEmployee.name}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6">
              {loadingDetails ? (
                <div>Chargement des détails...</div>
              ) : error ? (
                <div className="text-red-600">{error}</div>
              ) : (
                <>
                  {/* Affiche les stats du selectedEmployee */}
                  {/* Affiche les details de présence depuis attendanceDetails */}
                </>
              )}
            </div>

            <div className="flex justify-end p-4 border-t sticky bottom-0 bg-white">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
