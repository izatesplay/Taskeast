/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
  EyeOff,
  Cpu,
  Layers,
  Zap,
  CheckCircle2
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

  // 3D Tilt Effect State for Mouse Interactions
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // range: -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // range: -0.5 to 0.5
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

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
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen bg-[#060814] text-slate-100 flex flex-col justify-between relative overflow-hidden select-none font-sans"
    >
      
      {/* Interactive Cyber Neon Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f1123_1px,transparent_1px),linear-gradient(to_bottom,#0f1123_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />

      {/* Floating 3D Lava Orbs & Ambient Glow Lamps */}
      <motion.div 
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -80, 50, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-10%] left-[10%] w-[450px] h-[450px] bg-gradient-to-tr from-purple-600/20 to-indigo-600/20 rounded-full blur-[100px] pointer-events-none" 
      />
      
      <motion.div 
        animate={{
          x: [0, -70, 50, 0],
          y: [0, 90, -60, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[-10%] right-[15%] w-[550px] h-[550px] bg-gradient-to-tr from-pink-600/25 to-rose-600/10 rounded-full blur-[130px] pointer-events-none" 
      />

      <div className="absolute top-[35%] right-[5%] w-[250px] h-[250px] bg-cyan-500/15 rounded-full blur-[80px] pointer-events-none animate-pulse" />

      {/* Glowing Neon Lines */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-pink-500 opacity-60" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-900 z-10" style={{ direction: 'rtl' }}>
        <div className="flex items-center gap-3.5">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 12 }}
            className="p-3 bg-gradient-to-tr from-purple-600 via-purple-500 to-pink-500 rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.4)] flex items-center justify-center border border-white/20"
          >
            <PhoneCall className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">
              تسک‌بورد مرکز تماس (کالسنتر)
            </h1>
            <p className="text-[10px] text-purple-400 font-mono tracking-wider uppercase">DYNAMIC CALL CENTER SECURITY ENGINE v3.0</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs bg-slate-950/80 border border-purple-900/30 px-4 py-2 rounded-full text-slate-350 shadow-inner">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="font-bold text-slate-300 text-[11px]">پروتکل امنیتی SHA-256 و وب‌آدیو فعال</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-6 py-10 flex-grow z-10 flex items-center justify-center">
        
        <AnimatePresence mode="wait">
          {step === 'intro' ? (
            /* STEP 1: WELCOME INTRO */
            <motion.div 
              key="intro-screen"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.5, type: 'spring', damping: 20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full"
              style={{ direction: 'rtl' }}
            >
              <div className="lg:col-span-7 flex flex-col items-start text-right space-y-7">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md shadow-lg"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>طراحی مدرن ۳ بعدی شیفت کاری سال ۱۴۰۵</span>
                </motion.div>

                <motion.h2 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-4xl lg:text-5.5xl font-extrabold text-white leading-tight"
                >
                  تفکیک پیشرفته حریم خصوصی؛{0}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent block mt-3">
                    هر کارشناس تنها تسک‌های خود را می‌بیند
                  </span>
                </motion.h2>

                <motion.p 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-slate-300/90 text-sm sm:text-base leading-relaxed max-w-2xl text-justify"
                >
                  به منظور بهبود حداکثری امنیت اطلاعات کاربری پاسخگویی مرکز ارتباط، هر کارشناس پس از تایید هویت رمز عبور موقت، صرفاً تسک‌ها، پیام‌های چت درون‌تیمی و گزارش‌های مربوط به خود را مشاهده می‌کند. محیط به صورت ۳ بعدی و متصل به پایگاه داده phpMyAdmin توسعه یافته است.
                </motion.p>

                {/* Primary CTA button to slide into secure login step */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
                >
                  <button
                    onClick={() => setStep('login-select')}
                    className="group relative px-9 py-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 rounded-2xl font-bold text-white shadow-[0_0_35px_rgba(168,85,247,0.35)] hover:shadow-[0_0_50px_rgba(236,72,153,0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-3 border border-white/15"
                  >
                    <span>ورود به سامانه ۳ بعدی و شروع شیفت</span>
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </button>
                  
                  <div className="flex items-center justify-center gap-2 text-xs text-purple-300 px-5 py-4 border border-purple-900/30 rounded-2xl bg-slate-950/60 backdrop-blur-md">
                    <Activity className="w-4 h-4 text-emerald-400 animate-pulse animate-duration-1500" />
                    <span className="font-medium">پینگ پایگاه‌داده موقت: ۱۲ms (پایدار)</span>
                  </div>
                </motion.div>

                {/* Stats Indicators grid with 3D Float effect */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-8 border-t border-slate-900/80 w-full grid grid-cols-3 gap-4"
                >
                  <div className="group bg-slate-950/40 p-4 rounded-2xl border border-slate-900 hover:border-purple-500/20 hover:bg-slate-900/20 transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                    <p className="text-lg sm:text-xl font-black text-purple-400 font-mono">حفظ هویت</p>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-1">تسک‌ها برای شخص شما</p>
                  </div>
                  <div className="group bg-slate-950/40 p-4 rounded-2xl border border-slate-900 hover:border-pink-500/20 hover:bg-slate-900/20 transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                    <p className="text-lg sm:text-xl font-black text-pink-400 font-mono">وب‌آدیو ۳D</p>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-1">اعلام صوتی هوشمند</p>
                  </div>
                  <div className="group bg-slate-950/40 p-4 rounded-2xl border border-slate-900 hover:border-cyan-500/20 hover:bg-slate-900/20 transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                    <p className="text-lg sm:text-xl font-black text-cyan-400 font-mono">۵ اپراتور</p>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-1">همگام‌سازی زنده شیفت</p>
                  </div>
                </motion.div>
              </div>

              {/* Spectacular 3D Interactive Mock Frame Column */}
              <div className="lg:col-span-5 flex justify-center items-center">
                <motion.div 
                  style={{
                    transform: `perspective(1000px) rotateY(${mousePos.x * 25}deg) rotateX(${mousePos.y * -25}deg)`,
                    transition: 'transform 0.1s ease-out',
                    boxShadow: '0 30px 60px -15px rgba(0,0,0,0.8), 0 0 50px rgba(168,85,247,0.1)'
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-[35px] p-6 text-right overflow-hidden group/card"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-550/10 rounded-full blur-2xl group-hover/card:scale-110 transition-transform duration-500" />
                  
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800/80 mb-5">
                    <div className="flex gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-rose-500/80 animate-ping" />
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80" />
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[10px] text-purple-400 font-mono tracking-widest font-black uppercase">REALTIME_SHIFT_PROXY</span>
                  </div>

                  <div className="space-y-4">
                    {/* Glowing holographic block */}
                    <div className="p-4 bg-gradient-to-r from-purple-950/60 to-slate-900/40 border border-purple-550/20 rounded-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-purple-500/5 animate-pulse" />
                      <div className="relative text-center py-2">
                        <Cpu className="w-9 h-9 text-purple-300 mx-auto mb-3 animate-spin" style={{ animationDuration: '6s' }} />
                        <h4 className="text-xs sm:text-sm font-black text-white">اتصال بلادرنگ چت تیمی</h4>
                        <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                          با استفاده از هسته یکپارچه LocalStorage و MySQL، با ثبت هر پیام اعلان فوری صوتی و دیداری برای سازنده و ارجاع‌شونده صادر می‌گردد.
                        </p>
                      </div>
                    </div>

                    <div className="text-center py-2 bg-slate-950/65 rounded-xl border border-slate-850/30">
                      <span className="text-[9px] text-slate-400 block mb-2 font-bold select-none">اپراتورهای با دسترسی آنلاین شیفت امروز:</span>
                      <div className="flex justify-center -space-x-2 space-x-reverse">
                        {mockUsers.map(user => (
                          <motion.span 
                            key={user.id} 
                            whileHover={{ y: -3, scale: 1.1, zIndex: 10 }}
                            className={`w-8 h-8 rounded-full ${user.avatarColor} text-white font-black text-[10px] flex items-center justify-center border-2 border-slate-950 shadow-md cursor-help`}
                            title={user.name}
                          >
                            {user.initials}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            /* STEP 2: PROFILE SELECT & ENTER PIN CODE */
            <motion.div 
              key="login-select"
              initial={{ opacity: 0, y: 15, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -15, rotateX: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-4xl"
              style={{ direction: 'rtl', perspective: '1200px' }}
            >
              <div 
                style={{
                  transform: `rotateY(${mousePos.x * 12}deg) rotateX(${mousePos.y * -12}deg)`,
                  transition: 'transform 0.15s ease-out'
                }}
                className="bg-slate-900/60 border border-slate-800/80 rounded-[35px] p-6 sm:p-8 shadow-2xl backdrop-blur-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
              >
                
                {/* Right side: Select Operator list (cols 7) */}
                <div className="lg:col-span-7 space-y-5 text-right flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                      <Users className="w-6 h-6 text-purple-400" />
                      <span>انتخاب کارشناس فعال شیفت</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      همکاری که مایلید وارد پنل ۳ بعدی اختصاصی او شوید را انتخاب کنید. تسک‌ها منحصراً متعلق به شخص انتخاب شده خواهد بود.
                    </p>
                  </div>

                  {/* Grid of users */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4">
                    {mockUsers.map((user) => {
                      const isSelected = selectedUser?.id === user.id;
                      return (
                        <motion.button
                          key={user.id}
                          type="button"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => selectUser(user)}
                          className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-center gap-3.5 relative overflow-hidden group/user ${
                            isSelected
                              ? 'bg-purple-600/20 border-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.25)] ring-1 ring-purple-500'
                              : 'bg-slate-950/45 border-slate-800/80 hover:border-slate-700/85 hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-purple-500 to-pink-500" />
                          )}
                          <span className={`w-11 h-11 rounded-full ${user.avatarColor} text-white text-xs font-black flex items-center justify-center shrink-0 border border-white/10 shadow-md`}>
                            {user.initials}
                          </span>
                          <div className="overflow-hidden">
                            <h4 className={`text-xs sm:text-sm font-black truncate group-hover/user:text-white ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                              {user.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-1 font-medium truncate">{user.role}</p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Bottom Back To Info action */}
                  <button 
                    type="button" 
                    onClick={() => setStep('intro')}
                    className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer flex items-center gap-2 mt-auto font-bold"
                  >
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                    <span>بازگشت به گام اول معرفی سیستم</span>
                  </button>
                </div>

                {/* Left side: Secured Pin / Credentials entry form (cols 5) */}
                <div className="lg:col-span-5 bg-slate-950/75 border border-slate-850/60 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-inner" style={{ minHeight: '340px' }}>
                  <form onSubmit={handleLoginSubmit} className="space-y-4 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-350 mb-4 bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-xl w-fit">
                        <Lock className="w-3.5 h-3.5 text-pink-400" />
                        <span>احراز هویت کارشناس</span>
                      </div>

                      {selectedUser ? (
                        <div className="mb-4 p-3.5 bg-purple-600/10 border border-purple-500/30 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-150">
                          <span className={`w-9 h-9 rounded-full ${selectedUser.avatarColor} text-white text-xs font-black flex items-center justify-center shadow-md`}>
                            {selectedUser.initials}
                          </span>
                          <div className="text-right">
                            <span className="text-[9px] text-purple-400 block uppercase font-mono">SELECTED_IDENTITY</span>
                            <span className="text-xs font-black text-white">{selectedUser.name}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 border-2 border-dashed border-slate-800 rounded-2xl mb-4">
                          <UserCheck className="w-8 h-8 text-slate-600 mx-auto mb-1.5" />
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
                          className="w-full bg-slate-900/90 border border-slate-800 focus:border-purple-550 rounded-xl px-4 py-3 text-center font-mono tracking-widest text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all disabled:opacity-40"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          disabled={!selectedUser}
                          className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer disabled:opacity-30"
                        >
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Error or Hint block */}
                      {errorText ? (
                        <div className="mt-3 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] rounded-xl flex items-center gap-2 font-medium leading-relaxed">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>{errorText}</span>
                        </div>
                      ) : (
                        <div className="mt-3 p-3 bg-slate-900/60 border border-slate-850 text-slate-400 text-[10px] rounded-xl flex flex-col gap-1.5 text-right leading-relaxed">
                          <div className="flex items-center gap-1.5 font-bold">
                            <KeyRound className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>رمز عبور پیش‌فرض:</span>
                          </div>
                          <span>سارا رضایی: <strong className="text-white font-mono">1234</strong> | ارائه‌دهندگان دیگر: <strong className="text-white font-mono">1111</strong></span>
                          <span className="text-[9px] text-purple-400">مدیریت شیفت می‌تواند در پروسه کاری کارشناسان جدید اضافه کرده یا رمزها را ویرایش مجدد کند.</span>
                        </div>
                      )}
                    </div>

                    {/* Submit Login Action */}
                    <button
                      type="submit"
                      disabled={!selectedUser || isLoggingIn}
                      className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] text-white font-bold py-4 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg mt-4"
                    >
                      {isLoggingIn ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          <span>در حال اعتبارسنجی پرسنل...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4.5 h-4.5" />
                          <span>ورود به تسک‌بورد کارشناسی و بارگذاری شیفت</span>
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

      {/* Footer styled beautifully with terms updated & Fathabadi Credit */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 z-10" style={{ direction: 'rtl' }}>
        <p className="font-medium text-slate-400">
          © ۱۴۰۵ تسک‌بورد مدیریت کارهای کالسنتر • مجهز به حریم کارمندان و تفکیک داده‌های شیفت کاری
        </p>
        <p className="font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
          طراحی و توسعه توسط فتح آبادی
        </p>
      </footer>

    </div>
  );
}
