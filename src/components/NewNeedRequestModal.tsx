import React, { useState } from 'react';
import { X, Megaphone, Send, Clock, MapPin, Coins } from 'lucide-react';
import { MarketCategory, NeedRequest } from '../types';

interface NewNeedRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNeed: (need: NeedRequest) => void;
  userDorm: string;
  userName: string;
}

export const NewNeedRequestModal: React.FC<NewNeedRequestModalProps> = ({
  isOpen,
  onClose,
  onAddNeed,
  userDorm,
  userName,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MarketCategory>('engineering_tools');
  const [campusDorm, setCampusDorm] = useState(userDorm);
  const [budgetOffer, setBudgetOffer] = useState('۳۰ هزار تومان یا امانت');
  const [timeNeeded, setTimeNeeded] = useState('فردا صبح ساعت ۸ تا ۱۲');
  const [telegram, setTelegram] = useState('@my_id');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newNeed: NeedRequest = {
      id: `nr_${Date.now()}`,
      title: title.trim(),
      category,
      campusDorm: campusDorm.trim() || userDorm,
      budgetOffer: budgetOffer.trim() || 'توافقی',
      timeNeeded: timeNeeded.trim() || 'فوری',
      studentName: userName,
      studentMajor: 'دانشجوی کارشناسی',
      contactTelegram: telegram.trim(),
      responsesCount: 0,
      createdAt: 'هم‌اکنون',
      status: 'open',
    };

    onAddNeed(newNeed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-right">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-rose-600" />
            <h2 className="font-black text-sm text-slate-900 dark:text-white">
              اعلام نیاز فوری در خوابگاه («کی داره؟»)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              به چه چیزی نیاز داری؟
            </label>
            <input
              type="text"
              required
              placeholder="مثلاً: ماشین حساب مهندسی فوری / قابلمه برای پخت شام / اتو"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              دسته‌بندی:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MarketCategory)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="engineering_tools">ابزار مهندسی (ماشین حساب، تخته رسم...)</option>
              <option value="dorm_essentials">لوازم خوابگاه (قابلمه، کتری، اتو...)</option>
              <option value="books_notes">کتاب، جزوه و حل‌المسائل</option>
              <option value="electronics">دیجیتال و کابل</option>
              <option value="lab_medical">پزشکی و آزمایشگاه</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              موقعیت شما (خوابگاه / دانشکده):
            </label>
            <input
              type="text"
              required
              placeholder="خوابگاه طرشت ۲ - بلوک ۱ یا لابی"
              value={campusDorm}
              onChange={(e) => setCampusDorm(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              زمان مورد نیاز:
            </label>
            <input
              type="text"
              placeholder="مثلاً: فردا صبح از ساعت ۸ تا ۱۲"
              value={timeNeeded}
              onChange={(e) => setTimeNeeded(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              پیشنهاد مالی یا امانت شما:
            </label>
            <input
              type="text"
              placeholder="مثلاً: ۴۰ هزار تومان کرایه + گرو گذاشتن کارت دانشجویی"
              value={budgetOffer}
              onChange={(e) => setBudgetOffer(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              آیدی تلگرام برای دریافت پیام بچه‌ها:
            </label>
            <input
              type="text"
              placeholder="@student_id"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none text-left font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-white bg-[#FF4B26] hover:bg-[#E83C18] font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>انتشار در تابلوی خوابگاه</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
