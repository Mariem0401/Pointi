// src/components/EmployeeOfTheMonth.jsx
import React from 'react';
import { FiAward } from 'react-icons/fi';

const EmployeeOfTheMonth = ({ employee, darkMode }) => {
  return (
    <div className={`p-5 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-amber-50'} border ${darkMode ? 'border-slate-600' : 'border-amber-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-amber-900'} flex items-center`}>
          <FiAward className="mr-2 text-amber-500" />
          Employé du Mois
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-slate-600 text-amber-300' : 'bg-amber-100 text-amber-800'}`}>
          Félicitations !
        </span>
      </div>
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
          {employee.avatar ? (
            <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white text-2xl font-bold">
              {employee.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{employee.name}</h4>
          <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{employee.position}</p>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{employee.department}</p>
        </div>
      </div>
      
      <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-600' : 'border-amber-100'}`}>
        <h5 className={`text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-amber-800'}`}>Réalisations :</h5>
        <ul className="space-y-2">
          {employee.achievements.map((achievement, index) => (
            <li key={index} className="flex items-start">
              <span className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 mr-2 ${darkMode ? 'bg-amber-400' : 'bg-amber-500'}`}></span>
              <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{achievement}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmployeeOfTheMonth;