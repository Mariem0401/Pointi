// src/components/charts/EmployeeActivity.jsx
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeeActivity = ({ data, darkMode }) => {
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color),
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: darkMode ? '#e2e8f0' : '#64748b',
          font: {
            size: 12,
          },
          padding: 16,
        },
      },
    },
    cutout: '70%',
  };

  return <Doughnut data={chartData} options={options} />;
};

export default EmployeeActivity;