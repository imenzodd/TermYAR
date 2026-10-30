import React, { useState } from 'react';
import { X, Upload, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { DealType, MarketCategory, MarketItem } from '../types';
import { formatToman } from '../utils/persian';

interface NewMarketItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: MarketItem) => void;
  userDorm: string;
  userName: string;
}

export const NewMarketItemModal: React.FC<NewMarketItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  userDorm,
  userName,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MarketCategory>('dorm_essentials');
  const [dealType, setDealType] = useState<DealType>('rent');
  const [rentPriceDaily, setRentPriceDaily] = useState<number>(25000);
  const [sellPrice, setSellPrice] = useState<number>(300000);
  const [deposit, setDeposit] = useState<number>(150000);
  const [dormLocation, setDormLocation] = useState(userDorm);
  const [condition, setCondition] = useState<'در حد نو' | 'تمیز و سالم' | 'کارکرده'>('تمیز و سالم');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState('/src/assets/images/dorm_pot_1793347360476.jpg');
  const [telegram, setTelegram] = useState('@amir_student');

  if (!isOpen) return null;

  const sampleImages = [
    { label: 'قابلمه گرانیتی', url: '/src/assets/images/dorm_pot_1793347360476.jpg' },
    { label: 'ماشین حساب کاسیو', url: '/src/assets/images/calc_casio_1793347361000.jpg' },
    { label: 'تخته شاسی معماری', url: '/src/assets/images/drafting_board_1793347361688.jpg' },
    { label: 'کتری برقی خوابگاهی', url: '/src/assets/images/electric_kettle_1793347361481.jpg' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem: MarketItem = {
      id: `m_${Date.now()}`,
      title: title.trim(),
      category,
      dealType,
      rentPriceDaily: dealType !== 'sell' ? Number(rentPriceDaily) : undefined,
      sellPrice: dealType !== 'rent' ? Number(sellPrice) : undefined,
      deposit: dealType !== 'sell' ? Number(deposit) : undefined,
      dormLocation: dormLocation.trim() || userDorm,
      condition,
      description: description.trim() || 'وسایل سالم و آماده تحویل در لابی خوابگاه.',
      image: selectedImage,
      ownerName: userName,
      ownerDorm: userDorm,
      ownerMajor: 'مهندسی کامپیوتر',
      contactTelegram: telegram.trim() || '@student',
      status: 'available',
      createdAt: 'هم‌اکنون',
      views: 1,
    };

    onAddItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h2 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
              ثبت آگهی کالا (اجاره موقت یا فروش در خوابگاه)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              عنوان وسیله یا کالا:
            </label>
            <input
              type="text"
              required
              placeholder="مثلاً: قابلمه تفال نچسب ۲۴ سانت / ماشین حساب کاسیو ۹۹۱"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Deal Type & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                نوع معامله:
              </label>
              <select
                value={dealType}
                onChange={(e) => setDealType(e.target.value as DealType)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="rent">فقط اجاره روزانه</option>
                <option value="sell">فقط فروش قطعی</option>
                <option value="both">هم اجاره و هم فروش</option>
              </select>
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
                <option value="dorm_essentials">لوازم خوابگاه (قابلمه، اتو، کتری...)</option>
                <option value="engineering_tools">ابزار مهندسی و معماری</option>
                <option value="books_notes">کتاب و جزوه</option>
                <option value="electronics">دیجیتال و کابل</option>
                <option value="lab_medical">پزشکی و آزمایشگاه</option>
              </select>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/40">
            {dealType !== 'sell' && (
              <div>
                <label className="block font-bold text-indigo-900 dark:text-indigo-200 mb-1">
                  کرایه روزانه (تومان):
                </label>
                <input
                  type="number"
                  step="5000"
                  min="5000"
                  value={rentPriceDaily}
                  onChange={(e) => setRentPriceDaily(Number(e.target.value))}
                  className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>
            )}

            {dealType !== 'sell' && (
              <div>
                <label className="block font-bold text-indigo-900 dark:text-indigo-200 mb-1">
                  مبلغ ودیعه امانت (تومان):
                </label>
                <input
                  type="number"
                  step="10000"
                  min="0"
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>
            )}

            {dealType !== 'rent' && (
              <div className="sm:col-span-2">
                <label className="block font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                  قیمت فروش قطعی (تومان):
                </label>
                <input
                  type="number"
                  step="10000"
                  min="10000"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(Number(e.target.value))}
                  className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>
            )}
          </div>

          {/* Dorm Location & Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                محل تحویل در خوابگاه:
              </label>
              <input
                type="text"
                required
                placeholder="خوابگاه طرشت ۲ - بلوک ۱"
                value={dormLocation}
                onChange={(e) => setDormLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                وضعیت سلامت کالا:
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="در حد نو">در حد نو</option>
                <option value="تمیز و سالم">تمیز و سالم</option>
                <option value="کارکرده">کارکرده</option>
              </select>
            </div>
          </div>

          {/* Image Selection */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              انتخاب عکس کالای مشابه:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {sampleImages.map((img) => (
                <div
                  key={img.url}
                  onClick={() => setSelectedImage(img.url)}
                  className={`p-1 rounded-xl border cursor-pointer text-center space-y-1 transition-all ${
                    selectedImage === img.url
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/60 ring-2 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    referrerPolicy="no-referrer"
                    className="w-full aspect-[4/3] object-cover rounded-lg"
                  />
                  <span className="block text-[10px] font-medium text-slate-700 dark:text-slate-300 truncate">
                    {img.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              توضیحات و شرایط هماهنگی:
            </label>
            <textarea
              rows={2}
              placeholder="مثلاً: سالم با باتری نو، تست دم در خوابگاه، تخفیف برای اجاره هفتگی..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
            />
          </div>

          {/* Telegram ID */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              آیدی تلگرام جهت پیام دانشجویان:
            </label>
            <input
              type="text"
              placeholder="@your_id"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none text-left font-mono"
            />
          </div>

          {/* Submit */}
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
              className="px-5 py-2.5 rounded-lg text-white bg-[#FF4B26] hover:bg-[#E83C18] font-bold shadow-xs cursor-pointer"
            >
              انتشار فوری آگهی
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
