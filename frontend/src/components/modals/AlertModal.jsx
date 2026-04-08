import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

// --- COMPONENT: ALERT MODAL (For Blocking Errors) ---
const AlertModal = ({ isOpen, title, message, onClose, btnText }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-red-100 rounded-xl shadow-2xl max-w-md w-full p-8 transform scale-100 animate-in zoom-in-95 duration-200 relative overflow-hidden">
        {/* Decorative BG */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-red-50 rounded-full blur-2xl" />
        
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600 border border-red-200">
            <AlertTriangle size={40} />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 mb-8 text-base leading-relaxed">{message}</p>
          
          <Button onClick={onClose} className="w-full bg-red-600 hover:bg-red-700 text-white border-none py-3 text-lg shadow-lg shadow-red-200">
            {btnText || "Okay"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
