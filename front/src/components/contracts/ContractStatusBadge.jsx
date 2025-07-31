import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi';

const ContractStatusBadge = ({ status }) => {
  const statusConfig = {
    active: {
      text: 'Actif',
      icon: <FiCheckCircle className="mr-1" />,
      className: 'bg-green-100 text-green-800'
    },
    expired: {
      text: 'Expiré',
      icon: <FiAlertCircle className="mr-1" />,
      className: 'bg-red-100 text-red-800'
    },
    draft: {
      text: 'Brouillon',
      icon: <FiClock className="mr-1" />,
      className: 'bg-yellow-100 text-yellow-800'
    }
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.icon}
      {config.text}
    </span>
  );
};

export default ContractStatusBadge;