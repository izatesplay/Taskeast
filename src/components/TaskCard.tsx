/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Task, User, TaskPriority, TaskStatus } from '../types';
import { 
  Calendar, 
  MessageSquare, 
  Trash2, 
  Eye, 
  UserPlus, 
  ArrowLeftRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { getDynamicUsers } from '../mockData';

interface TaskCardProps {
  key?: any;
  task: Task;
  onViewDetails: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, newStatus: any) => void;
  onDragStart: (e: any, taskId: string) => void;
}

export default function TaskCard({ 
  task, 
  onViewDetails, 
  onDeleteTask, 
  onMoveTask,
  onDragStart 
}: TaskCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // Resolve assigned users
  const assignedTeam = getDynamicUsers().filter(u => task.assignedUsers.includes(u.id));

  // Determine priority styling
  const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return {
          gradient: 'bg-gradient-to-r from-red-600 via-rose-500 to-red-600',
          bg: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/40',
          label: 'فوری 🔥',
          borderCol: 'border-r-4 border-r-rose-500'
        };
      case 'high':
        return {
          gradient: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600',
          bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40',
          label: 'مهم ⚡',
          borderCol: 'border-r-4 border-r-amber-500'
        };
      case 'medium':
        return {
          gradient: 'bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500',
          bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900/40',
          label: 'متوسط 💠',
          borderCol: 'border-r-4 border-r-blue-500'
        };
      case 'low':
        default:
        return {
          gradient: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/40',
          label: 'عادی 📋',
          borderCol: 'border-r-4 border-r-emerald-500'
        };
    }
  };

  const style = getPriorityStyle(task.priority);

  // Format Persian/Intl due date safely
  const formatTime = (isoString?: string) => {
    if (!isoString) return '--';
    return isoString;
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className={`group relative bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4.5 shadow-xs hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-grab active:cursor-grabbing ${style.borderCol}`}
    >
      {/* Visual Priority Glow Line on Top */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl opacity-80 ${style.gradient}`} />

      {/* Card Header */}
      <div className="flex items-center justify-between gap-1.5 mb-2.5 pt-1">
        <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border ${style.bg}`}>
          {style.label}
        </span>
        <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{task.createdAt.split(' ')[1] || '08:00'}</span>
        </div>
      </div>

      {/* Task Content */}
      <div className="space-y-1.5">
        <h4 
          onClick={() => onViewDetails(task)}
          className="text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer line-clamp-1 select-none"
        >
          {task.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed h-8">
          {task.description || 'توضیحاتی ثبت نشده است.'}
        </p>
      </div>

      {/* Inline Divider */}
      <div className="my-3.5 border-t border-slate-100 dark:border-slate-800/80" />

      {/* Task Footer containing assigned agents, comment count, and deadline */}
      <div className="flex items-center justify-between">
        
        {/* Date Indicator */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono">{formatTime(task.dueDate)}</span>
        </div>

        {/* Assigned Avatars Stack */}
        <div className="flex items-center">
          {assignedTeam.length > 0 ? (
            <div className="flex -space-x-2 space-x-reverse relative">
              {assignedTeam.slice(0, 3).map((u) => (
                <div
                  key={u.id}
                  title={`${u.name} - ${u.role}`}
                  className={`w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 ${u.avatarColor} ${u.textColor} flex items-center justify-center text-[10px] font-bold shadow-xs select-none`}
                >
                  {u.initials}
                </div>
              ))}
              {assignedTeam.length > 3 && (
                <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[9px] font-mono font-bold">
                  +{assignedTeam.length - 3}
                </div>
              )}
            </div>
          ) : (
            <span className="text-[10px] text-slate-400 italic">بدون اپراتور</span>
          )}
        </div>

      </div>

      {/* Additional Interactive Detail Section (Comments / Action Tools) */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
        
        {/* Comment indicators */}
        <div className="flex items-center gap-3 text-slate-400">
          <div className="flex items-center gap-1 text-[11px]" title="یادداشت‌های ثبت‌شده">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="font-mono">{task.notes.length}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Quick Action Move Select list */}
          <div className="relative inline-flex items-center" title="تغییر سریع ستون">
            <select
              value={task.status}
              onChange={(e) => onMoveTask(task.id, e.target.value as 'todo' | 'in_progress' | 'done')}
              className="appearance-none bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/20 text-[10px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 pl-6 pr-2.5 py-1 rounded-md cursor-pointer transition-colors focus:ring-1 focus:ring-purple-500 outline-none"
            >
              <option value="todo">📋 منتظر</option>
              <option value="in_progress">⚡ در حال انجام</option>
              <option value="done">✅ انجام شده</option>
            </select>
            <ArrowLeftRight className="w-3 h-3 text-slate-400 absolute left-2 pointer-events-none" />
          </div>

          {/* View Details Button */}
          <button
            onClick={() => onViewDetails(task)}
            className="p-1 px-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 rounded border border-slate-200/40 dark:border-slate-700 transition-colors"
            title="مشاهده جزئیات و یادداشت‌ها"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="p-1 px-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded border border-slate-200/40 dark:border-slate-700 transition-colors"
            title="حذف تسک"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Modern, Self-Contained Persian Deletion Confirmation Overlay */}
      {showConfirmDelete && (
        <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/98 rounded-2xl flex flex-col items-center justify-center p-4.5 z-25 text-center border border-rose-500/30 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <AlertTriangle className="w-8 h-8 text-rose-500 mb-2 animate-pulse" />
          <h5 className="text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400">حذف بلیت کاری</h5>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed max-w-[200px]">
            آیا از حذف دائم این بلیت اطمینان دارید؟ تغییرات قابل بازگشت نخواهد بود.
          </p>
          <div className="flex items-center gap-2 w-full max-w-[190px]">
            <button
              onClick={() => {
                onDeleteTask(task.id);
                setShowConfirmDelete(false);
              }}
              className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer shadow-sm"
              title="تایید حذف بلیت"
            >
              بله، حذف
            </button>
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 active:scale-95 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-[10px] transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700"
              title="لغو عملیات"
            >
              انصراف
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
