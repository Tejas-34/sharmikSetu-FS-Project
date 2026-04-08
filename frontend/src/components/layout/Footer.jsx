import React from 'react';

const Footer = ({ navigate, t }) => (
  <footer className="border-t border-slate-200 bg-white relative overflow-hidden">
    <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl -z-10 transform translate-y-1/2" />
    <div className="container mx-auto flex flex-col gap-6 px-4 py-12 text-sm text-slate-500 md:flex-row md:items-center md:justify-between relative z-10">
      <div className="flex flex-col gap-2">
        <span className="font-bold text-slate-800 text-lg tracking-tight flex items-center gap-2">
          <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">ShramikSetu</span>
        </span>
        <p className="font-medium text-slate-500">© 2026 ShramikSetu. Reliable hiring for crews and site operators.</p>
        <p className="text-xs text-slate-400 font-medium">Made By Tejas, Isha & Kartavya.</p>
      </div>
      <div className="flex flex-wrap gap-8 font-semibold">
        <button onClick={() => navigate('/')} className="hover:text-amber-600 hover:-translate-y-0.5 transition-all">{t('navHome')}</button>
        <button onClick={() => navigate('/about')} className="hover:text-amber-600 hover:-translate-y-0.5 transition-all">{t('navAbout')}</button>
        <button onClick={() => navigate('/tutorial')} className="hover:text-amber-600 hover:-translate-y-0.5 transition-all">Tutorial</button>
        <button onClick={() => navigate('/login')} className="hover:text-amber-600 hover:-translate-y-0.5 transition-all">{t('navLogin')}</button>
      </div>
    </div>
  </footer>
);

export default Footer;
