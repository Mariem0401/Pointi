import React, { useState } from 'react';
import { FiDollarSign, FiUser, FiCalendar, FiDownload, FiPrinter } from 'react-icons/fi';

export default function PayrollCalculate() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [employees, setEmployees] = useState([
    { id: 1, name: "Jean Dupont", baseSalary: 3500, bonus: 250, deductions: 180 },
    { id: 2, name: "Marie Martin", baseSalary: 4200, bonus: 300, deductions: 210 },
    { id: 3, name: "Pierre Lambert", baseSalary: 2800, bonus: 150, deductions: 120 }
  ]);

  const handleValueChange = (id, field, value) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, [field]: Number(value) } : emp
    ));
  };

  const calculateNet = (employee) => {
    return employee.baseSalary + employee.bonus - employee.deductions;
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Calcul de Paie</h1>
        <p className="text-gray-600">Gestion des salaires pour le mois sélectionné</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center bg-white p-2 rounded-lg shadow-sm border">
          <FiCalendar className="text-gray-500 mr-2" />
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border-none focus:outline-none text-gray-700"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-50">
            <FiDownload size={18} />
            <span>Exporter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900">
            <FiPrinter size={18} />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire de Base</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retenues</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net à Payer</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <FiUser className="text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={employee.baseSalary}
                    onChange={(e) => handleValueChange(employee.id, 'baseSalary', e.target.value)}
                    className="w-24 border rounded px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={employee.bonus}
                    onChange={(e) => handleValueChange(employee.id, 'bonus', e.target.value)}
                    className="w-24 border rounded px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={employee.deductions}
                    onChange={(e) => handleValueChange(employee.id, 'deductions', e.target.value)}
                    className="w-24 border rounded px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  €{calculateNet(employee).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Affichage uniquement Salaires Bruts et Net */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Salaires Bruts</h3>
          <p className="text-2xl font-semibold text-gray-800">
            €{employees.reduce((sum, emp) => sum + emp.baseSalary, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Net</h3>
          <p className="text-2xl font-semibold text-blue-800">
            €{employees.reduce((sum, emp) => sum + calculateNet(emp), 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
