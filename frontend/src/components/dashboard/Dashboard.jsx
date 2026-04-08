import React from 'react';
import { BriefcaseBusiness, CalendarDays, FileBadge, Users, Plus, ArrowRight, UserPlus, FileText, CheckCircle2, Phone, Ban, Trash2, CheckCircle, ShieldAlert, Eye, X } from 'lucide-react';
import Button from '../ui/Button';

const Dashboard = ({ currentUser, jobs, users, dashboardSummary, taskHistory, certificates, calendarEntries, triggerDeleteUser, approveUser, toggleUserBan, navigate }) => {
  const isEmployer = currentUser.role === 'employer';
  const isAdmin = currentUser.role === 'admin';
  const isWorker = currentUser.role === 'worker';

  const [selectedUser, setSelectedUser] = React.useState(null);

  // Employer specific data
  const employerJobs = jobs.filter((job) => job.employerId === currentUser.id);
  const openJobs = employerJobs.filter((job) => job.status === 'OPEN');
  const employerApplicants = employerJobs.reduce((sum, job) => sum + job.applicants.length, 0);
  
  // Recent 3 jobs
  const recentJobs = [...employerJobs].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 3);
  
  // Recent 4 applicants
  const allApplicants = employerJobs.flatMap((job) =>
    job.applicants.map((worker) => ({
      ...worker,
      jobId: job.id,
      jobTitle: job.title,
    }))
  ).reverse().slice(0, 3); // basic reverse to get recents if array is chronologically append

  const cards = isAdmin
    ? [
        { label: 'Total Users', value: users.length, helper: 'Registered accounts', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pending Verification', value: users.filter(u => !u.isVerified && u.role !== 'admin').length, helper: 'Needs approval', icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Active listings', value: jobs.filter((job) => job.status === 'OPEN').length, helper: 'Jobs hiring', icon: BriefcaseBusiness, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      ]
    : isEmployer
      ? [
          { label: 'Active jobs', value: dashboardSummary?.active_jobs ?? 0, helper: 'Live vacancies', icon: BriefcaseBusiness, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Applicants', value: employerApplicants, helper: 'Across all postings', icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Completed jobs', value: dashboardSummary?.completed_jobs ?? 0, helper: 'Closed successfully', icon: FileBadge, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ]
      : [
          { label: 'Ongoing tasks', value: dashboardSummary?.ongoing_tasks ?? 0, helper: 'Accepted and active', icon: BriefcaseBusiness, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Certificates', value: (certificates || []).length, helper: 'Ready to download', icon: FileBadge, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Calendar entries', value: (calendarEntries || []).length, helper: 'Availability records', icon: CalendarDays, color: 'text-rose-600', bg: 'bg-rose-50' },
        ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Dynamic Header */}
      <section className={`relative overflow-hidden rounded-[2rem] border border-slate-200 p-8 shadow-sm ${isEmployer ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' : 'bg-white'}`}>
        {isEmployer && (
           <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
             <BriefcaseBusiness size={180} />
           </div>
        )}
        <div className={`relative z-10 text-xs font-bold uppercase tracking-[0.2em] ${isEmployer ? 'text-slate-400' : 'text-slate-500'}`}>
          {isWorker ? 'Worker overview' : isEmployer ? 'Employer Dashboard' : 'Admin overview'}
        </div>
        <h2 className={`mt-2 text-4xl font-bold ${isEmployer ? 'text-white' : 'text-slate-950'}`}>
          {isWorker ? 'Professional worker workspace' : isEmployer ? `Welcome back, ${currentUser.name}` : 'Platform overview'}
        </h2>
        <p className={`mt-3 max-w-3xl text-sm leading-7 ${isEmployer ? 'text-slate-300' : 'text-slate-600'}`}>
          {isWorker && 'Use the sidebar to move between jobs, certificates, calendar, and profile. This page stays focused on your current status only.'}
          {isEmployer && "Here's what's happening with your job postings right now. Manage your properties, review applicants, and quickly hire the best talent."}
          {isAdmin && 'Use this area to monitor platform activity and registered users.'}
        </p>

        {isEmployer && (
          <div className="mt-8 flex gap-4">
            <Button onClick={() => navigate?.('/app/jobs/new')} className="shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700">
              <Plus size={18} />
              Post New Job
            </Button>
            <Button variant="outline" onClick={() => navigate?.('/app/applicants')} className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800">
              <Users size={18} />
              Review Applicants
            </Button>
          </div>
        )}
      </section>

      {/* KPI Cards */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ label, value, helper, icon, color, bg }) => (
          <div key={label} className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</div>
              <div className={`rounded-xl p-3 ${bg} ${color}`}>
                {React.createElement(icon, { size: 20 })}
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
               <div className="text-4xl font-bold text-slate-950">{value}</div>
            </div>
            <div className="mt-1 text-sm text-slate-500">{helper}</div>
            <div className={`absolute bottom-0 left-0 h-1 w-full scale-x-0 bg-current opacity-20 transition-transform duration-300 group-hover:scale-x-100 ${color}`}></div>
          </div>
        ))}
      </section>

      {/* Employer Specific Sections */}
      {isEmployer && (
        <section className="grid gap-6 xl:grid-cols-2">
          {/* Recent Jobs */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-slate-950">Recent Job Postings</h3>
               <button onClick={() => navigate?.('/app/jobs')} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                  View all <ArrowRight size={16} />
               </button>
            </div>
            {recentJobs.length > 0 ? (
               <div className="space-y-4">
                  {recentJobs.map(job => (
                     <div key={job.id} onClick={() => navigate?.('/app/jobs')} className="group cursor-pointer rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:bg-blue-50 hover:border-blue-100">
                        <div className="flex justify-between items-start">
                           <div>
                              <div className="font-semibold text-slate-950 group-hover:text-blue-900">{job.title}</div>
                              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                 <span className="flex items-center gap-1"><FileText size={12}/> {job.location || job.siteCity}</span>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-sm font-bold text-slate-900">₹{job.wage}/day</div>
                              <div className={`mt-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full inline-block ${job.status === 'OPEN' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{job.status}</div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="rounded-2xl border border-dashed border-slate-300 py-8 text-center text-sm text-slate-500">
                  You haven't posted any jobs yet.
               </div>
            )}
          </div>

          {/* Recent Applicants */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-950">Recent Applicants</h3>
                <button onClick={() => navigate?.('/app/applicants')} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                   Review all <ArrowRight size={16} />
                </button>
             </div>
             {allApplicants.length > 0 ? (
                <div className="space-y-4">
                   {allApplicants.map((applicant, idx) => (
                      <div key={`${applicant.applicationId}-${idx}`} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                         <div className="flex items-center gap-3">
                            <div className="bg-slate-100 rounded-full p-2 text-slate-400">
                               <Users size={18} />
                            </div>
                            <div>
                               <div className="font-semibold text-slate-950">{applicant.name}</div>
                               <div className="text-xs text-slate-500">Applied for: <span className="font-medium text-slate-700">{applicant.jobTitle}</span></div>
                               {applicant.phoneNumber && (
                                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-500"><Phone size={10}/> {applicant.phoneNumber}</div>
                               )}
                            </div>
                         </div>
                         {applicant.status === 'pending' ? (
                           <div className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-lg">Pending</div>
                         ) : applicant.status === 'accepted' ? (
                           <div className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg flex items-center gap-1"><CheckCircle2 size={12}/> Accepted</div>
                         ) : (
                           <div className="text-xs font-semibold text-rose-600 bg-rose-100 px-2 py-1 rounded-lg">Rejected</div>
                         )}
                      </div>
                   ))}
                </div>
             ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 py-8 text-center text-sm text-slate-500">
                   No one has applied to your jobs recently.
                </div>
             )}
          </div>
        </section>
      )}

      {/* Worker Specific Sections */}
      {isWorker && (
        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-950">Accepted tasks</h3>
            <div className="mt-4 space-y-3">
              {[...(taskHistory?.ongoing || []), ...(taskHistory?.completed || [])].slice(0, 3).map((application) => (
                <div key={application.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-slate-200">
                  <div className="font-semibold text-slate-950">{application.job.title}</div>
                  <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                    <FileText size={14} className="text-slate-400" />
                    {application.job.site_city || application.job.employer?.city || 'Location pending'}
                  </div>
                </div>
              ))}
              {(!taskHistory?.ongoing?.length && !taskHistory?.completed?.length) && (
                 <div className="text-sm text-slate-500 p-4 text-center border border-dashed border-slate-200 rounded-xl">
                   No tasks accepted yet.
                 </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-950">Rating and reviews</h3>
            <div className="mt-6 rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-50 p-6 border border-blue-100 text-center">
              <div className="text-5xl font-black text-indigo-950">
                {dashboardSummary?.average_rating ? Number(dashboardSummary.average_rating).toFixed(1) : '0.0'}
              </div>
              <div className="mt-2 font-medium text-indigo-800 flex items-center justify-center gap-1">
                 {dashboardSummary?.reviews_count ?? 0} reviews recorded
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Admin Specific Sections */}
      {isAdmin && (
        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm overflow-hidden animate-in fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-950">System Users Management</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Contact Information</th>
                  <th className="px-4 py-3">Verification ID</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.city || 'Location N/A'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold uppercase ${
                        user.role === 'admin' ? 'bg-rose-100 text-rose-700' :
                        user.role === 'employer' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div>{user.email}</div>
                      <div className="text-xs flex items-center gap-1 mt-0.5"><Phone size={10}/> {user.phoneNumber || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-4">
                      {user.verificationDocumentType ? (
                         <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase text-slate-400">{user.verificationDocumentType}</span>
                            <span className="font-mono text-xs">{user.verificationDocumentId}</span>
                         </div>
                      ) : <span className="text-slate-400 text-xs italic">Not Provided</span>}
                    </td>
                    <td className="px-4 py-4">
                      {!user.isActive ? (
                         <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600"><Ban size={12}/> Banned</span>
                      ) : !user.isVerified ? (
                         <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600"><ShieldAlert size={12}/> Pending</span>
                      ) : (
                         <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600"><CheckCircle size={12}/> Verified</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setSelectedUser(user)} title="View User Details" className="p-2 border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors">
                          <Eye size={16} />
                        </button>
                        {user.role !== 'admin' && !user.isVerified && (
                          <button onClick={() => approveUser(user.id)} title="Verify User" className="p-2 border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-colors">
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                        {user.role !== 'admin' && (
                          <button onClick={() => toggleUserBan(user.id)} title={user.isActive ? 'Ban User' : 'Unban User'} className={`p-2 border rounded-xl transition-colors ${user.isActive ? 'border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100' : 'border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}>
                            <Ban size={16} />
                          </button>
                        )}
                        {user.role !== 'admin' && (
                          <button onClick={() => triggerDeleteUser(user.id)} title="Delete User" className="p-2 border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                   <tr>
                      <td colSpan="6" className="text-center py-8 text-slate-500">No users found.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-950">User Details</h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</div>
                  <div className="mt-1 font-medium text-slate-900">{selectedUser.name}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Role</div>
                  <div className="mt-1 font-medium text-slate-900 uppercase">{selectedUser.role}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</div>
                  <div className="mt-1 font-medium text-slate-900">{selectedUser.email}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number</div>
                  <div className="mt-1 font-medium text-slate-900">{selectedUser.phoneNumber || 'Not provided'}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">City / Location</div>
                  <div className="mt-1 font-medium text-slate-900">{selectedUser.city || 'Not provided'}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Date of Birth</div>
                  <div className="mt-1 font-medium text-slate-900">{selectedUser.dateOfBirth || 'Not provided'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Biography / Bio</div>
                  <div className="mt-1 text-sm text-slate-700">{selectedUser.bio || 'No biography written.'}</div>
                </div>
                <div className="col-span-2 mt-4 pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-4">Verification Documents</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Document Type</div>
                      <div className="font-semibold text-slate-900">{selectedUser.verificationDocumentType || 'Pending'}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Document ID</div>
                      <div className="font-mono font-medium text-slate-900">{selectedUser.verificationDocumentId || 'Not provided'}</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Current Status</div>
                    <div className="mt-1">
                      {!selectedUser.isActive ? (
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-rose-600"><Ban size={14}/> Account Banned</span>
                      ) : !selectedUser.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-600"><ShieldAlert size={14}/> Pending Approval</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600"><CheckCircle size={14}/> Fully Verified</span>
                      )}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Registration Date</div>
                    <div className="font-medium text-slate-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end">
              <Button onClick={() => setSelectedUser(null)} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
