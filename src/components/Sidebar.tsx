import React from 'react';
import { 
  Users, 
  FileText, 
  GitFork, 
  LineChart, 
  Grid2X2, 
  ClipboardCheck, 
  PlusCircle,
  Building2,
  ChevronRight
} from 'lucide-react';
import { useDwm } from '../context/DwmContext';
import { ViewType } from '../types/dwm';

interface SidebarProps {
  onOpenLogModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenLogModal }) => {
  const { activeView, setActiveView } = useDwm();

  const navItems: { view: ViewType; label: string; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
    {
      view: 'organogram',
      label: 'Organogram Hierarchy',
      icon: Users,
      description: 'Tiered departmental structure & span of control',
    },
    {
      view: 'rolesheets',
      label: 'Dynamic Role Sheets',
      icon: FileText,
      description: 'Hourly standard work & authority matrix',
    },
    {
      view: 'kpitree',
      label: 'Draggable KPI Tree',
      icon: GitFork,
      description: 'Cascading strategic driver alignment',
    },
    {
      view: 'controlgraph',
      label: 'SPC Control Graphs',
      icon: LineChart,
      description: 'Shewhart charts with Target, Mean, UCL & LCL',
    },
    {
      view: 'stability_matrix',
      label: 'Stability & Capability',
      icon: Grid2X2,
      description: 'Process stability & Cpk capability matrix',
    },
    {
      view: 'checksheet',
      label: 'Routine Checksheet',
      icon: ClipboardCheck,
      description: 'Shift standard work execution checklist',
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white shrink-0 hidden md:flex flex-col border-r border-slate-800">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg tracking-tight shrink-0 shadow-sm">
            <span className="font-serif">K</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold tracking-tight text-white truncate">
              Kauvery Hospital
            </span>
            <span className="text-[11px] text-slate-400 truncate">
              Billing DWM Platform
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
        <div className="px-2 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Daily Work Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;

          return (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-medium shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold leading-tight truncate">
                  {item.label}
                </div>
                <div className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                  {item.description}
                </div>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200 mt-0.5 shrink-0" />}
            </button>
          );
        })}
      </nav>

      {/* Quick Action Button & Bottom Info */}
      <div className="p-3.5 border-t border-slate-800/80 space-y-3">
        <button
          onClick={onOpenLogModal}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Log Control Data
        </button>

        <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/60 text-[11px] text-slate-400">
          <div className="flex items-center justify-between text-slate-300 font-medium">
            <span>Shift Status</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live
            </span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            NABH Operational Excellence Standard
          </div>
        </div>
      </div>

    </aside>
  );
};
