import React from 'react';
import { CalendarDays } from 'lucide-react';

const CalendarPage = ({ calendarEntries, fetchCalendarEntries }) => (
  <div className="space-y-6">
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Calendar</div>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Availability and blocked dates</h2>
        </div>
        <button onClick={fetchCalendarEntries} className="text-sm font-semibold text-blue-600">Refresh</button>
      </div>
    </section>

    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        {(calendarEntries || []).length > 0 ? (
          calendarEntries.map((entry) => (
            <div key={entry.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4">
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                <CalendarDays size={18} />
              </div>
              <div>
                <div className="font-semibold text-slate-950">{entry.title}</div>
                <div className="mt-1 text-sm text-slate-500">{entry.start_date} to {entry.end_date}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 px-6 py-16 text-center text-sm text-slate-500">
            No calendar entries yet.
          </div>
        )}
      </div>
    </section>
  </div>
);

export default CalendarPage;
