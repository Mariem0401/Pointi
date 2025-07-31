import React from 'react';

const PayrollSummary = ({ darkMode, processed, pending, totalAmount, averageSalary }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Paies traitées:</span>
        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{processed}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Paies en attente:</span>
        <span className={`font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>{pending}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Masse salariale:</span>
        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {(totalAmount/1000).toFixed(1)}K €
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Salaire moyen:</span>
        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {averageSalary.toFixed(0)} €
        </span>
      </div>
      <div className="pt-4 mt-4 border-t border-gray-200 dark:border-slate-700">
        <div className="flex justify-between items-center">
          <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Prochaine paie:</span>
          <span className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PayrollSummary;