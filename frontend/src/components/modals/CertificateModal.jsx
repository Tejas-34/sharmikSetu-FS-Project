import React from 'react';
import { X, Download } from 'lucide-react';

const CertificateModal = ({ certificate, onClose }) => {
  if (!certificate) return null;

  const formattedDate = new Date(certificate.issued_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <style>{`
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .cert-backdrop {
            position: static !important;
            background: white !important;
            backdrop-filter: none !important;
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .cert-no-print {
            display: none !important;
          }
          .cert-frame {
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            margin: 0 !important;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          @page {
            size: landscape A4;
            margin: 0;
          }
        }
      `}</style>

      {/* Modal Backdrop */}
      <div
        className="cert-backdrop fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Floating Action Bar */}
        <div className="cert-no-print absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-md hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <Download size={16} />
            Save as PDF
          </button>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-400 shadow-md hover:text-rose-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Certificate Frame */}
        <div className="cert-frame relative flex h-[90vh] max-h-[660px] w-full max-w-[960px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

          {/* Top Gold Band */}
          <div className="h-3 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg,#f59e0b,#fde68a,#f59e0b)' }} />

          <div className="flex flex-1 overflow-hidden">
            {/* Left Blue Bar */}
            <div className="w-3 flex-shrink-0" style={{ background: 'linear-gradient(180deg,#1e3a8a,#1d4ed8)' }} />

            {/* Body */}
            <div className="relative flex flex-1 flex-col items-center justify-evenly overflow-hidden px-10 py-6 text-center">

              {/* Watermark */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none opacity-[0.035]">
                <span className="font-black text-slate-800" style={{ fontSize: '220px', letterSpacing: '0.1em', transform: 'rotate(-20deg)' }}>SS</span>
              </div>

              {/* Header */}
              <div className="relative flex flex-col items-center gap-1.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md" style={{ background: '#1d4ed8' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                </div>
                <p className="text-[10px] font-black uppercase text-blue-700" style={{ letterSpacing: '0.35em' }}>ShramikSetu</p>
                <p className="text-[9px] font-semibold uppercase text-slate-400" style={{ letterSpacing: '0.2em' }}>Official Certificate of Recognition</p>
              </div>

              {/* Ornamental Divider */}
              <div className="flex w-48 items-center gap-3">
                <div className="h-px flex-1" style={{ background: '#f59e0b' }} />
                <div className="h-2 w-2 rotate-45" style={{ background: '#f59e0b' }} />
                <div className="h-px flex-1" style={{ background: '#f59e0b' }} />
              </div>

              {/* Main Title */}
              <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '2.4rem', fontWeight: 400, color: '#0f172a', lineHeight: 1.2 }}>
                Certificate of Completion
              </h1>

              {/* Recipient Block */}
              <div>
                <p className="text-[11px] font-bold uppercase text-blue-600" style={{ letterSpacing: '0.28em' }}>This is proudly presented to</p>
                <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.75rem', fontStyle: 'italic', fontWeight: 700, color: '#1e293b', marginTop: '0.35rem', marginBottom: '0.35rem' }}>
                  {certificate.recipient?.full_name || certificate.recipient?.name || 'Recipient'}
                </h2>
                <div style={{ height: '1px', background: '#e2e8f0', maxWidth: '280px', margin: '0 auto' }} />
              </div>

              {/* Body Text */}
              <p style={{ fontSize: '0.875rem', color: '#475569', maxWidth: '500px', lineHeight: '1.7' }}>
                For successfully fulfilling their obligations and completing the required engagement as an{' '}
                <strong style={{ color: '#1e293b' }}>{certificate.issued_to_role}</strong>.
              </p>

              {/* Job Info */}
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '14px 28px', minWidth: '320px' }}>
                <p className="text-[9px] font-bold uppercase text-amber-600" style={{ letterSpacing: '0.3em', marginBottom: '4px' }}>Project Assignment</p>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>{certificate.job?.title}</p>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  Employer: <span style={{ fontWeight: 600, color: '#334155' }}>{certificate.job?.employer?.full_name || 'N/A'}</span>
                </p>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', width: '100%', maxWidth: '560px', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ borderBottom: '2px solid #334155', paddingBottom: '4px', fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1e293b', paddingLeft: '16px', paddingRight: '16px' }}>{formattedDate}</p>
                  <p className="text-[9px] font-bold uppercase text-slate-400" style={{ marginTop: '4px', letterSpacing: '0.22em' }}>Date of Award</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '56px', width: '56px', borderRadius: '50%', border: '3px solid #fbbf24', background: 'white' }}>
                  <span style={{ fontSize: '9px', fontWeight: 900, color: '#f59e0b', letterSpacing: '0.1em' }}>SEAL</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ borderBottom: '2px solid #334155', paddingBottom: '4px', fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1e293b', paddingLeft: '16px', paddingRight: '16px' }}>{certificate.certificate_number}</p>
                  <p className="text-[9px] font-bold uppercase text-slate-400" style={{ marginTop: '4px', letterSpacing: '0.22em' }}>Registry Number</p>
                </div>
              </div>

            </div>

            {/* Right Amber Bar */}
            <div className="w-3 flex-shrink-0" style={{ background: 'linear-gradient(180deg,#f59e0b,#d97706)' }} />
          </div>

          {/* Bottom Blue Band */}
          <div className="h-3 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg,#1e3a8a,#1d4ed8,#1e3a8a)' }} />
        </div>
      </div>
    </>
  );
};

export default CertificateModal;
