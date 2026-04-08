import React from 'react';
import { Hammer, TrendingUp, Award, Shield, Users, CheckCircle, HardHat } from 'lucide-react';

const AboutPage = ({ t }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-50 min-h-screen relative overflow-hidden selection:bg-amber-300 selection:text-amber-900">
    {/* Decorative Backgrounds */}
    <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-amber-200/20 rounded-full blur-[100px] -z-10 transform translate-x-1/3 -translate-y-1/3" />
    
    <div className="bg-slate-900 py-24 text-center border-b border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 z-0"></div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-6 border border-white/10 backdrop-blur-md">
          <HardHat size={14} />
          Our Story
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">{t('aboutTitle')}</h1>
        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">{t('aboutSubtitle')}</p>
      </div>
    </div>

    <div className="container mx-auto px-4 py-20 max-w-5xl relative z-10">
      <div className="flex flex-col md:flex-row gap-16 items-center mb-24">
        <div className="bg-white p-12 rounded-[2.5rem] rotate-2 border border-slate-100 shadow-2xl shadow-amber-500/5 w-full md:w-1/3 flex justify-center hover:rotate-0 hover:scale-105 transition-all duration-500 ease-out">
          <Hammer size={80} className="text-amber-500" />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <TrendingUp size={28} className="text-amber-500" /> {t('missionTitle')}
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6 font-medium text-lg">
            {t('missionDesc1')}
          </p>
          <p className="text-slate-600 leading-relaxed font-medium text-lg">
            {t('missionDesc2')}
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:shadow-amber-500/10 transition-all duration-300 group">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:scale-110 transition-all">
            <Award className="text-amber-600 group-hover:text-white transition-colors" size={32} />
          </div>
          <h3 className="font-bold text-slate-900 text-xl mb-3">{t('valExcellence')}</h3>
          <p className="text-slate-600 leading-relaxed font-medium">{t('valExcellenceDesc')}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:shadow-amber-500/10 transition-all duration-300 group">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:scale-110 transition-all">
            <Shield className="text-amber-600 group-hover:text-white transition-colors" size={32} />
          </div>
          <h3 className="font-bold text-slate-900 text-xl mb-3">{t('valSafety')}</h3>
          <p className="text-slate-600 leading-relaxed font-medium">{t('valSafetyDesc')}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:shadow-amber-500/10 transition-all duration-300 group">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:scale-110 transition-all">
            <Users className="text-amber-600 group-hover:text-white transition-colors" size={32} />
          </div>
          <h3 className="font-bold text-slate-900 text-xl mb-3">{t('valCommunity')}</h3>
          <p className="text-slate-600 leading-relaxed font-medium">{t('valCommunityDesc')}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 md:p-16 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-bl-[100px] -z-10"></div>
        <h2 className="text-3xl font-black text-slate-900 mb-12 text-center">{t('howItWorks')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>

          <div className="md:pr-12 md:text-right group">
            <div className="inline-block bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold px-4 py-1.5 rounded-full mb-6 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">{t('forEmployers')}</div>
            <h3 className="text-slate-900 font-black text-2xl mb-4">{t('employerStep1')}</h3>
            <p className="text-slate-600 leading-relaxed mb-6 font-medium text-lg">{t('employerStep2')}</p>
            <ul className="text-slate-500 font-medium space-y-3 inline-block text-left">
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-amber-500" /> Auto-closing job posts</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-amber-500" /> View applicant profiles</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-amber-500" /> Manage multiple sites</li>
            </ul>
          </div>

          <div className="md:pl-12 group">
            <div className="inline-block bg-slate-900 text-white font-bold px-4 py-1.5 rounded-full mb-6 shadow-md shadow-slate-900/20 group-hover:scale-105 transition-transform">{t('forWorkers')}</div>
            <h3 className="text-slate-900 font-black text-2xl mb-4">{t('workerStep1')}</h3>
            <p className="text-slate-600 leading-relaxed mb-6 font-medium text-lg">{t('workerStep2')}</p>
            <ul className="text-slate-500 font-medium space-y-3">
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-emerald-500" /> Instant job alerts</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-emerald-500" /> Transparent wages</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-emerald-500" /> No agency fees</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AboutPage;
