import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Plus, 
  Printer, 
  ExternalLink,
  Award,
  Layers,
  X
} from 'lucide-react';
import { useDwm } from '../context/DwmContext';
import { RoutineTask } from '../types/dwm';

export const RoleSheetView: React.FC = () => {
  const { 
    positions, 
    selectedPositionId, 
    setSelectedPositionId, 
    updateRoutineTask, 
    addRoutineTask,
    setActiveView,
    setSelectedKpiId 
  } = useDwm();

  const currentPos = positions.find((p) => p.id === selectedPositionId) || positions[0];
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTime, setNewTaskTime] = useState('11:00 - 12:00');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskArtifact, setNewTaskArtifact] = useState('HIS Verification Slip');
  const [newTaskFrequency, setNewTaskFrequency] = useState<'Daily' | 'Hourly' | 'Shift-End' | 'Weekly'>('Daily');

  const handleToggleStatus = (task: RoutineTask) => {
    const nextStatus: 'Completed' | 'Pending' | 'Exception' =
      task.status === 'Completed' ? 'Pending' : 'Completed';
    updateRoutineTask(currentPos.id, task.id, nextStatus);
  };

  const handleFlagException = (taskId: string) => {
    const note = prompt('Please enter bottleneck or exception explanation:');
    if (note === null) return;
    updateRoutineTask(currentPos.id, taskId, 'Exception', note || 'Flagged during shift huddle.');
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addRoutineTask(currentPos.id, {
      timeSlot: newTaskTime,
      taskTitle: newTaskTitle,
      description: newTaskDesc || 'Assigned standard work activity.',
      frequency: newTaskFrequency,
      targetMinutes: 60,
      outputArtifact: newTaskArtifact,
      verificationMethod: 'Lead Signature & System Log',
      status: 'Pending',
    });

    setNewTaskTitle('');
    setNewTaskDesc('');
    setIsAddingTask(false);
  };

  const completedCount = currentPos.dailyRoutine.filter((t) => t.status === 'Completed').length;
  const totalTasks = currentPos.dailyRoutine.length;
  const completionPercent = Math.round((completedCount / (totalTasks || 1)) * 100);

  return (
    <div className="space-y-6">
      
      {/* Position Selector Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-900" />
              Dynamic Standard Work Role Sheets
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hourly operational standards, key result areas, and escalation thresholds
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-md transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            Print Role Sheet
          </button>
        </div>

        {/* Horizontal Role Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3">
          {positions.map((pos) => (
            <button
              key={pos.id}
              onClick={() => setSelectedPositionId(pos.id)}
              className={`px-3 py-2 text-xs rounded-md transition-all text-left whitespace-nowrap shrink-0 ${
                selectedPositionId === pos.id
                  ? 'bg-blue-900 text-white shadow-xs font-medium'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <div className="font-semibold">{pos.title}</div>
              <div className={`text-[10px] mt-0.5 ${selectedPositionId === pos.id ? 'text-blue-200' : 'text-slate-500'}`}>
                {pos.name} · {pos.tier}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Role Profile Header Card */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            {currentPos.avatarUrl ? (
              <img
                src={currentPos.avatarUrl}
                alt={currentPos.name}
                className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-lg shrink-0">
                {currentPos.name.slice(0, 2)}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {currentPos.title}
                </h3>
                <span className="text-[11px] font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                  {currentPos.tier}
                </span>
                <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {currentPos.department}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                <span className="font-semibold text-slate-900">{currentPos.name}</span>
                <span aria-hidden="true">·</span>
                <span>Reports to: <strong className="text-slate-800">{currentPos.reportsTo}</strong></span>
              </div>
              <p className="text-xs text-slate-600 mt-2 max-w-3xl leading-relaxed">
                <strong className="text-slate-900 font-semibold">Core Mission: </strong>
                {currentPos.objective}
              </p>
            </div>
          </div>

          {/* Routine Completion Gauge */}
          <div className="lg:text-right shrink-0 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
              Shift Routine Progress
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                {completionPercent}%
              </span>
              <span className="text-xs text-slate-500">
                ({completedCount} of {totalTasks} tasks)
              </span>
            </div>
            <div className="w-44 bg-slate-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-emerald-600 h-1.5 rounded-full transition-all"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Standard Work Checklist */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-900" />
              Hourly Standard Work Routine Checklist
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Click checkbox to toggle task execution status or record exception notes
            </p>
          </div>

          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors border border-blue-200"
          >
            <Plus className="w-3.5 h-3.5 text-blue-700" />
            Add Routine Task
          </button>
        </div>

        {/* Task Form */}
        {isAddingTask && (
          <form onSubmit={handleAddTaskSubmit} className="p-4 bg-blue-50/50 border-b border-blue-100 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-blue-900">Add New Routine Activity</h5>
              <button 
                type="button" 
                onClick={() => setIsAddingTask(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">Time Slot</label>
                <input
                  type="text"
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-medium text-slate-700 block mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Activity description..."
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Description / SOP Details</label>
              <textarea
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                placeholder="Specific instructions, verification steps..."
                rows={2}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingTask(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-900 hover:bg-blue-800 rounded-md"
              >
                Save to Routine
              </button>
            </div>
          </form>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-4 w-12 text-center">Status</th>
                <th className="py-2.5 px-4 w-32">Time Slot</th>
                <th className="py-2.5 px-4">Standard Work Activity & Verification</th>
                <th className="py-2.5 px-4 w-44 hidden md:table-cell">Output Artifact</th>
                <th className="py-2.5 px-4 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentPos.dailyRoutine.map((task) => (
                <tr
                  key={task.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    task.status === 'Completed'
                      ? 'bg-emerald-50/20'
                      : task.status === 'Exception'
                      ? 'bg-amber-50/30'
                      : ''
                  }`}
                >
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className="focus:outline-none"
                      title={task.status}
                    >
                      {task.status === 'Completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 inline" />
                      ) : task.status === 'Exception' ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600 inline" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 hover:border-slate-500 inline-block" />
                      )}
                    </button>
                  </td>

                  <td className="py-3 px-4 font-mono font-medium text-slate-800 whitespace-nowrap">
                    {task.timeSlot}
                    <div className="text-[10px] text-slate-500">{task.frequency}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className={`font-semibold text-slate-900 ${task.status === 'Completed' ? 'line-through text-slate-500' : ''}`}>
                      {task.taskTitle}
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                      {task.description}
                    </p>
                    {task.completedAt && (
                      <span className="text-[10px] text-emerald-700 font-mono mt-1 inline-block">
                        Completed at {task.completedAt}
                      </span>
                    )}
                    {task.notes && (
                      <div className="mt-1 text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                        <strong>Exception Note: </strong> {task.notes}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-medium text-[11px] hidden md:table-cell">
                    {task.outputArtifact}
                    <div className="text-[10px] text-slate-500">{task.verificationMethod}</div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleFlagException(task.id)}
                      className="text-[11px] text-amber-700 hover:text-amber-900 hover:underline font-medium"
                    >
                      Flag Issue
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KRAs & Escalation Matrices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* KRAs Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-900" />
              Key Result Areas (KRAs)
            </h4>
          </div>

          <div className="divide-y divide-slate-100">
            {currentPos.kras.map((kra) => (
              <div key={kra.id} className="p-3.5 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">
                    {kra.name}
                  </span>
                  <span 
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      kra.status === 'Green' ? 'bg-emerald-50 text-emerald-800' :
                      kra.status === 'Amber' ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-800'
                    }`}
                  >
                    {kra.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs mt-1.5 font-mono tabular-nums">
                  <span className="text-slate-500">
                    Target: <strong className="text-slate-800">{kra.target}</strong>
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500">
                    Actual: <strong className="text-slate-900">{kra.actual}</strong>
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500">
                    Weight: <strong>{kra.weightage}%</strong>
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <p className="text-[10px] text-slate-500 italic">
                    Formula: {kra.formula}
                  </p>
                  {kra.linkedKpiId && (
                    <button
                      onClick={() => {
                        setSelectedKpiId(kra.linkedKpiId!);
                        setActiveView('controlgraph');
                      }}
                      className="text-[11px] text-blue-900 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Control Graph</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Escalation Rules Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/70">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Authority Delegation & Escalation Triggers
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict hospital SLA thresholds for administrative and clinical handoffs
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {currentPos.escalationRules.map((rule, idx) => (
              <div key={idx} className="p-3.5 space-y-1 hover:bg-slate-50/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">
                    Trigger Condition:
                  </span>
                  <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                    SLA: {rule.slaMinutes} min
                  </span>
                </div>
                <p className="text-xs text-slate-700">
                  {rule.triggerCondition}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                  <span>Escalate to: <strong className="text-slate-800">{rule.escalateTo}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span className="text-blue-900 font-medium">Mode: {rule.mode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
