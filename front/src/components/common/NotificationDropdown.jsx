import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationDropdown = ({ 
  isOpen, 
  onClose, 
  notifications, 
  markAsRead, 
  darkMode 
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={`absolute right-6 top-16 z-50 w-80 rounded-xl shadow-lg ${
            darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
          }`}
        >
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex justify-between items-center">
              <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Notifications
              </h3>
              <button 
                onClick={onClose}
                className={`p-1 rounded-full ${
                  darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                }`}
              >
                <i className={`fas fa-times ${darkMode ? 'text-slate-400' : 'text-gray-500'}`} />
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b border-gray-200 dark:border-slate-700 ${
                    !notification.read ? darkMode ? 'bg-slate-700' : 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-slate-600' : 'bg-indigo-100'
                    }`}>
                      <i className={`fas fa-${
                        notification.title.includes('congé') ? 'calendar' : 
                        notification.title.includes('pointage') ? 'clock' : 'exclamation'
                      } ${
                        darkMode ? 'text-indigo-300' : 'text-indigo-600'
                      }`} />
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className={`text-sm font-medium ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm ${
                        darkMode ? 'text-slate-400' : 'text-gray-500'
                      }`}>
                        {notification.message}
                      </p>
                      <p className={`text-xs mt-1 ${
                        darkMode ? 'text-slate-500' : 'text-gray-400'
                      }`}>
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="ml-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500 block" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <i className={`fas fa-bell-slash text-3xl mb-2 ${
                  darkMode ? 'text-slate-500' : 'text-gray-400'
                }`} />
                <p className={`${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Aucune notification
                </p>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-slate-700">
            <button className={`w-full text-center text-sm ${
              darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
            }`}>
              Voir toutes les notifications
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;