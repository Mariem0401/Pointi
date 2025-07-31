import React from 'react';
import { FiUser } from 'react-icons/fi';
import PropTypes from 'prop-types';

const EmployeeAvatar = ({ employee, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg'
  };

  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 ${sizeClasses[size]} ${className}`}>
      {employee.photo ? (
        <img 
          src={employee.photo} 
          alt={`${employee.name}`} 
          className="rounded-full h-full w-full object-cover"
        />
      ) : (
        <span className="font-medium">
          {employee.name.split(' ').map(n => n[0]).join('')}
        </span>
      )}
    </div>
  );
};

EmployeeAvatar.propTypes = {
  employee: PropTypes.shape({
    name: PropTypes.string.isRequired,
    photo: PropTypes.string
  }).isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

export default EmployeeAvatar;