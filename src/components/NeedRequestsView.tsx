import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  MapPin, 
  Clock, 
  Coins, 
  MessageSquare, 
  CheckCircle,
  X,
  Send
} from 'lucide-react';
import { NeedRequest } from '../types';
import { toPersianDigits } from '../utils/persian';

interface NeedRequestsViewProps {
  requests: NeedRequest[];
  onOpenNewNeedModal: () => void;
  onRespondToNeed: (id: string) => void;
}

export const NeedRequestsView: React.FC<NeedRequestsViewProps> = ({
  requests,
  onOpenNewNeedModal,
  onRespondToNeed,
}) => {
  const [selectedDorm, setSelectedDorm] = useState('all');
  const [activeRespondModal, setActiveRespondModal] = useState<NeedRequest | null>(null);
  const [responseOffer, setResponseOffer] = useState('');
  const [responseSuccess, setResponseSuccess] = useState(false);

  const filteredRequests = requests.filter((r) => {
    if (selectedDorm !== 'all' && !r.campusDorm.includes(selectedDorm)) return false;
    return true;
  });

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRespondModal) {
      onRespondToNeed(activeRespondModal.id);
      setResponseSuccess(true);
      setTimeout(() => {
        setResponseSuccess(false);
        setActiveRespondModal(null);
        setResponseOffer('');
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              دیوار نیازمندی‌های فوری خوابگاه («کی داره؟»)
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              امانت و هماهنگی درون‌دانشگاهی
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            اعلام نیازهای سریع دانشجویان برای شب امتحان، ژوژمان یا وسایل پخت‌وپز خوابگاهی
          </p>
        </div>

        <button
          onClick={onOpenNewNeedModal}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ثبت نیاز فوری («کی داره؟»)</span>
        </button>
      </div>

      {/* Dorm filter */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
        <span className="font-medium text-slate-700 dark:text-slate-300">
          فیلتر موقعیت خوابگاه:
        </span>
        <select
          value={selectedDorm}
          onChange={(e) => setSelectedDorm(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
        >
          <option value="all">همه خوابگاه‌ها</option>
          <option value="طرشت">خوابگاه‌های طرشت</option>
          <option value="کوی">کوی دانشگاه</option>
          <option value="چمران">خوابگاه چمران</option>
          <option value="فاطمیه">خوابگاه فاطمیه</option>
        </select>
      </div>

      {/* Need Requests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.map((req) => (
          <article
            key={req.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {req.title}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                  فوری
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{req.campusDorm}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>زمان: {req.timeNeeded}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                  <Coins className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>پیشنهاد: {req.budgetOffer}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{req.studentName}</span>
                <span className="mr-1">({req.studentMajor})</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">{req.createdAt}</span>
              </div>

              <button
                onClick={() => {
                  setActiveRespondModal(req);
                  setResponseSuccess(false);
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>من دارم ({toPersianDigits(req.responsesCount)})</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Respond Modal */}
      {activeRespondModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                پاسخ به {activeRespondModal.studentName}
              </span>
              <button
                onClick={() => setActiveRespondModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
              <strong className="block text-slate-900 dark:text-white">{activeRespondModal.title}</strong>
              <span className="text-slate-500 block">موقعیت: {activeRespondModal.campusDorm}</span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold block">پیشنهاد: {activeRespondModal.budgetOffer}</span>
            </div>

            {responseSuccess ? (
              <div className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl text-center text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>پیام شما با موفقیت برای {activeRespondModal.studentName} ارسال شد.</span>
              </div>
            ) : (
              <form onSubmit={handleSendResponse} className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  پیام شما و شرایط امانت / اجاره:
                </label>
                <textarea
                  required
                  rows={3}
                  value={responseOffer}
                  onChange={(e) => setResponseOffer(e.target.value)}
                  placeholder="سلام، من در بلوک ۲ اتاق ۲۰۱ هستم. ماشین حسابم با باتری نو آماده است. بیا لابی تحویلت بدم."
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-slate-500"
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveRespondModal(null)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ارسال پاسخ</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
