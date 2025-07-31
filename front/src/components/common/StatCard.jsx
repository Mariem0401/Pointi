import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon, trend, description, darkMode }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: {
      y: -5,
      boxShadow: darkMode 
        ? '0 10px 25px -5px rgba(129, 140, 248, 0.3)' 
        : '0 10px 25px -5px rgba(99, 102, 241, 0.3)'
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`p-6 rounded-xl border ${
        darkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-lg ${
          darkMode ? 'bg-indigo-900 bg-opacity-50' : 'bg-indigo-100'
        }`}>
          <i className={`${icon} ${
            darkMode ? 'text-indigo-300' : 'text-indigo-600'
          } text-xl`} />
        </div>
        {trend && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            trend.value > 0 
              ? darkMode 
                ? 'bg-green-900 text-green-300' 
                : 'bg-green-100 text-green-800'
              : darkMode 
                ? 'bg-red-900 text-red-300' 
                : 'bg-red-100 text-red-800'
          }`}>
            {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className={`text-sm font-medium uppercase tracking-wider ${
          darkMode ? 'text-slate-400' : 'text-gray-500'
        }`}>
          {label}
        </p>
        <p className={`text-3xl font-bold mt-1 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {value}
        </p>
        {description && (
          <p className={`text-xs mt-2 ${
            darkMode ? 'text-slate-500' : 'text-gray-500'
          }`}>
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;