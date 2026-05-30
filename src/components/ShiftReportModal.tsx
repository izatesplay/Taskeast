/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Task, User } from '../types';
import { getDynamicUsers } from '../mockData';
import { X, Printer, FileText, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ShiftReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  currentUser: User;
}

export default function ShiftReportModal({
  isOpen,
  onClose,
  tasks,
  currentUser,
}: ShiftReportModalProps) {
  const mockUsers = getDynamicUsers();
  if (!isOpen) return null;

  const reportRef = useRef<HTMLDivElement>(null);

  // Stats calculation
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');
  const urgentCount = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length;

  // Handle native printer dialogue with styled print rules
  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const nowTimeStr = new Date().toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Export independent self-contained HTML report with high physical visual fidelity
  const handleDownloadHTML = () => {
    const reportHtml = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>گزارش نهایی وضعیت شیفت کاری مرکز تماس</title>
    <style>
        @import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');
        body {
            font-family: 'Vazirmatn', Tahoma, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 40px 20px;
            direction: rtl;
            text-align: right;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .header {
            border-bottom: 3px solid #0f172a;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h1 {
            font-size: 22px;
            font-weight: 900;
            color: #0f172a;
            margin: 0 0 8px 0;
        }
        .header p {
            font-size: 12px;
            color: #64748b;
            margin: 0;
        }
        .meta-info {
            font-size: 12px;
            color: #334155;
            line-height: 1.8;
            text-align: left;
        }
        .grid {
            display: grid;
            grid-template-cols: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 30px;
        }
        @media (max-width: 600px) {
            .grid {
                grid-template-cols: 1fr 1fr;
            }
        }
        .stat-card {
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 16px;
            text-align: center;
        }
        .stat-card.done {
            background-color: #ecfdf5;
            border-color: #a7f3d0;
            color: #065f46;
        }
        .stat-card.in-progress {
            background-color: #fffbeb;
            border-color: #fde68a;
            color: #92400e;
        }
        .stat-card.urgent {
            background-color: #fef2f2;
            border-color: #fca5a5;
            color: #991b1b;
        }
        .stat-label {
            font-size: 10px;
            color: #64748b;
            display: block;
            margin-bottom: 4px;
        }
        .stat-value {
            font-size: 20px;
            font-weight: 950;
        }
        .section-title {
            font-size: 14px;
            font-weight: 900;
            margin-top: 30px;
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 1px solid #cbd5e1;
            color: #1e1b4b;
        }
        .task-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 12px;
        }
        .task-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            flex-wrap: wrap;
            gap: 8px;
        }
        .task-title {
            font-size: 13px;
            font-weight: 700;
            color: #0d172a;
            margin: 0;
        }
        .badge {
            font-size: 9px;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 4px;
            background: #e2e8f0;
            color: #334155;
        }
        .badge.urgent {
            background: #ef4444;
            color: #ffffff;
        }
        .badge.done {
            background: #10b981;
            color: #ffffff;
        }
        .task-desc {
            font-size: 11.5px;
            color: #475569;
            margin: 0 0 12px 0;
            line-height: 1.6;
        }
        .task-footer {
            display: flex;
            justify-content: space-between;
            font-size: 9.5px;
            color: #64748b;
            border-top: 1px solid #f1f5f9;
            padding-top: 8px;
        }
        .signature-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px dashed #cbd5e1;
        }
        .signature-box {
            border: 1px dashed #cbd5e1;
            width: 150px;
            height: 70px;
            border-radius: 8px;
            margin-top: 4px;
        }
        .actions {
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
            gap: 12px;
        }
        .btn {
            background-color: #6366f1;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            font-family: inherit;
            font-weight: bold;
            font-size: 13px;
            cursor: pointer;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            transition: all 0.15s;
        }
        .btn:hover {
            opacity: 0.93;
        }
        @media print {
            .actions {
                display: none !important;
            }
            body {
                background: white;
                padding: 0;
            }
            .container {
                border: none;
                box-shadow: none;
                padding: 0;
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="actions">
        <button class="btn" onclick="window.print()">📥 چاپ مستقیم / ذخیره به عنوان PDF</button>
    </div>
    <div class="container">
        <div class="header">
            <div>
                <h1>گزارش نهایی وضعیت شیفت کاری مرکز تماس</h1>
                <p>سامانه مدیریت بلیت‌ها و هماهنگی صف‌های ترافیکی • گزارش پایان شیفت</p>
            </div>
            <div class="meta-info">
                <div>تاریخ گزارش: <strong>${todayStr} (${nowTimeStr})</strong></div>
                <div>مسئول گزارش: <strong>${currentUser.name}</strong></div>
                <div>سمت سازمانی: <em>${currentUser.role}</em></div>
            </div>
        </div>

        <div class="grid">
            <div class="stat-card">
                <span class="stat-label">تعداد کل بلیت‌ها</span>
                <span class="stat-value">${totalTasks}</span>
            </div>
            <div class="stat-card done">
                <span class="stat-label">اقدام نهایی شده (Done)</span>
                <span class="stat-value">${doneTasks.length}</span>
            </div>
            <div class="stat-card in-progress">
                <span class="stat-label">در حال بررسی (Progress)</span>
                <span class="stat-value">${inProgressTasks.length}</span>
            </div>
            <div class="stat-card urgent">
                <span class="stat-label">بحرانی فعال (Urgent)</span>
                <span class="stat-value">${urgentCount}</span>
            </div>
        </div>

        <div>
            <div class="section-title">📋 در انتظار اقدام (${todoTasks.length})</div>
            ${todoTasks.map(task => `
                <div class="task-card">
                    <div class="task-header">
                        <h4 class="task-title">${task.title}</h4>
                        <span class="badge ${task.priority === 'urgent' ? 'urgent' : ''}">
                            ${task.priority === 'urgent' ? 'فوری' : task.priority === 'high' ? 'مهم' : 'متوسط'}
                        </span>
                    </div>
                    <p class="task-desc">${task.description}</p>
                    <div class="task-footer">
                        <span>مهلت: <strong>${task.dueDate}</strong></span>
                        <span>اپراتورها: <strong>${mockUsers.filter(u => task.assignedUsers.includes(u.id)).map(u => u.name).join('، ') || 'بدون اپراتور'}</strong></span>
                    </div>
                </div>
            `).join('')}
            ${todoTasks.length === 0 ? '<p style="font-size:12px; color:#94a3b8; font-style:italic; text-align:center; padding: 10px;">بلیت فعالی در انتظار اقدام وجود ندارد.</p>' : ''}
        </div>

        <div>
            <div class="section-title">⚡ در حال بررسی و اقدام (${inProgressTasks.length})</div>
            ${inProgressTasks.map(task => `
                <div class="task-card">
                    <div class="task-header">
                        <h4 class="task-title">${task.title}</h4>
                        <span class="badge ${task.priority === 'urgent' ? 'urgent' : ''}">
                            ${task.priority === 'urgent' ? 'فوری' : task.priority === 'high' ? 'مهم' : 'متوسط'}
                        </span>
                    </div>
                    <p class="task-desc">${task.description}</p>
                    <div class="task-footer">
                        <span>مهلت مأموریت: <strong>${task.dueDate}</strong></span>
                        <span>مسئولین: <strong>${mockUsers.filter(u => task.assignedUsers.includes(u.id)).map(u => u.name).join('، ') || 'بدون اپراتور'}</strong></span>
                    </div>
                </div>
            `).join('')}
            ${inProgressTasks.length === 0 ? '<p style="font-size:12px; color:#94a3b8; font-style:italic; text-align:center; padding: 10px;">هیچ بلیت فعالی در حال بررسی نیست.</p>' : ''}
        </div>

        <div>
            <div class="section-title">🎯 انجام‌شده و بایگانی (${doneTasks.length})</div>
            ${doneTasks.map(task => `
                <div class="task-card">
                    <div class="task-header">
                        <h4 class="task-title">${task.title}</h4>
                        <span class="badge done">ثبت موفق</span>
                    </div>
                    <p class="task-desc">${task.description}</p>
                    <div class="task-footer">
                        <span>تاریخ ثبت بلیت: <strong>${task.createdAt}</strong></span>
                        <span>مسئول: <strong>${mockUsers.filter(u => task.assignedUsers.includes(u.id)).map(u => u.name).join('، ') || 'بدون اپراتور'}</strong></span>
                    </div>
                </div>
            `).join('')}
            ${doneTasks.length === 0 ? '<p style="font-size:12px; color:#94a3b8; font-style:italic; text-align:center; padding: 10px;">هنوز تسکی در این شیفت کاری نهایی نشده است.</p>' : ''}
        </div>

        <div class="signature-section">
            <div>
                <p style="font-size:12px; font-weight:bold; margin:0 0 6px 0;">ملاحظات دپارتمان پاسخگویی:</p>
                <p style="font-size:10px; color:#64748b; margin:0; max-width:400px;">کلیه تماس‌ها و بلیت‌ها با شاخص رضایت روزانه تطبیق داده شده و پرونده‌های بحرانی ارجاع شدند.</p>
            </div>
            <div>
                <p style="font-size:11px; font-weight:bold; margin:0;">امضاء و تایید گزارش شیفت</p>
                <div class="signature-box"></div>
            </div>
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `report-shift-${Date.now()}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 print:p-0 print:absolute print:inset-0 print:bg-white print:backdrop-blur-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col print:border-none print:shadow-none print:max-h-full print:w-full print:rounded-none">
        
        {/* 1. Modal Top Header (Hidden on Print) */}
        <div className="p-5 border-b border-slate-150 dark:border-slate-800/80 flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 print:hidden shrink-0">
          <div className="text-right">
            <h3 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">گزارش خلاصه شیفت کانبان کالسنتر</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">آماده‌سازی فایل چاپی و PDF انتهای ترخیص شیفت</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              id="download-summary-action-btn"
              onClick={handleDownloadHTML}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
              title="دانلود گزارش آفلاین با کیفیت بالا جهت پرینت تمیز"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود فایل گزارش مستقل</span>
            </button>

            <button
              id="print-summary-action-btn"
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-purple-650 to-purple-600 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>چاپ مستقیم شیفت</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* 2. Print Content Canvas */}
        <div 
          ref={reportRef}
          className="p-8 sm:p-12 overflow-y-auto flex-grow text-slate-800 print:text-black print:p-0 print:overflow-visible text-right bg-white dark:bg-slate-900 print:bg-white"
        >
          
          {/* Header Report Frame */}
          <div className="border-b-2 border-slate-900 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white print:text-black">
                گزارش نهایی وضعیت شیفت کاری مرکز تماس
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 print:text-slate-600 leading-relaxed">
                سامانه مدیریت بلیت‌ها و هماهنگی صف‌های ترافیکی • گزارش پایان شیفت
              </p>
            </div>
            
            <div className="text-left sm:text-left text-xs text-slate-600 dark:text-slate-400 print:text-black font-mono space-y-1">
              <p>تاریخ: <span>{todayStr} ({nowTimeStr})</span></p>
              <p>مسئول گزارش: <span className="font-bold">{currentUser.name}</span></p>
              <p>سمت: <span className="italic">{currentUser.role}</span></p>
            </div>
          </div>

          {/* KPI Dashboard stats Grid inside Report */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 print:bg-slate-100 print:text-black">
              <span className="text-[10px] text-slate-400 block mb-1">تعداد کل بلیت‌ها</span>
              <span className="text-xl font-mono font-black">{totalTasks}</span>
            </div>
            <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 print:bg-slate-100 print:text-black">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mb-1">اقدام نهایی شده (Done)</span>
              <span className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400">{doneTasks.length}</span>
            </div>
            <div className="p-4 bg-amber-50/45 dark:bg-amber-950/10 rounded-2xl border border-amber-100 dark:border-amber-800/30 print:bg-slate-100 print:text-black">
              <span className="text-[10px] text-amber-600 dark:text-amber-400 block mb-1">در حال بررسی (Progress)</span>
              <span className="text-xl font-mono font-black text-amber-600 dark:text-amber-400">{inProgressTasks.length}</span>
            </div>
            <div className="p-4 bg-red-55/10 bg-red-50/40 dark:bg-red-950/10 rounded-2xl border border-red-100 dark:border-red-800/30 print:bg-slate-100 print:text-black col-span-2 md:col-span-1">
              <span className="text-[10px] text-red-600 dark:text-red-400 block mb-1">بحرانی فعال (Urgent)</span>
              <span className="text-xl font-mono font-black text-red-600 dark:text-red-400">{urgentCount}</span>
            </div>
          </div>

          {/* Detail List grouped by columns */}
          <div className="space-y-8">
            
            {/* 1. Todo tasks list */}
            <div>
              <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-rose-500/20">
                <span className="text-base">📋</span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">در انتظار اقدام ({todoTasks.length})</h3>
              </div>
              
              <div className="space-y-3">
                {todoTasks.map(task => (
                  <div key={task.id} className="p-4.5 bg-slate-50 dark:bg-slate-950/35 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">{task.title}</h4>
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-md ${
                        task.priority === 'urgent' ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {task.priority === 'urgent' ? 'فوری' : task.priority === 'high' ? 'مهم' : 'متوسط'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{task.description}</p>
                    <div className="flex justify-between items-center text-[10px] mt-3 pt-2.5 border-t border-slate-200/40 dark:border-slate-800/40 text-slate-400">
                      <span>مهلت: <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{task.dueDate}</span></span>
                      <span>اپراتورها: <span className="font-bold text-slate-600 dark:text-slate-300">
                        {mockUsers.filter(u => task.assignedUsers.includes(u.id)).map(u => u.name).join('، ') || 'بدون اپراتور'}
                      </span></span>
                    </div>
                  </div>
                ))}
                {todoTasks.length === 0 && (
                  <p className="text-[11px] italic text-slate-400">تسک فعالی در این ستون نیست.</p>
                )}
              </div>
            </div>

            {/* 2. In Progress tasks list */}
            <div>
              <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-amber-500/20">
                <span className="text-base">⚡</span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">در حال بررسی و اقدام ({inProgressTasks.length})</h3>
              </div>
              
              <div className="space-y-3">
                {inProgressTasks.map(task => (
                  <div key={task.id} className="p-4.5 bg-slate-50 dark:bg-slate-950/35 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl text-right">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">{task.title}</h4>
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-md ${
                        task.priority === 'urgent' ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {task.priority === 'urgent' ? 'فوری' : task.priority === 'high' ? 'مهم' : 'متوسط'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{task.description}</p>
                    <div className="flex justify-between items-center text-[10px] mt-3 pt-2.5 border-t border-slate-200/40 dark:border-slate-800/40 text-slate-400">
                      <span>مهلت مأموریت: <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{task.dueDate}</span></span>
                      <span>مسئولین: <span className="font-bold text-slate-600 dark:text-slate-300">
                        {mockUsers.filter(u => task.assignedUsers.includes(u.id)).map(u => u.name).join('، ') || 'بدون اپراتور'}
                      </span></span>
                    </div>
                  </div>
                ))}
                {inProgressTasks.length === 0 && (
                  <p className="text-[11px] italic text-slate-400">هیچ تسکی در حال حاضر فعال نیست.</p>
                )}
              </div>
            </div>

            {/* 3. Done tasks list */}
            <div>
              <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-emerald-500/20">
                <span className="text-base">🎯</span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">انجام‌شده و بایگانی ({doneTasks.length})</h3>
              </div>
              
              <div className="space-y-3">
                {doneTasks.map(task => (
                  <div key={task.id} className="p-4.5 bg-slate-50 dark:bg-slate-950/35 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-teal-850 text-slate-800 dark:text-slate-100 leading-tight">{task.title}</h4>
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-md">
                        موفق
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{task.description}</p>
                    <div className="flex justify-between items-center text-[10px] mt-3 pt-2.5 border-t border-slate-200/40 dark:border-slate-800/40 text-slate-400">
                      <span>تاریخ ثبت بلیت: <span className="font-mono text-slate-600 dark:text-slate-300">{task.createdAt}</span></span>
                      <span>توسط: <span className="font-bold text-slate-600 dark:text-slate-300">{
                        mockUsers.filter(u => task.assignedUsers.includes(u.id)).map(u => u.name).join('، ') || 'بدون اپراتور'
                      }</span></span>
                    </div>
                  </div>
                ))}
                {doneTasks.length === 0 && (
                  <p className="text-[11px] italic text-slate-400">هنوز تسکی به پایان نرسیده است.</p>
                )}
              </div>
            </div>

          </div>

          {/* Supervisor signature section */}
          <div className="mt-16 pt-8 border-t border-dashed border-slate-300 flex justify-between items-end text-right">
            <div>
              <p className="text-xs font-bold text-slate-750 text-slate-700 dark:text-slate-300">ملاحظات دپارتمان پاسخگویی:</p>
              <p className="text-[10px] text-slate-400 mt-1">کلیه تماس‌ها و بلیت‌ها با شاخص رضایت روزانه تطبیق داده شده و پرونده‌های بحرانی ارجاع شدند.</p>
            </div>
            <div className="text-left font-mono">
              <p className="text-xs font-bold">محل امضاء و تایید شیفت</p>
              <div className="w-32 h-14 border border-dashed border-slate-300/60 rounded-lg mt-1" />
            </div>
          </div>

        </div>

        {/* CSS Print Stylesheet injected inline for high physical and layout fidelity */}
        <style>{`
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            .dark {
              --background: 255 255 255 !important;
              --foreground: 0 0 0 !important;
            }
            header, nav, footer, button, select {
              display: none !important;
            }
            .max-h-\\[90vh\\] {
              max-height: none !important;
              overflow: visible !important;
            }
            .shadow-2xl {
              box-shadow: none !important;
            }
            .border {
              border-color: #e2e8f0 !important;
            }
            .rounded-3xl {
              border-radius: 0 !important;
            }
          }
        `}</style>

      </div>
    </div>
  );
}
