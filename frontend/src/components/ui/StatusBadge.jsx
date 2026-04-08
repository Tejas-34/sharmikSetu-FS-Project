import React from 'react';

const StatusBadge = ({ status }) => {
  const normalizedStatus = String(status || '').toUpperCase();
  const isOpen = normalizedStatus === 'OPEN';

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] ${
        isOpen
          ? 'bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/25'
          : 'bg-rose-400/15 text-rose-300 ring-1 ring-rose-300/25'
      }`}
    >
      {normalizedStatus}
    </span>
  );
};

export default StatusBadge;
