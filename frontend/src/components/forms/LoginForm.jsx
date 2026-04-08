import React, { useState } from 'react';
import { Building2, ChevronRight, HardHat, KeyRound, User } from 'lucide-react';

import Button from '../ui/Button';
import Input from '../ui/Input';

const LoginForm = ({ login, register, loginWithPasskey, registerWithPasskey, t }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    password2: '',
    role: 'worker',
    city: '',
    phone_number: '',
    verification_document_type: 'Aadhaar',
    verification_document_id: '',
    date_of_birth: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLogin) {
      login(formData.email, formData.password);
    } else {
      register(formData);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/google?mode=redirect`;
  };

  const handlePasskeySubmit = async () => {
    if (passkeyLoading) return;
    setPasskeyLoading(true);
    try {
      if (isLogin) {
        await loginWithPasskey(formData.email);
      } else {
        await registerWithPasskey(formData);
      }
    } finally {
      setPasskeyLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-2 w-full animate-in fade-in zoom-in-95 duration-500">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 shadow-2xl shadow-slate-300/50 lg:grid-cols-[1.1fr_0.9fr] bg-white relative">
        
        {/* Left Side: Image with Dark Overlay */}
        <div className="hidden lg:flex relative overflow-hidden p-6 lg:p-8 min-h-[300px] flex-col justify-end group border-r border-slate-200">
          <div className="absolute inset-0 z-0">
            <img src="/images/login_hero.png" alt="Construction Worker Portrait" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent backdrop-blur-[1px]" />
          </div>
          
          <div className="relative z-10 mt-auto border-l-4 border-amber-500 pl-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300 shadow-xl mb-3">
              <HardHat size={12} />
              ShramikSetu
            </div>
            <h2 className="text-3xl font-black uppercase leading-[1.1] text-white tracking-tight drop-shadow-md">
              {isLogin ? 'Welcome Back.' : 'Start Building.'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300 font-medium font-sans drop-shadow-sm">
              Connecting skilled field workers with trusted site operators across the country.
            </p>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="bg-slate-50/50 p-6 lg:p-8 relative z-10 backdrop-blur-xl flex flex-col justify-center">
          <div className="mb-6 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-600 mb-1 block">
              {isLogin ? t('loginTitle') : t('joinTitle')}
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{isLogin ? 'Access your dashboard' : 'Create an account'}</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full flex justify-center items-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all h-10 rounded-xl shadow-sm text-sm font-semibold"
              onClick={handleGoogleLogin}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                <path fill="#FFC107" d="M43.6 20H42V20H24v8h11.3C34.7 32.8 31 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 2.9l6-6C34.6 7.6 29.6 5 24 5 13.5 5 5 13.5 5 24s8.5 19 19 19c11 0 19-8.5 19-19 0-1.3-.1-2.6-.4-4z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.6 18.9 13 24 13c3.1 0 5.9 1.1 8 2.9l6-6C34.6 7.6 29.6 5 24 5 16.3 5 9.7 9.5 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 43c5.6 0 10.6-2.6 14-6.6l-6.6-4.8c-2 1.5-4.6 2.4-7.4 2.4-6.6 0-12-5.4-12-12 0-1.3.2-2.5.6-3.7l-6.6-4.8C5.4 18 5 20.9 5 24c0 10.5 8.5 19 19 19z"/>
                <path fill="#1976D2" d="M43.6 20H42V20H24v8h11.3c-.8 2.7-2.6 4.9-5 6.3l6.6 4.8C40.6 35.5 44 30.2 44 24c0-1.3-.1-2.6-.4-4z"/>
              </svg>
              {isLogin ? 'Continue with Google' : 'Sign up with Google'}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full flex justify-center items-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all h-10 rounded-xl shadow-sm text-sm font-semibold"
              onClick={handlePasskeySubmit}
              disabled={passkeyLoading}
            >
              <KeyRound size={16} />
              {passkeyLoading
                ? 'Opening passkey prompt...'
                : (isLogin ? 'Continue with Passkey' : 'Sign up with Passkey')}
            </Button>

            <div className="py-1 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-slate-200 after:mt-0.5 after:flex-1 after:border-t after:border-slate-200">
              <span className="mx-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">or use email</span>
            </div>

            <div className={`grid gap-3 ${!isLogin ? 'md:grid-cols-2' : ''}`}>
              {!isLogin && (
                <Input
                  label={t('labelName')}
                  value={formData.full_name}
                  onChange={(event) => setFormData({ ...formData, full_name: event.target.value })}
                  required
                  placeholder="e.g. John Doe"
                />
              )}
              <Input
                label={t('labelEmail')}
                type="email"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                required
                placeholder="name@example.com"
              />
            </div>

            {!isLogin && (
              <div className="grid gap-3 grid-cols-2">
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(event) => setFormData({ ...formData, city: event.target.value })}
                  placeholder="e.g. Mumbai"
                />
                <Input
                  label="Phone"
                  value={formData.phone_number}
                  onChange={(event) => setFormData({ ...formData, phone_number: event.target.value })}
                  placeholder="10-digit mobile"
                  maxLength={10}
                  pattern="\d{10}"
                  title="Phone number must be exactly 10 digits"
                />
              </div>
            )}

            {!isLogin && (
              <div className="grid gap-3 grid-cols-2">
                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(event) => setFormData({ ...formData, date_of_birth: event.target.value })}
                  required
                />
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 ml-1">Doc Type</label>
                  <select
                    className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all hover:border-slate-300 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
                    value={formData.verification_document_type}
                    onChange={(event) => setFormData({ ...formData, verification_document_type: event.target.value, verification_document_id: '' })}
                  >
                    <option value="Aadhaar">Aadhaar (12 digits)</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Voter ID">Voter ID</option>
                  </select>
                </div>
              </div>
            )}
            
            {!isLogin && (
              <div className="w-full">
                <Input
                  label={`${formData.verification_document_type} Number`}
                  value={formData.verification_document_id}
                  onChange={(event) => {
                    let val = event.target.value;
                    if (formData.verification_document_type === 'Aadhaar') {
                      val = val.replace(/\D/g, '').slice(0, 12);
                    } else if (formData.verification_document_type === 'PAN Card') {
                      val = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
                    } else if (formData.verification_document_type === 'Voter ID') {
                      val = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
                    }
                    setFormData({ ...formData, verification_document_id: val });
                  }}
                  placeholder={`Enter ${formData.verification_document_type}`}
                  required
                />
              </div>
            )}

            <div className={`grid gap-3 ${!isLogin ? 'md:grid-cols-2' : ''}`}>
              <Input
                label={t('labelPassword')}
                type="password"
                value={formData.password}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                required
                placeholder="••••••••"
              />
              {!isLogin && (
                <Input
                  label="Confirm"
                  type="password"
                  value={formData.password2}
                  onChange={(event) => setFormData({ ...formData, password2: event.target.value })}
                  required
                  placeholder="••••••••"
                />
              )}
            </div>

            {!isLogin && (
              <div className="pt-1 pb-1">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Account Type</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'worker' })}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl border p-2.5 transition-all text-sm font-bold ${
                      formData.role === 'worker'
                        ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-amber-200 hover:bg-slate-50'
                    }`}
                  >
                    <User size={16} /> Worker
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'employer' })}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl border p-2.5 transition-all text-sm font-bold ${
                      formData.role === 'employer'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 size={16} /> Employer
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" className="w-full h-10 text-sm font-semibold rounded-xl shadow bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-amber-500/30 transition-all border-none text-white">
                {isLogin ? t('btnLogin') : t('btnCreateAccount')}
              </Button>
            </div>
          </form>

          <div className="mt-4 pt-4 text-center border-t border-slate-200">
            <p className="text-xs font-medium text-slate-500 inline-block mr-2">{isLogin ? 'New to ShramikSetu?' : 'Already have an account?'}</p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 transition-colors hover:text-amber-600"
            >
              {isLogin ? t('toggleSignup') : t('toggleLogin')}
              <ChevronRight size={14} />
            </button>
          </div>

          {/* {isLogin && (
            <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-white/50 p-3 flex flex-col items-center">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Test Accounts</div>
              <div className="flex flex-wrap justify-center gap-2">
                <button onClick={() => setFormData({ ...formData, email: 'john@work.com', password: '12345678' })} className="rounded-md bg-white border border-slate-200 px-3 py-1 text-[10px] font-bold text-slate-600 hover:text-amber-600 hover:shadow-sm">Worker</button>
                <button onClick={() => setFormData({ ...formData, email: 'boss@build.com', password: '12345678' })} className="rounded-md bg-white border border-slate-200 px-3 py-1 text-[10px] font-bold text-slate-600 hover:text-indigo-600 hover:shadow-sm">Employer</button>
                <button onClick={() => setFormData({ ...formData, email: 'admin@site.com', password: '12345678' })} className="rounded-md bg-white border border-slate-200 px-3 py-1 text-[10px] font-bold text-slate-600 hover:text-rose-600 hover:shadow-sm">Admin</button>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
