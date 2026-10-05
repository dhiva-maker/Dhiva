import React from 'react';
import { 
  Grid2X2, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  Info,
  ExternalLink
} from 'lucide-react';
import { useDwm } from '../context/DwmContext';
import { Kpi } from '../types/dwm';

interface StabilityCapabilityMatrixProps {
  onSelectKpi: (kpiId: string) => void;
}

export const StabilityCapabilityMatrix: React.FC<StabilityCapabilityMatrixProps> = ({ onSelectKpi }) => {
  const { kpis } = useDwm();

  // Classify KPIs into the 4 classic SPC quadrants
  const quad1 = kpis.filter(
    (k) => k.stabilityStatus === 'Stable' && k.cpk >= 1.33
  ); // Stable & Capable (Ideal)

  const quad2 = kpis.filter(
    (k) => k.stabilityStatus === 'Stable' && k.cpk < 1.33
  ); // Stable & Borderline/Incapable

  const quad3 = kpis.filter(
    (k) => k.stabilityStatus === 'Unstable' && k.cpk < 1.33
  ); // Unstable & Incapable (Crisis)

  const quad4 = kpis.filter(
    (k) => k.stabilityStatus === 'Unstable' && k.cpk >= 1.33
  ); // Unstable but Capable (Vulnerable)

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Grid2X2 className="w-4 h-4 text-blue-900" />
            Process Stability & Capability (Cp / Cpk) Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical classification of hospital billing metrics for targeted standard work and Kaizen
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> {quad1.length} Capable &amp; Stable
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-amber-700 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> {quad2.length + quad3.length + quad4.length} Focus Areas
          </span>
        </div>
      </div>

      {/* Explanatory Guide Strip */}
      <div className="bg-slate-100/70 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>How to read the matrix: </strong>
          <span className="text-slate-800">Stability</span> indicates predictability without special causes (evaluated via 3-sigma control limits). 
          <span className="text-slate-800"> Capability (Cpk)</span> measures how reliably the process stays within customer &amp; NABH tolerances. Click any card to drill down into its Control Graph.
        </div>
      </div>

      {/* 2x2 Quality Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Quadrant 1: Stable & Capable (Ideal State) */}
        <div className="bg-white rounded-lg border-2 border-emerald-500/40 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Quadrant I · Stable &amp; Capable (Ideal Process)
              </h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              Cpk ≥ 1.33 · Zero Special Causes
            </span>
          </div>

          <p className="text-[11px] text-slate-500">
            Action: <strong>Maintain Standard Work. </strong> Regularly execute daily routines to preserve baseline. Continuous audit sampling.
          </p>

          <div className="space-y-2 pt-1">
            {quad1.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No metrics currently in this quadrant.</p>
            ) : (
              quad1.map((kpi) => renderKpiCard(kpi, 'border-emerald-200 bg-emerald-50/20'))
            )}
          </div>
        </div>

        {/* Quadrant 4: Unstable but Capable (Vulnerable State) */}
        <div className="bg-white rounded-lg border-2 border-amber-500/40 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Quadrant IV · Unstable but Capable (Vulnerable)
              </h3>
            </div>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              Cpk ≥ 1.33 · Special Causes Present
            </span>
          </div>

          <p className="text-[11px] text-slate-500">
            Action: <strong>Eliminate Special Causes. </strong> Output is acceptable only by margin; sporadic spikes will eventually breach tolerances if root cause is unaddressed.
          </p>

          <div className="space-y-2 pt-1">
            {quad4.length === 0 ? (
              <div className="p-4 rounded border border-dashed border-slate-200 text-center text-xs text-slate-400">
                No metrics currently at risk in this quadrant.
              </div>
            ) : (
              quad4.map((kpi) => renderKpiCard(kpi, 'border-amber-200 bg-amber-50/20'))
            )}
          </div>
        </div>

        {/* Quadrant 2: Stable but Borderline/Incapable */}
        <div className="bg-white rounded-lg border-2 border-slate-300 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Quadrant II · Stable but Borderline (Systemic Redesign)
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              Cpk &lt; 1.33 · Stable Variation
            </span>
          </div>

          <p className="text-[11px] text-slate-500">
            Action: <strong>Fundamental Kaizen. </strong> The process is consistent, but its normal spread is too wide. Shift center line or reduce inherent common-cause variance.
          </p>

          <div className="space-y-2 pt-1">
            {quad2.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No metrics currently in this quadrant.</p>
            ) : (
              quad2.map((kpi) => renderKpiCard(kpi, 'border-slate-200 bg-slate-50'))
            )}
          </div>
        </div>

        {/* Quadrant 3: Unstable & Incapable (Crisis State) */}
        <div className="bg-white rounded-lg border-2 border-rose-500/40 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Quadrant III · Unstable &amp; Incapable (Priority Action)
              </h3>
            </div>
            <span className="text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
              Cpk &lt; 1.33 · Special Causes Present
            </span>
          </div>

          <p className="text-[11px] text-slate-500">
            Action: <strong>Immediate Containment &amp; 5-Why CAPA. </strong> High unpredictability and frequent SLA breaches. Executive intervention required.
          </p>

          <div className="space-y-2 pt-1">
            {quad3.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No metrics currently in this quadrant.</p>
            ) : (
              quad3.map((kpi) => renderKpiCard(kpi, 'border-rose-200 bg-rose-50/20'))
            )}
          </div>
        </div>

      </div>

    </div>
  );

  function renderKpiCard(kpi: Kpi, borderBgClass: string) {
    return (
      <div
        key={kpi.id}
        onClick={() => onSelectKpi(kpi.id)}
        className={`p-3 rounded-lg border transition-all cursor-pointer hover:shadow-xs hover:border-blue-900 ${borderBgClass}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900">{kpi.title}</span>
              <span className="text-[10px] font-semibold text-slate-500 font-mono">
                {kpi.code}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {kpi.responsibleTitle} · {kpi.department}
            </p>
          </div>

          <ExternalLink className="w-3.5 h-3.5 text-blue-900 shrink-0 mt-0.5" />
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-mono tabular-nums">
          <span className="text-slate-600">
            Target: <strong>{kpi.target} {kpi.unit}</strong>
          </span>
          <span className="text-slate-600">
            Cp: <strong>{kpi.cp}</strong>
          </span>
          <span>
            Cpk: <strong className={kpi.cpk >= 1.33 ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>{kpi.cpk}</strong>
          </span>
        </div>
      </div>
    );
  }
};
