import React, { useState } from 'react';
import { Briefcase, FileCheck2, Info, MapPinned, Wallet } from 'lucide-react';

import Button from '../ui/Button';
import Input from '../ui/Input';
import { MINIMUM_WAGES } from '../../constants';

const CreateJobForm = ({ currentUser, createJob, navigate, t, showToast, setBlockingError, setShowEmployerLawInfo }) => {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    city: currentUser.city || '',
    state: 'Maharashtra',
    wage: '',
    requiredWorkers: '',
    skillsRequired: '',
    siteAddress: '',
    siteCity: currentUser.city || '',
    siteLatitude: '',
    siteLongitude: '',
    startDate: '',
    deadline: '',
  });
  const [agreedToLaw, setAgreedToLaw] = useState(false);

  // Auto-detect required workers from description or title to prevent manual mismatch
  React.useEffect(() => {
    const combinedText = `${jobData.title} ${jobData.description}`.toLowerCase();
    const match = combinedText.match(/(\d+)\s*(workers?|cab drivers?|drivers?|truck drivers?|laborers?|people|persons?|men|women)/i);
    if (match && match[1]) {
      const extractedNumber = parseInt(match[1], 10);
      if (extractedNumber > 0 && String(jobData.requiredWorkers) !== String(extractedNumber)) {
        setJobData(prev => ({ ...prev, requiredWorkers: String(extractedNumber) }));
      }
    }
  }, [jobData.title, jobData.description]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!agreedToLaw) {
      showToast(t('errCompliance'), 'error');
      return;
    }

    const minWage = MINIMUM_WAGES[jobData.state] || MINIMUM_WAGES.Other;
    if (Number(jobData.wage) < minWage) {
      setBlockingError({
        isOpen: true,
        title: t('errWageTooLow'),
        message: `${t('errWageTooLowMsg')} ${jobData.state} (₹${minWage}).`,
      });
      return;
    }

    createJob({
      ...jobData,
      wage: Number(jobData.wage),
      requiredWorkers: Number(jobData.requiredWorkers),
      skillsRequired: jobData.skillsRequired
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean),
      siteLatitude: jobData.siteLatitude ? Number(jobData.siteLatitude) : null,
      siteLongitude: jobData.siteLongitude ? Number(jobData.siteLongitude) : null,
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Job creation</div>
            <h2 className="mt-2 flex items-center gap-2 text-2xl font-bold text-slate-950">
              <Briefcase size={22} className="text-slate-700" />
              {t('postJobTitle')}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Create a structured job record with site location, wage, crew size, schedule, and compliance details.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/app/dashboard')}>{t('cancel')}</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <div className="mb-4 text-sm font-semibold text-slate-950">Job details</div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  label={t('labelJobTitle')}
                  value={jobData.title}
                  onChange={(event) => setJobData({ ...jobData, title: event.target.value })}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Job Description</label>
                <textarea
                  value={jobData.description}
                  onChange={(event) => setJobData({ ...jobData, description: event.target.value })}
                  required
                  rows={5}
                  className="mt-2 w-full rounded-[1.4rem] border border-slate-200 bg-white p-4 text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the work, shift expectations, and any required experience."
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('labelState')}</label>
                <select
                  value={jobData.state}
                  onChange={(event) => setJobData({ ...jobData, state: event.target.value })}
                  className="h-[50px] rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.keys(MINIMUM_WAGES).map((state) => <option key={state} value={state}>{state}</option>)}
                </select>
              </div>

              <Input
                label="Employer City"
                value={jobData.city}
                onChange={(event) => setJobData({ ...jobData, city: event.target.value })}
                readOnly
              />

              <Input
                label={t('labelWage')}
                type="number"
                value={jobData.wage}
                onChange={(event) => setJobData({ ...jobData, wage: event.target.value })}
                required
              />

              <Input
                label={t('labelWorkers')}
                type="number"
                min="1"
                placeholder="e.g. 4"
                value={jobData.requiredWorkers}
                onChange={(event) => setJobData({ ...jobData, requiredWorkers: event.target.value })}
                required
              />

              <div className="md:col-span-2">
                <Input
                  label="Required Skills"
                  value={jobData.skillsRequired}
                  onChange={(event) => setJobData({ ...jobData, skillsRequired: event.target.value })}
                  placeholder="masonry, scaffolding, plumbing"
                />
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4 text-sm font-semibold text-slate-950">Site and schedule</div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  label="Site Address"
                  value={jobData.siteAddress}
                  onChange={(event) => setJobData({ ...jobData, siteAddress: event.target.value })}
                  placeholder="Street, landmark, worksite"
                />
              </div>

              <Input
                label="Site City"
                value={jobData.siteCity}
                onChange={(event) => setJobData({ ...jobData, siteCity: event.target.value })}
                placeholder="e.g. Mumbai"
              />
              <Input
                label="Start Date"
                type="date"
                value={jobData.startDate}
                onChange={(event) => setJobData({ ...jobData, startDate: event.target.value })}
              />
              <Input
                label="Deadline"
                type="date"
                value={jobData.deadline}
                onChange={(event) => setJobData({ ...jobData, deadline: event.target.value })}
              />

              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <Input
                  label="Latitude"
                  type="number"
                  value={jobData.siteLatitude}
                  onChange={(event) => setJobData({ ...jobData, siteLatitude: event.target.value })}
                  placeholder="19.0760"
                />
                <Input
                  label="Longitude"
                  type="number"
                  value={jobData.siteLongitude}
                  onChange={(event) => setJobData({ ...jobData, siteLongitude: event.target.value })}
                  placeholder="72.8777"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-blue-100 bg-blue-50 p-5">
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="lawCompliance"
                checked={agreedToLaw}
                onChange={(event) => setAgreedToLaw(event.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 accent-blue-600"
              />
              <div className="text-sm text-slate-700">
                <label htmlFor="lawCompliance" className="mb-1 block font-semibold">
                  {t('complianceTitle')}
                </label>
                <p className="mb-2 text-xs leading-6 text-slate-500">{t('complianceDesc')}</p>
                <button
                  type="button"
                  onClick={() => setShowEmployerLawInfo(true)}
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                >
                  <Info size={12} />
                  {t('viewResp')}
                </button>
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <Button type="submit" className="min-w-[220px]">{t('btnPublish')}</Button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950">Posting summary</h3>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 font-semibold text-slate-950">
                <Wallet size={16} className="text-slate-700" />
                Wage floor
              </div>
              <div className="mt-2">Minimum wage for {jobData.state}: ₹{MINIMUM_WAGES[jobData.state] || MINIMUM_WAGES.Other}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 font-semibold text-slate-950">
                <MapPinned size={16} className="text-slate-700" />
                Site profile
              </div>
              <div className="mt-2">{jobData.siteAddress || 'Add a site address to improve worker confidence.'}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 font-semibold text-slate-950">
                <FileCheck2 size={16} className="text-slate-700" />
                Completion records
              </div>
              <div className="mt-2">Completed jobs can issue certificates to accepted workers and the employer.</div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950">Draft preview</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Title</div>
              <div className="mt-2 font-semibold text-slate-950">{jobData.title || 'Untitled job posting'}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Crew requirement</div>
              <div className="mt-2 text-slate-700">{jobData.requiredWorkers ? `${jobData.requiredWorkers} worker(s) needed` : 'Crew size not set yet'}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Compensation</div>
              <div className="mt-2 text-slate-700">{jobData.wage ? `₹${jobData.wage} per day` : 'Wage not set yet'}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CreateJobForm;
