import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DonutChart from '../components/charts/DonutChart';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import StatCard from '../components/common/StatCard';
import RecentRequests from '../pages/leave/RecentRequests';
import { 
  FiUsers, 
  FiUserCheck, 
  FiClock, 
  FiDollarSign, 
  FiCalendar,
  FiTrendingUp,
  FiAlertTriangle,
  FiAward,
  FiCoffee
} from 'react-icons/fi';
import { TbClockHour4 } from 'react-icons/tb';
import { BsGraphUpArrow, BsPeopleFill } from 'react-icons/bs';

const DashboardHome = ({ darkMode }) => {
  const [timeRange, setTimeRange] = useState('month');
  
  // Données enrichies
  const [stats] = useState({
    totalEmployees: 142,
    presentToday: 118,
    lateToday: 9,
    onLeaveToday: 15,
    totalPayrollThisMonth: 284500,
    payrollChange: 2.8,
    avgWorkHours: 8.2,
    productivityIndex: 87,
    monthlyTimeTracking: [1250, 1180, 1320, 1400, 1280, 1450, 1500, 1380, 1420, 1300, 1350, 1480],
    monthlyLeaves: [34, 28, 31, 29, 27, 42, 65, 48, 36, 32, 28, 25],
    departments: [
      { name: 'Production', value: 62, color: '#6366f1', productivity: 92 },
      { name: 'Administration', value: 24, color: '#8b5cf6', productivity: 85 },
      { name: 'Technique', value: 32, color: '#ec4899', productivity: 89 },
      { name: 'Commercial', value: 18, color: '#14b8a6', productivity: 82 }
    ],
    leaveStatus: {
      approved: 18,
      pending: 7,
      rejected: 2
    },
    upcomingEvents: [
      { title: "Formation sécurité", date: "2023-06-15", type: "formation" },
      { title: "Réunion mensuelle", date: "2023-06-20", type: "meeting" },
      { title: "Évaluations annuelles", date: "2023-06-25", type: "evaluation" }
    ],
    topPerformers: [
      { name: "Sophie Martin", department: "Commercial", performance: 95 },
      { name: "Jean Dupont", department: "Technique", performance: 93 },
      { name: "Marie Leroy", department: "Production", performance: 91 }
    ]
  });

  // Formatage des données pour les graphiques
  const donutData = {
    labels: stats.departments.map(d => d.name),
    datasets: [{
      data: stats.departments.map(d => d.value),
      backgroundColor: stats.departments.map(d => d.color),
      borderWidth: 0
    }]
  };

  const timeTrackingData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Heures travaillées',
      data: stats.monthlyTimeTracking,
      backgroundColor: darkMode ? 'rgba(99, 102, 241, 0.8)' : 'rgba(139, 92, 246, 0.8)',
      borderColor: darkMode ? '#6366f1' : '#8b5cf6',
      tension: 0.3,
      fill: true
    }]
  };

  const leaveTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Jours de congé',
      data: stats.monthlyLeaves,
      backgroundColor: darkMode ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.8)',
      borderColor: '#ef4444',
      tension: 0.3
    }]
  };

  const productivityData = {
    labels: stats.departments.map(d => d.name),
    datasets: [{
      label: 'Productivité (%)',
      data: stats.departments.map(d => d.productivity),
      backgroundColor: stats.departments.map(d => d.color),
      borderWidth: 1,
      borderColor: darkMode ? '#374151' : '#e5e7eb'
    }]
  };

  return (
    <div className="space-y-6 pb-10">
      {/* En-tête amélioré */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl ${darkMode ? 'bg-gradient-to-r from-slate-800 to-slate-700' : 'bg-gradient-to-r from-indigo-50 to-blue-50'} shadow-lg`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-indigo-900'} flex items-center gap-2`}>
              <BsPeopleFill className="text-indigo-400" /> Tableau de Bord RH
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-slate-300' : 'text-indigo-700'}`}>
              Données en temps réel • {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm flex items-center ${
              darkMode ? 'bg-slate-700 text-green-300' : 'bg-green-100 text-green-800'
            }`}>
              <FiTrendingUp className="mr-1" /> Système actif
            </div>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={`text-sm rounded-lg px-3 py-2 ${
                darkMode 
                  ? 'bg-slate-700 text-white border-slate-600 hover:bg-slate-600' 
                  : 'bg-white border-gray-200 shadow hover:bg-gray-50'
              } border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
            >
              <option value="day">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Cartes de statistiques améliorées */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <StatCard 
          label="Effectif total" 
          value={stats.totalEmployees} 
          icon={<FiUsers className="w-5 h-5" />}
          trend={{ value: 3.2, direction: 'up' }}
          darkMode={darkMode}
          color="indigo"
          description="+5 nouveaux employés ce mois"
        />
        <StatCard 
          label="Présence aujourd'hui" 
          value={stats.presentToday} 
          secondaryValue={`${Math.round((stats.presentToday/stats.totalEmployees)*100)}%`}
          icon={<FiUserCheck className="w-5 h-5" />}
          darkMode={darkMode}
          color="green"
          description={`${stats.onLeaveToday} en congé`}
        />
        <StatCard 
          label="Retards aujourd'hui" 
          value={stats.lateToday} 
          icon={<FiClock className="w-5 h-5" />}
          trend={{ value: 1.5, direction: 'down' }}
          darkMode={darkMode}
          color="red"
          description="Moyenne quotidienne: 7"
        />
        <StatCard 
          label="Masse salariale" 
          value={`${(stats.totalPayrollThisMonth/1000).toFixed(1)}K €`} 
          icon={<FiDollarSign className="w-5 h-5" />}
          trend={{ value: stats.payrollChange, direction: stats.payrollChange >= 0 ? 'up' : 'down' }}
          darkMode={darkMode}
          color="purple"
          description={`${stats.payrollChange >= 0 ? '+' : ''}${stats.payrollChange}% vs mois dernier`}
        />
      </motion.div>

      {/* Première ligne de graphiques améliorée */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`lg:col-span-2 p-6 rounded-xl shadow-sm ${
            darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100 shadow'
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
              <TbClockHour4 className="text-indigo-500" /> Heures travaillées (mensuel)
            </h2>
            <div className={`text-sm px-2 py-1 rounded-md ${
              darkMode ? 'bg-slate-700 text-green-300' : 'bg-green-50 text-green-700'
            }`}>
              +5.2% vs année dernière
            </div>
          </div>
          <div className="h-80">
            <LineChart 
              data={timeTrackingData} 
              darkMode={darkMode} 
              isTimeSeries={true}
            />
          </div>
          <div className={`mt-4 text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Moyenne journalière: {stats.avgWorkHours}h/employé
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-xl shadow-sm ${
            darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100 shadow'
          }`}
        >
          <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
            <BsGraphUpArrow className="text-indigo-500" /> Répartition du personnel
          </h2>
          <div className="h-64 mb-4">
            <DonutChart 
              data={donutData} 
              darkMode={darkMode} 
            />
          </div>
          <div className="space-y-3">
            {stats.departments.map((dept, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    {dept.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    darkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {dept.productivity}%
                  </span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {dept.value} ({Math.round((dept.value/stats.totalEmployees)*100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Deuxième ligne de graphiques améliorée */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`lg:col-span-2 p-6 rounded-xl shadow-sm ${
            darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100 shadow'
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
              <FiAlertTriangle className="text-red-500" /> Tendances des congés (mensuel)
            </h2>
            <div className={`text-sm px-2 py-1 rounded-md ${
              darkMode ? 'bg-slate-700 text-amber-300' : 'bg-amber-50 text-amber-700'
            }`}>
              Pic en juillet (vacances)
            </div>
          </div>
          <div className="h-80">
            <BarChart 
              data={leaveTrendData} 
              darkMode={darkMode} 
              isTimeSeries={true}
            />
          </div>
          <div className={`mt-4 text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Taux d'approbation: {Math.round((stats.leaveStatus.approved / (stats.leaveStatus.approved + stats.leaveStatus.rejected)) * 100)}%
          </div>
        </motion.div>

        {/* Nouveau bloc - Productivité par département */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`p-6 rounded-xl shadow-sm ${
            darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100 shadow'
          }`}
        >
          <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
            <FiAward className="text-green-500" /> Productivité par département
          </h2>
          <div className="h-64 mb-4">
            <BarChart 
              data={productivityData} 
              darkMode={darkMode} 
            />
          </div>
          <div className={`text-center ${darkMode ? 'text-slate-400' : 'text-gray-500'} text-sm`}>
            Indice global: {stats.productivityIndex}%
          </div>
        </motion.div>
      </div>

      {/* Troisième ligne - Demandes récentes et autres informations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Demandes récentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`lg:col-span-2 p-6 rounded-xl shadow-sm ${
            darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100 shadow'
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
              <FiCalendar className="text-blue-500" /> Demandes récentes
            </h2>
            <button className={`text-sm px-3 py-1 rounded-md flex items-center transition-colors ${
              darkMode 
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
                : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
            }`}>
              Voir toutes <FiCalendar className="ml-1" />
            </button>
          </div>
          <RecentRequests 
            darkMode={darkMode}
            approved={stats.leaveStatus.approved}
            pending={stats.leaveStatus.pending}
            rejected={stats.leaveStatus.rejected}
          />
        </motion.div>

        {/* Nouveau bloc - Événements à venir et top performeurs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className={`space-y-6 ${
            darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100 shadow'
          } p-6 rounded-xl`}
        >
          {/* Événements à venir */}
          <div>
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
              <FiCalendar className="text-purple-500" /> Événements à venir
            </h2>
            <div className="space-y-3">
              {stats.upcomingEvents.map((event, index) => (
                <div key={index} className={`p-3 rounded-lg flex items-center ${
                  darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'
                } transition-colors`}>
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    event.type === 'formation' ? 'bg-blue-500' : 
                    event.type === 'meeting' ? 'bg-green-500' : 'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{event.title}</div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      {new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top performeurs */}
          <div>
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
              <FiAward className="text-yellow-500" /> Top Performeurs
            </h2>
            <div className="space-y-3">
              {stats.topPerformers.map((performer, index) => (
                <div key={index} className={`p-3 rounded-lg flex items-center justify-between ${
                  darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'
                } transition-colors`}>
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{performer.name}</div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      {performer.department}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {performer.performance}%
                  </div> 
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;