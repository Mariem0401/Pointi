import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import NotificationDropdown from '../common/NotificationDropdown';

const Header = ({ 
  isMobile, 
  setIsSidebarOpen
}) => {
  const location = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  // Charger les notifications au montage
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Exemple de données - remplacer par un appel API réel
        const mockNotifications = [
          {
            id: 1,
            title: "Nouveau message",
            message: "Vous avez reçu un nouveau message du service RH",
            date: new Date(),
            read: false,
            icon: "fa-envelope"
          },
          {
            id: 2,
            title: "Pointage validé",
            message: "Votre pointage du 15/05 a été validé",
            date: new Date(Date.now() - 86400000),
            read: false,
            icon: "fa-check-circle"
          }
        ];
        setNotifications(mockNotifications);
      } catch (error) {
        console.error("Erreur lors du chargement des notifications", error);
      }
    };

    fetchNotifications();
  }, []);

  // Fermer les notifications quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const clearAllNotifications = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setIsNotificationOpen(false);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Tableau de bord';
    if (path.startsWith('/employees')) return 'Gestion des employés';
    if (path.startsWith('/attendance')) return 'Gestion du pointage';
    if (path.startsWith('/leave')) return 'Gestion des congés';
    if (path.startsWith('/payroll')) return 'Gestion de la paie';
    if (path === '/stats') return 'Statistiques RH';
    if (path.startsWith('/departments')) return 'Gestion des départements';
    if (path.startsWith('/teams')) return 'Gestion des équipes';
    return 'Tableau de bord';
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 border-b border-gray-200 bg-white"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <i className="fas fa-bars text-gray-600" />
            </button>
          )}
          
          <h1 className="text-xl font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-full relative hover:bg-gray-100"
              aria-label="Notifications"
            >
              <i className="fas fa-bell text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </button>

            {isNotificationOpen && (
              <NotificationDropdown 
                notifications={notifications}
                onNotificationClick={handleNotificationClick}
                onClearAll={clearAllNotifications}
                unreadCount={unreadCount}
              />
            )}
          </div>

          <div className="relative">
            <button className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100">
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-indigo-100">
                <span className="text-sm font-medium text-indigo-600">
                  AD
                </span>
              </div>
              <span className="font-medium text-gray-900">
                Admin
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;