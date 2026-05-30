/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus, User, Note, ChatMessage } from '../types';
import { getDynamicUsers } from '../mockData';
import { 
  X, 
  Plus, 
  MessageSquare, 
  UserPlus, 
  Calendar, 
  UserCheck, 
  FileText, 
  ArrowLeft,
  Edit2,
  Trash2,
  BellRing,
  Send,
  Paperclip,
  Download,
  File,
  Image
} from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'notes'> & { id?: string; notes?: Note[]; chatMessages?: ChatMessage[] }) => void;
  taskToEdit?: Task | null;
  currentUser: User;
}

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  taskToEdit,
  currentUser,
}: TaskModalProps) {
  const mockUsers = getDynamicUsers();
  const isEditMode = !!taskToEdit;
  
  // Tab control for existing tasks: details/comments vs editing specifications
  const [activeTab, setActiveTab] = useState<'details' | 'edit'>('details');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('1405-03-10');

  // Chat message & attachment states
  const [chatText, setChatText] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; type: string; size: string; base64?: string } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Local task chat messages loading
  useEffect(() => {
    if (isOpen && taskToEdit) {
      setIsLoadingMessages(true);
      setMessages(taskToEdit.chatMessages || []);
      setIsLoadingMessages(false);
    } else {
      setMessages([]);
    }
  }, [isOpen, taskToEdit?.id, taskToEdit?.chatMessages]);

  // Reset form when modal opens or task changes
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setAssignedUsers(taskToEdit.assignedUsers);
      setDueDate(taskToEdit.dueDate);
      setActiveTab('details');
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setAssignedUsers([currentUser.id]);
      // Default due date to roughly 7 days from now
      setDueDate('1405-03-15');
      setActiveTab('edit');
    }
    setChatText('');
    setAttachedFile(null);
    setIsTyping(false);
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  // Toggle assigned operator selection
  const handleToggleUser = (userId: string) => {
    setAssignedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('لطفاً عنوان تسک را وارد نمایید.');
      return;
    }

    onSubmit({
      id: taskToEdit?.id,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assignedUsers,
      dueDate,
      notes: taskToEdit ? taskToEdit.notes : [],
      chatMessages: messages,
    });

    onClose();
  };

  // Handle Attachment Selection and Base64 Conversion
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedFile({
        name: file.name,
        type: file.type,
        size: (file.size / 1024).toFixed(1) + ' KB',
        base64: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  // Submit in-app Chat message & trigger real-time simulated reply subscriptions
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!chatText.trim() && !attachedFile) || !taskToEdit) return;

    const messageId = 'msg_' + Date.now();
    const freshMessage: ChatMessage = {
      id: messageId,
      taskId: taskToEdit.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      messageText: chatText.trim() || (attachedFile ? `📎 فایل پیوست شد: ${attachedFile.name}` : ''),
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      ...(attachedFile ? { fileAttachment: attachedFile } : {})
    };

    const updatedMessages = [...messages, freshMessage];
    setMessages(updatedMessages);

    // Persist message on submit
    onSubmit({
      ...taskToEdit,
      chatMessages: updatedMessages
    });

    setChatText('');
    setAttachedFile(null);

    // Dynamic subscription simulated reply triggers after brief interval
    const otherUsers = mockUsers.filter(u => u.id !== currentUser.id);
    const responder = otherUsers[Math.floor(Math.random() * otherUsers.length)];

    setTimeout(() => {
      setIsTyping(true);
      setTypingUser(responder.name);
    }, 1500);

    setTimeout(() => {
      const simulatedReplies = [
        "درود همكار گرامی، اطلاعات دریافتی و جزییات فایل ضمیمه را به دقت بررسی كردم. سریعاً هماهنگی‌های لازم با پیگیری فنی صورت می‌گیرد.",
        "سلام. موضوع ثبت شد. هم‌اکنون با مشتری تماس می‌گیریم تا پرونده ترافیکی صف انتظار را برای توزیع به اپراتورها بررسی کنیم.",
        "خسته نباشید. هماهنگی‌های لازم با سوپروایزر ثبت شد و تسک در اولویت اقدام شیفت قرار گرفت. تشکر از به‌روزرسانی کار بلیت.",
        "گزارش شیفت تایید گردید. لطفا نتایج نهایی پیگیری را بعد از اتمام تماس در برد کانبان ثبت نهایی فرمایید."
      ];
      const selectedReply = simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];

      const simulatedMsgId = 'msg_sim_' + Date.now();
      const simulatedMessage: ChatMessage = {
        id: simulatedMsgId,
        taskId: taskToEdit.id,
        senderId: responder.id,
        senderName: responder.name,
        messageText: selectedReply,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      
      const finalMessages = [...updatedMessages, simulatedMessage];
      setMessages(finalMessages);

      onSubmit({
        ...taskToEdit,
        chatMessages: finalMessages
      });

    }, 3800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/45 dark:bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Right Info Section for existing tasks - Details / Notes feed */}
        {isEditMode && activeTab === 'details' && (
          <div className="flex-1 p-5 border-b md:border-b-0 md:border-l border-slate-105 border-slate-100 dark:border-slate-805 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 max-h-[55vh] md:max-h-[90vh] overflow-hidden flex flex-col justify-between">
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3 shrink-0">
                <h3 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">💬 چت درون‌برنامه‌ای بلیت</h3>
                {isLoadingMessages ? (
                  <span className="text-[9px] text-purple-400 animate-pulse">در حال بارگذاری...</span>
                ) : (
                  <span className="text-[10px] bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-mono font-bold">
                    {messages.length} پیام فعال
                  </span>
                )}
              </div>

              {/* Chat timeline bubbles */}
              <div className="flex-grow space-y-3.5 overflow-y-auto pr-1 text-right mb-3 min-h-[180px] md:min-h-[300px] flex flex-col justify-end">
                <div className="space-y-3.5 overflow-y-auto max-h-[250px] md:max-h-[420px]">
                  {messages.length > 0 ? (
                    messages.map((msg) => {
                      const isMe = msg.senderId === currentUser.id;
                      const userObj = mockUsers.find(u => u.id === msg.senderId);
                      return (
                        <div 
                          key={msg.id} 
                          className={`flex items-start gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          {/* Avatar block */}
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${userObj?.avatarColor || 'bg-slate-400'} ${userObj?.textColor || 'text-white'}`}>
                            {userObj?.initials || msg.senderName.substring(0,2)}
                          </div>
                          
                          {/* Bubble component */}
                          <div className="max-w-[80%] space-y-1">
                            <div className={`flex items-center gap-1.5 text-[9px] text-slate-400 ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <span className="font-bold text-slate-600 dark:text-slate-300">{msg.senderName}</span>
                              <span className="font-mono">{msg.timestamp}</span>
                            </div>
                            
                            <div className={`p-3 rounded-2xl text-xs leading-relaxed break-words whitespace-pre-wrap ${
                              isMe 
                                ? 'bg-purple-600 text-white rounded-tr-none' 
                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none'
                            }`}>
                              <p>{msg.messageText}</p>
                              
                              {/* Attachment layout widget */}
                              {msg.fileAttachment && (
                                <div className={`mt-2 p-2 rounded-xl flex items-center justify-between gap-4 text-[10px] border ${
                                  isMe 
                                    ? 'bg-purple-700/40 border-purple-500/30 text-purple-100' 
                                    : 'bg-slate-50 dark:bg-slate-950/40 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                }`}>
                                  <div className="flex items-center gap-1.5 overflow-hidden">
                                    {msg.fileAttachment.type.startsWith('image/') ? (
                                      <Image className="w-3.5 h-3.5 shrink-0 text-purple-300" />
                                    ) : (
                                      <File className="w-3.5 h-3.5 shrink-0 text-purple-300" />
                                    )}
                                    <span className="truncate max-w-[100px] font-bold" title={msg.fileAttachment.name}>
                                      {msg.fileAttachment.name}
                                    </span>
                                    <span className="opacity-70 text-[8px]">({msg.fileAttachment.size})</span>
                                  </div>
                                  
                                  {msg.fileAttachment.base64 && (
                                    <a 
                                      href={msg.fileAttachment.base64} 
                                      download={msg.fileAttachment.name}
                                      className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-colors"
                                      title="دانلود فایل پیوست"
                                    >
                                      <Download className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 text-slate-400/80 italic text-xs">
                      💬 هنوز گفتگویی شروع نشده است. پیام اول را شما بنویسید!
                    </div>
                  )}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-start gap-2 flex-row">
                      <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-800 flex items-center justify-center text-[9px] font-bold text-slate-500 animate-pulse shrink-0">
                        ...
                      </div>
                      <div className="max-w-[80%] space-y-1">
                        <span className="text-[9px] text-slate-400 font-bold">{typingUser} در حال نوشتن...</span>
                        <div className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 text-xs px-3 py-2 rounded-2xl rounded-tl-none inline-flex items-center gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat attachments pre-send label block */}
            <form onSubmit={handleSendChat} className="mt-2 pt-3 border-t border-slate-150 dark:border-slate-800/80 shrink-0">
              {attachedFile && (
                <div className="mb-2 p-1.5 bg-purple-500/10 dark:bg-purple-500/15 border border-purple-400/40 rounded-xl flex items-center justify-between text-[10px]">
                  <span className="text-purple-700 dark:text-purple-300 font-bold truncate">
                    📎 آماده پیوست: {attachedFile.name} ({attachedFile.size})
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setAttachedFile(null)} 
                    className="text-red-500 hover:text-red-700 text-xs px-1"
                  >
                    حذف
                  </button>
                </div>
              )}

              <div className="text-[10px] text-slate-400 mb-1.5 flex items-center justify-between">
                <span>ارسال پاسخ از طرف: <b>{currentUser.name}</b></span>
                <span className="text-slate-400">نقش: {currentUser.role}</span>
              </div>
              
              <div className="relative flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-1.5 focus-within:ring-1 focus-within:ring-purple-500">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-55 border-slate-50 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-xl cursor-pointer transition-colors shrink-0"
                  title="پیوست سند یا فایل"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                <input
                  type="text"
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  placeholder="پیامی بنویسید یا سندی پیوست کنید..."
                  className="flex-grow text-xs bg-transparent border-none outline-none text-slate-800 dark:text-slate-200"
                />

                <button
                  type="submit"
                  disabled={!chatText.trim() && !attachedFile}
                  className="p-2 bg-purple-600 text-white hover:bg-purple-700 disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 rounded-xl cursor-pointer transition-colors shrink-0"
                  title="ارسال پیام"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Core Form Section for creating or specifications edit */}
        <div className="flex-1 flex flex-col justify-between max-h-[85vh] md:max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/20 dark:bg-slate-900/10">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                {isEditMode 
                  ? (activeTab === 'edit' ? 'ویرایش مشخصات وظیفه' : 'جزئیات کار و اطلاعات تماسی') 
                  : 'ایجاد تسک جدید برای کالسنتر'}
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">ثبت گزارش کار کادر پاسخگویی مرکز تماس</p>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Edit / Details Toggle tabs for editing tasks */}
          {isEditMode && (
            <div className="px-6 pt-3 flex border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/10 gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 text-xs font-bold transition-all border-b-2 px-1 cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                💬 چت درون‌برنامه‌ای و گزارش کار
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`pb-2.5 text-xs font-bold transition-all border-b-2 px-1 cursor-pointer ${
                  activeTab === 'edit'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                ⚙️ ویرایش پارامترها و اپراتورها
              </button>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleFormSubmit} className="p-6 space-y-4 flex-grow">
            
            {/* View Only Mode (when viewing details of existing task) */}
            {isEditMode && activeTab === 'details' ? (
              <div className="space-y-4 text-right">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold block">عنوان وظیفه:</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                    {taskToEdit.title}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold block">توضیحات کلی / سناریو تماس:</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 h-28 overflow-y-auto whitespace-pre-line text-justify">
                    {taskToEdit.description || 'توضیحی ثبت نگردیده.'}
                  </p>
                </div>

                {/* Badges indicators row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950/30 rounded-xl border border-slate-100 dark:border-slate-850 text-center">
                    <span className="text-[10px] text-slate-400 block mb-0.5">وضعیت کار</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {taskToEdit.status === 'todo' ? '📋 منتظر' : taskToEdit.status === 'in_progress' ? '⚡ در حال انجام' : '✅ انجام شده'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950/30 rounded-xl border border-slate-100 dark:border-slate-850 text-center">
                    <span className="text-[10px] text-slate-400 block mb-0.5">سطح اولویت</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {taskToEdit.priority === 'urgent' ? '🔴 فوری' : taskToEdit.priority === 'high' ? '🟠 مهم' : taskToEdit.priority === 'medium' ? '🔵 متوسط' : '🟢 عادی'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950/30 rounded-xl border border-slate-100 dark:border-slate-850 text-center">
                    <span className="text-[10px] text-slate-400 block mb-0.5">مهلت سررسید</span>
                    <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">{taskToEdit.dueDate}</span>
                  </div>
                </div>

                {/* Team Grid Stack */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold block mb-1">اپراتورهای مسئول تماس:</span>
                  <div className="flex flex-wrap gap-2">
                    {mockUsers.filter(u => taskToEdit.assignedUsers.includes(u.id)).map(user => (
                      <div 
                        key={user.id} 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${user.avatarColor} ${user.textColor}`}>
                          {user.initials}
                        </span>
                        <span>{user.name}</span>
                      </div>
                    ))}
                    {taskToEdit.assignedUsers.length === 0 && (
                      <span className="text-xs text-slate-400 italic">هیچ همکاری مسئول این تسک نشده است.</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Edit or Create Mode Field Fields */
              <div className="space-y-4">
                
                {/* Field 1: Title */}
                <div className="space-y-1 text-right">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 block">عنوان یادداشت تسک *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثلاً: پیگیری تماس گله‌مندی تاخیر ارسال فاکتور"
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-purple-500 focus:bg-white dark:focus:bg-slate-900 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Field 2: Description */}
                <div className="space-y-1 text-right">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 block">سناریو و توضیحات کامل تماس</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="مثال: اطلاعات بلیت، شرح مشکل مشترک و توافق برای تماس جبرانی..."
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-purple-500 focus:bg-white dark:focus:bg-slate-900 outline-none h-24 resize-none text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Grid Fields Group: Status & Priority & Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Field 3: Status selection */}
                  <div className="space-y-1 text-right">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 block">وضعیت فعلی برد</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as TaskStatus)}
                      className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none text-slate-700 dark:text-slate-300"
                    >
                      <option value="todo">📋 در انتظار پاسخگویی</option>
                      <option value="in_progress">⚡ در حال تماس/بررسی</option>
                      <option value="done">✅ انجام و ثبت نهایی</option>
                    </select>
                  </div>

                  {/* Field 4: Priority selection */}
                  <div className="space-y-1 text-right">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 block">سطح اولویت اقدام</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TaskPriority)}
                      className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none text-slate-700 dark:text-slate-300"
                    >
                      <option value="urgent">🔴 فوری (اقدام ضرب‌العجل)</option>
                      <option value="high">🟠 مهم (تخصیص روزانه)</option>
                      <option value="medium">🔵 متوسط (عادی شیفت)</option>
                      <option value="low">🟢 عادی (سرریز کار)</option>
                    </select>
                  </div>

                  {/* Field 5: Date Limit */}
                  <div className="space-y-1 text-right sm:col-span-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 block">مهلت پاسخگویی / سررسید</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        placeholder="مثال: ۱۴۰۵-۰۳-۱۰"
                        className="w-full text-xs p-3 pr-10 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none font-mono text-slate-800 dark:text-slate-100"
                      />
                      <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                </div>

                {/* Field 6: MultiUserSelect UI Component */}
                <div className="space-y-1.5 text-right">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-300 mr-1 block">
                    اختصاص چند کاربر به تسک (انتخاب اپراتورهای کالسنتر)
                  </label>
                  
                  {/* Custom Container styled for grid selections */}
                  <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 max-h-[170px] overflow-y-auto space-y-2">
                    {mockUsers.map((user) => {
                      const isAssigned = assignedUsers.includes(user.id);
                      return (
                        <div
                          key={user.id}
                          onClick={() => handleToggleUser(user.id)}
                          className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer select-none transition-all ${
                            isAssigned
                              ? 'bg-purple-500/10 border-purple-400/80 dark:border-purple-500/40 text-purple-900 dark:text-purple-300'
                              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-250 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {/* Color Avatar */}
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${user.avatarColor} ${user.textColor}`}>
                              {user.initials}
                            </div>
                            <div>
                              <p className="text-xs font-bold leading-tight">{user.name}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{user.role}</p>
                            </div>
                          </div>

                          {/* Checkbox item */}
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isAssigned}
                              onChange={() => {}} // Swallowed since parent handles click
                              className="w-4.5 h-4.5 text-purple-600 rounded-xs border-slate-300 focus:ring-purple-500 dark:border-slate-700 pointer-events-none"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* Form actions for specifications edit/create */}
            {(!isEditMode || activeTab === 'edit') && (
              <div className="pt-4 border-t border-slate-150 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/10 -m-6 p-6 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>{isEditMode ? 'ذخیره تغییرات تسک' : 'ایجاد تسک کالسنتر'}</span>
                </button>
              </div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
