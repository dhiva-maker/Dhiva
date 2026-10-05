import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  PlusCircle, 
  ShieldAlert, 
  CheckCircle2, 
  Sliders, 
  HelpCircle,
  TrendingUp,
  ChevronDown
} from 'lucide-react';
import { useDwm } from '../context/DwmContext';
import { Kpi, ControlDataPoint } from '../types/dwm';

interface ControlGraphViewProps {
  onOpenLogModal: () => void;
}

export const ControlGraphView: React.FC<ControlGraphViewProps> = ({ onOpenLogModal }) => {
  const { kpis, selectedKpiId, setSelectedKpiId } = useDwm();
  const [selectedShift, setSelectedShift] = useState<string>('All Shifts');
  const [showZones, setShowZones] = useState<boolean>(true);
  const [hoveredPoint, setHoveredPoint] = useState<ControlDataPoint | null>(null);

  const activeKpi = useMemo(() => {
    return kpis.find((k) => k.id === selectedKpiId) || kpis[0];
  }, [kpis, selectedKpiId]);

  const filteredPoints = useMemo(() => {
    if (selectedShift === 'All Shifts') return activeKpi.dataPoints;
    return activeKpi.dataPoints.filter((p) => p.shift === selectedShift);
  }, [activeKpi, selectedShift]);

  // Statistical calculations
  const stats = useMemo(() => {
    if (filteredPoints.length === 0) {
      return {
        mean: activeKpi.target,
        sigma: activeKpi.historicalSigma,
        ucl: activeKpi.historicalUcl,
        lcl: activeKpi.historicalLcl,
        p1Sig: activeKpi.target + activeKpi.historicalSigma,
        m1Sig: Math.max(0, activeKpi.target - activeKpi.historicalSigma),
        p2Sig: activeKpi.target + 2 * activeKpi.historicalSigma,
        m2Sig: Math.max(0, activeKpi.target - 2 * activeKpi.historicalSigma),
      };
    }

    const values = filteredPoints.map((p) => p.value);
    const sum = values.reduce((acc, v) => acc + v, 0);
    const mean = sum / values.length;

    let variance = 0;
    if (values.length > 1) {
      variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (values.length - 1);
    }
    const sigma = Math.sqrt(variance) || activeKpi.historicalSigma;

    const ucl = Number((mean + 3 * sigma).toFixed(2));
    const lcl = Number(Math.max(0, mean - 3 * sigma).toFixed(2));

    return {
      mean: Number(mean.toFixed(2)),
      sigma: Number(sigma.toFixed(2)),
      ucl,
      lcl,
      p1Sig: Number((mean + sigma).toFixed(2)),
      m1Sig: Number(Math.max(0, mean - sigma).toFixed(2)),
      p2Sig: Number((mean + 2 * sigma).toFixed(2)),
      m2Sig: Number(Math.max(0, mean - 2 * sigma).toFixed(2)),
    };
  }, [filteredPoints, activeKpi]);

  // SVG Dimension & Coordinate Math
  const width = 880;
  const height = 360;
  const padding = { top: 30, right: 90, bottom: 45, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const allValues = [
    stats.ucl * 1.05,
    stats.lcl * 0.95,
    activeKpi.target,
    ...filteredPoints.map((p) => p.value),
  ];
  const yMin = Math.max(0, Math.min(...allValues));
  const yMax = Math.max(...allValues);
  const ySpan = yMax - yMin || 1;

  const getYCoord = (val: number) => {
    return padding.top + chartHeight - ((val - yMin) / ySpan) * chartHeight;
  };

  const getXCoord = (index: number) => {
    if (filteredPoints.length <= 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (filteredPoints.length - 1)) * chartWidth;
  };

  const outOfControlPoints = filteredPoints.filter(
    (p) => p.value > stats.ucl || p.value < stats.lcl || p.outOfControlRule
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Metric Switcher */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <LineChart className="w-4 h-4 text-blue-900" />
            Statistical Process Control (SPC) · Shewhart Control Graph
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Statistical 3-Sigma Limits (UCL / LCL)</span>
            <span aria-hidden="true">·</span>
            <span>Target Line Standard</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Special Cause Detection</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Shift Filter */}
          <div className="relative inline-block text-left">
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-medium pl-3 pr-7 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
            >
              <option value="All Shifts">All Shifts</option>
              <option value="Shift A">Shift A (Morning)</option>
              <option value="Shift B">Shift B (Evening)</option>
              <option value="General">General Shift</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          <button
            onClick={() => setShowZones(!showZones)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              showZones
                ? 'bg-blue-50 text-blue-900 border-blue-200'
                : 'bg-slate-50 text-slate-600 border-slate-300'
            }`}
          >
            {showZones ? 'Hide ±1σ/2σ Zones' : 'Show ±1σ/2σ Zones'}
          </button>

          <button
            onClick={onOpenLogModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-900 hover:bg-blue-800 rounded-md transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Log Shift Audit Data
          </button>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {kpis.map((k) => (
          <button
            key={k.id}
            onClick={() => setSelectedKpiId(k.id)}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all text-left whitespace-nowrap shrink-0 ${
              selectedKpiId === k.id
                ? 'bg-white border-blue-900 text-blue-900 shadow-xs ring-1 ring-blue-900/10'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="font-bold text-xs">{k.shortName}</div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              Goal: {k.target} {k.unit} · Cpk {k.cpk}
            </div>
          </button>
        ))}
      </div>

      {/* Main SPC SVG Chart Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
        
        {/* Metric Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {activeKpi.title}
              </h3>
              <span className="text-[11px] font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                {activeKpi.code}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Owner: <strong>{activeKpi.responsibleTitle}</strong> · Subgroup Size: <strong>{activeKpi.subgroupSize}</strong>
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-slate-600">
            <span>
              Target: <strong className="text-emerald-700">{activeKpi.target} {activeKpi.unit}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              Mean: <strong className="text-slate-900">{stats.mean} {activeKpi.unit}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              UCL: <strong className="text-rose-700">{stats.ucl}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              LCL: <strong className="text-rose-700">{stats.lcl}</strong>
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-600 inline-block border-t border-dashed border-emerald-600" />
            <span>Target Goal ({activeKpi.target} {activeKpi.unit})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-800 inline-block" />
            <span>Center Line / Mean ({stats.mean})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-600 inline-block border-t border-dashed border-rose-600" />
            <span>Upper & Lower Control Limits (UCL / LCL)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            <span>Audited Point</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-rose-300 inline-block" />
            <span>Special Cause Outlier</span>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="relative overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto min-w-[720px] select-none"
          >
            {/* Background grid */}
            <rect
              x={padding.left}
              y={padding.top}
              width={chartWidth}
              height={chartHeight}
              fill="#f8fafc"
              stroke="#e2e8f0"
            />

            {/* Sigma Zones if enabled */}
            {showZones && (
              <>
                <line
                  x1={padding.left}
                  y1={getYCoord(stats.p1Sig)}
                  x2={padding.left + chartWidth}
                  y2={getYCoord(stats.p1Sig)}
                  stroke="#cbd5e1"
                  strokeDasharray="2,3"
                />
                <line
                  x1={padding.left}
                  y1={getYCoord(stats.m1Sig)}
                  x2={padding.left + chartWidth}
                  y2={getYCoord(stats.m1Sig)}
                  stroke="#cbd5e1"
                  strokeDasharray="2,3"
                />
                <line
                  x1={padding.left}
                  y1={getYCoord(stats.p2Sig)}
                  x2={padding.left + chartWidth}
                  y2={getYCoord(stats.p2Sig)}
                  stroke="#cbd5e1"
                  strokeDasharray="3,3"
                />
                <line
                  x1={padding.left}
                  y1={getYCoord(stats.m2Sig)}
                  x2={padding.left + chartWidth}
                  y2={getYCoord(stats.m2Sig)}
                  stroke="#cbd5e1"
                  strokeDasharray="3,3"
                />
              </>
            )}

            {/* UCL Line */}
            <line
              x1={padding.left}
              y1={getYCoord(stats.ucl)}
              x2={padding.left + chartWidth}
              y2={getYCoord(stats.ucl)}
              stroke="#e11d48"
              strokeWidth="1.75"
              strokeDasharray="6,4"
            />
            <text
              x={padding.left + chartWidth + 6}
              y={getYCoord(stats.ucl) + 3}
              fill="#be123c"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              UCL: {stats.ucl}
            </text>

            {/* LCL Line */}
            <line
              x1={padding.left}
              y1={getYCoord(stats.lcl)}
              x2={padding.left + chartWidth}
              y2={getYCoord(stats.lcl)}
              stroke="#e11d48"
              strokeWidth="1.75"
              strokeDasharray="6,4"
            />
            <text
              x={padding.left + chartWidth + 6}
              y={getYCoord(stats.lcl) + 3}
              fill="#be123c"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              LCL: {stats.lcl}
            </text>

            {/* Center Line (Mean) */}
            <line
              x1={padding.left}
              y1={getYCoord(stats.mean)}
              x2={padding.left + chartWidth}
              y2={getYCoord(stats.mean)}
              stroke="#0f172a"
              strokeWidth="2"
            />
            <text
              x={padding.left + chartWidth + 6}
              y={getYCoord(stats.mean) + 3}
              fill="#0f172a"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              Mean: {stats.mean}
            </text>

            {/* Target Line */}
            <line
              x1={padding.left}
              y1={getYCoord(activeKpi.target)}
              x2={padding.left + chartWidth}
              y2={getYCoord(activeKpi.target)}
              stroke="#059669"
              strokeWidth="2"
              strokeDasharray="5,4"
            />
            <text
              x={padding.left + chartWidth + 6}
              y={getYCoord(activeKpi.target) + 3}
              fill="#047857"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              Goal: {activeKpi.target}
            </text>

            {/* Connecting Polyline */}
            {filteredPoints.length > 1 && (
              <path
                d={filteredPoints
                  .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getXCoord(i)} ${getYCoord(p.value)}`)
                  .join(' ')}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
              />
            )}

            {/* Data Points */}
            {filteredPoints.map((pt, idx) => {
              const cx = getXCoord(idx);
              const cy = getYCoord(pt.value);
              const isOutlier = pt.value > stats.ucl || pt.value < stats.lcl || pt.outOfControlRule;

              return (
                <g key={pt.id} className="cursor-pointer">
                  {isOutlier && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="9"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2"
                      opacity="0.8"
                    />
                  )}

                  <circle
                    cx={cx}
                    cy={cy}
                    r="4.5"
                    fill={isOutlier ? '#e11d48' : '#1d4ed8'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    onMouseEnter={() => setHoveredPoint(pt)}
                  />

                  {/* X-axis tick */}
                  {idx % Math.ceil(filteredPoints.length / 10) === 0 && (
                    <text
                      x={cx}
                      y={padding.top + chartHeight + 16}
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {pt.date.slice(5)}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Y-axis Ticks */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const val = yMin + ratio * ySpan;
              const yPos = getYCoord(val);
              return (
                <g key={ratio}>
                  <line
                    x1={padding.left - 5}
                    y1={yPos}
                    x2={padding.left}
                    y2={yPos}
                    stroke="#94a3b8"
                  />
                  <text
                    x={padding.left - 8}
                    y={yPos + 3}
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    {val.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Y-axis label */}
            <text
              x={-height / 2}
              y="18"
              transform="rotate(-90)"
              fill="#475569"
              fontSize="10"
              fontFamily="sans-serif"
              textAnchor="middle"
            >
              {activeKpi.shortName} ({activeKpi.unit})
            </text>
          </svg>
        </div>

        {/* Hovered point details */}
        {hoveredPoint && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between text-xs gap-3 font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">
                {hoveredPoint.date} ({hoveredPoint.shift})
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>
                Value: <strong className="text-slate-900">{hoveredPoint.value} {activeKpi.unit}</strong>
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Sample: {hoveredPoint.sampleSize}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Auditor: {hoveredPoint.auditor}</span>
            </div>

            <div>
              {hoveredPoint.outOfControlRule ? (
                <span className="text-rose-800 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {hoveredPoint.outOfControlRule}
                </span>
              ) : (
                <span className="text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  In Statistical Control
                </span>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Process Capability & Statistical Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Capability Indicators */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-blue-900" />
            Process Capability Indices
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono tabular-nums">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 font-sans block">Potential Capability (Cp)</span>
              <span className="text-base font-bold text-slate-900">{activeKpi.cp}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 font-sans block">Actual Capability (Cpk)</span>
              <span className={`text-base font-bold ${activeKpi.cpk >= 1.33 ? 'text-emerald-700' : 'text-amber-700'}`}>
                {activeKpi.cpk}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 font-sans block">Upper Limit (UCL)</span>
              <span className="text-base font-bold text-rose-700">{stats.ucl}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 font-sans block">Lower Limit (LCL)</span>
              <span className="text-base font-bold text-rose-700">{stats.lcl}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Capability Rating:</span>
              <strong className="text-slate-900">{activeKpi.capabilityStatus}</strong>
            </div>
            <div className="flex justify-between">
              <span>Stability Status:</span>
              <strong className={activeKpi.stabilityStatus === 'Stable' ? 'text-emerald-700' : 'text-amber-700'}>
                {activeKpi.stabilityStatus}
              </strong>
            </div>
          </div>
        </div>

        {/* Special Cause Alerts Table */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              Special Cause Outliers & CAPA Actions
            </h4>
            <span className="text-xs text-slate-500 font-mono">
              {outOfControlPoints.length} Exception Events
            </span>
          </div>

          <div className="p-3 flex-1 overflow-y-auto max-h-52">
            {outOfControlPoints.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-1" />
                <p className="text-xs font-semibold text-slate-800">
                  Process Operating in Statistical Control
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  No data points breach the 3-sigma Upper/Lower Control Limits.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {outOfControlPoints.map((pt) => (
                  <div
                    key={pt.id}
                    className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/40 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-mono">
                          {pt.date} ({pt.shift})
                        </span>
                        <span className="font-mono tabular-nums text-rose-700 font-bold">
                          Value: {pt.value} {activeKpi.unit}
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-800 font-medium mt-0.5">
                        {pt.outOfControlRule || 'Point Beyond 3-Sigma Control Limit'}
                      </p>
                      {pt.notes && (
                        <p className="text-[10px] text-slate-600 mt-0.5 italic">
                          "{pt.notes}"
                        </p>
                      )}
                    </div>

                    <span className="px-2 py-0.5 text-[10px] font-semibold text-amber-800 bg-amber-100 rounded border border-amber-300">
                      {pt.capaStatus || 'CAPA Investigating'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
