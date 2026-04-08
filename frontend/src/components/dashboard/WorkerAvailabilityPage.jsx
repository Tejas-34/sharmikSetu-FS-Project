import React, { useEffect, useState } from 'react';
import { CalendarDays, Mail, MapPin, Phone, RefreshCw, Search, Users, Star, Award } from 'lucide-react';
import { apiFetch } from '../../utils/api';

const WorkerAvailabilityPage = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cityFilter.trim()) params.set('city', cityFilter.trim());
      const data = await apiFetch(`/calendar/all${params.toString() ? '?' + params.toString() : ''}`);
      setWorkers(data || []);
    } catch (err) {
      console.error('Failed to fetch worker availability', err);
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const filteredWorkers = workers.filter((w) => {
    const q = search.toLowerCase();
    return (
      w.worker_name?.toLowerCase().includes(q) ||
      w.worker_city?.toLowerCase().includes(q) ||
      w.availability?.some((a) => a.title?.toLowerCase().includes(q))
    );
  });

  const allCities = [...new Set(workers.map((w) => w.worker_city).filter(Boolean))].sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Talent Pool</div>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Worker Availability</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              See which workers have marked themselves as available. Contact them directly to offer work.
            </p>
          </div>
          <button
            onClick={fetchAvailability}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300 transition-all"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, city or availability title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none transition-all focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10"
            />
          </div>
          <select
            value={cityFilter}
            onChange={(e) => { setCityFilter(e.target.value); }}
            onBlur={fetchAvailability}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition-all focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 cursor-pointer"
          >
            <option value="">All Cities</option>
            {allCities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Worker Cards */}
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400">Loading availability data…</div>
        ) : filteredWorkers.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 px-6 py-16 text-center text-sm text-slate-500">
            <Users size={32} className="mx-auto mb-3 text-slate-300" />
            No workers have marked their availability yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.worker_id}
                className="rounded-2xl border border-slate-200 p-5 hover:border-amber-300 hover:shadow-md transition-all"
              >
                {/* Worker info */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-bold text-sm">
                    {worker.worker_name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-950">{worker.worker_name}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                        <Star size={14} fill={worker.average_rating ? "currentColor" : "none"} />
                        {worker.average_rating || 'Unrated'}
                      </div>
                      <div className="flex items-center gap-1 text-blue-600 font-bold text-sm border-l border-slate-200 pl-2">
                        <Award size={14} className={worker.certificate_count > 0 ? "text-blue-600" : "text-slate-300"} />
                        {worker.certificate_count || 0} Certs
                      </div>
                    </div>
                    {worker.worker_city && (
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={11} />
                        {worker.worker_city}
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact */}
                <div className="mt-4 rounded-2xl bg-slate-50 p-3 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="shrink-0 text-slate-400" />
                    <span className="truncate">{worker.worker_email || '—'}</span>
                  </div>
                  {worker.worker_phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="shrink-0 text-slate-400" />
                      <span>{worker.worker_phone}</span>
                    </div>
                  )}
                </div>

                {/* Availability slots */}
                <div className="mt-4">
                  <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Available Dates</div>
                  <div className="space-y-2">
                    {worker.availability.map((slot) => (
                      <div key={slot.id} className="flex items-start gap-2.5 rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                        <CalendarDays size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                        <div>
                          <div className="text-xs font-semibold text-emerald-800">{slot.title}</div>
                          <div className="mt-0.5 text-xs text-emerald-700">
                            {slot.start_date} → {slot.end_date}
                          </div>
                          {slot.notes && (
                            <div className="mt-1 text-xs text-emerald-600 italic">{slot.notes}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default WorkerAvailabilityPage;
