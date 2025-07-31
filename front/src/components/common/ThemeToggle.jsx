import React from 'react';
import { motion } from 'framer-motion';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => (
  <button 
    onClick={toggleDarkMode}
    className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none ${
      darkMode ? 'bg-indigo-900' : 'bg-gray-300'
    }`}
  >
    <motion.div
      className={`w-6 h-6 rounded-full shadow-md ${
        darkMode ? 'bg-indigo-500' : 'bg-white'
      }`}
      initial={false}
      animate={{ x: darkMode ? 26 : 0 }}
      transition={{ type: 'spring', stiffness: 700, damping: 30 }}
    >
      {darkMode ? (
        <i className="fas fa-moon text-white absolute inset-0 flex items-center justify-center" />
      ) : (
        <i className="fas fa-sun text-yellow-500 absolute inset-0 flex items-center justify-center" />
      )}
    </motion.div>
  </button>
);

export default ThemeToggle;