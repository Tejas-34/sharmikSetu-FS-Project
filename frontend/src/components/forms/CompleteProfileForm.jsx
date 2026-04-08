import React, { useState } from 'react';
import { Building2, User } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const CompleteProfileForm = ({ completeProfile, currentUser }) => {
  const [formData, setFormData] = useState({
    role: 'worker',
    city: '',
    phone_number: '',
    verification_document_type: 'Aadhaar',
    verification_document_id: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    completeProfile(formData);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
        <div className="mb-8 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
            Complete your setup
          </div>
          <h3 className="mt-2 text-3xl font-black text-slate-950">Just a few more details</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Welcome to ShramikSetu, {currentUser?.name || 'User'}! Please select your primary role and verify your details to activate your account.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Choose your main role</label>
            <div className="grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'worker' })}
                className={`rounded-[1.5rem] border p-4 text-left transition-all ${
                  formData.role === 'worker'
                    ? 'border-sky-400 bg-sky-50 shadow-[0_14px_28px_rgba(14,165,233,0.12)]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                  <User size={18} />
                </div>
                <div className="mt-3 text-sm font-bold text-slate-950">Find work</div>
                <div className="mt-1 text-xs text-slate-500">Worker dashboard</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'employer' })}
                className={`rounded-[1.5rem] border p-4 text-left transition-all ${
                  formData.role === 'employer'
                    ? 'border-amber-400 bg-amber-50 shadow-[0_14px_28px_rgba(245,158,11,0.12)]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <Building2 size={18} />
                </div>
                <div className="mt-3 text-sm font-bold text-slate-950">Hire crew</div>
                <div className="mt-1 text-xs text-slate-500">Employer dashboard</div>
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="City"
              value={formData.city}
              onChange={(event) => setFormData({ ...formData, city: event.target.value })}
              placeholder="e.g. Mumbai"
              required
            />
            <Input
              label="Phone Number"
              value={formData.phone_number}
              onChange={(event) => setFormData({ ...formData, phone_number: event.target.value })}
              placeholder="10-digit mobile"
              required
            />
          </div>
          
          <div className="mb-8">
              <Input
               label="Verification ID (Aadhaar Number)"
                value={formData.verification_document_id}
                onChange={(event) => setFormData({ ...formData, verification_document_id: event.target.value })}
                placeholder="12 digit ID"
                required
              />
          </div>

          <Button type="submit" className="w-full">
            Complete Registration
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfileForm;
