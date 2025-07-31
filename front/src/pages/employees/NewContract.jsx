import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, 
  FiCalendar, 
  FiDollarSign,
  FiCheck,
  FiX,
  FiBriefcase
} from 'react-icons/fi';

const NewContractForm = () => {
  const navigate = useNavigate();

  // Liste locale des employés
  const [employees] = useState([
    { id: 1, name: "Jean Dupont" },
    { id: 2, name: "Marie Lambert" }
  ]);

  const [formData, setFormData] = useState({
    employeeId: '',
    position: '',
    type: 'CDI',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    salary: '',
    status: 'active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newContract = {
      id: Date.now(),
      ...formData,
      endDate: formData.type === 'CDI' ? null : formData.endDate
    };

    console.log("Contrat enregistré :", newContract);
    navigate('/dashboard/employees/contracts'); // redirige vers la liste des contrats
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Nouveau Contrat</h2>
        <button 
          onClick={() => navigate('/dashboard/employees/contracts')}
          className="text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Employé */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employé</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un employé</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Poste */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
            <div className="relative">
              <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Ex: Développeur Senior"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Type de contrat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Stage">Stage</option>
              <option value="Alternance">Alternance</option>
            </select>
          </div>

          {/* Date de début */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Date de fin (si pas CDI) */}
          {formData.type !== 'CDI' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min={formData.startDate}
                />
              </div>
            </div>
          )}

          {/* Salaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salaire</label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Ex: 35000€"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/employees/contracts')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
          >
            <FiCheck className="mr-2" />
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewContractForm;