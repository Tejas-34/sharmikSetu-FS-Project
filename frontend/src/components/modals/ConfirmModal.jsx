import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

// --- COMPONENT: CONFIRM MODAL ---
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText, cancelText }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl max-w-sm w-full p-6 transform scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-red-600 mb-3">
          <AlertCircle size={28} />
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>{cancelText || "Cancel"}</Button>
          <Button variant="danger" onClick={onConfirm}>{confirmText || "Confirm"}</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
