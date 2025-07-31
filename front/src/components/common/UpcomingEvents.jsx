// src/components/UpcomingEvents.jsx
import React from 'react';
import { FiCalendar, FiUsers, FiBriefcase, FiStar } from 'react-icons/fi';

const eventIcons = {
  formation: <FiUsers className="text-blue-500" />,
  meeting: <FiBriefcase className="text-purple-500" />,
  evaluation: <FiStar className="text-amber-500" />,
  event: <FiCalendar className="text-green-500" />
};

const UpcomingEvents = ({ events, darkMode }) => {
  return (
    <div className={`rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow`}>
      <div className="p-5 border-b border-gray-200 dark:border-slate-700">
        <h3 className={`text-lg font-semibold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <FiCalendar className="mr-2 text-indigo-500" />
          Événements à venir
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-slate-700">
        {events.map((event) => (
          <div key={event.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <div className="flex items-start">
              <div className={`p-2 rounded-lg mr-3 ${darkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
                {eventIcons[event.type] || <FiCalendar />}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{event.title}</h4>
                <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-gray-500'}`}>
                  {new Date(event.date).toLocaleDateString('fr-FR', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                darkMode ? 'bg-slate-600 text-slate-300' : 'bg-gray-100 text-gray-700'
              }`}>
                {event.type === 'formation' && 'Formation'}
                {event.type === 'meeting' && 'Réunion'}
                {event.type === 'evaluation' && 'Évaluation'}
                {event.type === 'event' && 'Événement'}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className={`p-4 text-center border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
        <button className={`text-sm px-4 py-2 rounded-md ${
          darkMode 
            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}>
          Voir tous les événements
        </button>
      </div>
    </div>
  );
};

export default UpcomingEvents;