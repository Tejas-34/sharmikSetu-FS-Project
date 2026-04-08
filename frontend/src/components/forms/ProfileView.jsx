import React, { useState } from 'react';
import { CalendarPlus2, FileBadge, MapPinned, Settings, ShieldCheck, UserRound } from 'lucide-react';

import Button from '../ui/Button';
import Input from '../ui/Input';

const ProfileView = ({
  currentUser,
  updateUserProfile,
  navigate,
  taskHistory,
  certificates,
  calendarEntries,
  createCalendarEntry,
}) => {
  const isWorker = currentUser.role === 'worker';
  const [formData, setFormData] = useState({
    full_name: currentUser.name,
    email: currentUser.email,
    city: currentUser.city || '',
    phone_number: currentUser.phoneNumber || '',
    bio: currentUser.bio || '',
    latitude: currentUser.latitude || '',
    longitude: currentUser.longitude || '',
    verification_document_type: currentUser.verificationDocumentType || 'aadhar',
    verification_document_id: currentUser.verificationDocumentId || '',
  });
  const [calendarForm, setCalendarForm] = useState({
    title: '',
    start_date: '',
    end_date: '',
    is_blocked: false,
    notes: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    updateUserProfile({
      full_name: formData.full_name,
      city: formData.city,
      phone_number: formData.phone_number,
      bio: formData.bio,
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
      verification_document_type: formData.verification_document_type,
      verification_document_id: formData.verification_document_id,
    });
  };

  const handleCalendarSubmit = (event) => {
    event.preventDefault();
    createCalendarEntry(calendarForm);
    setCalendarForm({
      title: '',
      start_date: '',
      end_date: '',
      is_blocked: false,
      notes: '',
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Profile workspace</div>
            <h2 className="mt-2 flex items-center gap-2 text-2xl font-bold text-slate-950">
              <Settings className="text-slate-700" />
              Profile settings
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Maintain your identity, availability, verification, and location details from one structured settings screen.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={() => navigate('/app/dashboard')}>Back</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <div className="mb-4 text-sm font-semibold text-slate-950">Basic information</div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input label="Full Name" value={formData.full_name} onChange={(event) => setFormData({ ...formData, full_name: event.target.value })} required />
              </div>
              <div className="md:col-span-2">
                <Input label="Email" type="email" value={formData.email} readOnly />
              </div>
              <Input label="City" value={formData.city} onChange={(event) => setFormData({ ...formData, city: event.target.value })} />
              <Input label="Phone Number" value={formData.phone_number} onChange={(event) => setFormData({ ...formData, phone_number: event.target.value })} />
            </div>
          </section>

          <section>
            <div className="mb-4 text-sm font-semibold text-slate-950">Professional details</div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(event) => setFormData({ ...formData, bio: event.target.value })}
                  className="mt-2 w-full rounded-[1.4rem] border border-slate-200 bg-white p-4 text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Latitude" type="number" value={formData.latitude} onChange={(event) => setFormData({ ...formData, latitude: event.target.value })} />
                <Input label="Longitude" type="number" value={formData.longitude} onChange={(event) => setFormData({ ...formData, longitude: event.target.value })} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Verification Type" value={formData.verification_document_type} onChange={(event) => setFormData({ ...formData, verification_document_type: event.target.value })} />
                <Input label="Verification ID" value={formData.verification_document_id} onChange={(event) => setFormData({ ...formData, verification_document_id: event.target.value })} />
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <Button type="submit" className="min-w-[220px]">Save changes</Button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950">Account summary</h3>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 font-semibold text-slate-950">
                <UserRound size={16} className="text-slate-700" />
                Current role
              </div>
              <div className="mt-2 capitalize">{currentUser.role}</div>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck size={16} />
                Verification status
              </div>
              <div className="mt-2">{currentUser.isVerified ? 'Verified' : 'Pending admin verification'}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Certificates</div>
              <div className="mt-2 text-slate-900">{(certificates || []).length} available</div>
            </div>
          </div>
        </section>

        {isWorker && (
          <>
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-950">
                <CalendarPlus2 size={18} className="text-emerald-600" />
                Availability planning
              </h3>
              <form onSubmit={handleCalendarSubmit} className="space-y-4">
                <Input label="Title" value={calendarForm.title} onChange={(event) => setCalendarForm({ ...calendarForm, title: event.target.value })} required />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Start Date" type="date" value={calendarForm.start_date} onChange={(event) => setCalendarForm({ ...calendarForm, start_date: event.target.value })} required />
                  <Input label="End Date" type="date" value={calendarForm.end_date} onChange={(event) => setCalendarForm({ ...calendarForm, end_date: event.target.value })} required />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Entry Type</label>
                  <select
                    value={calendarForm.is_blocked ? 'blocked' : 'available'}
                    onChange={(event) => setCalendarForm({ ...calendarForm, is_blocked: event.target.value === 'blocked' })}
                    className="mt-2 w-full rounded-[1.4rem] border border-slate-200 bg-white p-4 text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="available text-emerald-600">Available (Shows to Employers)</option>
                    <option value="blocked text-rose-600">Busy / Blocked (Private)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Notes</label>
                  <textarea
                    value={calendarForm.notes}
                    onChange={(event) => setCalendarForm({ ...calendarForm, notes: event.target.value })}
                    className="mt-2 w-full rounded-[1.4rem] border border-slate-200 bg-white p-4 text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full">Add calendar block</Button>
              </form>

              <div className="mt-5 space-y-2">
                {(calendarEntries || []).slice(0, 4).map((entry) => (
                  <div key={entry.id} className={`rounded-2xl border p-4 text-sm ${entry.is_blocked ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-950">{entry.title}</div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${entry.is_blocked ? 'bg-amber-200 text-amber-800' : 'bg-emerald-200 text-emerald-800'}`}>
                        {entry.is_blocked ? 'Busy' : 'Available'}
                      </span>
                    </div>
                    <div className="text-slate-600">{entry.start_date} to {entry.end_date}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-slate-950">Task history</h3>
              <div className="space-y-3">
                {[...(taskHistory?.ongoing || []), ...(taskHistory?.completed || [])].slice(0, 4).map((application) => (
                  <div key={application.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="font-semibold text-slate-950">{application.job.title}</div>
                    <div className="mt-1 text-sm text-slate-500">
                      {application.job.site_city || application.job.employer?.city || 'Location pending'}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-950">
            <FileBadge size={18} className="text-blue-600" />
            Certificates
          </h3>
          <div className="space-y-3">
            {(certificates || []).slice(0, 4).map((certificate) => (
              <a
                key={certificate.id}
                href={`http://localhost:8000${certificate.download_path}`}
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl border border-slate-200 p-4 hover:bg-slate-50"
              >
                <div className="font-semibold text-slate-950">{certificate.subject_name}</div>
                <div className="text-xs text-slate-500">{certificate.certificate_number}</div>
              </a>
            ))}
          </div>
        </section>

        {(formData.latitude || formData.longitude) && (
          <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center gap-2 px-3 pt-3 text-lg font-bold text-slate-950">
              <MapPinned size={18} className="text-blue-600" />
              Profile location
            </div>
            <iframe
              title="Profile location"
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${formData.latitude},${formData.longitude}`)}&output=embed`}
              className="h-56 w-full rounded-[1.4rem]"
              loading="lazy"
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
