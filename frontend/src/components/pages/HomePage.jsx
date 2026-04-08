import React from 'react';
import { ArrowRight, BriefcaseBusiness, HardHat, ShieldCheck, Users, PlayCircle, Star } from 'lucide-react';

import Button from '../ui/Button';

const HomePage = ({ navigate, t }) => (
  <div className="bg-slate-50 min-h-screen font-sans selection:bg-amber-300 selection:text-amber-900 overflow-hidden">
    {/* Dynamic Background Elements */}
    <div className="absolute top-0 -left-1/4 w-full h-full bg-gradient-to-br from-amber-50/50 via-white to-slate-100/50 -z-10 pointer-events-none" />
    <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-amber-200/20 rounded-full blur-[120px] -z-10 pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
    <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-200/20 rounded-full blur-[100px] -z-10 pointer-events-none transform -translate-x-1/4 translate-y-1/4" />

    {/* Hero Section */}
    <section className="relative px-4 pt-24 pb-20 lg:pt-32 lg:pb-28 max-w-7xl mx-auto backdrop-blur-sm">
      <div className="container mx-auto grid gap-16 lg:grid-cols-2 lg:items-center relative z-10">
        
        {/* Left Content */}
        <div className="flex flex-col items-start gap-1 relative z-30">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-md px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-amber-700 shadow-sm ring-1 ring-inset ring-amber-500/20 hover:scale-105 hover:bg-white transition-all duration-300 cursor-default">
            <HardHat size={16} className="text-amber-500" />
            <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">The ShramikSetu Platform</span>
          </div>
          

          <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-slate-900 md:text-6xl lg:text-[4.5rem] lg:leading-[1.05]">
            ShramikSetu  <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-400 lg:text-[3.5rem]"> ~ ⁠सेतु रोज़गार का !</span>
          </h1>
          
          <p className="mt-2 max-w-lg text-lg leading-relaxed text-slate-600 font-medium">
            ShramikSetu seamlessly connects workers, employers, and administrators through a stunning public site and a powerful application dashboard.
          </p>
          
          <div className="mt-6 flex flex-col w-full sm:flex-row gap-4">
            <Button onClick={() => navigate('/login')} className="min-w-[190px] h-14 text-base font-semibold shadow-lg shadow-amber-500/30 hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 rounded-2xl group flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 border-none">
              {t('btnFindJob')}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-white" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/tutorial')} className="min-w-[180px] h-14 text-base font-semibold shadow-sm hover:scale-105 hover:-translate-y-1 hover:shadow-md hover:bg-slate-50 border-2 border-slate-200 text-slate-700 transition-all duration-300 rounded-2xl flex items-center justify-center gap-2 bg-white">
              <PlayCircle size={20} className="text-slate-500" />
              View Tutorial
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-8 flex items-center gap-4 text-sm font-medium text-slate-500 bg-white/50 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex -space-x-3">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}&backgroundColor=f1f5f9`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center text-amber-400 gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider mt-0.5">Trusted by 10k+ workers</span>
            </div>
          </div>
        </div>

        {/* Right Content - Hero Image */}
        <div className="relative z-10 w-full max-w-2xl mx-auto lg:mx-0 group">
          {/* Decorative shapes behind image */}
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-orange-300 rounded-[2.5rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 ease-in-out"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[105%] h-[105%] bg-white rounded-[3rem] shadow-xl rotate-3"></div>
          
          <div className="relative h-[400px] lg:h-[550px] w-full rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-slate-100 transform group-hover:-translate-y-2 transition-transform duration-500 ease-out z-10">
            <img 
              src="/images/hero_workers.png" 
              alt="Indian construction workers on site with smartphone" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Floating glass badge on image */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/20 shadow-xl flex items-center gap-4 text-white group-hover:bg-slate-900/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-inner shrink-0">
                <BriefcaseBusiness size={24} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-amber-200 uppercase tracking-widest mb-1">New Opportunities</p>
                <p className="text-lg font-bold leading-tight">2,500+ Active Roles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Features glassmorphism section */}
    <section className="relative -mt-8 lg:-mt-16 z-20 container mx-auto px-4 pb-20">
      <div className="rounded-[2.5rem] border border-slate-200/50 bg-slate-900/95 backdrop-blur-2xl p-6 lg:p-10 text-white shadow-[0_32px_64px_rgba(15,23,42,0.2)]">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white/5 p-8 border border-white/10 hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:bg-amber-500/30 group-hover:scale-110 transition-all">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Worker experience</h3>
            <p className="text-sm leading-relaxed text-slate-300">Search jobs, track accepted work, manage availability, and securely download your generated certificates directly from the app.</p>
          </div>
          
          <div className="rounded-[2rem] bg-white/5 p-8 border border-white/10 hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-500/30 group-hover:scale-110 transition-all">
              <BriefcaseBusiness size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Employer workspace</h3>
            <p className="text-sm leading-relaxed text-slate-300">Post jobs, review applicant profiles, and efficiently manage bulk hiring inside a separate and isolated operations dashboard.</p>
          </div>
          
          <div className="rounded-[2rem] bg-white/5 p-8 border border-white/10 hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500/30 group-hover:scale-110 transition-all">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Admin control</h3>
            <p className="text-sm leading-relaxed text-slate-300">Oversee all users, manage job volume, and maintain platform safety from a dedicated, secure application shell exclusively for owners.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Stats Section */}
    <section className="container mx-auto px-4 pb-24 relative z-10">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-amber-600 transition-colors">Total Jobs</div>
          <div className="mt-4 text-4xl font-black text-slate-900 group-hover:text-amber-500 transition-colors">{t ? t('statJobs') : '2,500+'}</div>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 font-medium whitespace-pre-line group-hover:text-slate-700 transition-colors">Active job opportunities across high-demand field roles.</p>
        </div>
        
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-amber-600 transition-colors">Strong Network</div>
          <div className="mt-4 text-4xl font-black text-slate-900 group-hover:text-amber-500 transition-colors">{t ? t('statWorkers') : '10K+'}</div>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 font-medium whitespace-pre-line group-hover:text-slate-700 transition-colors">Workers connected through a faster and clearer hiring workflow.</p>
        </div>
        
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-amber-600 transition-colors">Success Rate</div>
          <div className="mt-4 text-4xl font-black text-slate-900 group-hover:text-amber-500 transition-colors">{t ? t('statFillRate') : '98%'}</div>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 font-medium whitespace-pre-line group-hover:text-slate-700 transition-colors">A product focused on actual workforce operations, not brochure screens.</p>
        </div>
      </div>
    </section>
  </div>
);

export default HomePage;

