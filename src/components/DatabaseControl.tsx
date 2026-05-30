/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Terminal, 
  Wifi, 
  CheckCircle2, 
  Server, 
  ServerCrash, 
  RefreshCw, 
  Layers, 
  CheckCircle,
  AlertCircle,
  Settings,
  Link,
  Copy,
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import { Task, Notification } from '../types';

interface DatabaseControlProps {
  tasks: Task[];
  notifications: Notification[];
  lastAction: string;
  
  // Real cPanel MySQL connector states
  mysqlEnabled: boolean;
  setMysqlEnabled: (enabled: boolean) => void;
  mysqlApiUrl: string;
  setMysqlApiUrl: (url: string) => void;
  mysqlStatus: 'connected' | 'error' | 'disconnected';
  mysqlInfo: { database?: string; host?: string; error?: string; hint?: string };
  isSyncing: boolean;
  onManualSyncCheck: () => void;
}

export type DbEngine = 'sqlite' | 'postgres' | 'mongodb' | 'cloud_sql' | 'mysql';

export default function DatabaseControl({ 
  tasks, 
  notifications, 
  lastAction,
  mysqlEnabled,
  setMysqlEnabled,
  mysqlApiUrl,
  setMysqlApiUrl,
  mysqlStatus,
  mysqlInfo,
  isSyncing,
  onManualSyncCheck
}: DatabaseControlProps) {
  const [dbEngine, setDbEngine] = useState<DbEngine>(mysqlStatus === 'connected' ? 'mysql' : 'sqlite');
  const [latency, setLatency] = useState<number>(3);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [errorSimulated, setErrorSimulated] = useState<boolean>(false);
  const [showSqlSchema, setShowSqlSchema] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  
  const [queryLogs, setQueryLogs] = useState<{ id: string; sql: string; time: string; status: 'SUCCESS' | 'ERROR' }[]>([
    { id: '1', sql: 'SELECT * FROM tasks WHERE status != "archived";', time: '14:05:00', status: 'SUCCESS' },
    { id: '2', sql: 'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10;', time: '14:05:01', status: 'SUCCESS' },
  ]);

  // Sync internal dbEngine selection state with the global mysql integration status
  useEffect(() => {
    if (mysqlStatus === 'connected') {
      setDbEngine('mysql');
    }
  }, [mysqlStatus]);

  // Compute total chat messages
  const totalChats = tasks.reduce((acc, task) => acc + (task.chatMessages?.length || 0), 0);

  // Trigger simulated connection latency when switcher changes
  const handleEngineChange = (engine: DbEngine) => {
    setIsConnecting(true);
    setTimeout(() => {
      setDbEngine(engine);
      setIsConnecting(false);
      
      // Simulate typical latencies or show real status if MySQL
      if (engine === 'sqlite') setLatency(2);
      else if (engine === 'postgres') setLatency(14);
      else if (engine === 'mongodb') setLatency(45);
      else if (engine === 'cloud_sql') setLatency(8);
      else if (engine === 'mysql') setLatency(mysqlStatus === 'connected' ? 24 : 350);
      
      const timestamp = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setQueryLogs(prev => [
        {
          id: String(Date.now()),
          sql: `-- Connected successfully to ${engine.toUpperCase()} Database Engine. Schema synchronised.`,
          time: timestamp,
          status: 'SUCCESS'
        },
        ...prev
      ]);
    }, 400);
  };

  const rawSqlSchema = `-- -------------------------------------------------------------
-- SQL Schema Dump for phpMyAdmin (Task Manager)
-- Run this SQL in your phpMyAdmin SQL tab if database is not created automatically.
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS \`users\` (
    \`id\` VARCHAR(50) PRIMARY KEY,
    \`name\` VARCHAR(100) NOT NULL,
    \`role\` VARCHAR(100) NOT NULL,
    \`initials\` VARCHAR(10) NOT NULL,
    \`avatarColor\` VARCHAR(50) NOT NULL,
    \`password\` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`tasks\` (
    \`id\` VARCHAR(50) PRIMARY KEY,
    \`title\` VARCHAR(255) NOT NULL,
    \`description\` TEXT NULL,
    \`category\` VARCHAR(100) NULL,
    \`status\` VARCHAR(50) NOT NULL,
    \`priority\` VARCHAR(50) NOT NULL,
    \`dueDate\` VARCHAR(50) NULL,
    \`progress\` INT DEFAULT 0,
    \`estimatedHours\` FLOAT DEFAULT 0,
    \`actualHours\` FLOAT DEFAULT 0,
    \`assignedUsers\` TEXT NULL,
    \`authorId\` VARCHAR(50) NULL,
    \`chatMessages\` TEXT NULL,
    \`attachments\` TEXT NULL,
    \`createdAt\` VARCHAR(50) NULL,
    \`updatedAt\` VARCHAR(50) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`notifications\` (
    \`id\` VARCHAR(50) PRIMARY KEY,
    \`title\` VARCHAR(255) NOT NULL,
    \`message\` TEXT NOT NULL,
    \`type\` VARCHAR(50) NOT NULL,
    \`time\` VARCHAR(50) NOT NULL,
    \`read_status\` TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rawSqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert last action string to a live SQL statement
  useEffect(() => {
    if (!lastAction) return;

    const timestamp = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    let simulatedSql = '';

    // Simple NLP pattern matching to output realistic SQL/NoSQL statements
    if (lastAction.toLowerCase().includes('move') || lastAction.includes('جا‌به‌جا') || lastAction.includes('وضعیت')) {
      simulatedSql = dbEngine === 'mongodb'
        ? `db.tasks.updateOne({ id: "${lastAction.split('__')[1] || 'task_id'}" }, { $set: { status: "${lastAction.split('__')[2] || 'in_progress'}", updatedAt: new Date() } });`
        : `UPDATE tasks SET status = '${lastAction.split('__')[2] || 'in_progress'}', updated_at = NOW() WHERE id = '${lastAction.split('__')[1] || 'task_id'}';`;
    } else if (lastAction.toLowerCase().includes('add') || lastAction.includes('ایجاد') || lastAction.includes('ثبت')) {
      simulatedSql = dbEngine === 'mongodb'
        ? `db.tasks.insertOne({ title: "${lastAction.split('__')[1] || 'بلیت جدید'}", status: "todo", createdAt: new Date() });`
        : `INSERT INTO tasks (id, title, status, created_at) VALUES ('task_${Date.now().toString().slice(-4)}', '${lastAction.split('__')[1] || 'بلیت جدید'}', 'todo', NOW());`;
    } else if (lastAction.toLowerCase().includes('chat') || lastAction.includes('پیام') || lastAction.includes('چت')) {
      simulatedSql = dbEngine === 'mongodb'
        ? `db.tasks.updateOne({ id: "${lastAction.split('__')[1] || 'task_id'}" }, { $push: { chatMessages: { sender: "اپراتور", text: "ثبت گردید" } } });`
        : `INSERT INTO chat_messages (id, task_id, sender_name, message_text) VALUES ('msg_${Date.now().toString().slice(-4)}', '${lastAction.split('__')[1] || 'task_id'}', 'Operator', 'پیام ثبت شد');`;
    } else if (lastAction.toLowerCase().includes('delete') || lastAction.includes('حذف')) {
      simulatedSql = dbEngine === 'mongodb'
        ? `db.tasks.deleteOne({ id: "${lastAction.split('__')[1] || 'task_id'}" });`
        : `DELETE FROM tasks WHERE id = '${lastAction.split('__')[1] || 'task_id'}';`;
    } else if (lastAction.toLowerCase().includes('sync')) {
      simulatedSql = `/* Bulk Synced Tasks, Users and Notifications to MySQL (phpMyAdmin) */\nCOMMIT;`;
    } else {
      simulatedSql = dbEngine === 'mongodb'
        ? `db.tasks.find({}).sort({ createdAt: -1 });`
        : `SELECT * FROM tasks ORDER BY created_at DESC;`;
    }

    setQueryLogs(prev => [
      {
        id: String(Date.now()),
        sql: simulatedSql,
        time: timestamp,
        status: errorSimulated ? 'ERROR' : 'SUCCESS'
      },
      ...prev.slice(0, 15) // Keep last 15 queries to avoid memory bloat
    ]);
  }, [lastAction, dbEngine, errorSimulated]);

  return (
    <div className="bg-slate-900 border border-slate-850/80 rounded-3xl p-5 text-right font-sans text-slate-100 shadow-xl overflow-hidden space-y-5">
      
      {/* Upper Brand / Connected widget */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/85">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-600/10 border border-purple-500/20 text-purple-400 rounded-2xl">
            <Database className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-100">تنظیمات پایگاه‌داده اختصاصی و هاست cPanel</h3>
              <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 font-bold rounded-md ${
                mysqlStatus === 'connected'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                  : mysqlStatus === 'error'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/10'
                  : 'bg-amber-500/10 text-amber-500 border border-amber-500/15'
              }`}>
                <Wifi className="w-2.5 h-2.5" />
                <span>
                  {mysqlStatus === 'connected' ? 'متصل به MySQL هاست' : 
                   mysqlStatus === 'error' ? 'خطا در اتصال به دیتابیس mysql' : 
                   'حالت لوکال (آفلاین دمو)'}
                </span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">مدیریت اطلاعات بدون نیاز به فایربیس و ذخیره‌سازی زنده در phpMyAdmin وب‌سایت شما</p>
          </div>
        </div>

        {/* Database selector switch engine */}
        <div className="flex items-center gap-2.5">
          <label className="text-[10px] text-slate-400 font-bold hidden sm:inline-block">موتور پایگاه‌داده فعال:</label>
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/90 border border-slate-800 rounded-2xl">
            {([ 'sqlite', 'mysql', 'postgres', 'mongodb' ] as DbEngine[]).map((engine) => (
              <button
                key={engine}
                type="button"
                onClick={() => handleEngineChange(engine)}
                disabled={isConnecting}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer transition-all ${
                  dbEngine === engine
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                {engine === 'sqlite' ? 'SQLite/LocalStorage' : 
                 engine === 'mysql' ? 'MySQL اصلی (هاست)' : 
                 engine === 'postgres' ? 'PostgreSQL' : 'MongoDB'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real Host Connection & Setup Dashboard (Visible when MySQL is chosen or active) */}
      <div className="bg-slate-950/70 border border-slate-800 p-4.5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs sm:text-sm font-black text-slate-200">تنظیمات و راه‌اندازی اتصال به phpMyAdmin</h4>
          </div>
          
          <div className="flex items-center gap-2">
            {isSyncing && (
              <span className="flex items-center gap-1 text-[9px] text-indigo-400 font-bold animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                در حال همگام‌سازی با سرور...
              </span>
            )}
            <button
              type="button"
              onClick={onManualSyncCheck}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              title="تست مجدد و بارگذاری دیتابیس"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              تست اتصال و همگام‌سازی مجدد
            </button>
          </div>
        </div>

        {/* cPanel MySQL Integration Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Settings Parameters Panel */}
          <div className="md:col-span-7 space-y-3 font-sans">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 flex items-center gap-1">
                <Link className="w-3 h-3 text-slate-500" />
                آدرس وب‌سرویس اتصال به دیتابیس (API Path)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mysqlApiUrl}
                  onChange={(e) => {
                    setMysqlApiUrl(e.target.value);
                    localStorage.setItem('callcenter_mysql_api_url', e.target.value);
                  }}
                  placeholder="مثلاً: api.php یا https://yoursite.com/api.php"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-left font-mono text-indigo-400 outline-none focus:border-indigo-500 focus:bg-slate-900/95 flex-grow"
                />
              </div>
              <p className="text-[9px] text-slate-500 mt-1">توصیه می‌شود فایل <code className="text-slate-350 bg-slate-900 px-1 py-0.5 rounded">api.php</code> در همان پوشه‌ای باشد که برنامه آپلود می‌شود.</p>
            </div>

            {/* Status alerts */}
            {mysqlStatus === 'connected' ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-emerald-400">اتصال به دیتابیس MySQL با موفقیت برقرار شد!</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    میزبان: <span className="font-mono text-slate-200">{mysqlInfo.host}</span> • نام پایگاه‌داده: <span className="font-mono text-slate-200">{mysqlInfo.database}</span> • بلیت‌های کاری به صورت بدون وقفه بین کلاینت‌ها و phpMyAdmin هماهنگ و ذخیره می‌گردند.
                  </p>
                </div>
              </div>
            ) : mysqlStatus === 'error' ? (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-rose-400">خطا در برقراری ارتباط با مای‌اس‌کیوال ({mysqlInfo.error || 'پاسخ نامعتبر'})</p>
                  <p className="text-[9px] text-slate-400 leading-relaxed">
                    {mysqlInfo.hint || 'دسترسی دیتابیس توسط سرور مسدود شده است یا اعتبارنامه‌ها در خطوط ۲۴ الی ۲۷ فایل api.php ناصحیح وارد گردیده‌اند.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-slate-300">در حال استفاده از دیتابیس مروگر (LocalStorage)</p>
                  <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">
                    وب‌اپلیکیشن در حال کار به صورت مستقل و کامل است. پس از اتمام کار، برای ذخیره‌سازی ابری روی هاست خود، فایل <code className="text-slate-350 font-mono px-1 py-0.5 bg-slate-900 rounded">api.php</code> تولید شده را قرار داده و مشخصات پایگاه‌داده خویش را ست کنید.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Setup Guide Panel */}
          <div className="md:col-span-5 bg-slate-900/50 border border-slate-800 rounded-xl p-3 space-y-3 text-right">
            <h5 className="text-[11px] font-black text-slate-200 flex items-center gap-1 border-b border-slate-800 pb-2">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              راهنمای راه‌اندازی در cPanel هاست
            </h5>
            <ol className="text-[9px] text-slate-400 space-y-2 list-decimal pr-4">
              <li>
                فایل <strong className="text-slate-300 font-semibold font-mono">api.php</strong> موجود در پوشه خروجی را با cPanel File Manager آپلود کنید.
              </li>
              <li>
                یک دیتابیس MySQL درون سی‌پنل زیرمجموعه دپارتمان <strong className="text-slate-300">MySQL Database Wizard</strong> بسازید.
              </li>
              <li>
                فایل <code className="text-slate-300 font-mono">api.php</code> را باز کرده و خطوط ۲۴ الی ۲۷ را با نام کاربری و رمز دیتابیس ایجاد شده پر کنید.
              </li>
              <li>
                جداول پایگاه داده به صورت کاملا هوشمند توسط اسکریپت با اولین لود ساخته خواهند شد! نیازی به جابه جایی دستی نیست.
              </li>
            </ol>
            
            <button
              type="button"
              onClick={() => setShowSqlSchema(!showSqlSchema)}
              className="w-full py-1 text-center bg-slate-800 hover:bg-slate-750 text-[10px] text-slate-300 rounded-lg cursor-pointer flex items-center justify-center gap-1"
            >
              <span>{showSqlSchema ? 'بستن قطعه کد دیتابیس SQL' : 'مشاهده ساختار جداول SQL دیتابیس'}</span>
            </button>
          </div>

        </div>

        {/* Copy SQL code block */}
        {showSqlSchema && (
          <div className="bg-slate-900 rounded-xl p-3.5 border border-slate-800 mt-3 space-y-2 animate-in slide-in-from-top-3 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold">برای ساخت دستی جداول در phpMyAdmin (دلخواه):</span>
              <button
                type="button"
                onClick={copyToClipboard}
                className="px-2.5 py-1 bg-slate-850 hover:bg-slate-800 rounded-md text-[9px] font-bold text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'کپی شد!' : 'کپی کوئری SQL'}</span>
              </button>
            </div>
            <pre className="text-[8px] sm:text-[9px] bg-slate-950 p-2.5 rounded-lg text-left text-teal-400 max-h-48 overflow-y-auto font-mono leading-relaxed select-all" style={{ direction: 'ltr' }}>
              {rawSqlSchema}
            </pre>
          </div>
        )}
      </div>

      {/* Middle Grid Stats of database Tables counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-slate-850/80">
        <div className="p-3 bg-slate-950/45 border border-slate-800/60 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 block font-bold">جدول کارهای فعال (`tasks`)</span>
            <span className="text-sm font-mono font-black text-purple-400">{tasks.length} ردیف</span>
          </div>
          <Layers className="w-4 h-4 text-slate-600" />
        </div>

        <div className="p-3 bg-slate-950/45 border border-slate-800/60 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 block font-bold">جدول پیام‌ها (`chat_messages`)</span>
            <span className="text-sm font-mono font-black text-cyan-400">{totalChats} ردیف</span>
          </div>
          <Layers className="w-4 h-4 text-slate-600" />
        </div>

        <div className="p-3 bg-slate-950/45 border border-slate-800/60 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 block font-bold">جدول اعلان‌ها (`notifications`)</span>
            <span className="text-sm font-mono font-black text-amber-500">{notifications.length} ردیف</span>
          </div>
          <Layers className="w-4 h-4 text-slate-600" />
        </div>

        <div className="p-3 bg-slate-950/45 border border-slate-800/60 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 block font-bold">تأخیر رفت‌وبرگشت (Latency)</span>
            <span className="text-sm font-mono font-black text-emerald-400">{isConnecting ? '...' : `${latency}ms`}</span>
          </div>
          <Server className="w-4 h-4 text-slate-600" />
        </div>
      </div>

      {/* Bottom section: Live Query Logging output */}
      <div className="pt-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-350 text-slate-400 font-bold">
            <Terminal className="w-3.5 h-3.5 text-purple-500" />
            <span>خروجی ترمینال پایگاه‌داده (Live Transaction Logs)</span>
          </div>
          
          <button 
            type="button"
            onClick={() => setErrorSimulated(!errorSimulated)}
            className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer border ${
              errorSimulated 
                ? 'bg-rose-600 border-rose-450 text-white' 
                : 'bg-slate-800 hover:bg-slate-705 text-slate-300 border-slate-700'
            }`}
            title="شبیه‌سازی خطای کوئری دیتابیس"
          >
            {errorSimulated ? '🔴 رفع خطای شبیه‌ساز' : '⚠️ شبیه‌سازی خطای تراکنش'}
          </button>
        </div>

        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-850 h-32 overflow-y-auto font-mono text-left direction-ltr">
          {queryLogs.map((log) => (
            <div key={log.id} className="text-[10px] leading-relaxed mb-2.5 pb-2.5 border-b border-slate-900/40 last:border-none flex items-start justify-between gap-4">
              <div className="flex-grow">
                <span className="text-purple-400 mr-2">[{log.time}]</span>
                <span className={log.status === 'ERROR' ? 'text-rose-400 font-medium' : 'text-slate-300'}>
                  {log.sql}
                </span>
              </div>
              <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold shrink-0 ${
                log.status === 'ERROR' ? 'bg-rose-500/20 text-rose-400' : 'bg-green-500/10 text-emerald-440'
              }`}>
                {log.status}
              </span>
            </div>
          ))}
          {queryLogs.length === 0 && (
            <p className="text-[10px] text-slate-500 italic text-center py-6">No queries run yet. Update board tasks to view activity.</p>
          )}
        </div>
      </div>

    </div>
  );
}
