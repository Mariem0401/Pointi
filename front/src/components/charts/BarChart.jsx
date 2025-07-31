import React from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import './chartConfig';

const BarChart = ({ data, darkMode }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        bodyColor: darkMode ? '#e2e8f0' : '#64748b',
        titleColor: darkMode ? '#e2e8f0' : '#64748b',
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        borderColor: darkMode ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b'
        }
      },
      y: {
        grid: {
          color: darkMode ? '#334155' : '#e2e8f0',
          drawBorder: false
        },
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b'
        }
      }
    },
    animation: {
      delay: (context) => {
        if (context.type === 'data' && context.mode === 'default') {
          return context.dataIndex * 100;
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="h-full w-full"
    >
      <Bar data={data} options={options} />
    </motion.div>
  );
};

export default BarChart;