import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../common/ThemeToggle';

const Sidebar = ({
  isMobile,
  isSidebarOpen,
  setIsSidebarOpen,
  darkMode,
  toggleDarkMode,
}) => {
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleExpand = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const navItem = (to, iconClass, label, isChild = false) => (
    <Link
      to={`/dashboard${to}`}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        location.pathname === `/dashboard${to}`
          ? darkMode
            ? 'bg-indigo-900/80 text-white shadow-md'
            : 'bg-indigo-100 text-indigo-700 shadow-sm'
          : darkMode
            ? 'text-slate-300 hover:bg-slate-700/50'
            : 'text-gray-700 hover:bg-gray-100'
      } ${isChild ? 'ml-8 py-2 text-sm' : ''}`}
      onClick={() => isMobile && setIsSidebarOpen(false)}
    >
      <i className={`${iconClass} w-5 h-5 text-center flex-shrink-0 ${
        location.pathname === `/dashboard${to}`
          ? darkMode
            ? 'text-indigo-300'
            : 'text-indigo-600'
          : darkMode
            ? 'text-slate-400'
            : 'text-gray-500'
      }`} />
      <span className={`font-medium truncate ${isChild ? 'text-sm' : ''}`}>
        {label}
      </span>
      {location.pathname === `/dashboard${to}` && (
        <motion.span
          layoutId="activeIndicator"
          className={`w-1.5 h-1.5 rounded-full ${
            darkMode ? 'bg-indigo-400' : 'bg-indigo-600'
          }`}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  );

  const sectionItem = (sectionKey, icon, title, items) => (
    <div className="mb-1">
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors ${
          darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100'
        }`}
        onClick={() => toggleExpand(sectionKey)}
      >
        <div className="flex items-center space-x-3">
          <i className={`${icon} ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} text-lg`} />
          <span className={`font-medium ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>
            {title}
          </span>
        </div>
        <motion.i
          className={`fas fa-chevron-${
            expandedSection === sectionKey ? 'up' : 'down'
          } text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}
          animate={{ rotate: expandedSection === sectionKey ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      <AnimatePresence>
        {expandedSection === sectionKey && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="py-1 space-y-1">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {navItem(item.to, item.icon, item.label, true)}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const sections = [
    {
      key: 'employees',
      icon: 'fas fa-user-friends',
      title: 'Gestion du personnel',
      items: [
        { to: '/employees', icon: 'fas fa-list-ul', label: 'Liste des employés' },
        { to: '/employees/new', icon: 'fas fa-user-plus', label: 'Nouvel employé' },
        { to: '/employees/contracts', icon: 'fas fa-file-contract', label: 'Contrats' }
      ]
    },
    {
    key: 'departments',
    icon: 'fas fa-sitemap',
    title: 'Gestion des départements',
    items: [
      { to: '/departments', icon: 'fas fa-list', label: 'Liste des départements' },
      { to: '/departments/new', icon: 'fas fa-plus-circle', label: 'Créer un département' },
      { to: '/departments/teams', icon: 'fas fa-users', label: 'Gestion des équipes' }
    ]
  },
    {
      key: 'time',
      icon: 'fas fa-clock',
      title: 'Temps & Présence',
      items: [
        { to: '/attendance/daily', icon: 'fas fa-fingerprint', label: 'Pointage journalier' },
        { to: '/attendance/monthly', icon: 'fas fa-calendar-week', label: 'Synthèse mensuelle' },
        { to: '/attendance/schedules', icon: 'fas fa-calendar-alt', label: 'Plannings' }
      ]
    },
    {
      key: 'leave',
      icon: 'fas fa-umbrella-beach',
      title: 'Gestion des congés',
      items: [
        { to: '/leave/requests', icon: 'fas fa-inbox', label: 'Demandes' },
        { to: '/leave/balance', icon: 'fas fa-calculator', label: 'Soldes' },
        { to: '/leave/calendar', icon: 'fas fa-calendar-check', label: 'Calendrier' }
      ]
    },
    {
      key: 'payroll',
      icon: 'fas fa-money-bill-wave',
      title: 'Paie & Rémunération',
      items: [
        { to: '/payroll/calculate', icon: 'fas fa-calculator', label: 'Calcul de paie' },
        { to: '/payroll/history', icon: 'fas fa-history', label: 'Historique' },
        { to: '/payroll/slips', icon: 'fas fa-file-invoice', label: 'Bulletins' }
      ]
    }
  ];

  return (
    <motion.div
      initial={false}
      animate={{
        x: isSidebarOpen ? 0 : isMobile ? -320 : 0,
        boxShadow: isSidebarOpen ? '10px 0 30px -10px rgba(0,0,0,0.2)' : 'none',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`fixed lg:relative z-50 w-72 h-screen ${
        darkMode ? 'bg-slate-800' : 'bg-white'
      } border-r ${
        darkMode ? 'border-slate-700' : 'border-gray-200'
      } flex flex-col transition-colors duration-300`}
    >
      {/* Header */}
      <div className="p-5 border-b dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 10 }}
              className={`p-2 rounded-lg ${
                darkMode ? 'bg-indigo-900' : 'bg-indigo-100'
              }`}
            >
              <i className={`fas fa-user-tie text-lg ${
                darkMode ? 'text-indigo-400' : 'text-indigo-600'
              }`} />
            </motion.div>
            <h2 className={`text-xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              RH<span className="text-indigo-600">Manager</span>
            </h2>
          </div>
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className={`p-1 rounded-full ${
                darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
              }`}
            >
              <i className={`fas fa-times ${
                darkMode ? 'text-slate-400' : 'text-gray-500'
              }`} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation principale */}
      <div className="flex-1 overflow-y-auto p-4">
        <motion.div whileHover={{ scale: 1.02 }}>
          {navItem('', 'fas fa-tachometer-alt', 'Tableau de bord')}
        </motion.div>

        <div className="mt-6 space-y-2">
          {sections.map((section) =>
            sectionItem(section.key, section.icon, section.title, section.items)
          )}
        </div>
      </div>

      {/* Pied de page */}
      <div className="p-4 border-t dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                darkMode ? 'bg-indigo-900' : 'bg-indigo-100'
              }`}
            >
              <span
                className={`font-medium ${
                  darkMode ? 'text-indigo-300' : 'text-indigo-600'
                }`}
              >
                AD
              </span>
            </motion.div>
            <div>
              <p className={`text-sm font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Admin User
              </p>
              <p className={`text-xs ${
                darkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Administrateur
              </p>
            </div>
          </div>
          <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;