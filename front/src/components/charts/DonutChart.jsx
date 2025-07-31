import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import './chartConfig';

const DonutChart = ({ data, darkMode }) => {
  const chartRef = useRef(null);
  
  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: darkMode ? '#e2e8f0' : '#64748b',
          font: {
            family: "'Inter', sans-serif"
          }
        }
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
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="h-full w-full"
    >
      <Doughnut 
        ref={chartRef} 
        data={data} 
        options={options} 
      />
    </motion.div>
  );
};

export default DonutChart;