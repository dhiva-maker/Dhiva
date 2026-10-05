import React from 'react';
import { 
  Building2, 
  ChevronDown, 
  PlusCircle, 
  Clock, 
  ShieldCheck, 
  Activity, 
  Menu
} from 'lucide-react';
import { useDwm } from '../context/DwmContext';
import { ViewType } from '../types/dwm';

interface NavbarProps {
  onOpenLogModal: () => void;
}

const BRANCHES = [
  'Chennai - Alwarpet (Main)',
  'Chennai - Vadapalani',
  'Trichy - Cantonment',
  'Bengaluru - Electronic City',
  'Salem',
  'Tirunelveli',
  'Hosur',
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogModal }) => {
  const { 
    activeView, 
    setActiveView, 
    selectedBranch, 
    setSelectedBranch,
    kpis 
  } = useDwm();

  const ipKpi = kpis.find((k) => k.id === 'kpi-discharge-tat');
  const cleanKpi = kpis.find((k) => k.id === 'kpi-clean-claim');
  const latestTat = ipKpi?.dataPoints.slice(-1)[0]?.value ?? 41.2;
  const latestClean = cleanKpi?.dataPoints.slice(-1)[0]?.value ?? 95.9;

  const getViewTitle = (view: ViewType) => {
    switch (view) {
      case 'organogram':
        return 'Departmental Organogram & Tier Structure';
      case 'rolesheets':
        return 'Dynamic Standard Work Role Sheets';
      case 'kpitree':
        return 'Draggable KPI Driver Tree & Weight Distribution';
      case 'controlgraph':
        return 'Statistical Process Control (SPC) Graphs';
      case 'stability_matrix':
        return 'Process Stability & Capability (Cp / Cpk) Matrix';
      case 'checksheet':
        return 'Shift Routine Checksheet & Standard Work Execution';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Left: View Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="md:hidden flex items-center">
            <div className="w-8 h-8 rounded bg-blue-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
              K
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-900">Hospital Billing DWM</span>
              <span aria-hidden="true">/</span>
              <span className="truncate">{getViewTitle(activeView)}</span>
            </div>
            <h1 className="text-sm md:text-base font-bold text-slate-900 truncate tracking-tight">
              {getViewTitle(activeView)}
            </h1>
          </div>
        </div>

        {/* Center: Live Metric Badges */}
        <div className="hidden xl:flex items-center gap-4 text-xs font-mono tabular-nums">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-md border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-blue-700" />
            <span className="text-slate-500 font-sans">Avg TAT:</span>
            <span className="font-bold text-slate-900">{latestTat} min</span>
            <span className="text-emerald-700 font-sans text-[11px] font-semibold">(≤ 45m Goal)</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-md border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span className="text-slate-500 font-sans">Clean Claim:</span>
            <span className="font-bold text-slate-900">{latestClean}%</span>
            <span className="text-emerald-700 font-sans text-[11px] font-semibold">(≥ 95% Goal)</span>
          </div>
        </div>

        {/* Right: Hospital Branch Selector & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative inline-block text-left">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              aria-label="Hospital Branch Unit"
              className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-medium pl-3 pr-7 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          <button
            onClick={onOpenLogModal}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-900 hover:bg-blue-800 rounded-md transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Sample</span>
          </button>
        </div>

      </div>

      {/* Mobile Horizontal Navigation Tabs */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-100 gap-1.5 bg-slate-50 text-xs">
        <button
          onClick={() => setActiveView('organogram')}
          className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
            activeView === 'organogram' ? 'bg-blue-900 text-white' : 'text-slate-600'
          }`}
        >
          Organogram
        </button>
        <button
          onClick={() => setActiveView('rolesheets')}
          className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
            activeView === 'rolesheets' ? 'bg-blue-900 text-white' : 'text-slate-600'
          }`}
        >
          Role Sheets
        </button>
        <button
          onClick={() => setActiveView('kpitree')}
          className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
            activeView === 'kpitree' ? 'bg-blue-900 text-white' : 'text-slate-600'
          }`}
        >
          KPI Tree
        </button>
        <button
          onClick={() => setActiveView('controlgraph')}
          className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
            activeView === 'controlgraph' ? 'bg-blue-900 text-white' : 'text-slate-600'
          }`}
        >
          Control Graphs
        </button>
        <button
          onClick={() => setActiveView('stability_matrix')}
          className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
            activeView === 'stability_matrix' ? 'bg-blue-900 text-white' : 'text-slate-600'
          }`}
        >
          Stability Matrix
        </button>
        <button
          onClick={() => setActiveView('checksheet')}
          className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
            activeView === 'checksheet' ? 'bg-blue-900 text-white' : 'text-slate-600'
          }`}
        >
          Checksheet
        </button>
      </div>
    </header>
  );
};
