import React, { useState } from 'react';
import {
  X,
  Activity,
  Award,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Sliders,
  ChevronRight,
  BookOpen,
  Calendar,
  Timer,
  BarChart2,
  RefreshCw,
  HelpCircle,
  Clock,
} from 'lucide-react';
import { SemesterHealthScoreData } from '../types';

interface SemesterHealthScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  healthData: SemesterHealthScoreData;
  lang?: 'en' | 'fa';
  onNavigateTab?: (tab: string) => void;
  onUpdateGoalHours?: (hours: number) => void;
}

export const SemesterHealthScoreModal: React.FC<SemesterHealthScoreModalProps> = ({
  isOpen,
  onClose,
  healthData,
  lang = 'en',
  onNavigateTab,
  onUpdateGoalHours,
}) => {
  if (!isOpen) return null;

  const isFa = lang === 'fa';
  const {
    overallScore,
    status,
    statusLabel,
    statusLabelFa,
    statusDescription,
    statusDescriptionFa,
    indicators,
    recommendations,
    historySnapshots,
    weeklyComparison,
    hasMissingData,
    activeWeightsSum,
    weeklyGoalHours,
  } = healthData;

  const [simulatedGoalHours, setSimulatedGoalHours] = useState(weeklyGoalHours || 15);
  const [activeTab, setActiveTab] = useState<'overview' | 'formula' | 'history'>('overview');

  const getStatusBadge = () => {
    switch (status) {
      case 'excellent':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      case 'good':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800';
      case 'needs_attention':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      case 'at_risk':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isFa ? 'گزارش تحلیلی سلامت ترم' : 'Semester Health Diagnostics'}
                </h2>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge()}`}>
                  {isFa ? statusLabelFa : statusLabel}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isFa ? 'محاسبه شفاف و قطعی ۴ شاخص استاندارد بدون داده‌های ساختگی' : 'Deterministic 4-indicator evaluation engine'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {isFa ? 'نمای کلی و اقدامات' : 'Overview & Actions'}
          </button>
          <button
            onClick={() => setActiveTab('formula')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'formula'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {isFa ? 'فرمول و اوزان ریاضی' : 'Formula & Weights'}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {isFa ? 'روند تغییرات هفتگی' : 'Trajectory & History'}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Score Hero Banner */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 relative overflow-hidden shadow-lg">
                <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black tracking-tight">{overallScore}</span>
                      <span className="text-[10px] text-indigo-200 font-medium">/ 100</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs uppercase tracking-wider text-indigo-200 font-semibold">
                        {isFa ? 'وضعیت آکادمیک' : 'Current Academic Momentum'}
                      </span>
                      <h3 className="text-lg font-bold">{isFa ? statusLabelFa : statusLabel}</h3>
                      <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                        {isFa ? statusDescriptionFa : statusDescription}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center min-w-[140px]">
                    <span className="text-[10px] text-indigo-200 uppercase font-medium">
                      {isFa ? 'مقایسه با هفته قبل' : 'Weekly Delta'}
                    </span>
                    <div className="text-lg font-bold flex items-center justify-center gap-1 mt-0.5">
                      {weeklyComparison.trend === 'up' ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-300">+{weeklyComparison.diff} pts</span>
                        </>
                      ) : weeklyComparison.trend === 'down' ? (
                        <>
                          <TrendingDown className="w-4 h-4 text-rose-400" />
                          <span className="text-rose-300">{weeklyComparison.diff} pts</span>
                        </>
                      ) : (
                        <span className="text-slate-300">±0 pts</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-300 block">
                      {isFa ? `هفته قبل: ${weeklyComparison.previousScore}` : `Prev: ${weeklyComparison.previousScore}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Missing data disclaimer if applicable */}
              {hasMissingData && (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-3 text-xs text-amber-800 dark:text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold">
                      {isFa ? 'اصل عدم جعل داده‌های تحصیلی' : 'Zero Fake Data Principle'}
                    </span>
                    <p className="leading-relaxed">
                      {isFa
                        ? 'در ترم‌یار هیچ داده یا نمره‌ای به شکل ساختگی تولید نمی‌شود. شاخص‌هایی که هنوز در سیستم ورودی ندارند از مخرج کسر خارج شده و اوزان سایر شاخص‌ها به شکل نرمال تا ۱۰۰٪ بازتوزیع گردیده‌اند.'
                        : 'TermYar never manufactures artificial metrics. Indicators without user data are excluded, and weights are dynamically normalized across verified active data points.'}
                    </p>
                  </div>
                </div>
              )}

              {/* 4 Indicator Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Assignment Completion */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>{isFa ? indicators.assignment.nameFa : indicators.assignment.name}</span>
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {indicators.assignment.isAvailable ? `${indicators.assignment.score}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${indicators.assignment.isAvailable ? indicators.assignment.score : 0}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isFa ? indicators.assignment.summaryFa : indicators.assignment.summary}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span>{isFa ? indicators.assignment.metricLabelFa : indicators.assignment.metricLabel}</span>
                    <span>{isFa ? 'وزن رسمی: ۲۵٪' : 'Weight: 25%'}</span>
                  </div>
                </div>

                {/* 2. Exam Readiness */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>{isFa ? indicators.exam.nameFa : indicators.exam.name}</span>
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {indicators.exam.isAvailable ? `${indicators.exam.score}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all"
                      style={{ width: `${indicators.exam.isAvailable ? indicators.exam.score : 0}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isFa ? indicators.exam.summaryFa : indicators.exam.summary}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span>{isFa ? indicators.exam.metricLabelFa : indicators.exam.metricLabel}</span>
                    <span>{isFa ? 'وزن رسمی: ۳۰٪' : 'Weight: 30%'}</span>
                  </div>
                </div>

                {/* 3. Study Goal */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{isFa ? indicators.studyGoal.nameFa : indicators.studyGoal.name}</span>
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {indicators.studyGoal.score}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${indicators.studyGoal.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isFa ? indicators.studyGoal.summaryFa : indicators.studyGoal.summary}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span>{isFa ? indicators.studyGoal.metricLabelFa : indicators.studyGoal.metricLabel}</span>
                    <span>{isFa ? 'وزن رسمی: ۲۰٪' : 'Weight: 20%'}</span>
                  </div>
                </div>

                {/* 4. Course Progress */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-500" />
                      <span>{isFa ? indicators.courseProgress.nameFa : indicators.courseProgress.name}</span>
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {indicators.courseProgress.isAvailable ? `${indicators.courseProgress.score}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full transition-all"
                      style={{ width: `${indicators.courseProgress.isAvailable ? indicators.courseProgress.score : 0}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isFa ? indicators.courseProgress.summaryFa : indicators.courseProgress.summary}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span>{isFa ? indicators.courseProgress.metricLabelFa : indicators.courseProgress.metricLabel}</span>
                    <span>{isFa ? 'وزن رسمی: ۲۵٪' : 'Weight: 25%'}</span>
                  </div>
                </div>
              </div>

              {/* Actionable Recommendations List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isFa ? 'اقدامات پیشنهادی اولویت‌دار برای ارتقای سلامت ترم' : 'Priority Action Plan to Maximize Score'}</span>
                </h4>

                <div className="space-y-2.5">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {isFa ? rec.titleFa : rec.title}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60">
                            +{rec.impactPts} {isFa ? 'نمره' : 'pts'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {isFa ? rec.descriptionFa : rec.description}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          if (rec.actionTab && onNavigateTab) {
                            onNavigateTab(rec.actionTab);
                          }
                        }}
                        className="shrink-0 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white text-xs font-semibold transition-all flex items-center gap-1"
                      >
                        <span>{isFa ? rec.actionLabelFa : rec.actionLabel}</span>
                        <ChevronRight className={`w-3.5 h-3.5 ${isFa ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'formula' && (
            <div className="space-y-5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
                <h4 className="font-bold text-sm text-indigo-950 dark:text-indigo-200">
                  {isFa ? 'معادله ریاضی و فلسفه طراحی شاخص' : 'Mathematical Formulation & Invariants'}
                </h4>
                <p>
                  {isFa
                    ? 'امتیاز سلامت ترم از ترکیب محدب (Convex Combination) چهار بردار اساسی زیست‌بوم تحصیلی دانشجو تشکیل شده است:'
                    : 'The Semester Health Score is computed as a weighted convex combination across four deterministic pillars:'}
                </p>
                <code className="block p-3 rounded-xl bg-white dark:bg-slate-900 font-mono text-[11px] text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                  Overall Score = 0.25*(Assignments) + 0.30*(Exam Readiness) + 0.20*(Study Goal) + 0.25*(Course Progress)
                </code>
              </div>

              {/* Table of indicators */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">{isFa ? 'شاخص' : 'Indicator'}</th>
                      <th className="p-3">{isFa ? 'وزن رسمی' : 'Nominal Weight'}</th>
                      <th className="p-3">{isFa ? 'فرمول دقیق' : 'Deterministic Formula'}</th>
                      <th className="p-3">{isFa ? 'وضعیت فعلی' : 'Current Value'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="p-3 font-semibold">{isFa ? 'تکمیل تکالیف' : 'Assignments'}</td>
                      <td className="p-3">25%</td>
                      <td className="p-3 font-mono text-[11px]">(Completed / Total) * 100</td>
                      <td className="p-3 font-bold">{indicators.assignment.isAvailable ? `${indicators.assignment.score}%` : 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">{isFa ? 'آمادگی امتحانات' : 'Exam Readiness'}</td>
                      <td className="p-3">30%</td>
                      <td className="p-3 font-mono text-[11px]">∑ (Progress * 0.6 + StudyLogged * Urgency) / N</td>
                      <td className="p-3 font-bold">{indicators.exam.isAvailable ? `${indicators.exam.score}%` : 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">{isFa ? 'هدف هفتگی مطالعه' : 'Study Goal'}</td>
                      <td className="p-3">20%</td>
                      <td className="p-3 font-mono text-[11px]">min(100, (ActualHours / TargetHours) * 100)</td>
                      <td className="p-3 font-bold">{indicators.studyGoal.score}%</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">{isFa ? 'پیشرفت سرفصل‌ها' : 'Course Progress'}</td>
                      <td className="p-3">25%</td>
                      <td className="p-3 font-mono text-[11px]">∑ (Course_i.progress) / EnrolledCount</td>
                      <td className="p-3 font-bold">{indicators.courseProgress.isAvailable ? `${indicators.courseProgress.score}%` : 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Goal customizer */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      {isFa ? 'تنظیم هدف هفتگی ساعات مطالعه' : 'Configure Weekly Study Target'}
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      {isFa ? 'هدف استاندارد هفتگی برای سنجش شاخص تحقق پومودورو' : 'Target hours per week used in the study goal calculation'}
                    </p>
                  </div>
                  <span className="text-sm font-black px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    {simulatedGoalHours} {isFa ? 'ساعت در هفته' : 'hours / week'}
                  </span>
                </div>

                <input
                  type="range"
                  min="5"
                  max="35"
                  step="1"
                  value={simulatedGoalHours}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setSimulatedGoalHours(val);
                    if (onUpdateGoalHours) onUpdateGoalHours(val);
                  }}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isFa ? 'سیر تکاملی نمره سلامت در طول ترم' : 'Weekly Semester Health Trajectory'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isFa ? 'پایش پیشرفت هفته‌به‌هفته دانشجو از آغاز ترم تا زمان حاضر' : 'Track your historical momentum week by week'}
                </p>
              </div>

              {/* Bar comparison chart */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="h-44 flex items-end justify-between gap-4 pt-6">
                  {historySnapshots.map((snap) => {
                    const heightPercent = Math.max(15, snap.score);
                    const isCurrent = snap.week === 7;
                    return (
                      <div key={snap.week} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          {snap.score}
                        </span>
                        <div className="w-full max-w-[56px] bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden h-32 flex items-end">
                          <div
                            className={`w-full rounded-t-xl transition-all duration-700 ${
                              isCurrent
                                ? 'bg-indigo-600'
                                : 'bg-slate-400 dark:bg-slate-500'
                            }`}
                            style={{ height: `${heightPercent}%` }}
                          />
                        </div>
                        <span className={`text-[11px] font-semibold ${isCurrent ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400'}`}>
                          {isFa ? snap.weekLabelFa : snap.weekLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 block">
                    {isFa ? 'روند رشد مستمر' : 'Upward Growth Trajectory'}
                  </span>
                  <span className="text-indigo-700 dark:text-indigo-400">
                    {isFa
                      ? `از هفته ۴ تا هفته ۷ نمره شما ${overallScore - 68} نمره بهبود یافته است.`
                      : `Your score has climbed by +${overallScore - 68} points since Week 4.`}
                  </span>
                </div>
                <Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {isFa ? 'بروزرسانی خودکار همگام با ثبت تغییرات' : 'Auto-computed from tasks, courses & study logs'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
          >
            {isFa ? 'بستن پنجره تحلیل' : 'Done & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
