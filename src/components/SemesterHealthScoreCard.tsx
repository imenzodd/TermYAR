import React from 'react';
import {
  Activity,
  Award,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { SemesterHealthScoreData } from '../types';

interface SemesterHealthScoreCardProps {
  healthData: SemesterHealthScoreData;
  lang?: 'en' | 'fa';
  onOpenAnalysisModal: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const SemesterHealthScoreCard: React.FC<SemesterHealthScoreCardProps> = ({
  healthData,
  lang = 'en',
  onOpenAnalysisModal,
  onNavigateTab,
}) => {
  const isFa = lang === 'fa';
  const { overallScore, status, statusLabel, statusLabelFa, indicators, recommendations, weeklyComparison, hasMissingData } = healthData;

  // Status-based color themes
  const getTheme = () => {
    switch (status) {
      case 'excellent':
        return {
          ring: 'stroke-emerald-500',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
          dot: 'bg-emerald-500',
          accent: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'good':
        return {
          ring: 'stroke-indigo-600',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
          dot: 'bg-indigo-500',
          accent: 'text-indigo-600 dark:text-indigo-400',
        };
      case 'needs_attention':
        return {
          ring: 'stroke-amber-500',
          badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
          dot: 'bg-amber-500',
          accent: 'text-amber-600 dark:text-amber-400',
        };
      case 'at_risk':
      default:
        return {
          ring: 'stroke-rose-500',
          badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
          dot: 'bg-rose-500',
          accent: 'text-rose-600 dark:text-rose-400',
        };
    }
  };

  const theme = getTheme();
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const topRecommendation = recommendations[0];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{isFa ? 'امتیاز سلامت ترم' : 'Semester Health Score'}</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${theme.badge}`}>
                {isFa ? statusLabelFa : statusLabel}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {isFa ? 'پایش هوشمند و وزنی تعادل تحصیلی' : 'Intelligent weighted academic momentum'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAnalysisModal}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
        >
          <span>{isFa ? 'تحلیل جامع' : 'Full Analysis'}</span>
          <ChevronRight className={`w-3.5 h-3.5 ${isFa ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Main Score & 4 Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: Circular Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-2">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className={`${theme.ring} transition-all duration-1000 ease-out`}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {overallScore}
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                / 100
              </span>
            </div>
          </div>

          {/* Weekly trend badge */}
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            {weeklyComparison.trend === 'up' ? (
              <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                +{weeklyComparison.diff} {isFa ? 'نمره نسبت به هفته قبل' : 'pts vs last week'}
              </span>
            ) : weeklyComparison.trend === 'down' ? (
              <span className="inline-flex items-center text-rose-600 dark:text-rose-400 font-semibold gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                {weeklyComparison.diff} {isFa ? 'نمره نسبت به هفته قبل' : 'pts vs last week'}
              </span>
            ) : (
              <span>{isFa ? 'ثابت نسبت به هفته قبل' : 'Stable vs last week'}</span>
            )}
          </div>
        </div>

        {/* Right: 4 Weighted Indicators */}
        <div className="md:col-span-8 space-y-2.5">
          {/* Indicator 1: Assignments (25%) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span>{isFa ? 'تکمیل تکالیف' : 'Assignments'}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({Math.round(indicators.assignment.normalizedWeight * 100)}%)
                </span>
              </span>
              <span className="font-semibold text-slate-900 dark:text-white text-xs">
                {indicators.assignment.isAvailable ? `${indicators.assignment.score}%` : (isFa ? 'در انتظار داده' : 'No data')}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${indicators.assignment.score >= 75 ? 'bg-indigo-600' : 'bg-amber-500'} transition-all duration-700`}
                style={{ width: `${indicators.assignment.isAvailable ? indicators.assignment.score : 0}%` }}
              />
            </div>
          </div>

          {/* Indicator 2: Exam Readiness (30%) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span>{isFa ? 'آمادگی امتحانات' : 'Exam Readiness'}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({Math.round(indicators.exam.normalizedWeight * 100)}%)
                </span>
              </span>
              <span className="font-semibold text-slate-900 dark:text-white text-xs">
                {indicators.exam.isAvailable ? `${indicators.exam.score}%` : (isFa ? 'در انتظار داده' : 'No data')}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${indicators.exam.score >= 70 ? 'bg-purple-600' : 'bg-amber-500'} transition-all duration-700`}
                style={{ width: `${indicators.exam.isAvailable ? indicators.exam.score : 0}%` }}
              />
            </div>
          </div>

          {/* Indicator 3: Study Goal (20%) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{isFa ? 'هدف هفتگی مطالعه' : 'Study Goal'}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({Math.round(indicators.studyGoal.normalizedWeight * 100)}%)
                </span>
              </span>
              <span className="font-semibold text-slate-900 dark:text-white text-xs">
                {indicators.studyGoal.score}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${indicators.studyGoal.score >= 75 ? 'bg-emerald-500' : 'bg-amber-500'} transition-all duration-700`}
                style={{ width: `${indicators.studyGoal.score}%` }}
              />
            </div>
          </div>

          {/* Indicator 4: Course Progress (25%) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                <span>{isFa ? 'پیشرفت سرفصل‌ها' : 'Course Progress'}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({Math.round(indicators.courseProgress.normalizedWeight * 100)}%)
                </span>
              </span>
              <span className="font-semibold text-slate-900 dark:text-white text-xs">
                {indicators.courseProgress.isAvailable ? `${indicators.courseProgress.score}%` : (isFa ? 'در انتظار داده' : 'No data')}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${indicators.courseProgress.score >= 70 ? 'bg-sky-500' : 'bg-amber-500'} transition-all duration-700`}
                style={{ width: `${indicators.courseProgress.isAvailable ? indicators.courseProgress.score : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Missing data notice if applicable */}
      {hasMissingData && (
        <div className="mt-3 p-2 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 rounded-xl flex items-center gap-2 text-[11px] text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>
            {isFa
              ? 'برخی شاخص‌ها داده ثبت‌شده ندارند؛ اوزان باقی‌مانده به‌صورت نرمال محاسبه شده‌اند.'
              : 'Some indicators lack entries; weights are normalized proportionally across active metrics.'}
          </span>
        </div>
      )}

      {/* Quick Actionable Recommendation Banner */}
      {topRecommendation && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-slate-600 dark:text-slate-400 truncate">
              {isFa ? topRecommendation.titleFa : topRecommendation.title}
            </span>
            <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              +{topRecommendation.impactPts} pts
            </span>
          </div>

          <button
            onClick={() => {
              if (topRecommendation.actionTab && onNavigateTab) {
                onNavigateTab(topRecommendation.actionTab);
              } else {
                onOpenAnalysisModal();
              }
            }}
            className="shrink-0 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-0.5"
          >
            <span>{isFa ? topRecommendation.actionLabelFa : topRecommendation.actionLabel}</span>
            <ArrowRight className={`w-3 h-3 ${isFa ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}
    </div>
  );
};
