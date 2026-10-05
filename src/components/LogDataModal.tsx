import React, { useState } from 'react';
import { X, PlusCircle, LineChart } from 'lucide-react';
import { useDwm } from '../context/DwmContext';

interface LogDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogDataModal: React.FC<LogDataModalProps> = ({ isOpen, onClose }) => {
  const { kpis, selectedKpiId, setSelectedKpiId, addControlDataPoint } = useDwm();

  const [metricId, setMetricId] = useState(selectedKpiId || kpis[0]?.id);
  const [shift, setShift] = useState('Shift A');
  const [value, setValue] = useState('');
  const [sampleSize, setSampleSize] = useState('15');
  const [auditor, setAuditor] = useState('M. Balaji');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const currentKpi = kpis.find((k) => k.id === metricId) || kpis[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(value);
    if (isNaN(num)) return;

    addControlDataPoint(metricId, {
      value: Number(num.toFixed(2)),
      shift,
      sampleSize: parseInt(sampleSize, 10) || 15,
      auditor,
      notes: notes.trim() || undefined,
    });

    setValue('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-lg border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LineChart className="w-4 h-4 text-blue-900" />
            <h3 className="text-sm font-bold text-slate-900">
              Record Control Graph Audit Sample
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Select Billing Metric
            </label>
            <select
              value={metricId}
              onChange={(e) => {
                setMetricId(e.target.value);
                setSelectedKpiId(e.target.value);
              }}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
            >
              {kpis.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.title} ({k.unit})
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Target Standard: <strong>{currentKpi.target} {currentKpi.unit}</strong> · {currentKpi.department}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Audit Shift
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-md"
              >
                <option value="Shift A">Shift A (Morning)</option>
                <option value="Shift B">Shift B (Evening)</option>
                <option value="Shift C">Shift C (Night)</option>
                <option value="General">General Shift</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Sample Value ({currentKpi.unit})
              </label>
              <input
                type="number"
                step="0.01"
                placeholder={`e.g. ${currentKpi.target}`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-md font-mono"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Subgroup Sample Size
              </label>
              <input
                type="number"
                value={sampleSize}
                onChange={(e) => setSampleSize(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-md font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Auditing Officer
              </label>
              <input
                type="text"
                value={auditor}
                onChange={(e) => setAuditor(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Shift Observations / Root Causes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Ward discharge summary backlog..."
              rows={2}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-md"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium text-white bg-blue-900 hover:bg-blue-800 rounded-md transition-colors"
            >
              Log Sample &amp; Update Graph
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
