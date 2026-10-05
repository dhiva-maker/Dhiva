import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  Clock, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown, 
  X,
  UserCheck
} from 'lucide-react';
import { useDwm } from '../context/DwmContext';
import { Position } from '../types/dwm';

export const OrganogramView: React.FC = () => {
  const { positions, setActiveView, setSelectedPositionId, selectedPositionId } = useDwm();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Wings');
  const [selectedDrawerPos, setSelectedDrawerPos] = useState<Position | null>(null);

  const departments = [
    'All Wings',
    'Inpatient (IP) Billing',
    'Outpatient (OP) & Daycare',
    'Insurance & TPA Claims',
    'Audit & Revenue Assurance',
  ];

  const filteredPositions = positions.filter((p) => {
    if (selectedDept !== 'All Wings' && p.department !== selectedDept) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenRoleSheet = (posId: string) => {
    setSelectedPositionId(posId);
    setActiveView('rolesheets');
  };

  const handleOpenChecksheet = (posId: string) => {
    setSelectedPositionId(posId);
    setActiveView('checksheet');
  };

  const renderTierBadge = (tier: string) => {
    switch (tier) {
      case 'Tier 4':
        return <span className="text-[10px] font-semibold text-purple-900 bg-purple-50 px-2 py-0.5 rounded">Tier 4 · Executive</span>;
      case 'Tier 3':
        return <span className="text-[10px] font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">Tier 3 · Manager</span>;
      case 'Tier 2':
        return <span className="text-[10px] font-semibold text-teal-900 bg-teal-50 px-2 py-0.5 rounded">Tier 2 · Supervisor</span>;
      default:
        return <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Tier 1 · Frontline</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Filter Strip */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-900" />
            Billing Department Organogram & Tier Structure
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Kauvery Lean Daily Work Management</span>
            <span aria-hidden="true">·</span>
            <span>4-Tier Hierarchy of Accountability</span>
            <span aria-hidden="true">·</span>
            <span>Click any role to inspect standard work routine</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 w-48"
            />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-medium px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tiered Organogram Grid / Tree */}
      <div className="space-y-6">
        
        {/* Tier 4 Leadership */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            Tier 4 · Regional Business Excellence & CFO Leadership
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPositions
              .filter((p) => p.tier === 'Tier 4')
              .map((pos) => renderPositionCard(pos))}
          </div>
        </div>

        {/* Tier 3 Department Management */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            Tier 3 · Hospital Billing Operations Management
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPositions
              .filter((p) => p.tier === 'Tier 3')
              .map((pos) => renderPositionCard(pos))}
          </div>
        </div>

        {/* Tier 2 Section Supervisors & Leads */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-600" />
            Tier 2 · Shift Leads & Section In-Charges
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPositions
              .filter((p) => p.tier === 'Tier 2')
              .map((pos) => renderPositionCard(pos))}
          </div>
        </div>

        {/* Tier 1 Frontline Billing Executives */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            Tier 1 · Frontline Inpatient & Outpatient Billing Executives
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPositions
              .filter((p) => p.tier === 'Tier 1')
              .map((pos) => renderPositionCard(pos))}
          </div>
        </div>

      </div>

      {/* Slide-over Profile Drawer */}
      {selectedDrawerPos && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
            
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-900" />
                <h3 className="text-sm font-bold text-slate-900">
                  Personnel DWM Profile
                </h3>
              </div>
              <button
                onClick={() => setSelectedDrawerPos(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              <div className="flex items-start gap-4">
                {selectedDrawerPos.avatarUrl ? (
                  <img
                    src={selectedDrawerPos.avatarUrl}
                    alt={selectedDrawerPos.name}
                    className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-lg">
                    {selectedDrawerPos.name.slice(0, 2)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900 truncate">
                      {selectedDrawerPos.name}
                    </h4>
                    {renderTierBadge(selectedDrawerPos.tier)}
                  </div>
                  <p className="text-xs font-medium text-slate-700 mt-0.5">
                    {selectedDrawerPos.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedDrawerPos.department}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {selectedDrawerPos.status}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {selectedDrawerPos.shift}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5 text-slate-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedDrawerPos.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedDrawerPos.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">Reports to:</span>
                  <span>{selectedDrawerPos.reportsTo}</span>
                </div>
              </div>

              {/* Core Mission */}
              <div>
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Core Mission & Objective
                </h5>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {selectedDrawerPos.objective}
                </p>
              </div>

              {/* KRAs Preview */}
              <div>
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Key Result Areas (KRAs)
                </h5>
                <div className="space-y-2">
                  {selectedDrawerPos.kras.map((kra) => (
                    <div key={kra.id} className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs">
                      <div className="flex justify-between font-medium text-slate-900">
                        <span>{kra.name}</span>
                        <span className="text-emerald-700 font-bold">{kra.actual}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex justify-between font-mono">
                        <span>Target: {kra.target}</span>
                        <span>Weight: {kra.weightage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
              <button
                onClick={() => {
                  handleOpenChecksheet(selectedDrawerPos.id);
                  setSelectedDrawerPos(null);
                }}
                className="flex-1 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-md transition-colors"
              >
                Open Checksheet
              </button>
              <button
                onClick={() => {
                  handleOpenRoleSheet(selectedDrawerPos.id);
                  setSelectedDrawerPos(null);
                }}
                className="flex-1 py-2 text-xs font-medium text-white bg-blue-900 hover:bg-blue-800 rounded-md transition-colors"
              >
                View Full Role Sheet
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );

  function renderPositionCard(pos: Position) {
    const isSelected = selectedPositionId === pos.id;

    return (
      <div
        key={pos.id}
        onClick={() => setSelectedDrawerPos(pos)}
        className={`bg-white rounded-lg border transition-all cursor-pointer shadow-xs hover:shadow-md ${
          isSelected
            ? 'border-blue-900 ring-2 ring-blue-900/10'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              {pos.avatarUrl ? (
                <img
                  src={pos.avatarUrl}
                  alt={pos.name}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center font-bold text-sm">
                  {pos.name.slice(0, 2)}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {pos.name}
                </h4>
                {renderTierBadge(pos.tier)}
              </div>
              <p className="text-[11px] font-medium text-slate-700 truncate mt-0.5">
                {pos.title}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {pos.department}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-mono tabular-nums">
              <Clock className="w-3 h-3 text-slate-400" />
              {pos.shift.split(' ')[0]}
            </span>
            <span className="text-emerald-700 font-semibold font-mono tabular-nums">
              {pos.auditPassRate}% Audit Yield
            </span>
          </div>
        </div>

        <div className="bg-slate-50/80 px-4 py-2 border-t border-slate-100 flex items-center justify-between rounded-b-lg text-[11px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenRoleSheet(pos.id);
            }}
            className="text-blue-900 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline"
          >
            <span>Role Sheet</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          <span className="text-slate-400 font-mono">
            {pos.dailyRoutine.length} Routine Tasks
          </span>
        </div>
      </div>
    );
  }
};
