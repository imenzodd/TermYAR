import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  BookOpen,
  Plus,
  Flame,
  Award,
  BarChart2,
  FileCheck,
  ShoppingBag,
  Timer,
  Zap,
  GraduationCap,
  MapPin,
  Check,
  Code2,
  Calculator,
  Atom,
  Feather,
  LineChart,
} from 'lucide-react';
import { Course, MarketItem, NeedRequest, SemesterHealthScoreData, Task, UserProfile } from '../types';
import { SemesterHealthScoreCard } from './SemesterHealthScoreCard';

interface DashboardViewProps {
  user: UserProfile;
  tasks: Task[];
  courses: Course[];
  marketItems: MarketItem[];
  needRequests: NeedRequest[];
  lang?: 'en' | 'fa';
  healthData?: SemesterHealthScoreData;
  onOpenHealthModal?: () => void;
  onToggleTask: (taskId: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenNewTaskModal: () => void;
  onOpenNewMarketModal: () => void;
  onOpenProfileModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  tasks,
  courses,
  marketItems,
  needRequests,
  lang = 'en',
  healthData,
  onOpenHealthModal,
  onToggleTask,
  onNavigateTab,
  onOpenNewTaskModal,
  onOpenNewMarketModal,
  onOpenProfileModal,
}) => {
  const isFa = lang === 'fa';
  const displayName = user.name ? user.name.split(' ')[0] : 'Alex';

  // Interactive Pomodoro Timer state inside hero card
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(1);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      setSessionsCompleted((prev) => (prev < 4 ? prev + 1 : 1));
      setTimerSeconds(25 * 60);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds]);

  const toggleTimer = () => setTimerRunning(!timerRunning);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(25 * 60);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Priority badge styling
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60">
            {isFa ? 'فوری' : 'High'}
          </span>
        );
      case 'medium':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200/60">
            {isFa ? 'متوسط' : 'Medium'}
          </span>
        );
      case 'low':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            {isFa ? 'پایین' : 'Low'}
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {isFa ? 'معمولی' : 'Normal'}
          </span>
        );
    }
  };

  // Course Icon renderer
  const renderCourseIcon = (iconName?: string) => {
    switch (iconName) {
      case 'code':
        return <Code2 className="w-5 h-5 text-indigo-600" />;
      case 'bar-chart':
        return <LineChart className="w-5 h-5 text-purple-600" />;
      case 'calculator':
        return <Calculator className="w-5 h-5 text-emerald-600" />;
      case 'atom':
        return <Atom className="w-5 h-5 text-amber-600" />;
      case 'feather':
        return <Feather className="w-5 h-5 text-slate-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-indigo-600" />;
    }
  };

  // Streak heatmap dots (5 rows of 7 days)
  const streakDays = [
    // week 1
    true, true, true, true, false, false, true,
    // week 2
    true, true, true, true, true, true, true,
    // week 3
    true, true, true, true, true, true, true,
    // week 4
    true, true, true, true, true, false, false,
    // current week
    true, true, true, false, false, false, false,
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Greeting & Semester Stats Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{isFa ? `صبح بخیر، ${displayName}` : `Good morning, ${displayName}`}</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {isFa ? 'ترم تحصیلی شما در یک نگاه' : 'Your semester at a glance'}
          </p>
        </div>

        {/* Top Stat Pills Row matching screenshot */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{isFa ? 'هفته ۷ از ۱۵' : 'Week 7 of 15'}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 shadow-2xs">
            <FileCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>{isFa ? '۳ تحویل امروز' : '3 due today'}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{isFa ? '۲ امتحان نزدیک' : '2 exams soon'}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 shadow-2xs">
            <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{isFa ? 'معدل ۱۸.۶۰' : 'GPA 3.72'}</span>
          </div>
        </div>
      </div>

      {/* 2. Row 1: The Three Main Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card 1: Today's Focus (Dark Pomodoro Hero) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0F172A] via-[#111936] to-[#0A0E24] text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Card Header */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span>{isFa ? 'تمرکز فعال امروز' : "Today's focus"}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-medium text-indigo-200 border border-white/10">
              <span>🍅</span>
              <span>Pomodoro</span>
            </div>
          </div>

          {/* Focus Subject */}
          <div className="mb-4 relative z-10">
            <h3 className="text-base font-semibold text-slate-100">
              {isFa ? 'حل سری تمرین ۵ - ساختمان داده' : 'Finish problem set 5 - CS201'}
            </h3>
          </div>

          {/* Big Digital Timer Display */}
          <div className="flex items-center justify-between my-2 relative z-10">
            <div>
              <div className="text-5xl font-black tracking-tight tabular-nums font-mono text-white">
                {formatTimer(timerSeconds)}
              </div>
              <div className="text-xs text-indigo-300/80 mt-1">
                {isFa ? 'جلسه تمرکز فعال' : 'Focus session'}
              </div>
            </div>

            {/* Circular Glowing Play/Pause Button */}
            <button
              onClick={toggleTimer}
              className="w-14 h-14 rounded-full bg-indigo-600/30 hover:bg-indigo-600/45 text-indigo-300 border border-indigo-400/30 flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              {timerRunning ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5" />
              )}
            </button>
          </div>

          {/* Progress bar & sessions */}
          <div className="space-y-1.5 my-3 relative z-10">
            <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(sessionsCompleted / 4) * 100}%` }}
              />
            </div>
            <div className="flex justify-end text-[11px] text-slate-400 font-medium">
              <span>
                {sessionsCompleted} / 4 {isFa ? 'جلسه' : 'sessions'}
              </span>
            </div>
          </div>

          {/* Action Button & Options */}
          <div className="flex items-center gap-2 pt-2 relative z-10">
            <button
              onClick={toggleTimer}
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-sm text-center"
            >
              {timerRunning
                ? isFa ? 'توقف موقت' : 'Pause session'
                : isFa ? 'شروع جلسه تمرکز' : 'Start session'}
            </button>
            <button
              onClick={resetTimer}
              title="Reset timer"
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Today's Priorities */}
        <div className="lg:col-span-4 dash-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isFa ? 'اولویت‌های امروز' : "Today's priorities"}
                </h3>
              </div>
              <button
                onClick={onOpenNewTaskModal}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                + {isFa ? 'افزودن' : 'Add'}
              </button>
            </div>

            {/* Task list with checkable radios */}
            <div className="space-y-3 pt-1">
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.done
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 group-hover:border-indigo-500'
                      }`}
                    >
                      {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`text-xs font-semibold truncate ${
                          task.done
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {task.courseCode || task.courseName || 'General'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {task.time || 'All day'}
                    </span>
                    {getPriorityBadge(task.priority)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => onNavigateTab('tasks')}
              className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
            >
              {isFa ? 'مشاهده همه تکالیف ←' : 'View all tasks →'}
            </button>
          </div>
        </div>

        {/* Card 3: Upcoming Deadlines */}
        <div className="lg:col-span-3 dash-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
              <Calendar className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isFa ? 'مهلت‌های نزدیک' : 'Upcoming deadlines'}
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              {/* Item 1 */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {isFa ? 'کوییز ۱' : 'Quiz 1'}
                    </div>
                    <div className="text-[11px] text-slate-400">MATH101 • Oct 15</div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 shrink-0">
                  {isFa ? 'تا ۲ روز' : 'In 2 days'}
                </span>
              </div>

              {/* Item 2 */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {isFa ? 'گزارش آزمایشگاه' : 'Lab report'}
                    </div>
                    <div className="text-[11px] text-slate-400">CHEM201 • Oct 18</div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 shrink-0">
                  {isFa ? 'تا ۵ روز' : 'In 5 days'}
                </span>
              </div>

              {/* Item 3 */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {isFa ? 'امتحان میان‌ترم' : 'Midterm exam'}
                    </div>
                    <div className="text-[11px] text-slate-400">CS201 • Oct 26</div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                  {isFa ? 'تا ۱۳ روز' : 'In 13 days'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => onNavigateTab('exams')}
              className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
            >
              {isFa ? 'تقویم کامل امتحانات ←' : 'Full exam calendar →'}
            </button>
          </div>
        </div>
      </div>

      {/* 2.5 Intelligent Semester Health Score Banner Widget */}
      {healthData && (
        <SemesterHealthScoreCard
          healthData={healthData}
          lang={lang}
          onOpenAnalysisModal={onOpenHealthModal || (() => {})}
          onNavigateTab={onNavigateTab}
        />
      )}

      {/* 3. Row 2: 4 Activity & Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Weekly study activity */}
        <div className="dash-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{isFa ? 'فعالیت مطالعه هفتگی' : 'Weekly study activity'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#1E293B]" />
                <span>{isFa ? 'زمان مطالعه' : 'Study time'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-100 dark:bg-slate-700" />
                <span>{isFa ? 'باقیمانده' : 'Remaining'}</span>
              </div>
            </div>

            {/* Total Study Time Metric */}
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              14h 20m
            </div>
            <div className="text-[11px] text-slate-400 mb-4">
              {isFa ? 'مجموع زمان مطالعه این هفته' : 'Total study time'}
            </div>

            {/* 7 Day Vertical Bar Chart */}
            <div className="flex items-end justify-between gap-1.5 h-20 pt-2">
              {[
                { day: 'Mon', h: '70%' },
                { day: 'Tue', h: '45%' },
                { day: 'Wed', h: '60%' },
                { day: 'Thu', h: '50%' },
                { day: 'Fri', h: '55%' },
                { day: 'Sat', h: '85%' },
                { day: 'Sun', h: '75%' },
              ].map((b, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm h-full flex flex-col justify-end overflow-hidden">
                    <div
                      className="w-full bg-[#1E293B] dark:bg-indigo-600 rounded-t-sm transition-all duration-700"
                      style={{ height: b.h }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{b.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Study Streak */}
        <div className="dash-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>{isFa ? 'زنجیره مطالعه' : 'Study streak'}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isFa ? '۱۴ روز' : '14 days'}
            </div>
            <div className="text-[11px] text-slate-400 mb-4">
              {isFa ? 'زنجیره روزهای متوالی مطالعه' : 'Current streak'}
            </div>

            {/* Heatmap Matrix (5 x 7) */}
            <div className="grid grid-cols-7 gap-1.5 my-2">
              {streakDays.map((active, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-xs ${
                    active
                      ? 'bg-[#1E293B] dark:bg-indigo-500'
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 mt-2 px-0.5">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Card 3: Semester Progress */}
        <div className="dash-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>{isFa ? 'پیشرفت ترم' : 'Semester progress'}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* Circular Gauge Ring */}
            <div className="flex flex-col items-center justify-center my-3">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    strokeWidth="10"
                    className="stroke-slate-100 dark:stroke-slate-800"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 38}
                    strokeDashoffset={(2 * Math.PI * 38) * (1 - 0.47)}
                    strokeLinecap="round"
                    className="stroke-[#1E293B] dark:stroke-indigo-500 transition-all duration-1000"
                    fill="none"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    47%
                  </span>
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2">
                {isFa ? '۷ هفته باقیمانده' : '7 weeks left'}
              </div>
              <div className="text-[11px] text-slate-400">
                {isFa ? 'از مجموع ۱۵ هفته آموزشی' : 'of 15 weeks'}
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Quick Actions */}
        <div className="dash-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{isFa ? 'عملیات سریع' : 'Quick actions'}</span>
            </div>

            {/* 6 Grid Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigateTab('courses')}
                className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors flex flex-col items-start gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  {isFa ? 'افزودن درس' : 'Add course'}
                </span>
              </button>

              <button
                onClick={onOpenNewTaskModal}
                className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors flex flex-col items-start gap-1.5"
              >
                <FileCheck className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  {isFa ? 'افزودن تکلیف' : 'Add assignment'}
                </span>
              </button>

              <button
                onClick={() => onNavigateTab('exams')}
                className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors flex flex-col items-start gap-1.5"
              >
                <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  {isFa ? 'افزودن امتحان' : 'Add exam'}
                </span>
              </button>

              <button
                onClick={() => onNavigateTab('timer')}
                className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors flex flex-col items-start gap-1.5"
              >
                <Timer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  {isFa ? 'شروع تایمر' : 'Start timer'}
                </span>
              </button>

              <button
                onClick={() => onNavigateTab('resources')}
                className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors flex flex-col items-start gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  {isFa ? 'منابع درسی و جزوات' : 'Academic vault'}
                </span>
              </button>

              <button
                onClick={() => onNavigateTab('marketplace')}
                className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors flex flex-col items-start gap-1.5"
              >
                <ShoppingBag className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  {isFa ? 'بازارچه خوابگاه' : 'Marketplace'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Row 3: 3 Columns (Courses, Schedule, Exams) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Column 1: My Courses (5 cols) */}
        <div className="lg:col-span-5 dash-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isFa ? 'دروس من' : 'My courses'}
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('courses')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1"
              >
                <span>{isFa ? 'مشاهده همه' : 'View all'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Courses list */}
            <div className="space-y-3.5 pt-1">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      {renderCourseIcon(course.iconName)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {course.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {course.code} • {course.credits || course.units} {isFa ? 'واحد' : 'credits'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Progress bar */}
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-1.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${course.progress}%`,
                            backgroundColor: course.color || '#4F46E5',
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 w-7 text-right">
                        {course.progress}%
                      </span>
                    </div>

                    <button
                      onClick={() => onNavigateTab('courses')}
                      className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 flex items-center gap-1 hover:bg-slate-100"
                    >
                      <span>{isFa ? 'مشاهده' : 'View'}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: This Week Schedule (4 cols) */}
        <div className="lg:col-span-4 dash-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isFa ? 'برنامه این هفته' : 'This week'}
                </h3>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 cursor-pointer" onClick={() => onNavigateTab('schedule')} />
            </div>

            {/* Timetable Items */}
            <div className="space-y-3 pt-1">
              {[
                { day: 'Mon', time: '10:00 - 11:30', name: 'Data Structures', room: 'CS201 • Room 302', status: 'Done', color: 'bg-amber-500' },
                { day: 'Tue', time: '08:00 - 09:30', name: 'Statistics', room: 'STAT101 • Room 105', status: 'Done', color: 'bg-emerald-500' },
                { day: 'Wed', time: '10:00 - 12:00', name: 'Calculus II', room: 'MATH102 • Room 210', status: 'Upcoming', color: 'bg-indigo-500' },
                { day: 'Thu', time: '14:00 - 16:00', name: 'Physics II', room: 'PHYS101 • Lab 3', status: 'Upcoming', color: 'bg-purple-500' },
                { day: 'Fri', time: '10:00 - 11:30', name: 'Academic Writing', room: 'ENG100 • Room 104', status: 'Upcoming', color: 'bg-sky-500' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full ${item.color} mt-1.5 shrink-0`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <span className="text-slate-500">{item.day}</span>
                        <span>{item.time}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {item.room}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      item.status === 'Done'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                        : 'bg-sky-50 text-sky-600 border border-sky-200/60'
                    }`}
                  >
                    {item.status === 'Done' ? (isFa ? 'انجام شد' : 'Done') : (isFa ? 'آینده' : 'Upcoming')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Upcoming Exams & Mountain Quote (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Upcoming exams card */}
          <div className="dash-card p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isFa ? 'امتحانات پیش‌رو' : 'Upcoming exams'}
                  </h3>
                </div>
                <button
                  onClick={() => onNavigateTab('exams')}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  {isFa ? 'همه' : 'View all'}
                </button>
              </div>

              <div className="space-y-3 pt-1">
                {[
                  { month: 'Oct', day: '18', title: 'Lab report', code: 'CHEM201', due: 'In 5 days', color: 'bg-amber-50 text-amber-600' },
                  { month: 'Oct', day: '26', title: 'Midterm exam', code: 'CS201', due: 'In 13 days', color: 'bg-amber-50 text-amber-600' },
                  { month: 'Nov', day: '02', title: 'Final exam', code: 'MATH102', due: 'In 20 days', color: 'bg-indigo-50 text-indigo-600' },
                  { month: 'Nov', day: '10', title: 'Final exam', code: 'PHYS101', due: 'In 28 days', color: 'bg-indigo-50 text-indigo-600' },
                ].map((ex, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-[9px] uppercase font-bold text-slate-400 leading-none">
                          {ex.month}
                        </span>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 leading-none mt-0.5">
                          {ex.day}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {ex.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {ex.code}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${ex.color}`}>
                      {ex.due}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Inspirational Mountain Card matching bottom right of screenshot */}
          <div className="dash-card p-4 bg-gradient-to-br from-indigo-50/60 to-slate-50 dark:from-slate-900 dark:to-indigo-950/40 border border-indigo-100/60 dark:border-indigo-900/40 relative overflow-hidden">
            <div className="flex items-start gap-2.5 relative z-10">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                {isFa
                  ? 'قدم‌های کوچک روزانه، نتایج بزرگ فردا را می‌سازند.'
                  : 'Small steps every day lead to big results tomorrow.'}
              </p>
            </div>

            {/* Subtle stylized mountain SVG silhouette */}
            <div className="absolute right-0 bottom-0 opacity-15 dark:opacity-10 pointer-events-none">
              <svg width="120" height="40" viewBox="0 0 120 40" fill="currentColor" className="text-indigo-900 dark:text-indigo-300">
                <polygon points="0,40 30,10 60,40 85,15 120,40" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
