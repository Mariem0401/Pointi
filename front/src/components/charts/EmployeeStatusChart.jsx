// EmployeeStatusChart.jsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeeStatusChart = ({ data }) => {
  const chartData = {
    labels: ['Actifs', 'En essai', 'Inactifs'],
    datasets: [{
      data: [data.active, data.trial, data.inactive],
      backgroundColor: [
        '#10B981',
        '#F59E0B',
        '#EF4444'
      ],
      borderWidth: 0,
      hoverOffset: 15
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const value = context.raw;
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%'
  };

  return <Doughnut data={chartData} options={options} />;
};

export default EmployeeStatusChart;