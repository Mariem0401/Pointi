import React, { useState } from 'react';
import { FiCalendar, FiClock, FiPlus, FiUser, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function SchedulesManagement() {
  const [schedules, setSchedules] = useState([
    { id: 1, employee: "Jean Dupont", monday: "08:00-17:00", tuesday: "08:00-17:00", wednesday: "08:00-17:00", thursday: "08:00-17:00", friday: "08:00-16:00" },
    { id: 2, employee: "Marie Martin", monday: "09:00-18:00", tuesday: "09:00-18:00", wednesday: "09:00-18:00", thursday: "09:00-18:00", friday: "09:00-17:00" }
  ]);

  const [newSchedule, setNewSchedule] = useState({
    employee: "",
    monday: "08:00-17:00",
    tuesday: "08:00-17:00",
    wednesday: "08:00-17:00",
    thursday: "08:00-17:00",
    friday: "08:00-16:00"
  });

  const handleAddSchedule = () => {
    if (newSchedule.employee) {
      setSchedules([...schedules, { ...newSchedule, id: schedules.length + 1 }]);
      setNewSchedule({
        employee: "",
        monday: "08:00-17:00",
        tuesday: "08:00-17:00",
        wednesday: "08:00-17:00",
        thursday: "08:00-17:00",
        friday: "08:00-16:00"
      });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Plannings</h1>
        <p className="text-gray-600">Organisation des horaires de travail</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800">Nouveau planning</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Employé</label>
            <input
              type="text"
              value={newSchedule.employee}
              onChange={(e) => setNewSchedule({...newSchedule, employee: e.target.value})}
              placeholder="Nom de l'employé"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
            <div key={day}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {day === 'monday' ? 'Lun' : 
                 day === 'tuesday' ? 'Mar' :
                 day === 'wednesday' ? 'Mer' :
                 day === 'thursday' ? 'Jeu' : 'Ven'}
              </label>
              <input
                type="text"
                value={newSchedule[day]}
                onChange={(e) => setNewSchedule({...newSchedule, [day]: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div className="flex items-end">
            <button
              onClick={handleAddSchedule}
              className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
            >
              <FiPlus size={18} />
              <span>Ajouter</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lundi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mardi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mercredi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jeudi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendredi</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <FiUser className="text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{schedule.employee}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.monday}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.tuesday}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.wednesday}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.thursday}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.friday}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <FiEdit2 size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}