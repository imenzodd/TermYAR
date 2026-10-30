import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, Clock } from 'lucide-react';
import { Priority, Task, TaskType, Course } from '../types';
import { getTodayJalaliString } from '../utils/persian';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
  courses: Course[];
  initialType?: TaskType;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  courses,
  initialType = 'homework',
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TaskType>(initialType);
  const [courseName, setCourseName] = useState(courses[0]?.name || '');
  const [date, setDate] = useState(getTodayJalaliString());
  const [time, setTime] = useState('18:00');
  const [priority, setPriority] = useState<Priority>('medium');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: `t_${Date.now()}`,
      title: title.trim(),
      type,
      courseName: courseName || undefined,
      date,
      time,
      priority,
      done: false,
      notes: notes.trim() || undefined,
    };

    onAddTask(newTask);
    onClose();
    setTitle('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-right">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            <h2 className="font-black text-sm text-slate-900 dark:text-white">
              ثبت مورد جدید (تکلیف، پروژه، امتحان)
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
              عنوان کار:
            </label>
            <input
              type="text"
              required
              placeholder="مثلاً: حل تمرین فصل ۳ فیزیک یا امتحان میان‌ترم"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                نوع:
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="homework">تکلیف</option>
                <option value="project">پروژه</option>
                <option value="exam">امتحان</option>
                <option value="study">مطالعه</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                درس مرتبط:
              </label>
              <select
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
                <option value="">سایر / غیر درسی</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                تاریخ شمسی:
              </label>
              <input
                type="text"
                placeholder="۱۴۰۴/۰۸/۲۴"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                ساعت:
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              اولویت:
            </label>
            <div className="flex items-center gap-2">
              {[
                { id: 'low', label: 'کم' },
                { id: 'medium', label: 'متوسط' },
                { id: 'high', label: 'بالا و فوری' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id as Priority)}
                  className={`flex-1 py-2 rounded-xl font-bold cursor-pointer transition-all ${
                    priority === p.id
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              یادداشت یا توضیحات:
            </label>
            <textarea
              rows={2}
              placeholder="مثلاً: سوالات ۲ تا ۵ تمرین یا جزوه دکتر سهرابی..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              ذخیره در برنامه
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
