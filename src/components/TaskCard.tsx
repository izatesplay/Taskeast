/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Task, User, TaskPriority, TaskStatus } from '../types';
import { 
  Calendar, 
  MessageSquare, 
  Trash2, 
  Eye, 
  ArrowLeftRight,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import { getDynamicUsers } from '../mockData';

interface TaskCardProps {
  key?: any;
  task: Task;
  onViewDetails: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, newStatus: any) => void;
  onDragStart: (e: any, taskId: string) => void;
  isSupervisor?: boolean;
}

export default function TaskCard({ 
  task, 
  onViewDetails, 
  onDeleteTask, 
  onMoveTask,
  onDragStart,
  isSupervisor = false
}: TaskCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 3D Tilt Effect of individual cards on hover
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    // Calculate cursor location from center of card (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Set tilting degrees (maximum tilt of 10 degrees)
    setTilt({ x: x * 15, y: y * -15 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Resolve assigned users
  const assignedTeam = getDynamicUsers().filter(u => task.assignedUsers?.includes(u.id));

  // Determine priority styling
  const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return {
          gradient: 'from-rose-600 via-red-500 to-rose-600',
          shadowGlow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]',
          bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/40',
          label: 'فوری 🔥',
          borderCol: 'border-r-4 border-r-rose-500'
        };
      case 'high':
        return {
          gradient: 'from-amber-500 via-orange-500 to-amber-600',
          shadowGlow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
          bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40',
          label: 'مهم ⚡',
          borderCol: 'border-r-4 border-r-amber-500'
        };
      case 'medium':
        return {
          gradient: 'from-purple-550 via-purple-500 to-indigo-500',
          shadowGlow: 'hover:shadow-[0_0_20px_rgba(147,51,234,0.18)]',
          bg: 'bg-purple-50 text-purple-755 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-900/40',
          label: 'متوسط 💠',
          borderCol: 'border-r-4 border-r-purple-500'
        };
      case 'low':
      default:
        return {
          gradient: 'from-emerald-500 via-teal-500 to-emerald-600',
          shadowGlow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
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
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.28, type: 'spring', stiffness: 120, damping: 14 }}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateZ(${isHovered ? '8px' : '0px'})`,
        transition: 'transform 0.15s ease-out',
        transformStyle: 'preserve-3d',
        direction: 'rtl'
      }}
      className={`group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4.5 shadow-sm ${style.shadowGlow} transition-shadow duration-300 cursor-grab active:cursor-grabbing ${style.borderCol}`}
    >
      {/* 3D Inner Layer highlighting element */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-2xl pointer-events-none" />
      )}

      {/* Visual Priority Glow Line on Top */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl opacity-90 bg-gradient-to-r ${style.gradient}`} />

      {/* Card Header */}
      <div className="flex items-center justify-between gap-1.5 mb-2.5 pt-1" style={{ transform: 'translateZ(15px)' }}>
        <span className={`text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full border ${style.bg}`}>
          {style.label}
        </span>
        <div className="text-[10px] text-slate-400 dark:text-slate-505 dark:text-slate-500 flex items-center gap-1 font-mono font-semibold">
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span>{task.createdAt.split(' ')[1] || '08:00'}</span>
        </div>
      </div>

      {/* Task Content */}
      <div className="space-y-1.5" style={{ transform: 'translateZ(20px)' }}>
        <h4 
          onClick={() => onViewDetails(task)}
          className="text-sm font-black text-slate-800 dark:text-slate-100 hover:text-purple-650 dark:hover:text-purple-400 transition-colors cursor-pointer line-clamp-1 select-none"
        >
          {task.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed h-8 text-right overflow-hidden">
          {task.description || 'توضیحاتی برای این تسک ثبت نشده است.'}
        </p>
      </div>

      {/* Inline Divider */}
      <div className="my-3.5 border-t border-slate-150 dark:border-slate-800/80" />

      {/* Task Footer containing assigned agents, comment count, and deadline */}
      <div className="flex items-center justify-between" style={{ transform: 'translateZ(10px)' }}>
        
        {/* Date Indicator */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-bold">
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
                  className={`w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 ${u.avatarColor} ${u.textColor} flex items-center justify-center text-[10px] font-black shadow-xs select-none`}
                >
                  {u.initials}
                </div>
              ))}
              {assignedTeam.length > 3 && (
                <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-850 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[9px] font-mono font-bold">
                  +{assignedTeam.length - 3}
                </div>
              )}
            </div>
          ) : (
            <span className="text-[10px] text-slate-400 italic">بدون کاربر</span>
          )}
        </div>

      </div>

      {/* Additional Interactive Detail Section (Comments / Action Tools) */}
      <div className="mt-3 pt-3 border-t border-slate-150 dark:border-slate-805/60 dark:border-slate-800/60 flex items-center justify-between text-xs" style={{ transform: 'translateZ(12px)' }}>
        
        {/* Comment indicators & Checklist Progress */}
        <div className="flex items-center gap-3 text-slate-400">
          <div className="flex items-center gap-1 text-[11px] font-bold" title="پیام‌های چت تیمی">
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-mono">{task.chatMessages?.length || 0}</span>
          </div>

          {task.checklist && task.checklist.length > 0 && (
            <div 
              className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 bg-purple-50/40 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 rounded border border-purple-500/10 cursor-help" 
              title="پیشرفت اقدامات چک‌لیست"
            >
              <Sparkles className="w-3 h-3 text-purple-500 shrink-0" />
              <span className="font-mono">
                {task.checklist.filter(ch => ch.completed).length}/{task.checklist.length}
              </span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Quick Action Move Select list */}
          <div className="relative inline-flex items-center" title="تغییر سریع ستون">
            <select
              value={task.status}
              onChange={(e) => onMoveTask(task.id, e.target.value as 'todo' | 'in_progress' | 'done')}
              className="appearance-none bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 pl-6 pr-2.5 py-1 rounded-md cursor-pointer transition-colors focus:ring-1 focus:ring-purple-500 outline-none"
            >
              <option value="todo">📋 منتظر</option>
              <option value="in_progress">⚡ در حال انجام</option>
              <option value="done">✅ انجام شده</option>
            </select>
            <ArrowLeftRight className="w-3 h-3 text-slate-405 text-slate-400 absolute left-2 pointer-events-none" />
          </div>

          {/* View Details Button */}
          <button
            onClick={() => onViewDetails(task)}
            className="p-1 px-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/40 text-slate-500 dark:text-slate-400 hover:text-purple-650 dark:hover:text-purple-300 rounded border border-slate-200/40 dark:border-slate-700 transition-colors"
            title="مشاهده جزئیات و یادداشت‌ها"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Delete Button */}
          {isSupervisor && (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-1 px-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/40 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-450 rounded border border-slate-200/40 dark:border-slate-700 transition-colors"
              title="حذف تسک"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Modern, Self-Contained Persian Deletion Confirmation Overlay */}
      {showConfirmDelete && (
        <div className="absolute inset-0 bg-white/98 dark:bg-slate-900/98 rounded-2xl flex flex-col items-center justify-center p-4.5 z-25 text-center border border-rose-500/30 shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
          {/* Critical Action warning background color pulse */}
          <div className="absolute inset-0 bg-rose-500/10 dark:bg-rose-500/15 animate-[pulse_1.5s_infinite] pointer-events-none" />
          <AlertTriangle className="w-8 h-8 text-rose-500 mb-2 animate-pulse z-10" />
          <h5 className="text-xs sm:text-sm font-black text-rose-650 text-rose-600 dark:text-rose-400">حذف تسک کاری</h5>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed max-w-[200px]">
            آیا از حذف دائم این تسک اطمینان دارید؟ تغییرات قابل بازگشت نخواهد بود.
          </p>
          <div className="flex items-center gap-2 w-full max-w-[190px] z-10">
            <button
              onClick={() => {
                onDeleteTask(task.id);
                setShowConfirmDelete(false);
              }}
              className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer shadow-sm"
              title="تایید حذف تسک"
            >
              بله، حذف مجدد
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
    </motion.div>
  );
}
