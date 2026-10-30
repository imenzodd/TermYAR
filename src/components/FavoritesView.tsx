import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  BookOpen,
  FileCheck,
  Trash2,
  ExternalLink,
  MapPin,
  Tag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Course, MarketItem, Task } from '../types';
import { formatToman, toPersianDigits } from '../utils/persian';

interface FavoritesViewProps {
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  marketItems: MarketItem[];
  courses: Course[];
  tasks: Task[];
  lang?: 'en' | 'fa';
  onNavigateTab: (tab: string) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteIds,
  onToggleFavorite,
  marketItems,
  courses,
  tasks,
  lang = 'en',
  onNavigateTab,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'market' | 'course' | 'task'>('all');
  const isFa = lang === 'fa';

  const favoritedMarket = marketItems.filter((item) => favoriteIds.includes(item.id));
  const favoritedCourses = courses.filter((c) => favoriteIds.includes(c.id));
  const favoritedTasks = tasks.filter((t) => favoriteIds.includes(t.id));

  const totalCount = favoritedMarket.length + favoritedCourses.length + favoritedTasks.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isFa ? 'نشان‌شده‌ها و مورد علاقه‌ها' : 'Favorites & Bookmarks'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isFa
              ? 'دسترسی سریع به اقلام بازارچه خوابگاهی، دروس و وظایف نشان‌شده شما'
              : 'Quick access to your saved dorm items, courses, and pinned tasks'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isFa ? 'همه' : 'All'} ({totalCount})
          </button>
          <button
            onClick={() => setFilterType('market')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'market'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isFa ? 'اقلام بازارچه' : 'Marketplace'} ({favoritedMarket.length})
          </button>
          <button
            onClick={() => setFilterType('course')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'course'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isFa ? 'دروس' : 'Courses'} ({favoritedCourses.length})
          </button>
          <button
            onClick={() => setFilterType('task')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'task'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isFa ? 'تکالیف مهم' : 'Tasks'} ({favoritedTasks.length})
          </button>
        </div>
      </div>

      {/* Empty State */}
      {totalCount === 0 && (
        <div className="dash-card p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isFa ? 'هنوز موردی را نشان نکرده‌اید' : 'No favorites saved yet'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 mb-6 leading-relaxed">
            {isFa
              ? 'با کلیک بر روی آیکون قلب در بازارچه خوابگاهی یا بخش دروس، موارد دلخواه خود را برای دسترسی سریع ذخیره کنید.'
              : 'Click the heart icon on marketplace items, courses, or priority tasks to save them here for quick access.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => onNavigateTab('marketplace')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isFa ? 'مشاهده بازارچه خوابگاه' : 'Browse Marketplace'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('courses')}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isFa ? 'دروس من' : 'View Courses'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Favorited Marketplace Items Section */}
      {(filterType === 'all' || filterType === 'market') && favoritedMarket.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
            <span>{isFa ? 'اقلام نشان‌شده بازارچه خوابگاهی' : 'Saved Marketplace Items'}</span>
            <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">
              {favoritedMarket.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoritedMarket.map((item) => (
              <div
                key={item.id}
                className="dash-card p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative group"
              >
                {/* Remove heart button */}
                <button
                  onClick={() => onToggleFavorite(item.id)}
                  title="Remove from favorites"
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 text-rose-500 hover:bg-rose-50 shadow-xs z-10 transition-colors"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>

                <div>
                  <div className="w-full h-32 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{item.dormLocation}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    {item.dealType === 'rent' || item.dealType === 'both' ? (
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {isFa ? `${formatToman(item.rentPriceDaily || 0)} روزانه` : `$${item.rentPriceDaily || 10}/day`}
                      </span>
                    ) : (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {isFa ? `${formatToman(item.sellPrice || 0)} خرید` : `$${item.sellPrice || 50} Buy`}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onNavigateTab('marketplace')}
                    className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 flex items-center gap-1"
                  >
                    <span>{isFa ? 'تماس و اجاره' : 'View Item'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorited Courses Section */}
      {(filterType === 'all' || filterType === 'course') && favoritedCourses.length > 0 && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>{isFa ? 'دروس پین‌شده' : 'Pinned Courses'}</span>
            <span className="text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">
              {favoritedCourses.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoritedCourses.map((c) => (
              <div key={c.id} className="dash-card p-4 relative group">
                <button
                  onClick={() => onToggleFavorite(c.id)}
                  title="Remove from favorites"
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {c.code.slice(0, 4)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {c.name}
                    </h4>
                    <div className="text-[11px] text-slate-400">
                      {c.code} • {c.professor}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{isFa ? 'پیشرفت سرفصل' : 'Progress'}</span>
                    <span className="font-bold">{c.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-1.5 rounded-full bg-indigo-600"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
