import React, { useState } from 'react';
import { FileBadge } from 'lucide-react';
import CertificateModal from '../modals/CertificateModal';

const CertificatesPage = ({ certificates, fetchCertificates }) => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  return (
    <div className="space-y-6">
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Certificates</div>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Completion records</h2>
        </div>
        <button onClick={fetchCertificates} className="text-sm font-semibold text-blue-600">Refresh</button>
      </div>
    </section>

    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        {(certificates || []).length > 0 ? (
          certificates.map((certificate) => (
            <button
              key={certificate.id}
              onClick={() => setSelectedCertificate(certificate)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 p-4 hover:bg-slate-50 text-left transition-colors"
            >
              <div>
                <div className="font-semibold text-slate-950">{certificate.subject_name}</div>
                <div className="mt-1 text-xs text-slate-500">{certificate.certificate_number}</div>
              </div>
              <FileBadge size={18} className="text-blue-600" />
            </button>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 px-6 py-16 text-center text-sm text-slate-500">
            No certificates available yet.
          </div>
        )}
      </div>
    </section>
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
};

export default CertificatesPage;
