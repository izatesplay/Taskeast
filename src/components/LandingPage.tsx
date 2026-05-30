/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PhoneCall, 
  Sparkles, 
  Users, 
  Clock, 
  Activity, 
  ArrowLeft, 
  Lock, 
  UserCheck, 
  ShieldCheck, 
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { User } from '../types';

interface LandingPageProps {
  onStart: (selectedUser: User) => void;
  mockUsers: User[];
}

export default function LandingPage({ onStart, mockUsers }: LandingPageProps) {
  const [step, setStep] = useState<'intro' | 'login-select'>('intro');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [passcode, setPasscode] = useState<string>('');
  const [showPass, setShowPass] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Submit profile selection and PIN
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setErrorText('لطفاً ابتدا همکار مسئول شیفت را انتخاب کنید.');
      return;
    }
    
    setIsLoggingIn(true);
    setErrorText('');

    // Verify passcode
    const expectedPassword = selectedUser.password || (selectedUser.id === 'user_1' ? '1234' : '1111');
    if (passcode !== expectedPassword) {
      setTimeout(() => {
        setErrorText('⚠️ رمز عبور وارد شده نامعتبر است. مربی یا سوپروایزر را برای تایید مجدد مطلع کنید.');
        setIsLoggingIn(false);
      }, 600);
      return;
    }

    // Simulate database handshake
    setTimeout(() => {
      setIsLoggingIn(false);
      onStart(selectedUser);
    }, 1200);
  };

  const selectUser = (user: User) => {
    setSelectedUser(user);
    setErrorText('');
    setPasscode('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-800/50 z-10" style={{ direction: 'rtl' }}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-xl shadow-lg ring-1 ring-white/10 flex items-center justify-center">
            <PhoneCall className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              تسک‌بورد مرکز تماس (کالسنتر)
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">Call Center Secure Board v2.5</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-xs bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full text-slate-400">
          <span className="w-2 h-2 bg-emerald-55 bg-emerald-500 rounded-full animate-pulse" />
          <span>پروتکل امنیتی SHA-256 فعال</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-grow z-10 flex items-center justify-center">
        
        <AnimatePresence mode="wait">
          {step === 'intro' ? (
            /* STEP 1: WELCOME INTRO */
            <motion.div 
              key="intro-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full"
              style={{ direction: 'rtl' }}
            >
              <div className="lg:col-span-7 flex flex-col items-start text-right space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" style={{ animationDuration: '3s' }} />
                  <span>آپدیت شیفت کاری سال ۱۴۰۵ با تفکیک حریم خصوصی</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                  تفکیک حریم خصوصی کارشناسان؛{' '}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-450 bg-clip-text text-transparent block mt-2">
                    هر اپراتور تنها بلیت‌های خود را می‌بیند
                  </span>
                </h2>

                <p className="text-slate-350 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  به منظور بهبود امنیت داده‌ها و انطباق کامل با پروتکل‌های سازمانی مرکز ارتباط، هر کارشناس پس از ورود ایمن به حساب کاربری خود، صرفاً بلیت‌ها، هماهنگی‌های تلفنی و تسک‌هایی را مشاهده می‌کند که مستقیماً به وی ارجاع شده است. اطلاعات سایر همکاران به هیچ عنوان در حساب کاربری دیگران قابل رؤیت و پایش نمی‌باشد.
                </p>

                {/* Primary CTA button to slide into secure login step */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => setStep('login-select')}
                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-white shadow-[0_4px_20px_rgba(168,85,247,0.35)] hover:shadow-[0_4px_30px_rgba(236,72,153,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-3"
                  >
                    <span>ورود به سیستم و شروع شیفت پاسخگویی</span>
                    <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 rotate-180 transition-transform" />
                  </button>
                  
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 px-4 py-2.5 border border-slate-800 rounded-2xl bg-slate-900/40">
                    <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>اتصال به بانک اطلاعاتی برقرار است</span>
                  </div>
                </div>

                {/* Stats Indicators grid */}
                <div className="pt-8 border-t border-slate-800/80 w-full grid grid-cols-3 gap-4">
                  <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
                    <p className="text-xl sm:text-2xl font-black text-purple-400 font-mono">حریم شخصی</p>
                    <p className="text-xs text-slate-400 mt-1">تفکیک کامل بلیت‌ها</p>
                  </div>
                  <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
                    <p className="text-xl sm:text-2xl font-black text-rose-400 font-mono">SHA-256</p>
                    <p className="text-xs text-slate-400 mt-1">رمزنگاری اعتبارات</p>
                  </div>
                  <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
                    <p className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">۵ اپراتور</p>
                    <p className="text-xs text-slate-400 mt-1">پشتیبانی چند هویتی لایو</p>
                  </div>
                </div>
              </div>

              {/* Decorative Visual Frame Column */}
              <div className="lg:col-span-5 flex justify-center items-center">
                <div className="relative w-full max-w-sm bg-slate-900/85 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md text-right">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
                    <div className="flex gap-1.5ClassName">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80 animate-pulse" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Secured_Authentication_Proxy</span>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center gap-3 py-6 text-center">
                      <div>
                        <ShieldCheck className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-bounce" />
                        <h4 className="text-xs font-bold text-white">پلتفرم متمرکز هماهنگی پرسنل</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">ورود با شماره پرسنلی منحصربه‌فرد جهت دسترسی امن به بلم‌های اولویت‌بندی شده</p>
                      </div>
                    </div>

                    <div className="text-center py-2.5">
                      <span className="text-[9px] text-slate-400 block mb-1">تعداد همکاران فعال همزمان در سیستم</span>
                      <div className="flex justify-center -space-x-2 space-x-reverse">
                        {mockUsers.map(user => (
                          <span 
                            key={user.id} 
                            className={`w-7 h-7 rounded-full ${user.avatarColor} text-white font-bold text-[9px] flex items-center justify-center border-2 border-slate-900`}
                            title={user.name}
                          >
                            {user.initials}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* STEP 2: PROFILE SELECT & ENTER PIN CODE */
            <motion.div 
              key="login-select"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="w-full max-w-4xl"
              style={{ direction: 'rtl' }}
            >
              <div className="bg-slate-905 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Right side: Select Operator list (cols 7) */}
                <div className="lg:col-span-7 space-y-5 text-right flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-400" />
                      <span>انتخاب همکار مسئول شیفت (کاربر فعال)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">همکاری که مایلید کارهای ارجاعی مربوط به او را مدیریت و پیگیری کنید:</p>
                  </div>

                  {/* Grid of users */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4">
                    {mockUsers.map((user) => {
                      const isSelected = selectedUser?.id === user.id;
                      return (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => selectUser(user)}
                          className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-center gap-3.5 ${
                            isSelected
                              ? 'bg-purple-600/15 border-purple-500 text-white shadow-md ring-1 ring-purple-500'
                              : 'bg-slate-950/45 border-slate-800/80 hover:border-slate-700/85 hover:bg-slate-900 text-slate-400 hover:text-slate-250'
                          }`}
                        >
                          <span className={`w-10 h-10 rounded-full ${user.avatarColor} text-white text-xs font-black flex items-center justify-center shrink-0`}>
                            {user.initials}
                          </span>
                          <div className="overflow-hidden">
                            <h4 className={`text-xs sm:text-sm font-black truncate ${isSelected ? 'text-white' : 'text-slate-205 text-slate-300'}`}>
                              {user.name}
                            </h4>
                            <p className="text-[10px] text-slate-450 mt-1 font-medium truncate">{user.role}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom Back To Info action */}
                  <button 
                    type="button" 
                    onClick={() => setStep('intro')}
                    className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer flex items-center gap-1.5 mt-auto"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>بازگشت به معرفی معرفی سیستم</span>
                  </button>
                </div>

                {/* Left side: Secured Pin / Credentials entry form (cols 5) */}
                <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between" style={{ minHeight: '340px' }}>
                  <form onSubmit={handleLoginSubmit} className="space-y-4 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-4 bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-xl w-fit">
                        <Lock className="w-3.5 h-3.5 text-pink-400" />
                        <span>احراز هویت کارشناس</span>
                      </div>

                      {selectedUser ? (
                        <div className="mb-4 p-3 bg-purple-550/10 bg-purple-600/10 border border-purple-500/25 rounded-xl flex items-center gap-2.5">
                          <span className={`w-8 h-8 rounded-full ${selectedUser.avatarColor} text-white text-[10px] font-bold flex items-center justify-center`}>
                            {selectedUser.initials}
                          </span>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-450 block">پروفایل انتخابی جهت ورود</span>
                            <span className="text-xs font-black text-white">{selectedUser.name}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 border-2 border-dashed border-slate-850 rounded-xl mb-4">
                          <UserCheck className="w-8 h-8 text-slate-650 text-slate-600 mx-auto mb-1" />
                          <p className="text-[10px] text-slate-400">یک همکار را از لیست سمت راست انتخاب کنید</p>
                        </div>
                      )}

                      {/* Password PIN slots */}
                      <label className="text-[10px] text-slate-400 font-bold block mb-1.5">گذرواژه امنیتی (رمز موقت):</label>
                      <div className="relative">
                        <input
                          type={showPass ? 'text' : 'password'}
                          value={passcode}
                          onChange={(e) => {
                            setErrorText('');
                            setPasscode(e.target.value);
                          }}
                          placeholder="••••"
                          maxLength={12}
                          disabled={!selectedUser}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-center font-mono tracking-widest text-sm text-white focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-40"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          disabled={!selectedUser}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer disabled:opacity-30"
                        >
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Error or Hint block */}
                      {errorText ? (
                        <div className="mt-2.5 p-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[9px] rounded-lg flex items-center gap-1.5 font-medium">
                          <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
                          <span>{errorText}</span>
                        </div>
                      ) : (
                        <div className="mt-2.5 p-2 bg-slate-900/40 border border-slate-850 text-slate-400 text-[9px] rounded-lg flex flex-col gap-1 text-right leading-relaxed font-medium">
                          <div className="flex items-center gap-1.5">
                            <KeyRound className="w-3 h-3 text-amber-500 shrink-0" />
                            <span>رمز عبور پیش‌فرض:</span>
                          </div>
                          <span>سارا رضایی: <strong className="text-white font-mono">1234</strong> | سایر کارشناسان: <strong className="text-white font-mono">1111</strong></span>
                          <span className="text-[8.5px] text-purple-400 mt-0.5">مدیریت شیفت می‌تواند در تسک‌بورد کارشناس جدید اضافه کرده یا رمز شما را ویرایش کند.</span>
                        </div>
                      )}
                    </div>

                    {/* Submit Login Action */}
                    <button
                      type="submit"
                      disabled={!selectedUser || isLoggingIn}
                      className="w-full bg-gradient-to-r from-purple-550 to-pink-550 from-purple-600 to-pink-600 hover:opacity-95 text-white font-bold py-3.5 rounded-xl text-xs transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg mt-4"
                    >
                      {isLoggingIn ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          <span>در حال اعتبارسنجی پرسنل...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>تأیید ورود و بارگذاری بورد کارهای ارجاعی</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-800/40 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 z-10" style={{ direction: 'rtl' }}>
        <p>© ۱۴۰۵ تسک‌بورد مدیریت کارهای کالسنتر • مجهز به حمايت از حریم کارمندان و تفکیک زنده داده‌ها</p>
        <div className="flex gap-4">
          <span className="hover:text-slate-350 transition-colors pointer-events-none">مشاغل مخابراتی</span>
          <span className="hover:text-slate-350 transition-colors pointer-events-none">توسعه دهنده شیفت</span>
        </div>
      </footer>

    </div>
  );
}
