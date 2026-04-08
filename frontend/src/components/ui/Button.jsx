import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
  const baseStyle = 'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold tracking-[0.01em] transition-all duration-300';
  const variants = {
    primary: 'bg-amber-400 text-slate-950 shadow-[0_16px_32px_rgba(245,158,11,0.25)] hover:-translate-y-0.5 hover:bg-amber-300',
    secondary: 'bg-slate-800/90 text-slate-100 ring-1 ring-white/10 hover:-translate-y-0.5 hover:bg-slate-700',
    danger: 'bg-rose-500 text-white shadow-[0_16px_32px_rgba(244,63,94,0.22)] hover:-translate-y-0.5 hover:bg-rose-400',
    outline: 'border border-slate-300/30 bg-white/80 text-slate-900 backdrop-blur hover:-translate-y-0.5 hover:bg-white',
    ghost: 'bg-transparent text-slate-300 hover:bg-white/[0.08] hover:text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'cursor-not-allowed opacity-50 saturate-50' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
