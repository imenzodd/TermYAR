import React, { useState } from 'react';
import { X, User, GraduationCap, MapPin, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveProfile,
}) => {
  const [name, setName] = useState(user.name);
  const [university, setUniversity] = useState(user.university);
  const [major, setMajor] = useState(user.major);
  const [studentId, setStudentId] = useState(user.studentId);
  const [dormitory, setDormitory] = useState(user.dormitory);
  const [roomNumber, setRoomNumber] = useState(user.roomNumber);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...user,
      name: name.trim(),
      university: university.trim(),
      major: major.trim(),
      studentId: studentId.trim(),
      dormitory: dormitory.trim(),
      roomNumber: roomNumber.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-right">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h2 className="font-black text-sm text-slate-900 dark:text-white">
              تنظیم مشخصات و اطلاعات دانشجو
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              نام و نام خانوادگی:
            </label>
            <input
              type="text"
              required
              placeholder="مثلاً: علی محمدی"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                دانشگاه:
              </label>
              <input
                type="text"
                placeholder="مثلاً: دانشگاه تهران"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                رشته تحصیلی:
              </label>
              <input
                type="text"
                placeholder="مثلاً: مهندسی صنایع"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                شماره دانشجویی (اختیاری):
              </label>
              <input
                type="text"
                placeholder="۴۰۱..."
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                شماره اتاق / بلوک:
              </label>
              <input
                type="text"
                placeholder="اتاق ۲۰۳"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              نام خوابگاه (در صورت سکونت در خوابگاه):
            </label>
            <input
              type="text"
              placeholder="مثلاً: خوابگاه کوی دانشگاه / خوابگاه شهید چمران"
              value={dormitory}
              onChange={(e) => setDormitory(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
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
              className="px-5 py-2.5 rounded-lg text-white bg-[#FF4B26] hover:bg-[#E83C18] font-bold shadow-xs cursor-pointer"
            >
              ذخیره اطلاعات
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
