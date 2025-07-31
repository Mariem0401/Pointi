import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import { useLocation, Outlet } from 'react-router-dom';

const MainLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true' || false
  );
  const [notifications, setNotifications] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Gestion du responsive avec useCallback
  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 1024;
    setIsMobile(mobile);
    if (!mobile) setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Gestion du mode sombre
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Charger les données initiales
  useEffect(() => {
    // Simulation de données avec des timestamps réalistes
    const now = new Date();
    setNotifications([
      { 
        id: 1, 
        title: 'Nouvelle demande', 
        message: 'Demande de congé soumise par Jean Dupont', 
        time: new Date(now.getTime() - 120000), // 2 minutes ago
        read: false,
        type: 'leave'
      },
      { 
        id: 2, 
        title: 'Pointage', 
        message: '3 retards enregistrés ce matin', 
        time: new Date(now.getTime() - 3600000), // 1 heure ago
        read: false,
        type: 'attendance'
      }
    ]);

    setDepartments([
      { id: 1, name: 'Ressources Humaines', count: 12 },
      { id: 2, name: 'Informatique', count: 8 },
      { id: 3, name: 'Marketing', count: 5 }
    ]);
  }, []);

  // Fonctions mémoïsées
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar 
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        departments={departments}
      />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          isMobile={isMobile}
          darkMode={darkMode}
          notifications={notifications}
          toggleSidebar={toggleSidebar}
          markAsRead={markNotificationAsRead}
          markAllAsRead={markAllNotificationsAsRead}
          currentPath={location.pathname}
        />

        {/* Contenu dynamique */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <div 
              key={location.pathname}
              className={`rounded-lg transition-all duration-200 ${
                darkMode ? 'bg-slate-800' : 'bg-white'
              } shadow-sm p-4 md:p-6`}
            >
              <Outlet context={{ darkMode, departments, notifications }} />
            </div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className={`py-3 px-6 text-sm border-t ${
          darkMode ? 'border-slate-700 text-gray-400' : 'border-gray-200 text-gray-600'
        }`}>
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <span>© {new Date().getFullYear()} HR Management System</span>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="#" className="hover:underline">Confidentialité</a>
              <a href="#" className="hover:underline">Conditions</a>
              <a href="#" className="hover:underline">Aide</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;