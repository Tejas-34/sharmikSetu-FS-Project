import React from 'react';
import { Scale, BookOpen } from 'lucide-react';
import Button from '../ui/Button';

// --- COMPONENT: LAW MODAL (Generic) ---
const LawModal = ({ isOpen, title, items, onConfirm, buttonText, onCancel, disclaimer }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-blue-100 rounded-xl shadow-2xl max-w-lg w-full p-6 transform scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-blue-600 mb-4 border-b border-gray-100 pb-4">
          <Scale size={32} />
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        </div>
        
        <div className="space-y-4 mb-8">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-3">
              <BookOpen size={20} className="text-gray-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        {disclaimer && (
          <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg mb-6 text-xs text-amber-800">
            <strong>Disclaimer:</strong> {disclaimer}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={onConfirm}>{buttonText}</Button>
        </div>
      </div>
    </div>
  );
};

export default LawModal;
