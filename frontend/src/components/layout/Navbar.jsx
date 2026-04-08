import React from 'react';
import { BookOpen, HardHat } from 'lucide-react';

import Button from '../ui/Button';

const Navbar = ({ currentPath, navigate, t }) => {
  const navLinkClass = (target) => `rounded-full px-4 py-2 text-sm font-medium transition ${
    currentPath === target ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
  }`;

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-18 items-center justify-between px-4 py-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-3">
          <div className="rounded-2xl bg-amber-400 p-2.5 text-slate-950">
            <HardHat size={20} />
          </div>
          <div className="text-left">
            <div className="text-lg font-black uppercase tracking-[0.14em] text-slate-950">Shramik Setu</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500"></div>
          </div>
        </button>

        <div className="hidden items-center gap-2 md:flex">
          <button onClick={() => navigate('/')} className={navLinkClass('/')}>{t('navHome')}</button>
          <button onClick={() => navigate('/about')} className={navLinkClass('/about')}>{t('navAbout')}</button>
          <button onClick={() => navigate('/tutorial')} className={`${navLinkClass('/tutorial')} inline-flex items-center gap-2`}>
            <BookOpen size={15} />
            Tutorial
          </button>
        </div>

        <Button onClick={() => navigate('/login')} className="min-w-[120px]">
          {t('navLogin')}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
