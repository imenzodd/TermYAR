import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  Phone,
  CheckCircle,
  Tag,
  X,
  Search,
  Filter,
  Heart,
} from 'lucide-react';
import { MarketCategory, MarketItem, DealType } from '../types';
import { formatToman, toPersianDigits } from '../utils/persian';

interface MarketplaceViewProps {
  items: MarketItem[];
  onOpenNewModal: () => void;
  onOpenNeedRequestTab: () => void;
  searchQuery: string;
  favoriteIds?: string[];
  onToggleFavorite?: (id: string) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  items,
  onOpenNewModal,
  onOpenNeedRequestTab,
  searchQuery,
  favoriteIds = [],
  onToggleFavorite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory | 'all'>('all');
  const [selectedDealType, setSelectedDealType] = useState<DealType | 'all'>('all');
  const [selectedDorm, setSelectedDorm] = useState<string>('all');
  const [activeItemModal, setActiveItemModal] = useState<MarketItem | null>(null);
  const [rentDurationDays, setRentDurationDays] = useState<number>(3);
  const [reservationSuccess, setReservationSuccess] = useState<boolean>(false);

  const categories: { id: MarketCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'همه اقلام' },
    { id: 'dorm_essentials', label: 'لوازم خوابگاه (قابلمه، کتری، اتو...)' },
    { id: 'engineering_tools', label: 'ابزار مهندسی (ماشین حساب، تخته رسم...)' },
    { id: 'books_notes', label: 'کتاب، جزوه و حل‌المسائل' },
    { id: 'electronics', label: 'دیجیتال و کابل' },
    { id: 'lab_medical', label: 'پزشکی و آزمایشگاه' },
  ];

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedDealType !== 'all') {
      if (selectedDealType === 'rent' && item.dealType === 'sell') return false;
      if (selectedDealType === 'sell' && item.dealType === 'rent') return false;
    }
    if (selectedDorm !== 'all' && !item.dormLocation.includes(selectedDorm)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchOwner = item.ownerName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchOwner) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Clean Modern Header (No AI slop gradients) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              بازارچه و امانت اقلام خوابگاهی
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              امکان جانبی ترم‌یار
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            اجاره موقت و خرید وسایل دانشجویی (قابلمه، ماشین حساب مهندسی، تخته رسم و جزوه) با تحویل در لابی خوابگاه
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNeedRequestTab}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            دیوار «کی داره؟»
          </button>

          <button
            onClick={onOpenNewModal}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ثبت آگهی کالا</span>
          </button>
        </div>
      </div>

      {/* Clean Filters and Controls Strip */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
        
        {/* Deal Type & Dorm location */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setSelectedDealType('all')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
                selectedDealType === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              همه آگهی‌ها
            </button>
            <button
              onClick={() => setSelectedDealType('rent')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
                selectedDealType === 'rent'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              فقط اجاره روزانه
            </button>
            <button
              onClick={() => setSelectedDealType('sell')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
                selectedDealType === 'sell'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              فروش قطعی
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400">محدوده خوابگاه:</span>
            <select
              value={selectedDorm}
              onChange={(e) => setSelectedDorm(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">همه خوابگاه‌ها</option>
              <option value="طرشت">خوابگاه‌های طرشت</option>
              <option value="کوی">کوی دانشگاه</option>
              <option value="چمران">خوابگاه چمران</option>
              <option value="هنر">پردیس هنر و معماری</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer font-medium ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <ShoppingBag className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">
            موردی مطابق با این فیلتر یافت نشد
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            می‌توانید فیلترها را ریست کنید یا آگهی جدیدی ثبت نمایید.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              onClick={() => {
                setActiveItemModal(item);
                setReservationSuccess(false);
              }}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 shadow-sm transition-all flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 dark:bg-white/90 text-white dark:text-slate-900 backdrop-blur-sm">
                    {item.dealType === 'rent' ? 'اجاره روزانه' : item.dealType === 'sell' ? 'فروشی' : 'اجاره / فروش'}
                  </span>
                </div>

                {onToggleFavorite && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    title={favoriteIds.includes(item.id) ? 'حذف از نشان‌شده‌ها' : 'افزودن به نشان‌شده‌ها'}
                    className={`absolute top-2.5 left-2.5 p-1.5 rounded-full backdrop-blur-md transition-all shadow-xs ${
                      favoriteIds.includes(item.id)
                        ? 'bg-rose-500 text-white scale-105'
                        : 'bg-slate-900/60 text-white/80 hover:text-white hover:bg-slate-900/80'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${favoriteIds.includes(item.id) ? 'fill-current' : ''}`} />
                  </button>
                )}

                <div className="absolute bottom-2 right-2 left-2 flex items-center justify-between text-[10px] text-white bg-slate-950/70 backdrop-blur-sm px-2 py-1 rounded-md">
                  <div className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-300 shrink-0" />
                    <span className="truncate">{item.dormLocation}</span>
                  </div>
                  <span className="shrink-0 text-slate-300">{item.condition}</span>
                </div>
              </div>

              {/* Content Details */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  {item.rentPriceDaily && (
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">کرایه روزانه:</span>
                      <span className="font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {formatToman(item.rentPriceDaily)}
                        <span className="text-[10px] font-normal text-slate-400"> / روز</span>
                      </span>
                    </div>
                  )}

                  {item.sellPrice && (
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">قیمت فروش:</span>
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatToman(item.sellPrice)}
                      </span>
                    </div>
                  )}

                  {item.deposit && (
                    <div className="text-[10px] text-slate-400 flex items-center justify-between">
                      <span>ودیعه امانت:</span>
                      <span className="tabular-nums">{formatToman(item.deposit)} یا کارت دانشجویی</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span>{item.ownerName}</span>
                  <span className="text-slate-900 dark:text-white font-semibold group-hover:underline">
                    مشاهده شرایط ←
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Item Details Modal */}
      {activeItemModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-right">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                جزئیات کالا و امانت در خوابگاه
              </span>
              <button
                onClick={() => setActiveItemModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={activeItemModal.image}
                alt={activeItemModal.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {activeItemModal.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>{activeItemModal.dormLocation}</span>
                <span>·</span>
                <span>وضعیت: {activeItemModal.condition}</span>
                <span>·</span>
                <span>ثبت: {activeItemModal.createdAt}</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              {activeItemModal.description}
            </p>

            {/* Rent Pricing Calculator */}
            {activeItemModal.rentPriceDaily && (
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    محاسبه هزینه اجاره:
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 7].map((days) => (
                      <button
                        key={days}
                        onClick={() => setRentDurationDays(days)}
                        className={`px-2.5 py-0.5 rounded text-xs font-semibold cursor-pointer ${
                          rentDurationDays === days
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {toPersianDigits(days)} روز
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-slate-700/80 text-xs">
                  <span className="text-slate-600 dark:text-slate-400">
                    مبلغ کل ({toPersianDigits(rentDurationDays)} روز):
                  </span>
                  <span className="font-black text-sm text-slate-900 dark:text-white tabular-nums">
                    {formatToman(activeItemModal.rentPriceDaily * rentDurationDays)}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>مبلغ ودیعه امانت (هنگام عودت برگردانده می‌شود):</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                    {formatToman(activeItemModal.deposit)} یا کارت دانشجویی
                  </span>
                </div>
              </div>
            )}

            {/* Safe Dorm Delivery Box */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs">
              <ShieldCheck className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-slate-800 dark:text-slate-200">تحویل در لابی خوابگاه:</strong>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  تحویل کالا در لابی یا گیت ورودی خوابگاه انجام می‌شود. هنگام تحویل، تست سلامت کالا را انجام داده و برای ضمانت، ودیعه یا کارت دانشجویی مبادله نمایید.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    صاحب کالا: {activeItemModal.ownerName}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {activeItemModal.ownerMajor} · {activeItemModal.ownerDorm}
                  </span>
                </div>
                {activeItemModal.contactTelegram && (
                  <span className="font-mono text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {activeItemModal.contactTelegram}
                  </span>
                )}
              </div>

              {reservationSuccess ? (
                <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>درخواست ثبت شد! پیام برای صاحب کالا در تلگرام ارسال گردید.</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => setReservationSuccess(true)}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>پیام و رزرو در تلگرام</span>
                  </button>

                  <button
                    onClick={() => {
                      alert(`شماره تماس صاحب کالا: ${activeItemModal.contactPhone || '۰۹۱۲۳۴۵۶۷۸۹'}\nلطفاً تماس بین ساعات ۹ تا ۲۱ برقرار شود.`);
                    }}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>شماره تماس</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
