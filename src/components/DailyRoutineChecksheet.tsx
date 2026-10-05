import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Printer, 
  Check, 
  HelpCircle,
  FileCheck2,
  Calendar,
  X
} from 'lucide-react';
import { useDwm } from '../context/DwmContext';
import { RoutineTask } from '../types/dwm';

export const DailyRoutineChecksheet: React.FC = () => {
  const { positions, selectedPositionId, setSelectedPositionId, updateRoutineTask, addRoutineTask } = useDwm();

  const currentPos = positions.find((p) => p.id === selectedPositionId) || positions[0];
  const [isAdding, setIsAdding] = useState(false);
  const [timeSlot, setTimeSlot] = useState('14:00 - 15:00');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [artifact, setArtifact] = useState('HIS Verification Slip');

  const handleToggle = (task: RoutineTask) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    updateRoutineTask(currentPos.id, task.id, nextStatus);
  };

  const handleFlagException = (taskId: string) => {
    const note = prompt('Please describe operational issue / bottleneck:');
    if (note === null) return;
    updateRoutineTask(currentPos.id, taskId, 'Exception', note || 'Flagged exception');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addRoutineTask(currentPos.id, {
      timeSlot,
      taskTitle: title,
      description: desc || 'Shift operational standard work activity.',
      frequency: 'Daily',
      targetMinutes: 60,
      outputArtifact: artifact,
      verificationMethod: 'Lead Endorsement',
      status: 'Pending',
    });

    setTitle('');
    setDesc('');
    setIsAdding(false);
  };

  const completed = currentPos.dailyRoutine.filter((t) => t.status === 'Completed').length;
  const exceptions = currentPos.dailyRoutine.filter((t) => t.status === 'Exception').length;
  const pending = currentPos.dailyRoutine.filter((t) => t.status === 'Pending').length;
  const total = currentPos.dailyRoutine.length;
  const percent = Math.round((completed / (total || 1)) * 100);

  return (
    <div className="space-y-6">
      
      {/* Checksheet Header */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-blue-900" />
            Shift Standard Work Daily Routine Checksheet
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Date: <strong className="text-slate-800 font-mono">{new Date().toLocaleDateString()}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Shift: <strong className="text-slate-800">{currentPos.shift}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Audited By: <strong className="text-slate-800">{currentPos.reportsTo}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-md transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            Print Checksheet
          </button>
        </div>
      </div>

      {/* Position Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {positions.map((pos) => (
          <button
            key={pos.id}
            onClick={() => setSelectedPositionId(pos.id)}
            className={`px-3 py-2 text-xs rounded-lg border transition-all text-left whitespace-nowrap shrink-0 ${
              selectedPositionId === pos.id
                ? 'bg-blue-900 text-white font-medium border-blue-950 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="font-semibold">{pos.title}</div>
            <div className={`text-[10px] mt-0.5 ${selectedPositionId === pos.id ? 'text-blue-200' : 'text-slate-500'}`}>
              {pos.name}
            </div>
          </button>
        ))}
      </div>

      {/* Progress & Shift Execution Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Routine Adherence
          </span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            {percent}%
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            Standard target ≥ 95%
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Completed Tasks
          </span>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700 mt-1">
            {completed} <span className="text-xs text-slate-400 font-normal">/ {total}</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Timestamps registered
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Pending Routine
          </span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-700 mt-1">
            {pending}
          </div>
          <span className="text-[11px] text-slate-500">
            Scheduled for later shift
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Exceptions Flagged
          </span>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-700 mt-1">
            {exceptions}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">
            Requires supervisor sign-off
          </span>
        </div>
      </div>

      {/* Routine Checksheet Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-blue-900" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {currentPos.name} · Standard Work Log
            </h4>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-blue-700" />
            Add Task
          </button>
        </div>

        {/* Inline Add Task */}
        {isAdding && (
          <form onSubmit={handleAddSubmit} className="p-4 bg-blue-50/50 border-b border-blue-100 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-blue-900">Add Standard Work Task</h5>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
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
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-medium text-slate-700 block mb-1">Task Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task name / standard work activity..."
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Description / Verification Standard</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="What must be verified, system screens audited..."
                rows={2}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-900 hover:bg-blue-800 rounded-md"
              >
                Save Task
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-4 w-12 text-center">Check</th>
                <th className="py-2.5 px-4 w-32">Time Slot</th>
                <th className="py-2.5 px-4">Standard Work Activity</th>
                <th className="py-2.5 px-4 w-40 hidden md:table-cell">Output Artifact</th>
                <th className="py-2.5 px-4 w-28 text-center">Status</th>
                <th className="py-2.5 px-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentPos.dailyRoutine.map((task) => (
                <tr
                  key={task.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    task.status === 'Completed'
                      ? 'bg-emerald-50/20'
                      : task.status === 'Exception'
                      ? 'bg-amber-50/30'
                      : ''
                  }`}
                >
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggle(task)}
                      className="focus:outline-none"
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
                        Executed at {task.completedAt}
                      </span>
                    )}
                    {task.notes && (
                      <div className="mt-1 text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                        <strong>Exception: </strong> {task.notes}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-medium text-[11px] hidden md:table-cell">
                    {task.outputArtifact}
                    <div className="text-[10px] text-slate-500">{task.verificationMethod}</div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        task.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : task.status === 'Exception'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {task.status}
                    </span>
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

    </div>
  );
};
