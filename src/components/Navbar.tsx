import React, { useState } from 'react';
import { 
  Bell, 
  Moon, 
  Sun, 
  Search, 
  ChevronDown,
  Globe,
  Plus
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile;
  darkMode: boolean;
  toggleDarkMode: () => void;
  lang: 'en' | 'fa';
  setLang: (lang: 'en' | 'fa') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenProfileModal: () => void;
  onOpenNewTaskModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  darkMode,
  toggleDarkMode,
  lang,
  setLang,
  searchQuery,
  setSearchQuery,
  onOpenProfileModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const isFa = lang === 'fa';

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input Bar (Center/Left aligned as in mockup) */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isFa ? 'جستجو در دروس، تکالیف، یادداشت‌ها...' : 'Search courses, tasks, notes...'}
            className="w-full bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-10 pr-12 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 shadow-2xs">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Language toggle, Theme toggle, Notifications, User profile */}
      <div className="flex items-center gap-3 ml-4">
        {/* Language switch */}
        <button
          onClick={() => setLang(lang === 'en' ? 'fa' : 'en')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/60 dark:border-slate-700/60"
          title={isFa ? 'تغییر به انگلیسی' : 'Switch to Persian'}
        >
          <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{lang === 'en' ? 'FA' : 'EN'}</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications with red dot */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 z-50 text-xs">
              <div className="font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span>{isFa ? 'اعلان‌های مهم' : 'Notifications'}</span>
                <span className="text-[10px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded font-medium">
                  {isFa ? '۲ رویداد نزدیک' : '2 Upcoming'}
                </span>
              </div>
              <div className="py-2 space-y-2">
                <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    {isFa ? 'کوییز ریاضی ۱' : 'Quiz 1 - MATH101'}
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {isFa ? 'تا ۲ روز آینده - ساعت ۱۰:۰۰' : 'In 2 days - 10:00 AM'}
                  </div>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    {isFa ? 'گزارش آزمایشگاه فیزیک' : 'Lab report - PHYS101'}
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {isFa ? 'مهلت تحویل تا ۵:۰۰ عصر امروز' : 'Due today at 5:00 PM'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown matching screenshot */}
        <div 
          onClick={onOpenProfileModal}
          className="flex items-center gap-2 pl-2 cursor-pointer hover:opacity-85 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-1 ring-slate-300 dark:ring-slate-600 flex items-center justify-center text-sm font-semibold text-slate-700 dark:text-slate-200">
            {user.avatar && user.avatar.startsWith('http') ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span>{user.name ? user.name.slice(0, 2).toUpperCase() : 'AM'}</span>
            )}
          </div>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline">
            {user.name || 'Alex Morgan'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
        </div>
      </div>
    </header>
  );
};
