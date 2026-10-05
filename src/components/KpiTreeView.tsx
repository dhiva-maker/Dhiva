import React, { useState } from 'react';
import { 
  GitFork, 
  GripVertical, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  RotateCcw,
  Search,
  UserCheck,
  TrendingUp
} from 'lucide-react';
import { useDwm } from '../context/DwmContext';
import { KpiDriverNode } from '../types/dwm';

export const KpiTreeView: React.FC = () => {
  const { 
    kpiTree, 
    setKpiTree, 
    setActiveView, 
    setSelectedKpiId, 
    setSelectedPositionId 
  } = useDwm();

  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOverNodeId, setDragOverNodeId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

  const toggleCollapse = (id: string) => {
    setCollapsedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedNodeId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedNodeId !== targetId) {
      setDragOverNodeId(targetId);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverNodeId(null);
    if (!draggedNodeId || draggedNodeId === targetId) return;

    const reorderNodes = (parent: KpiDriverNode): KpiDriverNode => {
      if (!parent.children) return parent;

      const sourceIdx = parent.children.findIndex((c) => c.id === draggedNodeId);
      const targetIdx = parent.children.findIndex((c) => c.id === targetId);

      if (sourceIdx !== -1 && targetIdx !== -1) {
        const newChildren = [...parent.children];
        const [moved] = newChildren.splice(sourceIdx, 1);
        newChildren.splice(targetIdx, 0, moved);
        return { ...parent, children: newChildren };
      }

      return {
        ...parent,
        children: parent.children.map(reorderNodes),
      };
    };

    setKpiTree((prev) => reorderNodes(prev));
    setDraggedNodeId(null);
  };

  const handleWeightChange = (nodeId: string, newWeight: number) => {
    const updateWeight = (node: KpiDriverNode): KpiDriverNode => {
      if (node.id === nodeId) {
        return { ...node, weight: newWeight };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateWeight),
        };
      }
      return node;
    };
    setKpiTree((prev) => updateWeight(prev));
  };

  const matchesSearch = (node: KpiDriverNode): boolean => {
    if (selectedCategory !== 'All Categories' && node.category !== selectedCategory) {
      const childMatch = node.children?.some(matchesSearch);
      if (!childMatch) return false;
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const direct =
        node.title.toLowerCase().includes(q) ||
        node.responsibleTitle.toLowerCase().includes(q) ||
        node.description.toLowerCase().includes(q);
      const childMatch = node.children?.some(matchesSearch);
      return direct || Boolean(childMatch);
    }
    return true;
  };

  const renderStatusBadge = (status: 'Healthy' | 'At-Risk' | 'Critical') => {
    switch (status) {
      case 'Healthy':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Healthy
          </span>
        );
      case 'At-Risk':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> At-Risk
          </span>
        );
      case 'Critical':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" /> Critical
          </span>
        );
    }
  };

  const renderNode = (node: KpiDriverNode, depth: number = 0) => {
    if (!matchesSearch(node)) return null;

    const hasChildren = node.children && node.children.length > 0;
    const isCollapsed = collapsedNodes[node.id];
    const isDragging = draggedNodeId === node.id;
    const isDragOver = dragOverNodeId === node.id;

    return (
      <div 
        key={node.id} 
        className="flex flex-col relative transition-all"
        style={{ marginLeft: depth > 0 ? `${depth * 28}px` : 0 }}
      >
        <div
          draggable={node.level !== 1}
          onDragStart={(e) => handleDragStart(e, node.id)}
          onDragOver={(e) => handleDragOver(e, node.id)}
          onDrop={(e) => handleDrop(e, node.id)}
          className={`my-1.5 p-3.5 rounded-lg border transition-all duration-150 ${
            node.level === 1
              ? 'bg-blue-900 text-white border-blue-950 shadow-sm'
              : node.level === 2
              ? 'bg-slate-50 border-slate-300 shadow-2xs'
              : 'bg-white border-slate-200 shadow-2xs'
          } ${isDragging ? 'opacity-40 scale-98' : ''} ${
            isDragOver ? 'ring-2 ring-blue-600 border-blue-600' : ''
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Left Zone: Drag handle, Collapse Icon, Title & Category */}
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              {node.level !== 1 ? (
                <div 
                  className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 mt-0.5"
                  title="Drag to reorder sibling priority"
                >
                  <GripVertical className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-4 h-4" />
              )}

              {hasChildren ? (
                <button
                  onClick={() => toggleCollapse(node.id)}
                  className={`mt-0.5 p-0.5 rounded hover:bg-slate-200/50 ${
                    node.level === 1 ? 'hover:bg-blue-800 text-blue-200' : 'text-slate-500'
                  }`}
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <div className="w-4 h-4" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`text-xs font-bold truncate ${
                    node.level === 1 ? 'text-white text-sm' : 'text-slate-900'
                  }`}>
                    {node.title}
                  </h4>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    node.level === 1
                      ? 'bg-blue-800 text-blue-100'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {node.category}
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 truncate ${
                  node.level === 1 ? 'text-blue-200' : 'text-slate-500'
                }`}>
                  {node.description}
                </p>
              </div>
            </div>

            {/* Right Zone: Actual/Target, Status, Weight slider, Link buttons */}
            <div className="flex flex-wrap items-center gap-4 text-xs shrink-0 font-mono tabular-nums">
              
              <div className="text-right">
                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className={`text-sm font-bold ${
                    node.level === 1 ? 'text-white' : 'text-slate-900'
                  }`}>
                    {node.currentValue}
                  </span>
                  <span className={`text-[11px] ${node.level === 1 ? 'text-blue-200' : 'text-slate-500'}`}>
                    / {node.targetValue} {node.unit}
                  </span>
                </div>
                <span className={`text-[10px] block ${
                  node.level === 1 ? 'text-blue-300' : 'text-slate-500'
                }`}>
                  Target Metric
                </span>
              </div>

              <div>{renderStatusBadge(node.status)}</div>

              {node.level !== 1 && (
                <div className="flex items-center gap-1.5 bg-slate-100/70 px-2 py-1 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-sans">Weight:</span>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={node.weight}
                    onChange={(e) => handleWeightChange(node.id, Number(e.target.value))}
                    className="w-14 h-1 accent-blue-900 cursor-pointer"
                    title={`Priority Weight: ${node.weight}%`}
                  />
                  <span className="text-[11px] font-bold text-slate-800 w-8 text-right">
                    {node.weight}%
                  </span>
                </div>
              )}

              {/* Responsible Role Link */}
              <button
                onClick={() => {
                  setSelectedPositionId(node.responsiblePositionId);
                  setActiveView('rolesheets');
                }}
                className={`flex items-center gap-1 text-[11px] hover:underline ${
                  node.level === 1 ? 'text-blue-200 hover:text-white' : 'text-blue-900 font-medium'
                }`}
                title="View Role Sheet for this owner"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="max-w-[130px] truncate">{node.responsibleTitle.split(' ')[0]}</span>
              </button>

              {/* Linked SPC Shortcut */}
              {node.linkedKpiId && (
                <button
                  onClick={() => {
                    setSelectedKpiId(node.linkedKpiId!);
                    setActiveView('controlgraph');
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-blue-900 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                  title="Open Statistical Process Control Chart"
                >
                  <TrendingUp className="w-3 h-3 text-blue-700" />
                  SPC Chart
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Children Cascade */}
        {hasChildren && !isCollapsed && (
          <div className="flex flex-col relative">
            <div className="absolute left-3 top-0 bottom-4 w-0.5 bg-slate-200" />
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GitFork className="w-4 h-4 text-blue-900" />
            Draggable Cascading Operational KPI Driver Tree
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Draggable Priority Reordering</span>
            <span aria-hidden="true">·</span>
            <span>Hoshin Kanri Strategic Alignment</span>
            <span aria-hidden="true">·</span>
            <span>Weight Allocation Simulation</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search driver, KPI..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 w-44"
            />
          </div>

          <button
            onClick={() => setCollapsedNodes({})}
            className="px-2.5 py-1.5 text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-md"
          >
            Expand All
          </button>
          <button
            onClick={() => {
              const map: Record<string, boolean> = {};
              const traverse = (n: KpiDriverNode) => {
                if (n.children && n.children.length > 0) {
                  map[n.id] = true;
                  n.children.forEach(traverse);
                }
              };
              traverse(kpiTree);
              setCollapsedNodes(map);
            }}
            className="px-2.5 py-1.5 text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-md"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Guide Banner */}
      <div className="bg-blue-50/60 border border-blue-200 p-3 rounded-lg flex items-center gap-2 text-xs text-blue-900">
        <GripVertical className="w-4 h-4 text-blue-700 shrink-0" />
        <span>
          <strong>Interactive Reordering: </strong> Drag any card using the vertical grip handle to re-sequence sibling priority. Slide the weight controls to re-balance contribution percentages in real time.
        </span>
      </div>

      {/* Tree Container */}
      <div className="bg-slate-50/60 p-5 rounded-lg border border-slate-200 shadow-inner">
        {renderNode(kpiTree)}
      </div>

    </div>
  );
};
