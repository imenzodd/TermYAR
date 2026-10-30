import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  GraduationCap,
  FileCheck,
  ClipboardList,
  Calendar,
  Timer,
  BarChart2,
  FileText,
  ShoppingBag,
  User,
  Heart,
  Settings,
  ChevronDown,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openNeedsCount?: number;
  marketItemsCount?: number;
  pendingTasksCount?: number;
  user: UserProfile;
  lang?: 'en' | 'fa';
  onOpenProfileModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  lang = 'en',
  onOpenProfileModal,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const isFa = lang === 'fa';

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between h-screen sticky top-0 overflow-y-auto select-none">
      <div className="p-5">
        {/* Logo & Brand Header */}
        <div className="flex items-center gap-3 px-2 mb-6 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            {/* Geometric folded icon matching screenshot */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              TermYar
            </span>
            <span className="text-[10px] font-medium text-slate-400 -mt-1 tracking-wider uppercase">
              {isFa ? 'دستیار تحصیلی و خوابگاهی' : 'Student Cockpit'}
            </span>
          </div>
        </div>

        {/* Dashboard Single Active Item */}
        <div className="mb-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'dashboard'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`} />
            <span>{isFa ? 'داشبورد' : 'Dashboard'}</span>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-4">
          {/* Section: Study Plan */}
          <div>
            <button
              onClick={() => toggleSection('studyPlan')}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors"
            >
              <span>{isFa ? 'برنامه تحصیلی' : 'Study Plan'}</span>
              {collapsedSections['studyPlan'] ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            {!collapsedSections['studyPlan'] && (
              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'schedule'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900'
                  }`}
                >
                  <CalendarDays className="w-4 h-4 text-slate-400" />
                  <span>{isFa ? 'برنامه هفتگی' : 'Weekly Schedule'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'courses'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <span>{isFa ? 'دروس من' : 'My Courses'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Section: Tasks & Assessments */}
          <div>
            <button
              onClick={() => toggleSection('tasks')}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors"
            >
              <span>{isFa ? 'تکالیف و ارزیابی‌ها' : 'Tasks & Assessments'}</span>
              {collapsedSections['tasks'] ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            {!collapsedSections['tasks'] && (
              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'tasks'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900'
                  }`}
                >
                  <FileCheck className="w-4 h-4 text-slate-400" />
                  <span>{isFa ? 'تکالیف و تمرین‌ها' : 'Assignments'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('exams')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'exams'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900'
                  }`}
                >
                  <ClipboardList className="w-4 h-4 text-slate-400" />
                  <span>{isFa ? 'امتحانات' : 'Exams'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'calendar'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{isFa ? 'تقویم ترم' : 'Calendar'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Section: Study & Progress */}
          <div>
            <button
              onClick={() => toggleSection('progress')}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors"
            >
              <span>{isFa ? 'مطالعه و پیشرفت' : 'Study & Progress'}</span>
              {collapsedSections['progress'] ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            {!collapsedSections['progress'] && (
              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => setActiveTab('timer')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'timer'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900'
                  }`}
                >
                  <Timer className="w-4 h-4 text-slate-400" />
                  <span>{isFa ? 'تایمر مطالعه (پومودورو)' : 'Study Timer'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('statistics')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'statistics'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900'
                  }`}
                >
                  <BarChart2 className="w-4 h-4 text-slate-400" />
                  <span>{isFa ? 'آمار مطالعه' : 'Statistics'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'reports'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>{isFa ? 'گزارش‌های تحصیلی' : 'Reports'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Section: Academic Resources */}
          <div>
            <button
              onClick={() => toggleSection('resources')}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors"
            >
              <span>{isFa ? 'منابع و خدمات دانشجویی' : 'Academic Resources'}</span>
              {collapsedSections['resources'] ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            {!collapsedSections['resources'] && (
              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'marketplace'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-slate-400" />
                    <span>{isFa ? 'بازارچه اجاره و خرید خوابگاه' : 'Marketplace'}</span>
                  </div>
                  <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded font-medium">
                    {isFa ? 'خوابگاه' : 'Dorm'}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Section: Account */}
          <div>
            <button
              onClick={() => toggleSection('account')}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors"
            >
              <span>{isFa ? 'حساب کاربری' : 'Account'}</span>
              {collapsedSections['account'] ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            {!collapsedSections['account'] && (
              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => onOpenProfileModal ? onOpenProfileModal() : setActiveTab('profile')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{isFa ? 'مشخصات دانشجو' : 'Profile'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'favorites'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${activeTab === 'favorites' ? 'text-rose-500 fill-current' : 'text-slate-400'}`} />
                  <span>{isFa ? 'نشان‌شده‌ها' : 'Favorites'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900'
                  }`}
                >
                  <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{isFa ? 'تنظیمات' : 'Settings'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Semester Card from Screenshot */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center gap-3 border border-slate-200/60 dark:border-slate-700/60">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {isFa ? 'نیم‌سال بهار ۱۴۰۴' : 'Spring 2025'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {isFa ? 'ترم تحصیلی جاری' : 'Current Semester'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
