import React from 'react';
import { Briefcase, CalendarClock, CheckCircle, FileCheck2, Lock, Mail, MessageSquare, MapPin, Phone, Trash2, UserMinus, Users } from 'lucide-react';

import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import { formatDate } from '../../utils/helpers';

const JobCard = ({
  job,
  isEmployer,
  currentUser,
  t,
  initiateApplyForJob,
  triggerDeleteJob,
  removeWorker,
  updateApplicationStatus,
  markJobCompleted,
  navigate,
}) => {
  const acceptedCount = job.applicants.filter((applicant) => applicant.status === 'accepted').length;
  const totalApplicants = job.appliedWorkers.length;
  const isFull = acceptedCount >= job.requiredWorkers;
  const hasApplied = job.appliedWorkers.includes(currentUser?.id);
  const progressPercent = Math.min((acceptedCount / job.requiredWorkers) * 100, 100);
  const isAdmin = currentUser?.role === 'admin';
  const hasMap = Boolean(job.siteAddress || job.siteCity || (job.siteLatitude && job.siteLongitude));
  const mapQuery = job.siteLatitude && job.siteLongitude
    ? `${job.siteLatitude},${job.siteLongitude}`
    : [job.siteAddress, job.siteCity].filter(Boolean).join(', ');

  return (
    <div className="flex h-full flex-col rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-950">{job.title}</h3>
            <StatusBadge status={job.status} />
          </div>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <Briefcase size={14} />
            {job.employerName}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-950">₹{job.wage}<span className="ml-1 text-xs font-medium text-slate-500">{t('day')}</span></div>
          <div className="mt-1 text-xs text-slate-500">{formatDate(job.postedAt)}</div>
          {(isAdmin || (isEmployer && currentUser?.id === job.employerId)) && (
            <button onClick={() => triggerDeleteJob(job.id)} className="mt-3 rounded-full p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div className="rounded-2xl bg-slate-50 p-3"><MapPin size={14} className="mb-2 text-slate-400" />{job.location}</div>
        <div className="rounded-2xl bg-slate-50 p-3"><Users size={14} className="mb-2 text-slate-400" />{job.availableSlots} open spot(s)</div>
        <div className="rounded-2xl bg-slate-50 p-3"><CalendarClock size={14} className="mb-2 text-slate-400" />{job.deadline ? `${job.daysRemaining ?? 0} days left` : 'No deadline'}</div>
        <div className="rounded-2xl bg-slate-50 p-3"><Briefcase size={14} className="mb-2 text-slate-400" />{job.startDate || 'Start date TBD'}</div>
      </div>

      <p className="mt-5 text-sm leading-7 text-slate-600">{job.description}</p>

      {job.skillsRequired.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {job.skillsRequired.map((skill) => (
            <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {skill}
            </span>
          ))}
        </div>
      )}

      {hasMap && (
        <div className="mt-5 overflow-hidden rounded-[1.3rem] border border-slate-200">
          <iframe
            title={`Map for ${job.title}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
            className="h-40 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>Total applicants</span>
          <span>{totalApplicants}</span>
        </div>
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>{t('spotsFilled')}</span>
          <span>{acceptedCount} / {job.requiredWorkers}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div className={`h-full rounded-full ${isFull ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="mt-5 border-t border-slate-200 pt-5">
        {isEmployer ? (
          <div className="text-sm text-slate-500">
            {totalApplicants === 0 ? 'No applicants yet' : `${totalApplicants} applicant(s)`}
          </div>
        ) : (
          <div>
            {hasApplied ? (
              <>
                {(() => {
                  const workerApp = job.applicants.find((applicant) => applicant.id === currentUser.id);
                  const appStatus = workerApp?.status || job.myApplicationStatus || 'pending';

                  if (appStatus === 'accepted') {
                    return (
                      <>
                        <Button disabled className="w-full !bg-emerald-600 !text-white">
                          <CheckCircle size={18} />
                          Application accepted
                        </Button>
                        <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                          <div className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{t('employerContact')}</div>
                          <div className="mt-3 flex items-center gap-2 text-sm text-emerald-900">
                            <Mail size={14} />
                            {job.employerEmail || 'No email provided'}
                          </div>
                          {job.employerPhone && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-emerald-900">
                              <Phone size={14} />
                              {job.employerPhone}
                            </div>
                          )}
                          <Button 
                            variant="outline" 
                            className="mt-4 w-full !border-emerald-300 !text-emerald-800 hover:!bg-emerald-100"
                            onClick={() => navigate?.(`/app/messages?with_user=${job.employerId}&job_id=${job.id}`)}
                          >
                            <MessageSquare size={16} />
                            Message Employer
                          </Button>
                        </div>
                      </>
                    );
                  }

                  if (appStatus === 'rejected') {
                    return (
                      <Button disabled className="w-full !bg-rose-600 !text-white">
                        <UserMinus size={18} />
                        Application rejected
                      </Button>
                    );
                  }

                  return (
                    <Button disabled className="w-full !bg-amber-400 !text-slate-950">
                      <Users size={18} />
                      Application pending
                    </Button>
                  );
                })()}
              </>
            ) : job.status === 'CLOSED' ? (
              <Button disabled className="w-full !bg-slate-300 !text-slate-600">
                <Lock size={18} />
                {t('positionFilled')}
              </Button>
            ) : (
              <Button onClick={() => initiateApplyForJob(job.id)} className="w-full">
                {t('applyNow')}
              </Button>
            )}
          </div>
        )}
      </div>

      {isEmployer && acceptedCount > 0 && (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-2 text-sm text-emerald-900">
            <FileCheck2 size={16} className="mt-0.5" />
            <div>
              <div className="font-semibold">Completion certificates are available on job close.</div>
              <div className="mt-1 text-xs text-emerald-700">Marking the job complete issues certificates to you and accepted workers.</div>
            </div>
          </div>
          <Button variant="outline" className="mt-4 w-full !border-emerald-300 !text-emerald-800 hover:!bg-emerald-100" onClick={() => markJobCompleted(job.id)}>
            <FileCheck2 size={16} />
            Mark completed
          </Button>
        </div>
      )}

      {isEmployer && totalApplicants > 0 && (
        <div className="mt-5 border-t border-slate-200 pt-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{t('applicants')}</p>
          <div className="space-y-3">
            {job.applicants.map((worker) => (
              <div key={worker.applicationId} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-950">{worker.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{worker.city || 'City not provided'}</div>
                    <div className="mt-2 text-xs text-slate-500">{worker.status}</div>
                  </div>
                  <button onClick={() => removeWorker(job.id, worker.id)} className="rounded-full p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                    <UserMinus size={15} />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex-1 rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail size={12} />
                      {worker.email || 'No email provided'}
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate?.(`/app/messages?with_user=${worker.id}&job_id=${job.id}`)}
                    className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    title="Message worker"
                  >
                    <MessageSquare size={16} />
                  </button>
                </div>

                {worker.status === 'pending' && (
                  <div className="mt-3 flex gap-2">
                    <Button onClick={() => updateApplicationStatus(worker.applicationId, 'accepted')} className="flex-1 !min-h-[40px] !text-xs">
                      Accept
                    </Button>
                    <Button onClick={() => updateApplicationStatus(worker.applicationId, 'rejected')} variant="outline" className="flex-1 !min-h-[40px] !text-xs">
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
