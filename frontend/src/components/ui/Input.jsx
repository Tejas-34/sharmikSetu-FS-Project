import React from 'react';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  min,
  readOnly = false,
  disabled = false,
}) => (
  <div className="mb-4 flex flex-col gap-2">
    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      min={min}
      readOnly={readOnly}
      disabled={disabled}
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500 read-only:bg-slate-100"
    />
  </div>
);

export default Input;
