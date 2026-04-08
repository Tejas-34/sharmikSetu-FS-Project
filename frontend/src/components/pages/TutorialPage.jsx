import React from 'react';
import { BookOpen, Briefcase, CalendarDays, CheckCircle2, FileBadge, Filter, MapPinned, ShieldCheck, Star } from 'lucide-react';

const sections = [
  {
    title: '1. Create a trusted profile',
    icon: ShieldCheck,
    points: [
      'Register as worker or employer.',
      'Add city, phone number, verification document details, and profile notes.',
      'Verified profiles help employers shortlist faster and help workers look credible.',
    ],
  },
  {
    title: '2. Post or filter jobs',
    icon: Filter,
    points: [
      'Employers can publish jobs with wage, required workers, skills, site address, start date, and deadline.',
      'Workers can use the filter drawer to narrow jobs by location, wage, skill, and open status.',
      'The dashboard shows site city, remaining slots, and days left until the deadline.',
    ],
  },
  {
    title: '3. Manage active work',
    icon: Briefcase,
    points: [
      'Employers review applicants and accept or reject them directly from the job card.',
      'Workers can track ongoing and completed accepted tasks from their profile hub.',
      'Attendance is recorded per accepted worker so task history includes proof of participation.',
    ],
  },
  {
    title: '4. Use the calendar and maps',
    icon: CalendarDays,
    points: [
      'Workers can block dates for existing commitments or add planning entries for future work.',
      'Each job card can embed a site map when address or coordinates are available.',
      'Location information helps both sides validate travel and site planning quickly.',
    ],
  },
  {
    title: '5. Close jobs and collect records',
    icon: FileBadge,
    points: [
      'When an employer marks a job completed, ShramikSetu issues certificates for the employer and accepted workers.',
      'Certificates are stored in the platform and also sent through the configured email backend.',
      'Both sides can later review each other to build a work reputation.',
    ],
  },
];

const TutorialPage = ({ navigate }) => (
  <div className="min-h-[calc(100vh-8rem)] bg-[radial-gradient(circle_at_top,#dbeafe,transparent_35%),linear-gradient(180deg,#f8fafc,white)]">
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center mb-14">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
          <BookOpen size={16} /> ShramikSetu tutorial
        </div>
        <h1 className="mt-6 text-4xl md:text-5xl font-black tracking-tight text-slate-900">
          Use ShramikSetu from first signup to final certificate
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          This walkthrough covers profile setup, job discovery, attendance, calendars, map-backed site views, and completion certificates.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map(({ title, icon, points }) => (
          <article key={title} className="rounded-3xl border border-slate-200 bg-white/90 p-7 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                {React.createElement(icon, { size: 22 })}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            </div>
            <div className="space-y-3">
              {points.map((point) => (
                <div key={point} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                  <CheckCircle2 size={16} className="mt-1 shrink-0 text-emerald-600" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-slate-900 p-5 text-white">
          <MapPinned className="mb-3 text-cyan-300" />
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Maps</div>
          <div className="mt-2 text-sm text-slate-100">Preview job sites directly from dashboard cards.</div>
        </div>
        <div className="rounded-2xl bg-emerald-600 p-5 text-white">
          <CalendarDays className="mb-3 text-emerald-100" />
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-100">Calendar</div>
          <div className="mt-2 text-sm text-emerald-50">Block dates and plan future availability windows.</div>
        </div>
        <div className="rounded-2xl bg-amber-500 p-5 text-slate-950">
          <Star className="mb-3 text-slate-900" />
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-800">Ratings</div>
          <div className="mt-2 text-sm text-slate-900">Collect employer and worker reviews after job completion.</div>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="rounded-2xl border border-blue-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <FileBadge className="mb-3 text-blue-600" />
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Start Now</div>
          <div className="mt-2 text-sm text-slate-600">Open the login page and begin with a real profile.</div>
        </button>
      </div>
    </section>
  </div>
);

export default TutorialPage;
