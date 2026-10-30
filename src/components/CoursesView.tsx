import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit3, Award, Clock, MapPin, X } from 'lucide-react';
import { Course } from '../types';
import { toPersianDigits } from '../utils/persian';

interface CoursesViewProps {
  courses: Course[];
  onAddCourse: (course: Course) => void;
  onUpdateCourseProgress: (courseId: string, progress: number) => void;
  onDeleteCourse: (courseId: string) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  onAddCourse,
  onUpdateCourseProgress,
  onDeleteCourse,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [professor, setProfessor] = useState('');
  const [units, setUnits] = useState(3);
  const [color, setColor] = useState('#4f46e5');
  const [currentGrade, setCurrentGrade] = useState(17);

  const totalUnits = courses.reduce((acc, c) => acc + c.units, 0);
  const avgProgress = courses.length
    ? Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)
    : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newCourse: Course = {
      id: `c_${Date.now()}`,
      name: name.trim(),
      code: name.trim().slice(0, 4).toUpperCase() + '101',
      professor: professor.trim() || 'نامشخص',
      credits: Number(units),
      units: Number(units),
      color,
      progress: 0,
      currentGrade: Number(currentGrade),
      schedule: [],
    };
    onAddCourse(newCourse);
    setName('');
    setProfessor('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>دروس و نمرات ترم جاری</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مجموعاً {toPersianDigits(courses.length)} درس ثبت شده ({toPersianDigits(totalUnits)} واحد تحصیلی)
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن درس جدید</span>
        </button>
      </div>

      {/* Course Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">تعداد واحدهای انتخابی</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
            {toPersianDigits(totalUnits)} واحد
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">میانگین پیشرفت سرفصل‌ها</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 tabular-nums">
            {toPersianDigits(avgProgress)}٪
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">وضعیت سرفصل دروس</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            مناسب و در حال پیشرفت
          </div>
        </div>
      </div>

      {/* Courses List */}
      {courses.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
            هنوز درسی برای این ترم اضافه نکرده‌اید
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            با کلیک روی دکمه زیر، اولین درس (نام درس، تعداد واحد و نام استاد) را ثبت کنید تا برنامه هفتگی و پیشرفت شما فعال شود.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 cursor-pointer"
          >
            + افزودن اولین درس ترم
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
                  style={{ backgroundColor: course.color }}
                >
                  {course.units}و
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {course.name}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    استاد: {course.professor} · {toPersianDigits(course.units)} واحد
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm(`آیا از حذف درس ${course.name} اطمینان دارید؟`)) {
                    onDeleteCourse(course.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                title="حذف درس"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  پیشرفت تدریس / مطالعه سرفصل‌ها:
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {toPersianDigits(course.progress)}٪
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={course.progress}
                onChange={(e) => onUpdateCourseProgress(course.id, Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
              />
            </div>

            {/* Estimated Grade & Classroom Schedule */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>نمره تخمینی: </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                  {toPersianDigits(course.currentGrade || 16)} از ۲۰
                </span>
              </div>

              <span>{toPersianDigits(course.schedule.length)} جلسه در هفته</span>
            </div>
          </div>
        ))}
      </div>
    )}

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-black text-sm text-slate-900 dark:text-white">
                ثبت درس جدید ترم
              </span>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نام درس:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: ریاضی مهندسی"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نام استاد:
                </label>
                <input
                  type="text"
                  placeholder="دکتر ..."
                  value={professor}
                  onChange={(e) => setProfessor(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تعداد واحد:
                  </label>
                  <select
                    value={units}
                    onChange={(e) => setUnits(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
                  >
                    {[1, 2, 3, 4].map((u) => (
                      <option key={u} value={u}>
                        {toPersianDigits(u)} واحد
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    هدف نمره:
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="20"
                    value={currentGrade}
                    onChange={(e) => setCurrentGrade(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رنگ برچسب درس:
                </label>
                <div className="flex items-center gap-2">
                  {['#4f46e5', '#0891b2', '#ea580c', '#059669', '#db2777', '#7c3aed'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        color === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
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
                  ذخیره درس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
