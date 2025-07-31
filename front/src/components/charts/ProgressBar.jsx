import React from 'react';

export default function ProgressBar({ value, color = 'blue' }) {
  const colors = {
    blue: '#3b82f6',
    red: '#ef4444',
    green: '#22c55e',
    gray: '#9ca3af',
  };

  const barColor = colors[color] || colors.blue;

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        backgroundColor: '#e5e7eb', // gris clair
        borderRadius: '8px',
        height: '12px',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${value}%`,
          backgroundColor: barColor,
          height: '100%',
          borderRadius: '8px 0 0 8px',
          transition: 'width 0.3s ease-in-out',
        }}
      />
    </div>
  );
}
