import React from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useDwm } from '../context/DwmContext';

export const ToastNotification: React.FC = () => {
  const { toast } = useDwm();

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border text-xs font-medium ${
        toast.type === 'success'
          ? 'bg-emerald-900 text-white border-emerald-800'
          : toast.type === 'warning'
          ? 'bg-amber-900 text-white border-amber-800'
          : 'bg-slate-900 text-white border-slate-800'
      }`}>
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : toast.type === 'warning' ? (
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        ) : (
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
