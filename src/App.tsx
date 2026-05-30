/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, User, Notification } from './types';
import { mockUsers, initialTasks, initialNotifications } from './mockData';
import LandingPage from './components/LandingPage';
import BoardColumn from './components/BoardColumn';
import TaskModal from './components/TaskModal';
import NotificationCenter from './components/NotificationCenter';
import ShiftReportModal from './components/ShiftReportModal';
import DatabaseControl from './components/DatabaseControl';
import CalendarView from './components/CalendarView';
import { signInAnonymously } from 'firebase/auth';
import { auth } from './firebase';
import { 
  Plus, 
  Search, 
  Users, 
  Filter, 
  Sun, 
  Moon, 
  SlidersHorizontal, 
  PhoneCall, 
  TrendingUp,
  Activity,
  Award,
  LogOut,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle2,
  FileText,
  Shield,
  Trash2,
  CheckCircle,
  UserPlus,
  X
} from 'lucide-react';

export default function App() {
  // Navigation & View Mode
  const [activeView, setActiveView] = useState<'landing' | 'board' | 'calendar'>('landing');

  // Core Data State (with localStorage persistence)
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('callcenter_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn(e);
      }
    }
    return mockUsers.map(u => ({
      ...u,
      password: u.id === 'user_1' ? '1234' : '1111'
    }));
  });

  useEffect(() => {
    localStorage.setItem('callcenter_users', JSON.stringify(users));
  }, [users]);

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('callcenter_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('callcenter_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Sound effects status state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('callcenter_sound_enabled');
    return saved !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('callcenter_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  // Active / Logged-in Operator testing state
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('callcenter_user');
    const savedUsersStr = localStorage.getItem('callcenter_users');
    let currentUsersList = mockUsers.map(u => ({ ...u, password: u.id === 'user_1' ? '1234' : '1111' }));
    if (savedUsersStr) {
      try {
        currentUsersList = JSON.parse(savedUsersStr);
      } catch(e){}
    }
    if (saved) {
      const parsed = JSON.parse(saved);
      const found = currentUsersList.find(u => u.id === parsed.id);
      if (found) return found;
    }
    return currentUsersList[0]; // Default to Sarah Rezaei (Shift Manager)
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('callcenter_is_logged_in') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('callcenter_is_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  // Anonymous Firebase Sign-in to satisfy isSignedIn() in firestore.rules
  useEffect(() => {
    signInAnonymously(auth)
      .then((cred) => {
        console.log("Authenticated anonymously to secure Firestore:", cred.user.uid);
      })
      .catch((error) => {
        console.error("Firebase Anonymous Auth failed:", error);
      });
  }, []);

  // UI state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [filterUser, setFilterUser] = useState<string | 'all'>('all');

  // Toast array (transient real-time bottom-left popups)
  const [activeToasts, setActiveToasts] = useState<Notification[]>([]);

  // Modal handlers
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [dbLastAction, setDbLastAction] = useState<string>('');

  // Form states for operator administration panel
  const [newOpName, setNewOpName] = useState('');
  const [newOpRole, setNewOpRole] = useState('اپراتور پاسخگویی شیفت');
  const [newOpPassword, setNewOpPassword] = useState('');
  const [newOpAvatarColor, setNewOpAvatarColor] = useState('bg-purple-600');

  // Add a new employee operator to the workspace database
  const handleAddOperator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpName.trim()) {
      triggerLocalToast({
        title: 'خطا در ثبت اطلاعات',
        message: 'لطفاً نام کامل کارشناس را وارد نمایید.',
        type: 'warning'
      });
      return;
    }
    if (!newOpPassword.trim()) {
      triggerLocalToast({
        title: 'خطا در ثبت اطلاعات',
        message: 'لطفاً یک رمز عبور موقت برای همکار مشخص کنید.',
        type: 'warning'
      });
      return;
    }

    // Format initials automatically
    const parts = newOpName.trim().split(/\s+/);
    let initials = '';
    if (parts.length >= 2) {
      initials = (parts[0][0] || '') + (parts[1][0] || '');
    } else if (parts.length === 1) {
      initials = parts[0].substring(0, 2);
    } else {
      initials = 'اپ';
    }

    const newOpId = `user_${Date.now()}`;
    const newOperator: User = {
      id: newOpId,
      name: newOpName.trim(),
      role: newOpRole.trim(),
      initials: initials,
      avatarColor: newOpAvatarColor,
      textColor: 'text-white',
      password: newOpPassword.trim()
    };

    const updated = [...users, newOperator];
    setUsers(updated);

    // Clear form
    setNewOpName('');
    setNewOpPassword('');
    setNewOpRole('اپراتور پاسخگویی شیفت');
    setNewOpAvatarColor('bg-purple-600');

    triggerLocalToast({
      title: 'همکار جدید افزوده شد',
      message: `آقای/خانم ${newOperator.name} با کد دسترسی اختصاصی به لیست ورود اضافه شد.`,
      type: 'success'
    });
  };

  // Modify password of existing operator
  const handleUpdatePassword = (userId: string, targetPass: string) => {
    if (!targetPass.trim()) {
      triggerLocalToast({
        title: 'کلمه عبور نامعتبر',
        message: 'رمز عبور پرسنل نمی‌تواند خالی باشد.',
        type: 'warning'
      });
      return;
    }
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, password: targetPass.trim() };
      }
      return u;
    });
    setUsers(updated);
    triggerLocalToast({
      title: 'رمز عبور بروزرسانی شد',
      message: 'تغییرات با موفقیت در دیتابیس بورد ذخیره و مکتوب گردید.',
      type: 'success'
    });
  };

  // Resigned operator dismissal (remove account)
  const handleDeleteOperator = (userId: string) => {
    if (userId === currentUser.id) {
      triggerLocalToast({
        title: 'غیرقابل حذف',
        message: 'شما نمی‌توانید اکانت اصلی فعال خودتان را حذف کنید.',
        type: 'warning'
      });
      return;
    }
    const updated = users.filter(u => u.id !== userId);
    setUsers(updated);
    triggerLocalToast({
      title: 'حذف پرونده کارشناس',
      message: 'همکار از دیتابیس فعال خارج و اتصالات دسترسی قطع گردید.',
      type: 'info'
    });
  };

  // Sync data state to localStorage
  useEffect(() => {
    localStorage.setItem('callcenter_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('callcenter_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('callcenter_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Sync body theme classes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Switch Active Team Member who is editing
  const handleSwitchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      
      // Inject informational toast
      triggerLocalToast({
        title: 'تبدیل کاربر فعال شیفت',
        message: `اکنون به عنوان "${user.name}" ({${user.role}}) به سیستم متصل هستید.`,
        type: 'info'
      });
    }
  };

  // Web Audio chime builder
  const playNotificationSound = (isHighPriority: boolean = false) => {
    if (!soundEnabled) return;
    try {
      // @ts-ignore
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (isHighPriority) {
        // Double alarm chords Sequence
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(660, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(440, ctx.currentTime);
        osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
        
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        
        osc1.connect(gainNode);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.35);
        
        gainNode.connect(ctx.destination);
      } else {
        // Gentle Notification Chime
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12);
        
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.30);
        
        osc.connect(gainNode);
        osc.start();
        osc.stop(ctx.currentTime + 0.30);
        
        gainNode.connect(ctx.destination);
      }
    } catch (e) {
      console.warn('AudioContext failed to start.', e);
    }
  };

  // Helper to append a dynamic notification and transient toast
  const triggerLocalNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'urgent') => {
    const freshNotif: Notification = {
      id: 'notif_' + Date.now() + Math.random().toString(36).substr(2, 5),
      title,
      message,
      createdAt: 'هم‌اکنون ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type
    };

    setNotifications(prev => [freshNotif, ...prev]);
    
    // Add to toasts list
    setActiveToasts(prev => [freshNotif, ...prev]);

    // Cleanup toast after 5 seconds automatically
    setTimeout(() => {
      setActiveToasts(prev => prev.filter(t => t.id !== freshNotif.id));
    }, 5500);

    // Play subtle sound!
    const isHighOrUrgent = type === 'urgent' || type === 'warning';
    playNotificationSound(isHighOrUrgent);
  };

  // Just temporary Toast overlay without adding to historical system log
  const triggerLocalToast = (toastParams: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const freshToast: Notification = {
      ...toastParams,
      id: 'toast_' + Date.now(),
      createdAt: 'هم‌اکنون',
      read: false
    };

    setActiveToasts(prev => [freshToast, ...prev]);
    setTimeout(() => {
      setActiveToasts(prev => prev.filter(t => t.id !== freshToast.id));
    }, 5000);
  };

  // Drag start handler - injects ID to transfer packet
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  // Drop card on column action
  const handleDropTask = (taskId: string, targetStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.status === targetStatus) return; // No change

    const PersianColumns: Record<TaskStatus, string> = {
      todo: 'در انتظار',
      in_progress: 'در حال انجام',
      done: 'انجام شده'
    };

    // Trigger update
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: targetStatus };
      }
      return t;
    }));

    setDbLastAction(`MOVE__${taskId}__${targetStatus}`);

    // Raise responsive alert
    triggerLocalNotification(
      'تغییر وضعیت تسک',
      `وظیفه "${task.title}" توسط ${currentUser.name} به ستون "${PersianColumns[targetStatus]}" منتقل شد.`,
      'success'
    );
  };

  // Quick move via Dropdown select list (accessibility)
  const handleMoveTask = (id: string, newStatus: TaskStatus) => {
    handleDropTask(id, newStatus);
  };

  // Task Creation and specs modification handler (supports real-time chat sync and file attachments)
  const handleTaskModalSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'notes'> & { id?: string; notes?: Task['notes']; chatMessages?: Task['chatMessages'] }) => {
    if (taskData.id) {
      // Edit mode
      const isChatAdded = taskData.chatMessages && taskData.chatMessages.length !== (tasks.find(t => t.id === taskData.id)?.chatMessages || []).length;
      
      setTasks(prev => prev.map(t => {
        if (t.id === taskData.id) {
          return {
            ...t,
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            priority: taskData.priority,
            assignedUsers: taskData.assignedUsers,
            dueDate: taskData.dueDate,
            notes: taskData.notes || [],
            chatMessages: taskData.chatMessages || []
          };
        }
        return t;
      }));

      if (isChatAdded) {
        setDbLastAction(`CHAT__${taskData.id}__add`);
        triggerLocalNotification(
          'پیام جدید در چت',
          `پیام جدیدی در گفتگوی تسک "${taskData.title}" ثبت گردید.`,
          'info'
        );
      } else {
        setDbLastAction(`EDIT__${taskData.id}__update`);
        triggerLocalNotification(
          'به‌روزرسانی وظیفه',
          `مشخصات تسک "${taskData.title}" توسط ${currentUser.name} با موفقیت ویرایش گردید.`,
          'success'
        );
      }
    } else {
      // Create mode
      const freshTask: Task = {
        id: 'task_' + Date.now(),
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        assignedUsers: taskData.assignedUsers,
        dueDate: taskData.dueDate,
        notes: [],
        chatMessages: [],
        createdAt: 'امروز ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
      };

      setTasks(prev => [freshTask, ...prev]);
      setDbLastAction(`ADD__${freshTask.title}__create`);

      triggerLocalNotification(
        'ایجاد بلیت کار جدید',
        `تسک "${freshTask.title}" با اولویت ${
          freshTask.priority === 'urgent' ? 'فوری' : freshTask.priority === 'high' ? 'مهم' : 'معمولی'
        } توسط ${currentUser.name} به برد اضافه شد.`,
        freshTask.priority === 'urgent' ? 'urgent' : 'success'
      );
    }
  };

  // Delete task completely
  const handleDeleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setTasks(prev => prev.filter(t => t.id !== id));
    setDbLastAction(`DELETE__${id}__remove`);
    triggerLocalNotification(
      'حذف وظیفه',
      `تسک "${task.title}" توسط ${currentUser.name} از آرشیو برد کالسنتر حذف شد.`,
      'warning'
    );
  };

  // Event subscriber is handled internally by real-time reactive states

  // Notification actions
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    triggerLocalToast({
      title: 'وضعیت پیام‌ها',
      message: 'تمامی اعلان‌های ورودی به عنوان خوانده شده علامت‌گذاری شدند.',
      type: 'success'
    });
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    triggerLocalToast({
      title: 'پاکسازی هیستوری',
      message: 'تاریخچه اعلان‌های لایو با موفقیت ریست شد.',
      type: 'info'
    });
  };

  const handleDismissToast = (id: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  };

  // Reset demo board to initial data state
  const handleResetDemoData = () => {
    if (confirm('آیا مایلید تمام تغییرات را حذف کرده و اطلاعات اولیه را بازنشانی کنید؟')) {
      setTasks(initialTasks);
      setNotifications(initialNotifications);
      triggerLocalToast({
        title: 'بازنشانی اطلاعات شیفت',
        message: 'دیتا برد و یادداشت‌ها با موفقیت بازنشانی شدند.',
        type: 'info'
      });
    }
  };

  // Filter & Search computation (Highly Secure: restricted to current operator's assigned tasks, while supervisors can oversee all)
  const isManager = currentUser.role.includes('مدیر') || currentUser.role.includes('سوپروایزر') || currentUser.id === 'user_1';
  const myTasks = isManager ? tasks : tasks.filter(task => task.assignedUsers.includes(currentUser.id));

  const filteredTasks = myTasks.filter(task => {
    // Search query matches title or description
    const textMatch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Priority filter match
    const priorityMatch = filterPriority === 'all' || task.priority === filterPriority;

    return textMatch && priorityMatch;
  });

  // Calculate live HUD stats to display at top based strictly on MY tasks
  const totalCount = myTasks.length;
  const completedCount = myTasks.filter(t => t.status === 'done').length;
  const inProgressCount = myTasks.filter(t => t.status === 'in_progress').length;
  const urgentCount = myTasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length;

  if (!isLoggedIn) {
    return (
      <LandingPage 
        onStart={(selectedUser) => {
          setCurrentUser(selectedUser);
          setIsLoggedIn(true);
          setActiveView('board');
        }} 
        mockUsers={users} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 transition-colors duration-200">
      
      {/* 2. MAIN HEADER (Sticky & Tinted with Glassmorphism Purple/Pink Gradients) */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand Logo & Title with Active Switcher info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveView('landing')}
                className="p-2 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-xl text-white shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                title="بازگشت به صفحه معرفی"
              >
                <PhoneCall className="w-5 h-5" />
              </button>
              
              <div className="text-right">
                <span className="text-[10px] bg-purple-500/10 text-purple-700 dark:text-purple-400 font-bold px-2 py-0.5 rounded-md leading-none">
                  میز کار کالسنتر
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-white mt-1">
                  تسک‌بورد پاسخگویی کانبان
                </h2>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid Badges */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 bg-slate-100/60 dark:bg-slate-950/40 p-1.5 rounded-2xl border border-slate-200/40 dark:border-slate-800/50">
            <div className="px-2.5 py-1 text-center">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 block">کل کارهای فعال</span>
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-white font-mono">{totalCount}</span>
            </div>
            <div className="px-2.5 py-1 text-center border-r border-slate-200/50 dark:border-slate-800/50">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 block">در حال تماس</span>
              <span className="text-xs sm:text-sm font-black text-amber-500 dark:text-amber-400 font-mono">{inProgressCount}</span>
            </div>
            <div className="px-2.5 py-1 text-center border-r border-slate-200/50 dark:border-slate-800/50">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 block">پاسخ‌داده شده</span>
              <span className="text-xs sm:text-sm font-black text-emerald-500 dark:text-emerald-400 font-mono">{completedCount}</span>
            </div>
            <div className="px-2.5 py-1 text-center border-r border-slate-200/50 dark:border-slate-800/50">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 block">بحرانی/فوری</span>
              <span className="text-xs sm:text-sm font-black text-rose-500 dark:text-rose-400 font-mono animate-pulse">{urgentCount}</span>
            </div>
          </div>

          {/* User Controls and Theme Switcher widgets */}
          <div className="flex items-center justify-end gap-3.5">
            
            {/* Operator Switcher selector changed to direct Active Logged-in profile tag */}
            <div className="flex items-center gap-2.5 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-500/20 dark:border-purple-900/40 px-3.5 py-2 rounded-2xl text-right">
              <span className={`w-8 h-8 rounded-full ${currentUser.avatarColor} text-white text-xs font-black flex items-center justify-center border border-white dark:border-slate-900`}>
                {currentUser.initials}
              </span>
              <div className="hidden xs:flex flex-col text-right text-[10px]">
                <span className="text-[9px] text-purple-600 dark:text-purple-400 font-bold leading-none">{currentUser.role}</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 mt-1">{currentUser.name}</span>
              </div>
            </div>

            {/* Notification drop center */}
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClearAll={handleClearAllNotifications}
              onDismissToast={handleDismissToast}
              activeToasts={activeToasts}
              dropdownOpen={isNotificationDropdownOpen}
              setDropdownOpen={setIsNotificationDropdownOpen}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled(!soundEnabled)}
            />

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-all cursor-pointer border border-slate-200/45 dark:border-slate-700/40"
              title={theme === 'light' ? 'فعالسازی تم تاریک' : 'فعالسازی تم روشن'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-indigo-600" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>

            {/* Secure Log out button */}
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setActiveView('landing');
                triggerLocalToast({
                  title: 'خروج موفقیت‌آمیز',
                  message: `شما با موفقیت از سیستم پاسخگویی خارج شدید.`,
                  type: 'info'
                });
              }}
              className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-white dark:text-rose-400 hover:bg-rose-600 dark:hover:bg-rose-600/90 border border-rose-500/20 px-3 px-2 sm:px-3.5 py-2 sm:py-2.5 rounded-xl transition-all font-black cursor-pointer"
              title="خروج از حساب کاربری"
              id="logout-btn"
            >
              <LogOut className="w-4 h-4 rotate-180" />
              <span className="hidden xs:inline">خروج از حساب</span>
            </button>

          </div>

        </div>
      </header>

      {/* CORE WORKSPACE container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Filter bar and Addition button controls */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-3xl shadow-xs flex flex-col md:flex-row gap-4 items-stretch justify-between">
          
          {/* Right Inputs: Search text & Filters */}
          <div className="flex flex-wrap items-center gap-3 flex-grow max-w-4xl">
            
            {/* Search Input Box */}
            <div className="relative flex-grow min-w-[200px] sm:min-w-[260px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی بلیت، شماره تماس، نام مشترک یا تگ..."
                className="w-full text-xs p-3 pr-10 pl-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-1 focus:ring-purple-500 focus:bg-white dark:focus:bg-slate-900 outline-none text-slate-800 dark:text-slate-100 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            </div>

            {/* Secure Filter Profile Tag */}
            {isManager ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-400 rounded-2xl text-[11px] font-black shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span>دسترسی مدیریت: نظارت بر کل بلیت‌های دپارتمان</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-purple-55 bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-400 rounded-2xl text-[11px] font-black shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                <span>بلیت‌های ارجاعی به: {currentUser.name}</span>
              </div>
            )}

            {/* Filter by Priority */}
            <div className="relative min-w-[120px]" title="فیلتر بر اساس نوع اولویت">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="appearance-none w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs p-3 pl-8 pr-3.5 rounded-2xl cursor-pointer outline-none focus:ring-1 focus:ring-purple-500 text-slate-700 dark:text-slate-300 font-semibold"
              >
                <option value="all">🔥 کل اولویت‌ها</option>
                <option value="urgent">🔴 فقط فوری</option>
                <option value="high">🟠 فقط مهم</option>
                <option value="medium">🔵 فقط متوسط</option>
                <option value="low">🟢 فقط عادی</option>
              </select>
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>

            {/* Active Filter Clear Helper trigger */}
            {(searchQuery || filterPriority !== 'all' || filterUser !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterPriority('all');
                  setFilterUser('all');
                }}
                className="text-xs text-rose-500 font-bold hover:underline cursor-pointer"
              >
                حذف فیلترها
              </button>
            )}

          </div>

          {/* Left Actions Button: Add Task, Reset Data, and Print PDF Shift Summary */}
          <div className="flex items-center gap-3 justify-end shrink-0">
            
            {/* Reset data */}
            <button
              onClick={handleResetDemoData}
              className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 hover:text-slate-800 transition-colors cursor-pointer border border-transparent dark:border-slate-800"
              title="بارگذاری مجدد اطلاعات آزمایشی"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* User credentials and Addition Admin panel toggle button */}
            <button
              id="admin-user-mgmt-btn"
              onClick={() => setIsUserMgmtOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer border border-transparent"
              title="مدیریت ثبت کارشناس جدید و تنظیم گذرواژه‌ها"
            >
              <Users className="w-4 h-4" />
              <span>مدیریت پرسنل و رمزها</span>
            </button>

            {/* Shift end report printable PDF exporter */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer border border-transparent"
              title="خروجی گزارش شیفت PDF"
            >
              <FileText className="w-4 h-4" />
              <span>خروجی PDF شیفت</span>
            </button>

            {/* Add task CTA */}
            <button
              id="add-task-btn"
              onClick={() => {
                setTaskToEdit(null);
                setIsTaskModalOpen(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-4 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت تسک جدید</span>
            </button>

          </div>

        </div>

        {/* Database Sync Panel Controller */}
        <DatabaseControl 
          tasks={tasks}
          notifications={notifications}
          lastAction={dbLastAction}
        />

        {/* 4. CHRONO DESK - INTERACTIVE VIEW TAB SWITCHER */}
        <div className="flex items-center gap-2 bg-slate-150 bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-1.5 rounded-2xl w-fit text-right" style={{ direction: 'rtl' }}>
          <button
            type="button"
            onClick={() => setActiveView('board')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-black transition-all duration-150 cursor-pointer flex items-center gap-2 ${
              activeView === 'board'
                ? 'bg-purple-650 bg-purple-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-750 dark:hover:text-slate-300 dark:text-slate-400'
            }`}
          >
            📋 بورد کانبان شیفت
          </button>
          
          <button
            type="button"
            onClick={() => setActiveView('calendar')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-black transition-all duration-150 cursor-pointer flex items-center gap-2 relative ${
              activeView === 'calendar'
                ? 'bg-purple-650 bg-purple-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-750 dark:hover:text-slate-300 dark:text-slate-400'
            }`}
          >
            📅 تقویم و توزیع ددلاین‌ها
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>

        {activeView === 'board' ? (
          /* 3. KANBAN BOARD WRAPPER - Columns Todo, In Progress, Done */
          <div className="flex flex-col md:flex-row gap-5 overflow-x-auto pb-4 items-stretch select-none">
            <BoardColumn
              id="todo"
              label="در انتظار اقدام"
              emoji="📋"
              tasks={filteredTasks.filter(t => t.status === 'todo')}
              onViewDetails={(task) => {
                setTaskToEdit(task);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onMoveTask={handleMoveTask}
              onDragStart={handleDragStart}
              onDropTask={handleDropTask}
            />

            <BoardColumn
              id="in_progress"
              label="در حال پیگیری تلفنی / بررسی"
              emoji="⚡"
              tasks={filteredTasks.filter(t => t.status === 'in_progress')}
              onViewDetails={(task) => {
                setTaskToEdit(task);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onMoveTask={handleMoveTask}
              onDragStart={handleDragStart}
              onDropTask={handleDropTask}
            />

            <BoardColumn
              id="done"
              label="موفقیت‌آمیز / آرشیو شده"
              emoji="✅"
              tasks={filteredTasks.filter(t => t.status === 'done')}
              onViewDetails={(task) => {
                setTaskToEdit(task);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onMoveTask={handleMoveTask}
              onDragStart={handleDragStart}
              onDropTask={handleDropTask}
            />
          </div>
        ) : (
          <CalendarView
            tasks={filteredTasks}
            onViewTask={(task) => {
              setTaskToEdit(task);
              setIsTaskModalOpen(true);
            }}
          />
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80 mt-12 py-6 text-center text-xs text-slate-500 max-w-7xl mx-auto rounded-t-3xl shadow-lg">
        <p className="font-medium">تسک‌بورد کالسنتر مجهز به چت درون‌برنامه‌ای، پیوست فایل و خروجی گزارش شیفت.</p>
        <p className="mt-1 text-slate-400 dark:text-slate-500">طراحی شده بر اساس استانداردهای راست‌به‌چپ (RTL) زبان شیرین فارسی • سال ۱۴۰۵ • دیتابیس فعال</p>
      </footer>

      {/* Task Creation & Detail modal dialog */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSubmit={handleTaskModalSubmit}
        taskToEdit={taskToEdit}
        currentUser={currentUser}
      />

      {/* Shift summary report and PDF printer modal */}
      <ShiftReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        tasks={tasks}
        currentUser={currentUser}
      />

      {/* Operator and Passcode Administrative Management Modal */}
      {isUserMgmtOpen && (
        <div id="user-mgmt-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-right" style={{ direction: 'rtl' }}>
          <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-150 dark:border-slate-800/80 flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 shrink-0">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">مدیریت اعضاء و رمز عبور پرسنل</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">ثبت نام کارمند جدید و ویرایش کلمه‌های عبور ورود به سامانه</p>
                </div>
              </div>
              <button
                onClick={() => setIsUserMgmtOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Scroll Container */}
            <div className="p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-12 gap-6 bg-white dark:bg-slate-900">
              
              {/* Right Side: Add New Operator Form (Col: 5) */}
              <div className="md:col-span-5 border-b md:border-b-0 md:border-l border-slate-100 dark:border-slate-800 pb-6 md:pb-0 md:pl-6 space-y-4">
                <div className="border-r-4 border-indigo-500 pr-3">
                  <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">افزودن کارمند جدید</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">ثبت همکار جدید در لیست ورودی سیستم پاسخگویی</p>
                </div>

                <form onSubmit={handleAddOperator} className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 block mr-1">نام و خانوادگی همکار *</label>
                    <input
                      type="text"
                      required
                      value={newOpName}
                      onChange={(e) => setNewOpName(e.target.value)}
                      placeholder="مثلاً: علیرضا حسینی"
                      className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-850 dark:text-slate-100 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 block mr-1">سمت شغلی / دبارتمان *</label>
                    <input
                      type="text"
                      required
                      value={newOpRole}
                      onChange={(e) => setNewOpRole(e.target.value)}
                      placeholder="مثلاً: کارشناس پاسخگویی"
                      className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-850 dark:text-slate-100 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 block mr-1">گذرواژه ورود (پسورد) *</label>
                    <input
                      type="text"
                      required
                      value={newOpPassword}
                      onChange={(e) => setNewOpPassword(e.target.value)}
                      placeholder="یک رمز برای همکار مشخص کنید"
                      className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-850 dark:text-slate-100 font-mono placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 block mr-1">رنگ نماد آواتار همکار</label>
                    <div className="flex gap-2">
                      {[
                        'bg-purple-600',
                        'bg-indigo-600',
                        'bg-emerald-600',
                        'bg-rose-600',
                        'bg-amber-600',
                        'bg-cyan-600',
                        'bg-sky-600'
                      ].map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewOpAvatarColor(color)}
                          className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${color} ${newOpAvatarColor === color ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 scale-110' : 'opacity-85 hover:opacity-100'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-transform cursor-pointer shadow-md mt-4"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>افزودن کارشناس جدید</span>
                  </button>
                </form>
              </div>

              {/* Left Side: Real-Time Password Management and Operator Listing (Col: 7) */}
              <div className="md:col-span-7 flex flex-col h-full space-y-4">
                <div className="border-r-4 border-emerald-500 pr-3">
                  <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">فهرست کل پرسنل فعال سامانه</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">مشاهده مستقیم و ویرایش آنی رمز عبور تک تک کاربران</p>
                </div>

                <div className="space-y-2.5 overflow-y-auto max-h-[420px] pr-1 flex-grow">
                  {users.map((item) => (
                    <div 
                      key={item.id}
                      className="p-3 bg-slate-50 dark:bg-slate-950/45 rounded-2xl border border-slate-150 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      {/* Avatar & Operator Meta Info */}
                      <div className="flex items-center gap-2.5 min-w-[150px]">
                        <span className={`w-9 h-9 shrink-0 rounded-full ${item.avatarColor} text-white text-xs font-black flex items-center justify-center border border-white dark:border-slate-900 shadow-xs`}>
                          {item.initials}
                        </span>
                        <div>
                          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.name}</h5>
                          <span className="text-[9px] text-slate-400">{item.role}</span>
                        </div>
                      </div>

                      {/* Password input & modify action */}
                      <div className="flex items-center gap-1.5 grow sm:justify-end">
                        <div className="relative max-w-[140px] w-full" title="رمز عبور">
                          <span className="absolute right-2 top-2 text-[9px] font-black text-slate-400">پسورد:</span>
                          <input
                            type="text"
                            defaultValue={item.password || '1111'}
                            onBlur={(e) => handleUpdatePassword(item.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdatePassword(item.id, (e.target as HTMLInputElement).value);
                              }
                            }}
                            placeholder="رمز ورود"
                            className="w-full text-xs py-1.5 pr-11 pl-2 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-850 rounded-lg text-left font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-400 font-bold"
                          />
                        </div>
                        
                        {/* Save password indicator */}
                        <button
                          type="button"
                          onClick={(e) => {
                            const inputElem = e.currentTarget.previousSibling?.querySelector('input');
                            if (inputElem) {
                              handleUpdatePassword(item.id, inputElem.value);
                            }
                          }}
                          className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="ثبت کلمه عبور همکار"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>

                        {/* Dismiss Operator */}
                        <button
                          type="button"
                          onClick={() => handleDeleteOperator(item.id)}
                          className="p-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="حذف و قطع دسترسی کارمند"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-150 dark:border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-slate-400 pr-2">توصیه امنیتی: اطلاعات رمز عبور به صورت کدهای تفکیکی در حافظه محلی ذخیره می‌گردد.</span>
              <button
                type="button"
                onClick={() => setIsUserMgmtOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-[11px] font-bold cursor-pointer"
              >
                بستن پنجره مدیریت
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
