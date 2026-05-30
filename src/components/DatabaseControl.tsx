/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Database, Terminal, Wifi, CheckCircle2, Server, ServerCrash, RefreshCw, Layers } from 'lucide-react';
import { Task, Notification } from '../types';

interface DatabaseControlProps {
  tasks: Task[];
  notifications: Notification[];
  lastAction: string; // Describes the last user activity, e.g., "moved task to done"
}

export type DbEngine = 'sqlite' | 'postgres' | 'mongodb' | 'cloud_sql';

export default function DatabaseControl({ tasks, notifications, lastAction }: DatabaseControlProps) {
  const [dbEngine, setDbEngine] = useState<DbEngine>('sqlite');
  const [latency, setLatency] = useState<number>(3);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [errorSimulated, setErrorSimulated] = useState<boolean>(false);
  const [queryLogs, setQueryLogs] = useState<{ id: string; sql: string; time: string; status: 'SUCCESS' | 'ERROR' }[]>([
    { id: '1', sql: 'SELECT * FROM tasks WHERE status != "archived";', time: '14:05:00', status: 'SUCCESS' },
    { id: '2', sql: 'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10;', time: '14:05:01', status: 'SUCCESS' },
  ]);

  // Compute total chat messages
  const totalChats = tasks.reduce((acc, task) => acc + (task.chatMessages?.length || 0), 0);

  // Trigger simulated connection latency when switcher changes
  const handleEngineChange = (engine: DbEngine) => {
    setIsConnecting(true);
    setTimeout(() => {
      setDbEngine(engine);
      setIsConnecting(false);
      // Simulate typical latencies
      if (engine === 'sqlite') setLatency(2);
      else if (engine === 'postgres') setLatency(14);
      else if (engine === 'mongodb') setLatency(45);
      else if (engine === 'cloud_sql') setLatency(8);
      
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
    }, 600);
  };

  // Convert last action string to a live SQL statement
  useEffect(() => {
    if (!lastAction) return;

    const timestamp = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    let simulatedSql = '';

    // Simple NLP pattern matching to output realistic raw SQL/NoSQL statements
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
      ...prev.slice(0, 15) // Keep last 15 queries to avoid memory bloom
    ]);
  }, [lastAction, dbEngine, errorSimulated]);

  return (
    <div className="bg-slate-900 border border-slate-850/80 rounded-3xl p-5 text-right font-sans text-slate-100 shadow-xl overflow-hidden">
      
      {/* Upper Brand / Connected widget */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/85">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-600/10 border border-purple-500/20 text-purple-400 rounded-2xl">
            <Database className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-100">کنترل پنل و اتصال به بانک اطلاعاتی</h3>
              <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 font-bold rounded-md ${
                errorSimulated 
                  ? 'bg-rose-500/20 text-rose-450 text-rose-400 border border-rose-500/10' 
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
              }`}>
                <Wifi className="w-2.5 h-2.5" />
                <span>{errorSimulated ? 'قطعی شبیه‌سازی' : isConnecting ? 'در حال اتصال...' : 'متصل و فعال'}</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">تراکنش‌های شیفت کاری مرکز تماس به صورت کوئری‌های زنده هماهنگ می‌شوند</p>
          </div>
        </div>

        {/* Database selector switch engine */}
        <div className="flex items-center gap-2.5">
          <label className="text-[10px] text-slate-400 font-bold hidden sm:inline-block">موتور پایگاه‌داده:</label>
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/90 border border-slate-800 rounded-2xl">
            {(['sqlite', 'postgres', 'mongodb', 'cloud_sql'] as DbEngine[]).map((engine) => (
              <button
                key={engine}
                onClick={() => handleEngineChange(engine)}
                disabled={isConnecting}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer transition-colors ${
                  dbEngine === engine
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                {engine === 'sqlite' ? 'SQLite (محلی)' : 
                 engine === 'postgres' ? 'PostgreSQL' : 
                 engine === 'mongodb' ? 'MongoDB' : 'Cloud SQL'}
              </button>
            ))}
          </div>
        </div>
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
                ? 'bg-rose-650 bg-rose-500 border-rose-400 text-white' 
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
                log.status === 'ERROR' ? 'bg-rose-500/20 text-rose-400' : 'bg-green-500/10 text-emerald-450 text-emerald-400'
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
