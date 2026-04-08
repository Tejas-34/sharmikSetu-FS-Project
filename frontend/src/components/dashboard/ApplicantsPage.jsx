import React, { useState } from 'react';
import { Mail, UserMinus, Users, Phone, Star, Award, MessageSquare } from 'lucide-react';

import Button from '../ui/Button';

const ApplicantsPage = ({ jobs, currentUser, updateApplicationStatus, removeWorker, navigate }) => {
  const employerJobs = jobs.filter((job) => job.employerId === currentUser.id);
  const applicants = employerJobs.flatMap((job) =>
    job.applicants.map((worker) => ({
      ...worker,
      jobId: job.id,
      jobTitle: job.title,
    }))
  );

  const [selectedJobId, setSelectedJobId] = useState('all');
  const [skipAccepted, setSkipAccepted] = useState(false);

  let filteredApplicants = selectedJobId === 'all' 
    ? applicants 
    : applicants.filter(worker => worker.jobId.toString() === selectedJobId.toString());

  if (skipAccepted) {
    filteredApplicants = filteredApplicants.filter(worker => worker.status !== 'accepted');
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Applicants</div>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Applicant management</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Review all workers who have applied to your jobs in one place instead of opening each job separately.
        </p>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider shrink-0">Filter by Job posting</h3>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              <input 
                type="checkbox" 
                checked={skipAccepted}
                onChange={(e) => setSkipAccepted(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer accent-amber-500"
              />
              Hide accepted candidates
            </label>

            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 cursor-pointer appearance-none shrink-0"
              style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em', paddingRight: '2.5rem' }}
            >
              <option value="all">All Applicants ({applicants.length})</option>
              {employerJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job.applicants?.length || 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredApplicants.length > 0 ? (
          <div className="space-y-4">
            {filteredApplicants.map((worker) => (
              <div key={worker.applicationId} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-950">{worker.name}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                        <Star size={14} fill={worker.averageRating ? "currentColor" : "none"} />
                        {worker.averageRating || 'Unrated'}
                      </div>
                      <div className="flex items-center gap-1 text-blue-600 font-bold text-sm border-l border-slate-200 pl-2">
                        <Award size={14} className={worker.certificateCount > 0 ? "text-blue-600" : "text-slate-300"} />
                        Certificates : {worker.certificateCount || 0} 
                      </div>
                      <div className="text-sm text-slate-500 border-l border-slate-200 pl-2">{worker.jobTitle}</div>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{worker.city || 'City not provided'}</div>
                  </div>
                  <button onClick={() => removeWorker(worker.jobId, worker.id)} className="rounded-full p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                    <UserMinus size={16} />
                  </button>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    {worker.email || 'No email provided'}
                  </div>
                  {worker.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} />
                      {worker.phoneNumber}
                    </div>
                  )}
                </div>

                {/* <button 
                  onClick={() => navigate?.(`/app/messages?with_user=${worker.id}&job_id=${worker.jobId}`)}
                  className="mt-3 flex items-center justify-center gap-2 w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all hover:border-slate-300"
                  title="Message worker"
                >
                  <MessageSquare size={16} />
                  Message worker
                </button> */}

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{worker.status}</div>
                  {worker.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button onClick={() => updateApplicationStatus(worker.applicationId, 'accepted')} className="!min-h-[40px] !text-xs">
                        Accept
                      </Button>
                      <Button onClick={() => updateApplicationStatus(worker.applicationId, 'rejected')} variant="outline" className="!min-h-[40px] !text-xs">
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 px-6 py-16 text-center text-sm text-slate-500">
            No applicants available yet.
          </div>
        )}
      </section>
    </div>
  );
};

export default ApplicantsPage;
