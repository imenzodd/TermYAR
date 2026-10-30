import React, { useState } from 'react';
import { CalendarDays, Clock, MapPin, User, Plus, X } from 'lucide-react';
import { Course, CourseSchedule } from '../types';
import { PERSIAN_DAYS, getJalaliWeekDays, toPersianDigits } from '../utils/persian';

interface WeeklyScheduleViewProps {
  courses: Course[];
  onAddScheduleSlot: (courseId: string, slot: CourseSchedule) => void;
}

export const WeeklyScheduleView: React.FC<WeeklyScheduleViewProps> = ({
  courses,
  onAddScheduleSlot,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [selectedDay, setSelectedDay] = useState(0);
  const [startTime, setStartTime] = useState('10:30');
  const [endTime, setEndTime] = useState('12:00');
  const [room, setRoom] = useState('کلاس ۱۰۲ تالارها');

  const weekDays = getJalaliWeekDays();
  const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

  // Flatten all class schedules with course info
  const scheduledClasses: Array<{
    course: Course;
    schedule: CourseSchedule;
  }> = [];

  courses.forEach((course) => {
    course.schedule.forEach((sch) => {
      scheduledClasses.push({ course, schedule: sch });
    });
  });

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;
    onAddScheduleSlot(selectedCourseId, {
      day: Number(selectedDay),
      startTime,
      endTime,
      room,
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>برنامه هفتگی و کلاسی دانشگاه</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مشاهده زمان‌بندی دقیق کلاس‌ها، اساتید و شماره اتاق‌ها در طول هفته
          </p>
        </div>

        <button
          onClick={() => {
            if (courses.length === 0) {
              alert('برای تنظیم ساعات برنامه هفتگی، لطفاً ابتدا حداقل یک درس را از بخش «دروس و نمرات» اضافه نمایید.');
              return;
            }
            setShowAddModal(true);
          }}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن کلاس به برنامه</span>
        </button>
      </div>

      {/* Week Calendar Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 text-center bg-slate-50 dark:bg-slate-800/50">
          {weekDays.map((d) => (
            <div
              key={d.name}
              className={`p-3 border-l border-slate-200 dark:border-slate-800 last:border-l-0 ${
                d.isToday ? 'bg-indigo-50/70 dark:bg-indigo-950/40 font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="block text-xs font-bold">{d.name}</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">{d.dateStr}</span>
            </div>
          ))}
        </div>

        {/* Calendar Body: 7 Days Columns */}
        <div className="grid grid-cols-7 min-h-[460px] divide-x divide-x-reverse divide-slate-100 dark:divide-slate-800/80">
          {weekDays.map((d) => {
            const dayClasses = scheduledClasses.filter((c) => c.schedule.day === d.dayIndex);

            return (
              <div
                key={d.name}
                className={`p-2 space-y-2 min-h-full ${
                  d.isToday ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''
                }`}
              >
                {dayClasses.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[11px] text-slate-300 dark:text-slate-600">
                    بدون کلاس
                  </div>
                ) : (
                  dayClasses.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl text-right shadow-sm border transition-transform hover:-translate-y-0.5"
                      style={{
                        backgroundColor: `${item.course.color}15`,
                        borderColor: `${item.course.color}40`,
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.course.color }}
                        />
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {item.course.name}
                        </h4>
                      </div>

                      <div className="mt-1.5 space-y-1 text-[10px] text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="tabular-nums">
                            {toPersianDigits(item.schedule.startTime)} - {toPersianDigits(item.schedule.endTime)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.schedule.room}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 truncate">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.course.professor}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-black text-sm text-slate-900 dark:text-white">
                ثبت ساعت کلاسی جدید
              </span>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  درس مربوطه:
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.professor})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  روز هفته:
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
                >
                  {PERSIAN_DAYS.map((day, idx) => (
                    <option key={day} value={idx}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ساعت شروع:
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ساعت پایان:
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  محل کلاس یا دانشکده:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: کلاس ۱۰۲ تالارها یا سایت ۲"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-bold"
                >
                  ثبت در تقویم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
