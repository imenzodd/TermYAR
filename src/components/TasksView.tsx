import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Calendar, Clock, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Priority, Task, TaskType } from '../types';
import { toPersianDigits } from '../utils/persian';

interface TasksViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenNewTaskModal: (defaultType?: TaskType) => void;
  isExamOnly?: boolean;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onOpenNewTaskModal,
  isExamOnly = false,
}) => {
  const [filterType, setFilterType] = useState<string>(isExamOnly ? 'exam' : 'all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTasks = tasks.filter((task) => {
    if (isExamOnly && task.type !== 'exam') return false;
    if (!isExamOnly && filterType !== 'all' && task.type !== filterType) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (filterStatus === 'pending' && task.done) return false;
    if (filterStatus === 'done' && !task.done) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>{isExamOnly ? 'تقویم و برنامه امتحانات ترم' : 'تکالیف، پروژه‌ها و مهلت‌ها'}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isExamOnly
              ? 'برنامه‌ریزی و آماده‌سازی برای امتحانات میان‌ترم و پایان‌ترم'
              : 'لیست وظایف با اولویت‌بندی، تاریخ تحویل و وضعیت انجام'}
          </p>
        </div>

        <button
          onClick={() => onOpenNewTaskModal(isExamOnly ? 'exam' : 'homework')}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isExamOnly ? 'ثبت تاریخ امتحان جدید' : 'افزودن کار یا تکلیف'}</span>
        </button>
      </div>

      {/* Filters Bar */}
      {!isExamOnly && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
          {/* Type Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
            {[
              { id: 'all', label: 'همه موارد' },
              { id: 'homework', label: 'تکالیف' },
              { id: 'project', label: 'پروژه‌ها' },
              { id: 'exam', label: 'امتحانات' },
              { id: 'study', label: 'مطالعه' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer font-medium ${
                  filterType === tab.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="pending">در حال انجام</option>
              <option value="done">انجام شده</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">همه اولویت‌ها</option>
              <option value="high">اولویت بالا</option>
              <option value="medium">اولویت متوسط</option>
              <option value="low">اولویت کم</option>
            </select>
          </div>
        </div>
      )}

      {/* Task Rows List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="font-bold text-sm">هیچ موردی با این فیلتر ثبت نشده است.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                task.done
                  ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => onToggleTask(task.id)}
                  className="w-5 h-5 rounded-md text-indigo-600 accent-indigo-600 cursor-pointer mt-0.5 shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <h3 className={`font-bold text-sm leading-snug ${
                    task.done ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'
                  }`}>
                    {task.title}
                  </h3>

                  {task.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {task.notes}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {task.courseName && (
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        درس: {task.courseName}
                      </span>
                    )}
                    <span className="flex items-center gap-1 tabular-nums">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {toPersianDigits(task.date)}
                    </span>
                    {task.time && (
                      <span className="flex items-center gap-1 tabular-nums">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        ساعت {toPersianDigits(task.time)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Badges & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  task.priority === 'high'
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                    : task.priority === 'medium'
                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  اولویت {task.priority === 'high' ? 'زیاد' : task.priority === 'medium' ? 'متوسط' : 'کم'}
                </span>

                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                  task.type === 'homework'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                    : task.type === 'project'
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                    : task.type === 'exam'
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}>
                  {task.type === 'homework' ? 'تکلیف' : task.type === 'project' ? 'پروژه' : task.type === 'exam' ? 'امتحان' : 'مطالعه'}
                </span>

                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  title="حذف کار"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
