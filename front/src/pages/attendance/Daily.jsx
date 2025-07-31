import React, { useState, useRef, useEffect } from 'react';
import {
  FiClock,
  FiX,
  FiSearch,
  FiCalendar,
  FiDownload,
  FiPrinter
} from 'react-icons/fi';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import axios from 'axios';

export default function DailyAttendance() {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const printRef = useRef();

  // Configuration axios pour inclure les credentials
  axios.defaults.withCredentials = true;

  // Fetch attendance data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:7777/attendance/daily`, {
          params: { date },
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          setEmployees(response.data.data);
        } else {
          throw new Error(response.data.error || 'Échec du chargement des données');
        }
      } catch (err) {
        console.error('Erreur fetch:', err);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  // Fetch employee history
  const fetchEmployeeHistory = async (employeeId) => {
    try {
      const response = await axios.get(`http://localhost:7777/api/attendance/user/${employeeId}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Échec du chargement de l\'historique');
    } catch (err) {
      console.error('Erreur fetch historique:', err);
      throw err;
    }
  };

  const openHistory = async (employee) => {
    try {
      const history = await fetchEmployeeHistory(employee.userId);
      setSelectedEmployee({
        ...employee,
        history
      });
    } catch (err) {
      setError('Impossible de charger l\'historique');
    }
  };

  const closeHistory = () => {
    setSelectedEmployee(null);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToPDF = () => {
    const doc = new jsPDF();
    const title = `Rapport de présence - ${moment(date).format('DD/MM/YYYY')}`;
    
    doc.setFontSize(18);
    doc.text(title, 14, 15);
    
    autoTable(doc, {
      startY: 25,
      head: [['Nom', 'Département', 'Statut', 'Arrivée', 'Départ', 'Heures']],
      body: filteredEmployees.map(emp => {
        const checkInTime = moment(emp.checkIn, 'HH:mm');
        const lateMinutes = emp.checkIn && checkInTime.isValid() ?
          Math.max(0, (checkInTime.hours() * 60 + checkInTime.minutes() - 480)) : 0;
        
        return [
          emp.name,
          emp.department,
          emp.status === 'present' ? 'Présent' :
            emp.status === 'absent' ? 'Absent' : `Retard (${lateMinutes}min)`,
          emp.checkIn || '-',
          emp.checkOut || '-',
          emp.hoursWorked || '0h00'
        ];
      }),
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255
      }
    });
    
    doc.save(`presence_${date}.pdf`);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page {
        size: auto;
        margin: 10mm;
      }
      @media print {
        body {
          font-size: 12pt;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          background-color: #f3f4f6 !important;
          color: #374151 !important;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
    removeAfterPrint: true
  });

  const exportHistoryToPDF = (employee) => {
    const doc = new jsPDF();
    doc.text(`Historique de ${employee.name}`, 14, 15);
    
    autoTable(doc, {
      startY: 25,
      head: [['Date', 'Arrivée', 'Départ', 'Heures', 'Statut']],
      body: employee.history.map(item => {
        const checkInTime = moment(item.checkIn, 'HH:mm');
        const status = item.checkIn && checkInTime.isValid() ?
          (() => {
            const totalMin = checkInTime.hours() * 60 + checkInTime.minutes();
            return totalMin > 480 ? `Retard (${totalMin - 480}min)` : 'Présent';
          })()
          : 'Absent';
        
        return [
          moment(item.date).format('DD/MM/YYYY'),
          item.checkIn || '-',
          item.checkOut || '-',
          item.hoursWorked || '0h00',
          status
        ];
      }),
      theme: 'grid'
    });
    
    doc.save(`historique_${employee.name.replace(/ /g, '_')}.pdf`);
  };

  if (loading) return <div className="p-6">Chargement en cours...</div>;
  if (error) return <div className="p-6 text-red-500">Erreur: {error}</div>;

  return (
    <div className="p-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold mb-2">Pointage Journalier Automatique</h1>
          <p className="text-gray-600">
            Suivi des présences par badgeage - {moment(date).format('DD/MM/YYYY')}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiDownload size={18} />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <FiPrinter size={18} />
            <span className="hidden sm:inline">Imprimer</span>
          </button>
        </div>
      </div>

      {/* Date & Search Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 no-print">
        <div className="flex items-center bg-white p-2 rounded-lg border">
          <FiClock className="text-gray-500 mr-2" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border-none focus:outline-none"
          />
        </div>
        <div className="flex items-center bg-white p-2 rounded-lg border flex-1 max-w-md">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div ref={printRef}>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <h2 className="text-xl font-semibold p-4 no-print">Pointage du {moment(date).format('DD/MM/YYYY')}</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employé</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Département</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Arrivée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Départ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Heures</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase no-print">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee, index) => {
                const checkInTime = moment(employee.checkIn, 'HH:mm');
                const lateMinutes = employee.checkIn && checkInTime.isValid() ?
                  Math.max(0, (checkInTime.hours() * 60 + checkInTime.minutes() - 480)) : 0;
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{employee.name}</td>
                    <td className="px-6 py-4">{employee.department}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full
                        ${employee.status === 'present' ? 'bg-green-100 text-green-800' :
                          employee.status === 'absent' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                        {employee.status === 'present' ? 'Présent' :
                         employee.status === 'absent' ? 'Absent' : 
                         `Retard (${lateMinutes}min)`}
                      </span>
                    </td>
                    <td className="px-6 py-4">{employee.checkIn || '-'}</td>
                    <td className="px-6 py-4">{employee.checkOut || '-'}</td>
                    <td className="px-6 py-4">{employee.hoursWorked || '0h00'}</td>
                    <td className="px-6 py-4 no-print">
                      <button
                        onClick={() => openHistory(employee)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <FiCalendar size={14} />
                        Historique
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 no-print">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
                <h3 className="text-lg font-semibold">
                  Historique - {selectedEmployee.name}
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => exportHistoryToPDF(selectedEmployee)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    <FiDownload size={14} />
                    PDF
                  </button>
                  <button onClick={closeHistory} className="text-gray-500 hover:text-gray-700">
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium">Informations</h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Département</p>
                    <p>{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut actuel</p>
                    <p className={`px-2 py-1 inline-flex text-xs rounded-full
                      ${selectedEmployee.status === 'present' ? 'bg-green-100 text-green-800' :
                        selectedEmployee.status === 'absent' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                      {selectedEmployee.status === 'present' ? 'Présent' :
                       selectedEmployee.status === 'absent' ? 'Absent' : 'En retard'}
                    </p>
                  </div>
                </div>
              </div>

              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Arrivée</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Départ</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Heures</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedEmployee.history?.map((item, idx) => {
                    const checkInTime = moment(item.checkIn, 'HH:mm');
                    const status = item.checkIn && checkInTime.isValid() ?
                      (() => {
                        const totalMin = checkInTime.hours() * 60 + checkInTime.minutes();
                        return totalMin > 480 ? `Retard (${totalMin - 480}min)` : 'Présent';
                      })()
                      : 'Absent';

                    const statusColor =
                      status.includes('Présent') ? 'bg-green-100 text-green-800' :
                      status.includes('Absent') ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800';

                    return (
                      <tr key={idx}>
                        <td className="px-4 py-3">{moment(item.date).format('DD/MM/YYYY')}</td>
                        <td className="px-4 py-3">{item.checkIn || '-'}</td>
                        <td className="px-4 py-3">{item.checkOut || '-'}</td>
                        <td className="px-4 py-3">{item.hoursWorked || '0h00'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 inline-flex text-xs rounded-full ${statusColor}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="pt-4 text-right">
                <button
                  onClick={closeHistory}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}