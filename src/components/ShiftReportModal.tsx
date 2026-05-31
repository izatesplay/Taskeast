/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Task, User } from '../types';
import { getDynamicUsers } from '../mockData';
import { 
  X, 
  Printer, 
  FileText, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ShieldAlert, 
  Award, 
  Users, 
  Info,
  Layers,
  History,
  TrendingUp,
  FileCheck2
} from 'lucide-react';
import { ActivityLogItem } from './ActivityLog';

interface ShiftReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  currentUser: User;
  activityLogs?: ActivityLogItem[];
  isSupervisor?: boolean;
}

export default function ShiftReportModal({
  isOpen,
  onClose,
  tasks,
  currentUser,
  activityLogs = [],
  isSupervisor = false,
}: ShiftReportModalProps) {
  if (!isOpen) return null;

  const mockUsers = getDynamicUsers();
  const reportRef = useRef<HTMLDivElement>(null);

  // Stats calculation
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');
  
  const urgentCount = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length;
  const highCount = tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length;
  const mediumCount = tasks.filter((t) => t.priority === 'medium' && t.status !== 'done').length;

  const completionRate = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0;

  // Generate unique report serial number
  const today = new Date();
  const reportSerial = `RPT-1405-${today.getMonth() + 1}${today.getDate()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const todayStr = today.toLocaleDateString('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const nowTimeStr = today.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Handle native printer dialogue with styled print rules
  const handlePrint = () => {
    window.print();
  };

  // Export independent self-contained HTML report with high physical visual fidelity
  const handleDownloadHTML = () => {
    const reportHtml = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>گزارش اداری پایان شیفت - مرکز دیسپچنگ کالسنتر</title>
    <style>
        @import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');
        
        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Vazirmatn', Tahoma, sans-serif;
            background-color: #f1f5f9;
            color: #0f172a;
            margin: 0;
            padding: 30px 15px;
            direction: rtl;
            text-align: right;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: #ffffff;
            border: 2px solid #cbd5e1;
            border-radius: 20px;
            padding: 35px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
            position: relative;
        }

        /* Top Bar Decorators */
        .official-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px double #0f172a;
            padding-bottom: 20px;
            margin-bottom: 25px;
        }

        .official-logo-area {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .seal-decoration {
            width: 60px;
            height: 60px;
            border: 2px dashed #4f46e5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            font-weight: 900;
            color: #4f46e5;
            text-align: center;
            transform: rotate(-10deg);
        }

        .official-title {
            margin: 0;
        }

        .official-title h1 {
            font-size: 20px;
            font-weight: 950;
            color: #1e1b4b;
            margin: 0 0 6px 0;
            letter-spacing: -0.5px;
        }

        .official-title p {
            font-size: 11px;
            color: #64748b;
            margin: 0;
        }

        .meta-stamp {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px 20px;
            font-size: 11px;
            color: #334155;
            line-height: 1.8;
            min-width: 220px;
        }

        .badge-confidential {
            display: inline-block;
            background-color: #fef2f2;
            color: #991b1b;
            font-weight: 900;
            padding: 2px 8px;
            border: 1px solid #fecaca;
            border-radius: 6px;
            font-size: 10px;
            margin-bottom: 6px;
        }

        /* Statistics Bento Dashboard */
        .grid-stats {
            display: grid;
            grid-template-cols: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: #fafafa;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 18px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .stat-card.done {
            background-color: #f0fdf4;
            border-color: #bbf7d0;
            color: #166534;
        }

        .stat-card.in-progress {
            background-color: #fffbeb;
            border-color: #fef3c7;
            color: #854d0e;
        }

        .stat-card.urgent {
            background-color: #fef2f2;
            border-color: #fca5a5;
            color: #991b1b;
        }

        .stat-label {
            font-size: 10px;
            color: #475569;
            display: block;
            margin-bottom: 6px;
            font-weight: 700;
        }

        .stat-value {
            font-size: 24px;
            font-weight: 950;
            font-family: 'Courier New', monospace, sans-serif;
        }

        /* Subsections layout styling */
        .section-header {
            background: #1e293b;
            color: #ffffff;
            font-size: 13px;
            font-weight: 900;
            padding: 10px 16px;
            border-radius: 8px;
            margin-top: 35px;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .section-badge {
            background: rgba(255, 255, 255, 0.2);
            color: #ffffff;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
        }

        /* Tasks Tables */
        table.report-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            font-size: 11px;
        }

        table.report-table th {
            background-color: #f1f5f9;
            color: #334155;
            font-weight: 900;
            border: 1px solid #cbd5e1;
            padding: 10px 12px;
            text-align: right;
        }

        table.report-table td {
            border: 1px solid #e2e8f0;
            padding: 10px 12px;
            vertical-align: top;
            line-height: 1.6;
        }

        table.report-table tr:nth-child(even) td {
            background-color: #f8fafc;
        }

        .priority-badge {
            display: inline-block;
            font-size: 9px;
            font-weight: 900;
            padding: 2px 6px;
            border-radius: 4px;
            text-align: center;
        }

        .priority-badge.urgent {
            background-color: #ef4444;
            color: #ffffff;
        }

        .priority-badge.high {
            background-color: #f97316;
            color: #ffffff;
        }

        .priority-badge.medium {
            background-color: #3b82f6;
            color: #ffffff;
        }

        .priority-badge.low {
            background-color: #64748b;
            color: #ffffff;
        }

        .operators-tags {
            font-weight: 700;
            color: #4f46e5;
        }

        /* Operator Listing section */
        .team-box {
            display: grid;
            grid-template-cols: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 30px;
        }

        .member-card {
            border: 1px solid #e2e8f0;
            background: #fafafa;
            padding: 10px 15px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .member-name {
            font-size: 11px;
            font-weight: bold;
        }

        .member-role {
            font-size: 9px;
            color: #64748b;
        }

        /* Activity logs table inside HTML */
        .logs-box {
            font-size: 10.5px;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            background: #ffffff;
            padding: 15px;
            max-height: 250px;
            overflow-y: auto;
        }

        .log-row {
            padding: 8px 0;
            border-bottom: 1px solid #f1f5f9;
            display: flex;
            justify-content: space-between;
        }

        .log-row:last-child {
            border-bottom: none;
        }

        /* Signatures block */
        .handoff-section {
            margin-top: 45px;
            border-top: 2px solid #0f172a;
            padding-top: 20px;
        }

        .handoff-text {
            font-size: 11px;
            color: #475569;
            line-height: 1.8;
            margin-bottom: 25px;
        }

        .signature-grid {
            display: grid;
            grid-template-cols: repeat(2, 1fr);
            gap: 40px;
        }

        .signature-zone {
            border: 1px dashed #cbd5e1;
            border-radius: 12px;
            padding: 15px;
            text-align: center;
            background-color: #fdfdfd;
        }

        .signature-title {
            font-size: 12px;
            font-weight: 900;
            color: #0f172a;
            margin-bottom: 6px;
        }

        .signature-name {
            font-size: 11px;
            color: #475569;
            margin-bottom: 15px;
        }

        .signature-box-space {
            border: 1px dashed #cbd5e1;
            background: #ffffff;
            height: 90px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: #cbd5e1;
        }

        .btn-container {
            text-align: center;
            margin-bottom: 20px;
        }

        .btn-print {
            background-color: #059669;
            color: #ffffff;
            padding: 12px 28px;
            border-radius: 10px;
            border: none;
            cursor: pointer;
            font-family: inherit;
            font-weight: 900;
            font-size: 13px;
        }

        @media print {
            .btn-container {
                display: none;
            }
            body {
                background: #ffffff;
                padding: 0;
            }
            .container {
                border: none;
                box-shadow: none;
                padding: 0;
                width: 100%;
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="btn-container">
        <button class="btn-print" onclick="window.print()">🖨️ چاپ فیزیکی رسمی یا خروجی PDF</button>
    </div>

    <div class="container">
        <div class="official-header">
            <div class="official-logo-area">
                <div class="seal-decoration">
                    مُهر رسمی<br>شیفت دیسپچ
                </div>
                <div class="official-title">
                    <h1>گزارش اداری و کارنامه انتهای شیفت پاسخگویی</h1>
                    <p>سامانه جامع یکپارچه مدیریت صف و تسک‌های کالسنتر هوشمند • دپارتمان دیسپچ</p>
                </div>
            </div>
            
            <div class="meta-stamp">
                <div class="badge-confidential">رده‌بندی: سند اداری محرمانه</div>
                <div>شماره سریال گزارش: <strong>${reportSerial}</strong></div>
                <div>تاریخ صدور سوابق: <span>${todayStr} ساعت ${nowTimeStr}</span></div>
                <div>سرپرست صادرکننده: <strong>${currentUser.name}</strong></div>
                <div>سمت سازمانی: <span style="font-style: italic;">${currentUser.role}</span></div>
            </div>
        </div>

        <div class="grid-stats">
            <div class="stat-card">
                <span class="stat-label">تعداد کل تسک‌های فعال</span>
                <span class="stat-value">${totalTasks}</span>
            </div>
            <div class="stat-card done">
                <span class="stat-label">اقدامات نهایی شده (Done)</span>
                <span class="stat-value">${doneTasks.length} (${completionRate}٪)</span>
            </div>
            <div class="stat-card in-progress">
                <span class="stat-label">در حال بررسی و اقدام</span>
                <span class="stat-value">${inProgressTasks.length}</span>
            </div>
            <div class="stat-card urgent">
                <span class="stat-label">موارد بحرانی فعال (Urgent)</span>
                <span class="stat-value">${urgentCount}</span>
            </div>
        </div>

        <!-- Registered Operators List -->
        <h3 style="font-size: 12px; color: #1e1b4b; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin-top: 30px;">👥 اعضای تیم و کارشناسان فعال پاسخگویی در این شیفت</h3>
        <div class="team-box">
            ${mockUsers.map(user => {
              const userActiveTasks = tasks.filter(t => t.assignedUsers.includes(user.id) && t.status !== 'done').length;
              return `
                <div class="member-card">
                    <div>
                        <div class="member-name">${user.name}</div>
                        <div class="member-role">${user.role}</div>
                    </div>
                    <div style="font-size: 10px; font-weight: bold; background: #e2e8f0; padding: 2px 7px; border-radius: 5px;">
                        ${userActiveTasks} تسک فعال
                    </div>
                </div>
              `;
            }).join('')}
        </div>

        <!-- 1. TODO SECTION -->
        <div class="section-header">
            <span>📋 تسک‌های در انتظار مأموریت اقدام و بررسی اولیه</span>
            <span class="section-badge">${todoTasks.length} تسک</span>
        </div>
        <table class="report-table">
            <thead>
                <tr>
                    <th style="width: 25%;">عنوان تسک</th>
                    <th style="width: 40%;">توضیحات و فرآیند مأموریت</th>
                    <th style="width: 10%;">اولویت بندی</th>
                    <th style="width: 12%;">سررسید اقدام</th>
                    <th style="width: 13%;">اپراتور‌های مسئول</th>
                </tr>
            </thead>
            <tbody>
                ${todoTasks.map(task => `
                    <tr>
                        <td style="font-weight: bold; color: #1e293b;">${task.title}</td>
                        <td style="color: #475569;">${task.description || 'توضیحاتی ثبت نشده است.'}</td>
                        <td>
                            <span class="priority-badge ${task.priority}">
                                ${task.priority === 'urgent' ? 'فوری/بحرانی' : task.priority === 'high' ? 'مهم' : task.priority === 'medium' ? 'متوسط' : 'عادی'}
                            </span>
                        </td>
                        <td style="font-family: Courier New; font-weight: bold;">${task.dueDate || 'تعیین نشده'}</td>
                        <td class="operators-tags">
                            ${mockUsers.filter(u => task.assignedUsers.includes(u.id)).map(u => u.name).join('، ') || 'بدون ارجاع مستقیم'}
                        </td>
                    </tr>
                `).join('')}
                ${todoTasks.length === 0 ? `<tr><td colspan="5" style="text-align: center; color: #94a3b8; font-style: italic; padding: 20px;">هیچ تسکی در انتظار اقدام وجود ندارد.</td></tr>` : ''}
            </tbody>
        </table>

        <!-- 2. IN_PROGRESS SECTION -->
        <div class="section-header" style="background-color: #854d0e;">
            <span>⚡ تسک‌های فعال در حال پیگیری، اقدام جدی و رفع باگ</span>
            <span class="section-badge">${inProgressTasks.length} تسک</span>
        </div>
        <table class="report-table">
            <thead>
                <tr>
                    <th style="width: 25%;">عنوان تسک</th>
                    <th style="width: 40%;">شرح اقدام جاری</th>
                    <th style="width: 10%;">اولویت</th>
                    <th style="width: 12%;">مهلت بررسی</th>
                    <th style="width: 13%;">کارشناس مجری</th>
                </tr>
            </thead>
            <tbody>
                ${inProgressTasks.map(task => `
                    <tr>
                        <td style="font-weight: bold; color: #1e293b;">${task.title}</td>
                        <td style="color: #475569;">
                            ${task.description}
                            ${task.notes && task.notes.length > 0 ? `<div style="margin-top: 5px; font-size: 10px; background:#fef08a; padding:3px 7px; border-radius:4px; display:inline-block;">💬 ${task.notes.length} یادداشت فنی ثبت شده</div>` : ''}
                        </td>
                        <td>
                            <span class="priority-badge ${task.priority}">
                                ${task.priority === 'urgent' ? 'فوری/بحرانی' : task.priority === 'high' ? 'مهم' : task.priority === 'medium' ? 'متوسط' : 'عادی'}
                            </span>
                        </td>
                        <td style="font-family: Courier New; font-weight: bold;">${task.dueDate}</td>
                        <td class="operators-tags">
                            ${mockUsers.filter(u => task.assignedUsers.includes(u.id)).map(u => u.name).join('، ') || 'ارزیابی خودکار'}
                        </td>
                    </tr>
                `).join('')}
                ${inProgressTasks.length === 0 ? `<tr><td colspan="5" style="text-align: center; color: #94a3b8; font-style: italic; padding: 20px;">هیچ تسک فعالی در دست ارجاع و اپراتوری نیست.</td></tr>` : ''}
            </tbody>
        </table>

        <!-- 3. DONE SECTION -->
        <div class="section-header" style="background-color: #166534;">
            <span>🎯 اقدامات نهایی شده، کامپلت کامل و بایگانی شیفت جاری</span>
            <span class="section-badge">${doneTasks.length} تسک</span>
        </div>
        <table class="report-table">
            <thead>
                <tr>
                    <th style="width: 25%;">عنوان تسک خاتمه یافته</th>
                    <th style="width: 45%;">شرح مأموریت انجام شده</th>
                    <th style="width: 15%;">تاریخ اتمام و بایگانی</th>
                    <th style="width: 15%;">کارشناسان مسئول</th>
                </tr>
            </thead>
            <tbody>
                ${doneTasks.map(task => `
                    <tr>
                        <td style="font-weight: bold; text-decoration: line-through; color: #64748b;">${task.title}</td>
                        <td style="color: #475569;">
                            ${task.description}
                            <div style="font-size: 9px; color: #059669; font-weight: 900; margin-top: 4px;">✔ با موفقیت رفع اختلال گردید</div>
                        </td>
                        <td style="font-family: Courier New; color: #0d9488;">${task.createdAt || 'پایان موفق'}</td>
                        <td class="operators-tags" style="color: #059669;">
                            ${mockUsers.filter(u => task.assignedUsers.includes(u.id)).map(u => u.name).join('، ') || 'دیسپچ هوشمند'}
                        </td>
                    </tr>
                `).join('')}
                ${doneTasks.length === 0 ? `<tr><td colspan="4" style="text-align: center; color: #94a3b8; font-style: italic; padding: 20px;">هنوز هیچ تسکی در این شیفت نهایی نشده است.</td></tr>` : ''}
            </tbody>
        </table>

        <!-- Real-time Activity Logs inside the printed document -->
        ${activityLogs.length > 0 ? `
        <h3 style="font-size: 12px; color: #1e1b4b; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin-top: 35px;">🪵 لاگ تفصیلی و سابقه عملکرد برد در خلال حضور شیفت (وقایع اخیر)</h3>
        <div class="logs-box">
            ${activityLogs.slice(0, 10).map(log => `
                <div class="log-row">
                    <div>
                        <strong>[${log.user.name} - ${log.user.role}]</strong> 
                        تسک «${log.taskTitle}» : ${log.details}
                    </div>
                    <div style="font-family: monospace; color: #64748b; font-size: 9.5px;">
                      ${new Date(log.timestamp).toLocaleTimeString('fa-IR')}
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Handoff & Double Stamp Signatures -->
        <div class="handoff-section">
            <div class="handoff-text">
                <strong>شرایط خاتمه شیفت و تسلیم گزارش:</strong> گزارش حاضر بر اساس صحت عملکرد کارشناسان ثبت شیفت و نظارت کامل سرپرست پاسخگویی استخراج شده است. کلیه لاگ‌ها و رخدادها به صورت خودکار با دیتابیس بومی و محلی کالسنتر سینک شده و آماده تحویل به کادر سرپرستی شیفت آتی است.
            </div>
            
            <div class="signature-grid">
                <div class="signature-zone">
                    <div class="signature-title">تکمیل کننده گزارش و سرپرست شیفت حاضر</div>
                    <div class="signature-name">${currentUser.name} (${currentUser.role})</div>
                    <div class="signature-box-space">محل مهر و امضای تأیید</div>
                </div>

                <div class="signature-zone">
                    <div class="signature-title font-bold">تحویل‌گیرنده و سرپرست شیفت وقت آتی</div>
                    <div class="signature-name">کارشناس مسئول دیسپچینگ شیفت دوم</div>
                    <div class="signature-box-space">محل تایید و امضای تحویل مأموریت</div>
                </div>
            </div>
        </div>

    </div>
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `official-shift-report-${reportSerial}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Safe checks
  if (!isSupervisor) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-right" style={{ direction: 'rtl' }}>
        <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-3xl w-full max-w-lg p-8 shadow-2xl flex flex-col items-center text-center gap-4">
          <div className="p-4 bg-rose-500/10 rounded-full border border-rose-500/20 text-rose-500">
            <ShieldAlert className="w-12 h-12 animate-pulse" />
          </div>
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">خطا در احراز هویت دیسپچ</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            شما با حساب سطح کاربری عادی وارد شده‌اید. تهیه گزارش پایان و خروجی چاپی PDF رسمی شیفت منحصراً در اختیار سرپرست یا مدیر دیسپچ کالسنتر می‌باشد.
          </p>
          <button
            onClick={onClose}
            className="w-full mt-2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-black transition-all cursor-pointer"
          >
            بازگشت به برد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 print:p-0 print:absolute print:inset-0 print:bg-white print:backdrop-blur-none text-right" style={{ direction: 'rtl' }}>
      <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col print:border-none print:shadow-none print:max-h-full print:w-full print:rounded-none">
        
        {/* Modal Top Header (Hidden on Print) */}
        <div className="p-5 border-b border-slate-150 dark:border-slate-800/80 flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 print:hidden shrink-0">
          <div className="text-right">
            <h3 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500 animate-pulse" />
              <span>پیش‌نویس کارنامه و گزارش رسمی انتهای شیفت</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">آماده‌سازی فایل رسمی چاپی و دانلود سند مستقل در فرمت HTML+CSS به عنوان بایگانی</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              id="download-summary-action-btn"
              onClick={handleDownloadHTML}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
              title="دانلود فایل وب رسمی گزارش پایان شیفت"
            >
              <Download className="w-4 h-4" />
              <span>دانلود فایل وب گزارش رسمی</span>
            </button>

            <button
              id="print-summary-action-btn"
              onClick={handlePrint}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ رسمی یا ذخیره PDF</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Print Content Preview Canvas */}
        <div 
          ref={reportRef}
          className="p-6 sm:p-10 overflow-y-auto flex-grow text-slate-800 dark:text-slate-200 print:text-black print:p-0 print:overflow-visible text-right bg-white dark:bg-slate-925 print:bg-white space-y-8"
        >
          {/* Header Report Frame */}
          <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1.5">
              <span className="text-[9px] font-black tracking-widest px-2.5 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md">
                « گزارش اداری پایان شیفت دیسپچ - رده محرمانه »
              </span>
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white print:text-black">
                گزارش نهایی وضعیت شیفت کاری مرکز تماس
              </h1>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 print:text-slate-600 leading-relaxed">
                سامانه مدیریت تسک‌ها و هماهنگی صف‌های ترافیکی • دپارتمان پاسخگویی شرکت
              </p>
            </div>
            
            <div className="text-right sm:text-left text-xs text-slate-600 dark:text-slate-400 print:text-black font-semibold space-y-1 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-150 dark:border-slate-850">
              <p>سریال گزارش: <strong className="font-mono text-slate-800 dark:text-slate-200 font-bold">{reportSerial}</strong></p>
              <p>تاریخ خروجی: <span>{todayStr} ({nowTimeStr})</span></p>
              <p>مسئول گزارش: <span className="font-bold text-indigo-600 dark:text-indigo-400">{currentUser.name}</span></p>
              <p>سمت سازمانی: <span className="italic text-[10px] text-slate-500">{currentUser.role}</span></p>
            </div>
          </div>

          {/* Statistical Highlights Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                <Layers className="w-4 h-4 text-slate-500" />
                <span className="text-[10px] font-bold">کل تسک‌های فعال</span>
              </div>
              <span className="text-2xl font-mono font-black">{totalTasks}</span>
            </div>
            
            <div className="p-4 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/15 dark:border-emerald-800/20 rounded-2xl">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-405 mb-1 animate-pulse">
                <FileCheck2 className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold">اقدام نهایی شده</span>
              </div>
              <span className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400">
                {doneTasks.length} <span className="text-xs font-black">({completionRate}٪)</span>
              </span>
            </div>

            <div className="p-4 bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/15 dark:border-amber-800/20 rounded-2xl">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-405 mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] font-bold">فعال در حال بررسی</span>
              </div>
              <span className="text-2xl font-mono font-black text-amber-600 dark:text-amber-400">{inProgressTasks.length}</span>
            </div>

            <div className="p-4 bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/15 dark:border-rose-800/20 rounded-2xl">
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-405 mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-[10px] font-bold">بحرانی شیفت (Urgent)</span>
              </div>
              <span className="text-2xl font-mono font-black text-rose-600 dark:text-rose-400">{urgentCount}</span>
            </div>
          </div>

          {/* Members of operators */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Users className="w-4.5 h-4.5 text-indigo-500" />
              <span>کارشناسان و پرسنل پاسخگویی فعال در خلال شیفت جاری</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {mockUsers.map(user => {
                const userActiveTasks = tasks.filter(t => t.assignedUsers.includes(user.id) && t.status !== 'done').length;
                return (
                  <div key={user.id} className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{user.name}</p>
                      <p className="text-[10px] text-slate-400">{user.role}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-250 dark:bg-slate-800 rounded font-semibold text-slate-600 dark:text-slate-300">
                      {userActiveTasks} تسک فعال
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tasks table data rows grouped by columns */}
          <div className="space-y-6">
            
            {/* 1. Todo Tasks List Table */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 border-b border-indigo-500/10 pb-2">
                <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-md text-[10px] font-black">📋 در انتظار اقدام</span>
                <span className="text-[11px] text-slate-400 font-bold">({todoTasks.length} تسک ثبت شده)</span>
              </div>
              
              {todoTasks.length > 0 ? (
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850">
                        <th className="p-3 font-black text-right text-slate-700 dark:text-slate-300">عنوان تسک کاری</th>
                        <th className="p-3 font-black text-right text-slate-700 dark:text-slate-300">شرح مأموریت / جزئیات</th>
                        <th className="p-3 font-black text-center text-slate-700 dark:text-slate-300">اولویت</th>
                        <th className="p-3 font-black text-center text-slate-700 dark:text-slate-300">سررسید</th>
                        <th className="p-3 font-black text-right text-slate-700 dark:text-slate-300">کارشناسان مسئول</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                      {todoTasks.map(task => (
                        <tr key={task.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-950/20">
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{task.title}</td>
                          <td className="p-3 text-slate-500 dark:text-slate-400 leading-relaxed">{task.description || 'توضیحات تکمیلی درج نشده است'}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                              task.priority === 'urgent' ? 'bg-red-500 text-white' : 'bg-slate-250 dark:bg-slate-850 text-slate-600 dark:text-slate-300'
                            }`}>
                              {task.priority === 'urgent' ? 'فوری' : task.priority === 'high' ? 'مهم' : 'معمولی'}
                            </span>
                          </td>
                          <td className="p-3 text-center font-mono text-[10.5px]">{task.dueDate}</td>
                          <td className="p-3 font-semibold text-indigo-600 dark:text-indigo-400">
                            {mockUsers.filter(u => task.assignedUsers.includes(u.id)).map(u => u.name).join('، ') || 'بدون اپراتور'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic text-center py-2">موردی در انتظار اقدام ثبت نشده است.</p>
              )}
            </div>

            {/* 2. In progress table */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 border-b border-indigo-500/10 pb-2">
                <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md text-[10px] font-black">⚡ در حال اقدام جاری</span>
                <span className="text-[11px] text-slate-400 font-bold">({inProgressTasks.length} تسک در حال بررسی)</span>
              </div>
              
              {inProgressTasks.length > 0 ? (
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850">
                        <th className="p-3 font-black text-right text-slate-700 dark:text-slate-300">عنوان تسک کاری</th>
                        <th className="p-3 font-black text-right text-slate-700 dark:text-slate-300">اقدام شیفت / یادداشت‌ها</th>
                        <th className="p-3 font-black text-center text-slate-700 dark:text-slate-300">اولویت</th>
                        <th className="p-3 font-black text-center text-slate-700 dark:text-slate-300">مهلت</th>
                        <th className="p-3 font-black text-right text-slate-700 dark:text-slate-300">مجری ارجاعی</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                      {inProgressTasks.map(task => (
                        <tr key={task.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-950/20">
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{task.title}</td>
                          <td className="p-3 text-slate-500 dark:text-slate-400 leading-relaxed">
                            <p>{task.description}</p>
                            {task.notes && task.notes.length > 0 && (
                              <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 bg-yellow-50 text-yellow-800 rounded-md">💬 {task.notes.length} یادداشت فنی</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                              task.priority === 'urgent' ? 'bg-red-500 text-white' : 'bg-slate-250 dark:bg-slate-850 text-slate-600 dark:text-slate-300'
                            }`}>
                              {task.priority === 'urgent' ? 'فوری' : task.priority === 'high' ? 'مهم' : 'معمولی'}
                            </span>
                          </td>
                          <td className="p-3 text-center font-mono text-[10.5px]">{task.dueDate}</td>
                          <td className="p-3 font-semibold text-indigo-600 dark:text-indigo-400">
                            {mockUsers.filter(u => task.assignedUsers.includes(u.id)).map(u => u.name).join('، ') || 'بدون ارجاع'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic text-center py-2">هیچ مأموریت فعالی به کارشناسان دپارتمان ارجاع داده نشده است.</p>
              )}
            </div>

            {/* 3. Done tasks table */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 border-b border-indigo-500/10 pb-2">
                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md text-[10px] font-black">🎯 اقدامات رفع شده و بایگانی</span>
                <span className="text-[11px] text-slate-400 font-bold">({doneTasks.length} تسک انجام شده)</span>
              </div>
              
              {doneTasks.length > 0 ? (
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850">
                        <th className="p-3 font-black text-right text-slate-700 dark:text-slate-300">عنوان تسک نهایی شده</th>
                        <th className="p-3 font-black text-right text-slate-700 dark:text-slate-300">شرح مأموریت انجام شده</th>
                        <th className="p-3 font-black text-center text-slate-700 dark:text-slate-300">وضعیت</th>
                        <th className="p-3 font-black text-center text-slate-700 dark:text-slate-300">ثبت اتمام</th>
                        <th className="p-3 font-black text-right text-slate-700 dark:text-slate-300">مسئول مسئولیت</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                      {doneTasks.map(task => (
                        <tr key={task.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-950/20">
                          <td className="p-3 font-bold text-slate-650 line-through text-slate-500 dark:text-slate-400">{task.title}</td>
                          <td className="p-3 text-slate-500 dark:text-slate-400 leading-relaxed">{task.description}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                              موفقیت‌آمیز
                            </span>
                          </td>
                          <td className="p-3 text-center font-mono text-[10.5px] text-emerald-600">{task.createdAt}</td>
                          <td className="p-3 text-emerald-700 font-bold dark:text-emerald-400">
                            {mockUsers.filter(u => task.assignedUsers.includes(u.id)).map(u => u.name).join('، ') || 'کارشناس آزاد'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic text-center py-2">هنوز هیچ تسکی در شیفت حاضر نهایی و آرشیو نشده است.</p>
              )}
            </div>

          </div>

          {/* Activity Logs in the report preview */}
          {activityLogs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-150 flex items-center gap-1.5 pt-3">
                <History className="w-4.5 h-4.5 text-indigo-500" />
                <span>سیاهه عملکرد پرسنل و تاریخچه فعالیت‌های شیفت</span>
              </h3>
              
              <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 rounded-2xl p-4 max-h-48 overflow-y-auto space-y-3">
                {activityLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="flex justify-between items-center text-[10.5px] border-b border-dashed border-slate-200 dark:border-slate-800/80 pb-2 last:border-b-0 last:pb-0">
                    <p className="text-slate-600 dark:text-slate-350">
                      <strong>[{log.user.name}]</strong> تسک «{log.taskTitle}» • {log.details}
                    </p>
                    <span className="font-mono text-slate-400">{new Date(log.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supervisor signatures block */}
          <div className="mt-16 pt-8 border-t border-dashed border-slate-300 flex flex-col sm:flex-row justify-between items-stretch text-right gap-8">
            <div className="flex-1 space-y-1">
              <p className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1">
                <Info className="w-4 h-4 text-slate-450" />
                <span>شرایط تسلیم شیفت و گزارش:</span>
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                کلیه تماس‌ها، اقدامات اپراتوری و سوابق مأموریت‌های صف بر اساس لاگ‌های اتوماتیک دیتابیس بومی کالسنتر تطبیق داده شده و پرونده‌های بحرانی ارجاع شدند.
              </p>
            </div>
            
            <div className="flex gap-4 shrink-0 justify-end">
              <div className="text-center font-mono w-44">
                <p className="text-xs font-black text-slate-800 dark:text-slate-200">سرپرست تحویل‌دهنده شیفت</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{currentUser.name}</p>
                <div className="h-16 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl mt-1.5 flex items-center justify-center text-[9px] text-slate-300">محل مهر و امضاء</div>
              </div>
              <div className="text-center font-mono w-44">
                <p className="text-xs font-black text-slate-800 dark:text-slate-200">سرپرست تحویل‌گیرنده شیفت</p>
                <p className="text-[10px] text-slate-400 mt-0.5">کارشناس دیسپچ دوم</p>
                <div className="h-16 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl mt-1.5 flex items-center justify-center text-[9px] text-slate-300">امضاء و تایید شیفت</div>
              </div>
            </div>
          </div>

        </div>

        {/* CSS Print Stylesheet injected inline for high physical and layout fidelity */}
        <style>{`
          @media print {
            body {
              background: white !important;
              color: black !important;
              direction: rtl !important;
              font-family: 'Tahoma', 'Vazirmatn', sans-serif !important;
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
            .max-h-\\[92vh\\] {
              max-height: none !important;
              overflow: visible !important;
            }
            .shadow-2xl {
              box-shadow: none !important;
            }
            .border {
              border-color: #cbd5e1 !important;
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
