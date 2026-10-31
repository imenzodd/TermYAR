import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Folder,
  Tag,
  Lock,
  Globe,
  Link,
  Trash2,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { AcademicResource, Course, ResourceFileType, ResourceVisibility } from '../types';
import { formatBytes } from '../utils/resourceStorage';

interface UploadResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  userName: string;
  onAddResource: (newResource: AcademicResource) => void;
  lang?: 'en' | 'fa';
}

interface PendingUploadItem {
  id: string;
  file: File;
  title: string;
  courseId: string;
  folder: string;
  tagsString: string;
  description: string;
  visibility: ResourceVisibility;
  downloadAllowed: boolean;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  errorMessage?: string;
  dataUrl?: string;
}

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.pptx', '.xlsx', '.png', '.jpg', '.jpeg'];
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export const UploadResourceModal: React.FC<UploadResourceModalProps> = ({
  isOpen,
  onClose,
  courses,
  userName,
  onAddResource,
  lang = 'en',
}) => {
  if (!isOpen) return null;

  const isFa = lang === 'fa';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [queue, setQueue] = useState<PendingUploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Common default folder presets
  const folderPresets = [
    { en: 'Lectures & Slides', fa: 'جزوات و اسلایدها' },
    { en: 'Summaries & Cheat Sheets', fa: 'خلاصه و فرمول‌ها' },
    { en: 'Past Exams & Solutions', fa: 'نمونه سوالات و حل' },
    { en: 'Lab & Projects', fa: 'آزمایشگاه و پروژه‌ها' },
  ];

  const detectFileType = (fileName: string, mimeType: string): ResourceFileType => {
    const ext = fileName.toLowerCase().split('.').pop() || '';
    if (ext === 'pdf' || mimeType.includes('pdf')) return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'docx';
    if (['ppt', 'pptx'].includes(ext)) return 'pptx';
    if (['xls', 'xlsx'].includes(ext)) return 'xlsx';
    if (['png', 'jpg', 'jpeg', 'webp'].includes(ext) || mimeType.startsWith('image/')) return 'image';
    return 'other';
  };

  const handleFilesSelected = (files: FileList | File[]) => {
    const newItems: PendingUploadItem[] = [];

    Array.from(files).forEach((file) => {
      const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();

      // Size Validation
      if (file.size > MAX_FILE_SIZE_BYTES) {
        alert(
          isFa
            ? `فایل ${file.name} از حداکثر حجم مجاز (۲۵ مگابایت) بزرگ‌تر است.`
            : `File ${file.name} exceeds the 25 MB maximum size limit.`
        );
        return;
      }

      // Extension Validation
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        alert(
          isFa
            ? `فرمت فایل ${file.name} پشتیبانی نمی‌شود. فقط فرمت‌های PDF, DOCX, PPTX, XLSX, PNG, JPG مجاز هستند.`
            : `File format ${ext} is not supported. Allowed formats: PDF, DOCX, PPTX, XLSX, PNG, JPG.`
        );
        return;
      }

      const defaultCourse = courses[0];
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

      newItems.push({
        id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        file,
        title: cleanTitle,
        courseId: defaultCourse?.id || '',
        folder: isFa ? 'جزوات و اسلایدها' : 'Lectures & Slides',
        tagsString: 'Course Material, University',
        description: '',
        visibility: 'link',
        downloadAllowed: true,
        progress: 0,
        status: 'pending',
      });
    });

    if (newItems.length > 0) {
      setQueue((prev) => [...prev, ...newItems]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleUpdateItem = (id: string, updates: Partial<PendingUploadItem>) => {
    setQueue((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const handleRemoveFromQueue = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  // Start Uploading Queue
  const handleStartUpload = async () => {
    if (queue.length === 0) return;
    setIsProcessing(true);

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      if (item.status === 'completed') continue;

      // Update item to uploading
      handleUpdateItem(item.id, { status: 'uploading', progress: 25 });

      // Read file into DataURL
      const readPromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('File read failure'));
        reader.readAsDataURL(item.file);
      });

      try {
        // Progress simulation
        await new Promise((r) => setTimeout(r, 200));
        handleUpdateItem(item.id, { progress: 65 });

        const dataUrl = await readPromise;
        await new Promise((r) => setTimeout(r, 200));
        handleUpdateItem(item.id, { progress: 100, status: 'completed', dataUrl });

        // Build completed AcademicResource
        const selectedCourse = courses.find((c) => c.id === item.courseId);
        const tags = item.tagsString
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);

        const newResource: AcademicResource = {
          id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title: item.title || item.file.name,
          fileName: item.file.name,
          fileType: detectFileType(item.file.name, item.file.type),
          mimeType: item.file.type || 'application/octet-stream',
          fileSize: item.file.size,
          fileSizeFormatted: formatBytes(item.file.size),
          uploadDate: new Date().toISOString().split('T')[0],
          courseId: selectedCourse?.id || 'c-gen',
          courseCode: selectedCourse?.code || 'GEN',
          courseName: selectedCourse?.name || 'General Academic',
          description: item.description || `Uploaded university study material: ${item.title}`,
          tags: tags.length > 0 ? tags : ['Study Resource'],
          folder: item.folder,
          ownerName: userName || 'Alex Morgan',
          isFavorite: false,
          visibility: item.visibility,
          shareToken: `token_${Math.random().toString(36).substring(2, 10)}`,
          downloadAllowed: item.downloadAllowed,
          pageCount: 3,
          fileDataUrl: dataUrl,
          samplePages: [
            {
              pageNumber: 1,
              title: item.title,
              text: item.description || `Uploaded academic file: ${item.file.name}\nSize: ${formatBytes(item.file.size)}\nCourse: ${selectedCourse?.name || 'General'}\nReady for student reading and annotation.`,
            },
          ],
        };

        onAddResource(newResource);
      } catch (err: any) {
        handleUpdateItem(item.id, {
          status: 'error',
          errorMessage: isFa ? 'خطا در بارگذاری فایل' : 'Upload failed',
        });
      }
    }

    setIsProcessing(false);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isFa ? 'بارگذاری منابع درسی و جزوه' : 'Upload Academic Materials'}
              </h3>
              <p className="text-xs text-slate-400">
                {isFa ? 'پشتیبانی از PDF, DOCX, PPTX, XLSX و تصاویر تا ۲۵ مگابایت' : 'Supported formats: PDF, DOCX, PPTX, XLSX, Images (Max 25MB)'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept=".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.png,.jpg,.jpeg"
              onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              {isFa ? 'فایل‌ها را به اینجا بکشید یا برای انتخاب کلیک کنید' : 'Drag & drop files here, or browse files'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {isFa
                ? 'جزوات دست‌نویس، اسلایدهای اساتید، حل‌المسائل و کتابچه‌های فرمول'
                : 'Lecture notes, professor slides, solution manuals, and formula cheat sheets'}
            </p>
          </div>

          {/* Pending Upload Queue */}
          {queue.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {isFa ? `فایل‌های آماده بارگذاری (${queue.length})` : `Upload Queue (${queue.length})`}
                </span>
                <button
                  onClick={() => setQueue([])}
                  className="text-xs text-rose-500 hover:underline"
                >
                  {isFa ? 'پاک کردن لیست' : 'Clear all'}
                </button>
              </div>

              <div className="space-y-3">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                            {item.file.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatBytes(item.file.size)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.status === 'completed' && (
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{isFa ? 'تکمیل شد' : 'Done'}</span>
                          </span>
                        )}
                        {item.status === 'uploading' && (
                          <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>{item.progress}%</span>
                          </span>
                        )}
                        {item.status === 'pending' && (
                          <button
                            onClick={() => handleRemoveFromQueue(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Metadata fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          {isFa ? 'عنوان نمایشی' : 'Display Title'}
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          {isFa ? 'درس مرتبط' : 'Associated Course'}
                        </label>
                        <select
                          value={item.courseId}
                          onChange={(e) => handleUpdateItem(item.id, { courseId: e.target.value })}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                        >
                          {courses.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.code} - {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          {isFa ? 'پوشه یا دسته‌بندی' : 'Folder Category'}
                        </label>
                        <select
                          value={item.folder}
                          onChange={(e) => handleUpdateItem(item.id, { folder: e.target.value })}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                        >
                          {folderPresets.map((f, idx) => (
                            <option key={idx} value={isFa ? f.fa : f.en}>
                              {isFa ? f.fa : f.en}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          {isFa ? 'برچسب‌ها (با کاما جدا کنید)' : 'Tags (Comma separated)'}
                        </label>
                        <input
                          type="text"
                          value={item.tagsString}
                          onChange={(e) => handleUpdateItem(item.id, { tagsString: e.target.value })}
                          placeholder="Midterm, Formulas, Summary"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
          >
            {isFa ? 'انصراف' : 'Cancel'}
          </button>

          <button
            onClick={handleStartUpload}
            disabled={queue.length === 0 || isProcessing}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
          >
            {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>
              {isFa
                ? `تایید و ذخیره در آرشیو (${queue.length})`
                : `Upload to Vault (${queue.length})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
