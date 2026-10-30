import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Moon,
  Sun,
  Timer,
  GraduationCap,
  Bell,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Check,
  Building,
  User,
  Shield,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  lang: 'en' | 'fa';
  setLang: (l: 'en' | 'fa') => void;
  onResetToSampleData: () => void;
  onClearAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onSaveProfile,
  darkMode,
  toggleDarkMode,
  lang,
  setLang,
  onResetToSampleData,
  onClearAllData,
}) => {
  const isFa = lang === 'fa';
  const [profileForm, setProfileForm] = useState<UserProfile>(user);
  const [pomodoroLength, setPomodoroLength] = useState<number>(25);
  const [shortBreakLength, setShortBreakLength] = useState<number>(5);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [semesterWeeks, setSemesterWeeks] = useState<number>(15);
  const [currentWeek, setCurrentWeek] = useState<number>(7);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profileForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const data = {
      profile: user,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `termyar_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isFa ? 'تنظیمات و پیکربندی' : 'Settings & Preferences'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isFa
              ? 'شخصی‌سازی ظاهر، زمان‌بندی تایمر مطالعه، ترم تحصیلی و مدیریت داده‌ها'
              : 'Customize appearance, study timer intervals, semester duration, and manage data'}
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-semibold animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{isFa ? 'تنظیمات ذخیره شد!' : 'Settings saved!'}</span>
          </div>
        )}
      </div>

      {/* 1. Appearance & Localization Section */}
      <div className="dash-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-600" />
          <span>{isFa ? 'زبان و ظاهر سامانه' : 'Language & Appearance'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Language Switch */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isFa ? 'زبان برنامه (Language)' : 'Interface Language'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {isFa ? 'انگلیسی یا فارسی با چیدمان راست‌چین' : 'Switch between English and Persian'}
              </div>
            </div>

            <div className="flex items-center gap-1 bg-white dark:bg-slate-700 p-1 rounded-lg border border-slate-200 dark:border-slate-600">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  lang === 'en'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('fa')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  lang === 'fa'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                فا
              </button>
            </div>
          </div>

          {/* Dark / Light Mode Switch */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isFa ? 'حالت تیره / روشن' : 'Theme Mode'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {darkMode ? (isFa ? 'تم تیره فعال است' : 'Dark theme active') : (isFa ? 'تم روشن فعال است' : 'Light theme active')}
              </div>
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:scale-105 transition-all shadow-2xs"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Study & Pomodoro Timer Configuration */}
      <div className="dash-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Timer className="w-4 h-4 text-indigo-600" />
          <span>{isFa ? 'تنظیمات جلسات مطالعه (پومودورو)' : 'Study Timer & Focus Settings'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Focus Duration */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
              {isFa ? 'مدت زمان تمرکز (دقیقه)' : 'Focus Session (mins)'}
            </label>
            <select
              value={pomodoroLength}
              onChange={(e) => setPomodoroLength(Number(e.target.value))}
              className="w-full mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
            >
              <option value={20}>20 minutes</option>
              <option value={25}>25 minutes (Standard)</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes (Deep work)</option>
              <option value={50}>50 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>

          {/* Short Break */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
              {isFa ? 'استراحت کوتاه (دقیقه)' : 'Short Break (mins)'}
            </label>
            <select
              value={shortBreakLength}
              onChange={(e) => setShortBreakLength(Number(e.target.value))}
              className="w-full mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
            >
              <option value={3}>3 minutes</option>
              <option value={5}>5 minutes (Standard)</option>
              <option value={10}>10 minutes</option>
            </select>
          </div>

          {/* Sound Alert Toggle */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {isFa ? 'صدای زنگ پایان جلسه' : 'Sound Notification'}
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="mt-2 w-full py-1.5 px-3 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-2xs"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>{isFa ? 'صدا فعال' : 'Sound Enabled'}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span>{isFa ? 'بی‌صدا' : 'Muted'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Semester Academic Settings */}
      <div className="dash-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          <span>{isFa ? 'تنظیمات ترم تحصیلی' : 'Academic Semester Settings'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
              {isFa ? 'تعداد کل هفته‌های آموزشی ترم' : 'Total Semester Weeks'}
            </label>
            <input
              type="number"
              min={10}
              max={20}
              value={semesterWeeks}
              onChange={(e) => setSemesterWeeks(Number(e.target.value))}
              className="w-full mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
              {isFa ? 'هفته جاری ترم' : 'Current Week'}
            </label>
            <input
              type="number"
              min={1}
              max={semesterWeeks}
              value={currentWeek}
              onChange={(e) => setCurrentWeek(Number(e.target.value))}
              className="w-full mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. Student & Dorm Profile Form */}
      <form onSubmit={handleSaveProfile} className="dash-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          <span>{isFa ? 'مشخصات دانشجو و خوابگاه' : 'Student & Dorm Profile'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
              {isFa ? 'نام و نام خانوادگی' : 'Full Name'}
            </label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
              {isFa ? 'دانشگاه' : 'University'}
            </label>
            <input
              type="text"
              value={profileForm.university}
              onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
              {isFa ? 'رشته تحصیلی' : 'Major / Field of Study'}
            </label>
            <input
              type="text"
              value={profileForm.major}
              onChange={(e) => setProfileForm({ ...profileForm, major: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
              {isFa ? 'نام خوابگاه و شماره اتاق' : 'Dormitory & Room #'}
            </label>
            <input
              type="text"
              value={profileForm.dormitory}
              onChange={(e) => setProfileForm({ ...profileForm, dormitory: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            {isFa ? 'ذخیره تغییرات پروفایل' : 'Save Profile Changes'}
          </button>
        </div>
      </form>

      {/* 5. Data Management (Reset / Clear / Export) */}
      <div className="dash-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-600" />
          <span>{isFa ? 'مدیریت داده‌ها و پشتیبان‌گیری' : 'Data Management & Backup'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Export JSON */}
          <button
            onClick={handleExportData}
            className="p-3.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 text-left transition-colors flex items-center gap-3"
          >
            <Download className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isFa ? 'پشتیبان‌گیری داده‌ها' : 'Export JSON Backup'}
              </div>
              <div className="text-[10px] text-slate-400">
                {isFa ? 'دانلود نسخه JSON' : 'Save all notes and records'}
              </div>
            </div>
          </button>

          {/* Reset to Mockup Demo Data */}
          <button
            onClick={onResetToSampleData}
            className="p-3.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 text-left transition-colors flex items-center gap-3"
          >
            <RefreshCw className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isFa ? 'بارگذاری داده‌های نمونه' : 'Load Demo Mockup Data'}
              </div>
              <div className="text-[10px] text-slate-400">
                {isFa ? 'اطلاعات الکس مورگان و دروس' : 'Restore screenshot sample data'}
              </div>
            </div>
          </button>

          {/* Clear All Data */}
          <button
            onClick={onClearAllData}
            className="p-3.5 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/60 rounded-xl border border-rose-200/60 dark:border-rose-900/40 text-left transition-colors flex items-center gap-3"
          >
            <Trash2 className="w-4 h-4 text-rose-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-rose-700 dark:text-rose-400">
                {isFa ? 'پاک‌سازی تمام داده‌ها' : 'Clear All Data (Blank)'}
              </div>
              <div className="text-[10px] text-rose-500/80">
                {isFa ? 'شروع با یک بوم کاملاً خالی' : 'Start with fresh empty canvas'}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
