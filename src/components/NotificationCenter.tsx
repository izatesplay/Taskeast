/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Notification } from '../types';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Sparkles,
  PhoneIncoming,
  Volume2,
  VolumeX
} from 'lucide-react';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onDismissToast: (id: string) => void;
  activeToasts: Notification[];
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  browserPushEnabled?: boolean;
  onToggleBrowserPush?: () => void;
  urgentSoundType?: string;
  onChangeUrgentSoundType?: (type: string) => void;
}

export default function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onDismissToast,
  activeToasts,
  dropdownOpen,
  setDropdownOpen,
  soundEnabled = true,
  onToggleSound,
  browserPushEnabled = false,
  onToggleBrowserPush,
  urgentSoundType = 'double_chord',
  onChangeUrgentSoundType,
}: NotificationCenterProps) {
  
  const unreadCount = (notifications || []).filter((n) => !n.read).length;

  // Visual icons representing notification severity types
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return (
          <div className="p-2 bg-rose-500 rounded-lg text-white">
            <PhoneIncoming className="w-4 h-4 animate-bounce" />
          </div>
        );
      case 'warning':
        return (
          <div className="p-2 bg-amber-500 rounded-lg text-white">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case 'success':
        return (
          <div className="p-2 bg-emerald-500 rounded-lg text-white">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="p-2 bg-blue-500 rounded-lg text-white">
            <Info className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="relative">
      
      {/* 1. Header Bell Icon with unread badge */}
      <button
        id="notification-bell-btn"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center border border-slate-200/40 dark:border-slate-700/40 focus:ring-1 focus:ring-purple-500"
      >
        <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border border-white dark:border-slate-900 animate-pulse font-mono">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu details */}
      <AnimatePresence>
        {dropdownOpen && (
          <>
            {/* Backdrop click-away shield */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setDropdownOpen(false)} 
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute left-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 text-right"
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-55/10 bg-slate-50/50 dark:bg-slate-950/20">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">اعلان‌های سیستم کالسنتر</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">دریافت وقایع، ارجاعات و هشدارهای سرور</p>
                </div>
                <div className="flex items-center gap-2">
                  {onToggleBrowserPush && (
                    <button
                      onClick={onToggleBrowserPush}
                      className={`p-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        browserPushEnabled 
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-850 text-emerald-700 dark:text-emerald-400 font-black' 
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-450'
                      }`}
                      title={browserPushEnabled ? 'غیرفعال‌سازی هوشمند پوش لپتاپ' : 'فعال‌سازی نوتیفیکیشن دسکتاپ'}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${browserPushEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                      <span className="hidden xs:inline">پوش مرورگر</span>
                    </button>
                  )}
                  {onToggleSound && (
                    <button
                      onClick={onToggleSound}
                      className={`p-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        soundEnabled 
                          ? 'bg-purple-100 dark:bg-purple-950/40 border-purple-200 dark:border-purple-850 text-purple-700 dark:text-purple-400' 
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-450'
                      }`}
                      title={soundEnabled ? 'غیرفعال‌سازی نوتیفیکیشن صوتی' : 'فعال‌سازی نوتیفیکیشن صوتی'}
                    >
                      {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                      <span className="hidden xs:inline">{soundEnabled ? 'با صدا' : 'بی صدا'}</span>
                    </button>
                  )}
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllAsRead}
                      className="text-[10px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer font-bold border border-transparent px-1.5 py-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5 animate-pulse" />
                      <span>خوانده شد همه</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Urgent Sound Settings Custom Block */}
              <div className="p-3 bg-rose-500/5 dark:bg-rose-500/10 border-b border-slate-100 dark:border-slate-800 text-right space-y-1.5 flex flex-col items-stretch">
                <span className="text-[10px] text-rose-600 dark:text-rose-450 font-black flex items-center gap-1">
                  🔥 صدای نوتیفیکیشن وظایف فوری (Urgent):
                </span>
                <select
                  value={urgentSoundType}
                  onChange={(e) => onChangeUrgentSoundType?.(e.target.value)}
                  className="w-full text-[10px] font-bold p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-slate-800 dark:text-slate-100"
                >
                  <option value="double_chord">🔊 آکورد دوتایی (پیش‌فرض)</option>
                  <option value="laser_sweep">🛸 جاروب لیزری فضایی (مهیج)</option>
                  <option value="bell_ring">🔔 زنگ کوبنده فلزی (پرصدا)</option>
                  <option value="melodic_triad">🎵 ملودی صعودی هشدار (آلارم)</option>
                </select>
              </div>

              {/* Notification Items List */}
              <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {(notifications || []).length > 0 ? (
                  (notifications || []).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkAsRead(notif.id)}
                      className={`p-3.5 flex items-start gap-3.5 transition-colors cursor-pointer ${
                        !notif.read 
                          ? 'bg-purple-500/5 dark:bg-purple-500/2' 
                          : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/10'
                      }`}
                    >
                      {/* Left Badge Indicator */}
                      {getNotificationIcon(notif.type)}

                      {/* Content details */}
                      <div className="flex-grow space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className={`text-xs font-bold ${notif.read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                            {notif.title}
                          </h5>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {notif.message}
                        </p>
                        <span className="text-[9px] text-slate-450 text-slate-400 dark:text-slate-500 font-mono italic block">
                          {notif.createdAt}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 italic text-xs">
                    هیچ اعلانی ثبت نشده است.
                  </div>
                )}
              </div>

              {/* Clear action footer */}
              {(notifications || []).length > 0 && (
                <div className="p-2.5 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800/60 text-center">
                  <button
                    onClick={onClearAll}
                    className="text-[10px] text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 inline-flex items-center gap-1.5 cursor-pointer font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>پاک کردن کل سوابق لایو</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 2. Bottom-Left Floating Real-Time Spring Toast Overlay Banner */}
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3 w-[330px] sm:w-[360px] pointer-events-none">
        <AnimatePresence>
          {activeToasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: -60, scale: 0.9, y: 15 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: 1,
                y: 0,
                transition: { 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 20 
                } 
              }}
              exit={{ opacity: 0, x: -100, scale: 0.9, transition: { duration: 0.2 } }}
              className="p-4 bg-slate-900/95 dark:bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl flex items-start gap-3.5 pointer-events-auto select-none"
            >
              {/* Event Icon Indicator */}
              {getNotificationIcon(toast.type)}

              {/* Body */}
              <div className="flex-grow space-y-1 text-right">
                <div className="flex justify-between items-center gap-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    {toast.type === 'urgent' && <Sparkles className="w-3 h-3 text-pink-400 animate-pulse" />}
                    {toast.title}
                  </span>
                  
                  {/* Close cross trigger */}
                  <button
                    onClick={() => onDismissToast(toast.id)}
                    className="p-0.5 text-slate-500 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-medium">
                  {toast.message}
                </p>
                
                <span className="text-[9px] text-slate-500 font-mono tracking-wide block">
                  اعلان زنده کالسنتر • هم‌اکنون ‌
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
