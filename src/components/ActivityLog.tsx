/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  Move, 
  Search, 
  Filter, 
  X, 
  AlertCircle, 
  User, 
  Clock, 
  Layers,
  FileSpreadsheet
} from 'lucide-react';

export interface ActivityLogItem {
  id: string;
  taskId?: string;
  taskTitle: string;
  user: {
    id: string;
    name: string;
    role: string;
    avatarColor: string;
    initials: string;
  };
  type: 'status_change' | 'deletion' | 'creation' | 'edit';
  details: string;
  timestamp: string; // ISO String
}

interface ActivityLogProps {
  logs: ActivityLogItem[];
  onClearLogs?: () => void;
  isManager: boolean;
}

export default function ActivityLog({ logs, onClearLogs, isManager }: ActivityLogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'status_change' | 'deletion'>('all');

  const getPersianType = (type: string) => {
    switch(type) {
      case 'status_change': return 'تغییر وضعیت بلیت';
      case 'deletion': return 'حذف قطعی بلیت';
      case 'creation': return 'ایجاد بلیت جدید';
      case 'edit': return 'ویرایش مشخصات';
      default: return 'سایر فعالیت‌ها';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getLogBadgeColors = (type: string) => {
    switch(type) {
      case 'status_change': 
        return 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20';
      case 'deletion': 
        return 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20';
      case 'creation': 
        return 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20';
      default: 
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  const getLogIcon = (type: string) => {
    switch(type) {
      case 'status_change': 
        return <Move className="w-4 h-4 text-blue-500" />;
      case 'deletion': 
        return <Trash2 className="w-4 h-4 text-rose-500" />;
      default: 
        return <History className="w-4 h-4 text-amber-500" />;
    }
  };

  const formatPersianDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const timeStr = date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
      const dateStr = date.toLocaleDateString('fa-IR', { month: 'long', day: 'numeric' });
      return `${dateStr} ساعت ${timeStr}`;
    } catch (e) {
      return 'نامشخص';
    }
  };

  if (!isManager) {
    return (
      <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-3xl text-right flex flex-col items-center justify-center gap-3 text-rose-600 dark:text-rose-400">
        <AlertCircle className="w-10 h-10" />
        <h4 className="font-black text-sm">عدم دسترسی کافی</h4>
        <p className="text-xs text-slate-500 text-center max-w-md">این بخش منحصراً مخصوص سوپروایزر یا مدیر شیفت کالسنتر می‌باشد و دسترسی شما مجاز نیست.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 sm:p-6 text-right font-sans shadow-xs space-y-6">
      
      {/* Header and overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/10 dark:bg-indigo-650/10 rounded-2xl border border-indigo-500/15 text-indigo-600 dark:text-indigo-400">
            <History className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-base sm:text-lg">تاریخچه و لاگ فعالیت‌های بورد شیفت</h3>
            <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1">رهگیری دقیق تمامی تغییر وضعیت‌های بلیت یا بلیت‌های حذف شده کالسنتر با قابلیت فیلترینگ مستقل</p>
          </div>
        </div>

        {onClearLogs && logs.length > 0 && (
          <button
            type="button"
            onClick={onClearLogs}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40 rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            پاک کردن سوابق لاگ
          </button>
        )}
      </div>

      {/* Filter Bar Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch justify-between">
        
        {/* Right input search fields */}
        <div className="flex flex-wrap items-center gap-3 flex-grow">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو بر اساس عنوان بلیت، اپراتور یا اقدام..."
              className="w-full text-xs p-3 pr-10 pl-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 transition-all text-right"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute left-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative min-w-[160px]">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="appearance-none w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs p-3 pl-8 pr-3.5 rounded-2xl cursor-pointer outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 font-bold"
            >
              <option value="all">🔍 همه سوابق</option>
              <option value="status_change">🔄 جا‌به‌جایی‌های ستون</option>
              <option value="deletion">❌ عملیات‌های حذف بلیت</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Stats brief */}
        <div className="flex items-center gap-2 self-end shrink-0 text-[11px] font-black text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-850">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>تعداد کل سوابق یافت شده: </span>
          <span className="font-mono text-slate-800 dark:text-slate-100 text-xs">{filteredLogs.length}</span>
        </div>
      </div>

      {/* Logs Table or Timeline */}
      {filteredLogs.length > 0 ? (
        <div className="relative border-r border-slate-150 dark:border-slate-800 pr-5 py-2 space-y-6">
          {filteredLogs.map((log) => (
            <div key={log.id} className="relative group">
              
              {/* Timeline Indicator dot */}
              <div className="absolute -right-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-950 border-2 border-indigo-500 flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                <span className="w-1 h-1 rounded-full bg-indigo-500" />
              </div>

              {/* Log Item Card Container */}
              <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-150 dark:border-slate-850/70 p-4 rounded-2xl hover:bg-slate-100/40 dark:hover:bg-slate-950/60 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Right side details / Author */}
                <div className="flex items-start gap-4">
                  {/* Operator Initials Icon */}
                  <span className={`w-9 h-9 rounded-full ${log.user.avatarColor} text-white text-[11px] font-black flex items-center justify-center shrink-0 border border-white dark:border-slate-900 shadow-xs mt-0.5 sm:mt-0`}>
                    {log.user.initials}
                  </span>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-100">{log.user.name}</span>
                      <span className="text-[9px] px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-md">
                        {log.user.role}
                      </span>
                      
                      <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold border ${getLogBadgeColors(log.type)}`}>
                        {getPersianType(log.type)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                      بلیت: <strong className="text-slate-800 dark:text-slate-100">«{log.taskTitle}»</strong> • {log.details}
                    </p>
                  </div>
                </div>

                {/* Left side timestamp */}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium self-end sm:self-center shrink-0">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{formatPersianDateTime(log.timestamp)}</span>
                </div>

              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-950/20 p-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center gap-2.5">
          <History className="w-10 h-10 text-slate-300 dark:text-slate-700 animate-pulse" />
          <h4 className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300">هیچ لاگ یا سابقه‌ی فعالیتی یافت نشد</h4>
          <p className="text-[10px] sm:text-xs text-slate-500">یافته‌ای برای فیلترهای کنونی در جدول تاریخچه‌ی تخته وجود ندارد.</p>
        </div>
      )}

    </div>
  );
}
