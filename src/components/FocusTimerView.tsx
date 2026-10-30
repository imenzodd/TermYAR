import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, CheckCircle, Flame, Coffee, Sparkles } from 'lucide-react';
import { Course, StudyLog } from '../types';
import { toPersianDigits, getTodayJalaliString } from '../utils/persian';

interface FocusTimerViewProps {
  courses: Course[];
  studyLogs: StudyLog[];
  onAddStudyLog: (log: StudyLog) => void;
}

export const FocusTimerView: React.FC<FocusTimerViewProps> = ({
  courses,
  studyLogs,
  onAddStudyLog,
}) => {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.name || 'مطالعه آزاد');
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCompletedNotice, setSessionCompletedNotice] = useState(false);

  const totalStudyMinutes = studyLogs.reduce((acc, log) => acc + log.durationMinutes, 0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Completed timer!
      setIsRunning(false);
      if (mode === 'focus') {
        const newLog: StudyLog = {
          id: `log_${Date.now()}`,
          durationMinutes: 25,
          courseName: selectedCourse,
          timestamp: Date.now(),
          date: getTodayJalaliString(),
        };
        onAddStudyLog(newLog);
        setSessionCompletedNotice(true);
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, selectedCourse, onAddStudyLog]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = (newMode: 'focus' | 'break' = mode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progress = mode === 'focus' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
          <Flame className="w-4 h-4 text-[#FF4B26]" />
          <span>تکنیک پومودورو (مطالعه عمیق تحصیلی)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white">
          اتاق تمرکز و مطالعه دانشجویی
        </h1>
        <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
          ۲۵ دقیقه تمرکز کامل روی تمرینات، سپس ۵ دقیقه استراحت کوتاه.
        </p>
      </div>

      {sessionCompletedNotice && (
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle className="w-5 h-5 text-[#FF4B26]" />
            <span>آفرین! ۲۵ دقیقه مطالعه با موفقیت ثبت شد. وقت ۵ دقیقه استراحت است.</span>
          </div>
          <button
            onClick={() => setSessionCompletedNotice(false)}
            className="text-xs text-slate-500 hover:text-black dark:hover:text-white font-bold"
          >
            بستن
          </button>
        </div>
      )}

      {/* Timer Circular Card */}
      <div className="p-8 sm:p-12 rounded-xl bg-white dark:bg-[#12151D] border border-slate-200/90 dark:border-slate-800 shadow-xs text-center space-y-8">
        
        {/* Mode Selector */}
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => resetTimer('focus')}
            className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
              mode === 'focus'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            جلسه مطالعه (۲۵ دقیقه)
          </button>
          <button
            onClick={() => resetTimer('break')}
            className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'break'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>استراحت کوتاه (۵ دقیقه)</span>
          </button>
        </div>

        {/* Big Display Clock */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="110"
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="110"
              className={mode === 'focus' ? 'text-[#FF4B26]' : 'text-slate-800 dark:text-slate-300'}
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 110}
              strokeDashoffset={2 * Math.PI * 110 * (1 - progress / 100)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-slate-950 dark:text-white tracking-wider tabular-nums">
              {toPersianDigits(timeFormatted)}
            </span>
            <span className="text-xs text-slate-400 font-semibold mt-2">
              {mode === 'focus' ? `درس: ${selectedCourse}` : 'زمان استراحت ذهن ☕'}
            </span>
          </div>
        </div>

        {/* Course Select Dropdown */}
        {mode === 'focus' && (
          <div className="max-w-xs mx-auto">
            <label className="block text-xs font-bold text-slate-500 mb-1">
              انتخاب درس جهت ثبت در گزارش:
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
              <option value="مطالعه آزاد">مطالعه آزاد / زبان خارجه</option>
            </select>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={toggleTimer}
            className={`px-8 py-2.5 rounded-lg text-sm font-bold text-white shadow-xs flex items-center gap-2 transition-all cursor-pointer ${
              isRunning
                ? 'bg-black hover:bg-slate-800'
                : 'bg-[#FF4B26] hover:bg-[#E83C18]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>توقف موقت</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>شروع مطالعه</span>
              </>
            )}
          </button>

          <button
            onClick={() => resetTimer()}
            className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            title="ریست تایمر"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Study Session History */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Timer className="w-4 h-4 text-indigo-600" />
            <span>گزارش جلسات مطالعه اخیر</span>
          </h2>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            مجموعاً: {toPersianDigits(totalStudyMinutes)} دقیقه
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {studyLogs.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              هنوز جلسه‌ای به پایان نرسیده است. با تکمیل اولین تایمر، زمان مطالعه شما اینجا ثبت می‌شود.
            </p>
          ) : (
            studyLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {log.courseName}
                  </span>
                  <span className="text-[11px] text-slate-400 tabular-nums">
                    تاریخ: {toPersianDigits(log.date)}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold tabular-nums">
                  +{toPersianDigits(log.durationMinutes)} دقیقه تمرکز
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
