import React, { useMemo, useState } from 'react';
import { Filter, Plus, Search } from 'lucide-react';

import Button from '../ui/Button';
import JobCard from './JobCard';
import FilterDrawer from './FilterDrawer';

const defaultFilters = {
  openOnly: true,
  location: '',
  skills: [],
  minWage: '',
  maxWage: '',
  wageRange: '',
};

const JobsPage = ({
  currentUser,
  jobs,
  navigate,
  t,
  initiateApplyForJob,
  triggerDeleteJob,
  removeWorker,
  updateApplicationStatus,
  markJobCompleted,
}) => {
  const isEmployer = currentUser.role === 'employer';
  const isAdmin = currentUser.role === 'admin';
  const isWorker = currentUser.role === 'worker';
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const visibleJobs = useMemo(() => {
    let filtered = jobs;

    if (isEmployer) {
      filtered = jobs.filter((job) => job.employerId === currentUser.id);
    }

    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(lowerTerm) ||
        job.location.toLowerCase().includes(lowerTerm) ||
        job.employerName.toLowerCase().includes(lowerTerm) ||
        job.description.toLowerCase().includes(lowerTerm)
      );
    }

    if (isWorker) {
      if (filters.openOnly) {
        filtered = filtered.filter((job) => job.status === 'OPEN');
      }
      if (filters.location.trim()) {
        const location = filters.location.toLowerCase();
        filtered = filtered.filter((job) =>
          job.location.toLowerCase().includes(location) ||
          job.siteAddress.toLowerCase().includes(location) ||
          job.employerCity.toLowerCase().includes(location)
        );
      }
      if (filters.skills.length > 0) {
        filtered = filtered.filter((job) =>
          filters.skills.some((skill) => job.skillsRequired.map((item) => item.toLowerCase()).includes(skill))
        );
      }
      if (filters.minWage !== '') {
        filtered = filtered.filter((job) => job.wage >= Number(filters.minWage));
      }
      if (filters.maxWage !== '') {
        filtered = filtered.filter((job) => job.wage <= Number(filters.maxWage));
      }
    }

    return filtered;
  }, [currentUser.id, filters, isEmployer, isWorker, jobs, searchTerm]);

  const activeSelectedJobId = selectedJobId && visibleJobs.some((job) => job.id === selectedJobId)
    ? selectedJobId
    : visibleJobs[0]?.id ?? null;
  const selectedJob = visibleJobs.find((job) => job.id === activeSelectedJobId) || null;

  return (
    <div className="space-y-6">
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        filters={filters}
        setFilters={setFilters}
        onClose={() => setIsFilterDrawerOpen(false)}
        onReset={() => setFilters(defaultFilters)}
      />

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              {isWorker ? 'Worker jobs' : isEmployer ? 'Employer jobs' : 'Job records'}
            </div>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              {isWorker ? 'Browse available jobs' : isEmployer ? 'Manage your job postings' : 'Review platform jobs'}
            </h2>
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative min-w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {isWorker && (
              <Button variant="outline" onClick={() => setIsFilterDrawerOpen(true)}>
                <Filter size={18} />
                Filters
              </Button>
            )}
            {isEmployer && (
              <Button onClick={() => navigate('/app/jobs/new')}>
                <Plus size={18} />
                {t('btnPostJob')}
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          {visibleJobs.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 px-6 py-16 text-center">
              <h3 className="text-lg font-bold text-slate-950">{t('noJobs')}</h3>
              <p className="mt-2 text-sm text-slate-500">
                {searchTerm ? t('noJobsDesc') : (isEmployer ? "You haven't posted any jobs yet." : 'No jobs available right now.')}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Wage</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Applicants</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleJobs.map((job) => (
                    <tr
                      key={job.id}
                      onClick={() => setSelectedJobId(job.id)}
                      className={`cursor-pointer border-t border-slate-200 transition hover:bg-slate-50 ${
                        activeSelectedJobId === job.id ? 'bg-blue-50' : 'bg-white'
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-950">{job.title}</div>
                        <div className="mt-1 text-xs text-slate-500">{job.employerName}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{job.location}</td>
                      <td className="px-4 py-4 font-medium text-slate-900">₹{job.wage}</td>
                      <td className="px-4 py-4 text-slate-600">{job.status}</td>
                      <td className="px-4 py-4 text-slate-600">{job.appliedWorkers.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          {selectedJob ? (
            <JobCard
              job={selectedJob}
              isEmployer={isEmployer || isAdmin}
              currentUser={currentUser}
              t={t}
              initiateApplyForJob={initiateApplyForJob}
              triggerDeleteJob={triggerDeleteJob}
              removeWorker={removeWorker}
              updateApplicationStatus={updateApplicationStatus}
              markJobCompleted={markJobCompleted}
              navigate={navigate}
            />
          ) : (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
              Select a job from the list to review its details.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default JobsPage;
