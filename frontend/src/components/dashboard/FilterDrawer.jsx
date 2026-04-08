import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

import Button from '../ui/Button';

const skillOptions = ['masonry', 'electrician', 'plumbing', 'welding', 'painting', 'scaffolding', 'general'];
const wageOptions = [
  { label: '₹0 - ₹499', min: 0, max: 499 },
  { label: '₹500 - ₹799', min: 500, max: 799 },
  { label: '₹800 - ₹1199', min: 800, max: 1199 },
  { label: '₹1200+', min: 1200, max: Infinity },
];

const FilterDrawer = ({ isOpen, filters, setFilters, onClose, onReset }) => {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const updateRange = (range) => {
    setFilters((prev) => ({
      ...prev,
      wageRange: prev.wageRange === range.label ? '' : range.label,
      minWage: prev.wageRange === range.label ? '' : range.min,
      maxWage: prev.wageRange === range.label ? '' : (Number.isFinite(range.max) ? range.max : ''),
    }));
  };

  return (
    <div className={`fixed inset-0 z-40 transition ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-slate-950/35 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <aside className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2 text-slate-900">
            <SlidersHorizontal size={18} className="text-blue-600" />
            <h3 className="font-bold">Job Filters</h3>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-7 overflow-y-auto px-5 py-5 text-sm">
          <section>
            <div className="mb-3 font-semibold text-slate-700">Status</div>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
              <input
                type="checkbox"
                checked={filters.openOnly}
                onChange={(event) => update('openOnly', event.target.checked)}
                className="h-4 w-4 accent-blue-600"
              />
              <span>Only show open jobs</span>
            </label>
          </section>

          <section>
            <div className="mb-3 font-semibold text-slate-700">Skill</div>
            <div className="grid grid-cols-2 gap-2">
              {skillOptions.map((skill) => (
                <label key={skill} className={`rounded-xl border px-3 py-2 capitalize ${filters.skills.includes(skill) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}>
                  <input
                    type="checkbox"
                    className="mr-2 accent-blue-600"
                    checked={filters.skills.includes(skill)}
                    onChange={(event) => {
                      update(
                        'skills',
                        event.target.checked
                          ? [...filters.skills, skill]
                          : filters.skills.filter((item) => item !== skill),
                      );
                    }}
                  />
                  {skill}
                </label>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-3 font-semibold text-slate-700">Daily wage</div>
            <div className="space-y-2">
              {wageOptions.map((range) => (
                <label key={range.label} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${filters.wageRange === range.label ? 'border-amber-400 bg-amber-50 text-amber-800' : 'border-slate-200 text-slate-600'}`}>
                  <input
                    type="checkbox"
                    checked={filters.wageRange === range.label}
                    onChange={() => updateRange(range)}
                    className="h-4 w-4 accent-amber-500"
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-3 font-semibold text-slate-700">Location</div>
            <input
              type="text"
              value={filters.location}
              onChange={(event) => update('location', event.target.value)}
              placeholder="Mumbai, Pune, Nashik..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </section>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-slate-200 px-5 py-4">
          <Button variant="outline" onClick={onReset}>Reset</Button>
          <Button onClick={onClose}>Apply</Button>
        </div>
      </aside>
    </div>
  );
};

export default FilterDrawer;
