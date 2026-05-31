/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TaskStatus, Task } from '../types';
import TaskCard from './TaskCard';

interface BoardColumnProps {
  id: TaskStatus;
  label: string;
  emoji: string;
  tasks: Task[];
  onViewDetails: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, newStatus: any) => void;
  onDragStart: (e: any, taskId: string) => void;
  onDropTask: (taskId: string, targetStatus: TaskStatus) => void;
  isSupervisor?: boolean;
}

export default function BoardColumn({
  id,
  label,
  emoji,
  tasks,
  onViewDetails,
  onDeleteTask,
  onMoveTask,
  onDragStart,
  onDropTask,
  isSupervisor = false
}: BoardColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  // Style properties per status
  const getColStyle = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return {
          barColor: 'from-violet-500 to-indigo-500',
          textColor: 'text-violet-700 dark:text-violet-400',
          badgeBg: 'bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-300',
          borderColor: 'border-violet-100 dark:border-violet-950/20',
          backdrop: 'bg-slate-50/50 dark:bg-slate-900/30'
        };
      case 'in_progress':
        return {
          barColor: 'from-amber-500 to-orange-500',
          textColor: 'text-amber-700 dark:text-amber-400',
          badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
          borderColor: 'border-amber-100 dark:border-amber-950/20',
          backdrop: 'bg-slate-50/50 dark:bg-slate-900/30'
        };
      case 'done':
      default:
        return {
          barColor: 'from-emerald-500 to-teal-500',
          textColor: 'text-emerald-700 dark:text-emerald-400',
          badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
          borderColor: 'border-emerald-100 dark:border-emerald-950/20',
          backdrop: 'bg-slate-50/50 dark:bg-slate-900/30'
        };
    }
  };

  const cStyle = getColStyle(id);

  // Drag and Drop Event Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onDropTask(taskId, id);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col flex-1 min-w-[310px] w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-4 transition-all duration-300 pb-8 min-h-[550px] ${
        isDragOver ? 'drag-over-active shadow-lg ring-2 ring-purple-500/30 bg-purple-500/5' : ''
      }`}
    >
      {/* Column Gradient Header Line */}
      <div className={`h-1.5 w-full rounded-full bg-gradient-to-r ${cStyle.barColor} mb-4`} />

      {/* Column Name with Emoji and count */}
      <div className="flex items-center justify-between mb-4.5 px-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <h3 className={`font-bold text-sm sm:text-base ${cStyle.textColor}`}>{label}</h3>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold leading-none ${cStyle.badgeBg} font-mono`}>
          {tasks.length}
        </span>
      </div>

      {/* Tasks Stack Container */}
      <div className={`flex flex-col gap-3.5 flex-grow overflow-y-auto max-h-[600px] rounded-xl p-1.5 ${cStyle.backdrop}`}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onViewDetails={onViewDetails}
              onDeleteTask={onDeleteTask}
              onMoveTask={onMoveTask}
              onDragStart={onDragStart}
              isSupervisor={isSupervisor}
            />
          ))
        ) : (
          /* Hollow Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl flex-grow h-full bg-slate-50/20 dark:bg-slate-900/10">
            <span className="text-2xl mb-2 filter grayscale-30 block">📥</span>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">لیست در حال حاضر خالی است</p>
            <p className="text-[10px] text-slate-400/80 dark:text-slate-500/70 mt-1 max-w-[180px] leading-relaxed">
              تسک جدیدی تعریف کنید یا کارتی را به این بخش بکشید.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
