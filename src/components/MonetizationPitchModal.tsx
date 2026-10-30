import React from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Zap, 
  ShoppingBag,
  ArrowRight,
  Flame
} from 'lucide-react';

interface MonetizationPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToMarket: () => void;
}

export const MonetizationPitchModal: React.FC<MonetizationPitchModalProps> = ({
  isOpen,
  onClose,
  onGoToMarket,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                تحلیل جامع ایده اجاره و درآمدزایی ترم‌یار
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                بررسی فرصت بازار، اعتبارسنجی مدل درآمدی و استراتژی رشد در خوابگاه‌ها
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Verdict Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">
            <Flame className="w-4 h-4 text-emerald-600" />
            <span>پاسخ صریح به شما: این ایده فوق‌العاده است و نجات‌دهنده پروژه شماست!</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            علت اینکه پروژه را به خاطر نبود درآمد متوقف کردید این بود که **هیچ دانشجویی بابت پلنر تحصیلی پول اشتراک نمی‌دهد** چون Google Calendar و دفترچه رایگان است. اما «کرایه فوری ابزار خوابگاهی» یک **درد واقعی، داغ و روزمره با تبادل پول نقد** است!
          </p>
        </div>

        {/* 3 Pillars of Success */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span>چرا ایده اجاره خوابگاهی (Campus Peer-to-Peer Rental) جواب می‌دهد؟</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
              <strong className="block text-slate-900 dark:text-white font-bold text-xs">
                ۱. نیاز فوری با ارزش بالا
              </strong>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                دانشجو برای یک جلسه امتحان حاضر است ۵۰ هزار تومان بدهد تا ماشین حساب ۲ میلیونی نخرد. دانشجو برای ژوژمان حاضر است تخته رسم را کرایه کند تا ترم بعد در کمد خاک نخورد.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
              <strong className="block text-slate-900 dark:text-white font-bold text-xs">
                ۲. هزینه پست صفر & تحویل ۳ دقیقه‌ای
              </strong>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                هیچ رقیبی (دیوار، شیپور، دیجی‌کالا) نمی‌تواند با سرعت «تحویل در لابی خوابگاه یا ورودی سلف» رقابت کند. دانشجو کالایش را دم در اتاق تحویل می‌گیرد!
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
              <strong className="block text-slate-900 dark:text-white font-bold text-xs">
                ۳. ایجاد درآمد برای دانشجویان
              </strong>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                دانشجویی که وسایل دارد (قابلمه تفال، اتو، کتری، مانیتور)، از وسایل بیکارش پول توجیبی درمی‌آورد و با شوق آگهی ثبت می‌کند و به دوستانش معرفی می‌کند.
              </p>
            </div>

          </div>
        </div>

        {/* 4 Proven Monetization Channels */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>۴ روش درآمدزایی مستقیم از این سامانه:</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            
            <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                ۱
              </span>
              <div>
                <strong className="block font-bold text-slate-900 dark:text-white text-xs">
                  کارمزد امانت و ودیعه امن (Escrow Protection Fee):
                </strong>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                  هنگامی که کسی کالا را رزرو می‌کند، ۱۰٪ از مبلغ کرایه به عنوان کارمزد پلتفرم و ضمانت سلامت کالا به حساب سامانه واریز می‌شود.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                ۲
              </span>
              <div>
                <strong className="block font-bold text-slate-900 dark:text-white text-xs">
                  نردبان و آگهی فوری شب امتحان (Urgent Promoted Listing):
                </strong>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                  دانشجویی که فردا امتحان دارد می‌تواند با پرداخت مبلغ اندک (مثلاً ۱۰ تا ۲۰ هزار تومان)، درخواست نیازش را در بالای تمام خوابگاه‌ها پین کند.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                ۳
              </span>
              <div>
                <strong className="block font-bold text-slate-900 dark:text-white text-xs">
                  حراجی و واگذاری پایان ترم (Graduation Moving Out Pack):
                </strong>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                  دانشجویان فارغ‌التحصیل خرداد و شهریور وسایل سنگین (یخچال کوچک، فرش، جا کفشی) را به ورودی‌های جدید می‌فروشند و سامانه برای فروش پکیج‌ها کارمزد می‌گیرد.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                ۴
              </span>
              <div>
                <strong className="block font-bold text-slate-900 dark:text-white text-xs">
                  اسپانسرشیپ خدمات اطراف دانشگاه:
                </strong>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                  تکثیرات و انتشارات دانشگاه، لوازم‌التحریرها، کافه‌های دانشجویی و خدمات چاپ ارزان می‌توانند در بنرهای بومی دانشگاه تبلیغ کنند.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Trust & Safety Solution */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>چگونه ریسک آسیب یا سرقت کالا در خوابگاه حل می‌شود؟</span>
          </div>
          <p className="text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
            ۱. امانت با کارت دانشجویی فیزیکی یا گرو نگه داشتن ودیعه نقدی در لابی. <br />
            ۲. عضویت مشروط به تأیید شماره دانشجویی یا شماره اتاق و بلوک خوابگاه. <br />
            ۳. امتیازدهی و نظرات کاربران؛ دانشجوی بدحساب فوراً از سامانه مسدود می‌شود.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            بستن پنجره
          </button>

          <button
            onClick={() => {
              onClose();
              onGoToMarket();
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>مشاهده و تست بازارچه در ترم‌یار</span>
          </button>
        </div>

      </div>
    </div>
  );
};
