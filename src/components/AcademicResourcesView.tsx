import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  FileText,
  UploadCloud,
  Search,
  Filter,
  Star,
  Folder,
  Tag,
  Share2,
  Trash2,
  Eye,
  Download,
  Lock,
  Globe,
  Link,
  HardDrive,
  Clock,
  Sparkles,
  LayoutGrid,
  List,
  ArrowUpDown,
  Plus,
  ChevronRight,
  FileSpreadsheet,
  Presentation,
  Image,
  AlertCircle,
  FolderPlus,
} from 'lucide-react';
import { AcademicResource, Course, ResourceFileType } from '../types';
import { formatBytes } from '../utils/resourceStorage';

interface AcademicResourcesViewProps {
  resources: AcademicResource[];
  courses: Course[];
  lang?: 'en' | 'fa';
  onOpenUploadModal: () => void;
  onOpenResourceViewer: (resource: AcademicResource) => void;
  onToggleFavorite: (resourceId: string) => void;
  onDeleteResource: (resourceId: string) => void;
  onQuickShare: (resource: AcademicResource) => void;
}

export const AcademicResourcesView: React.FC<AcademicResourcesViewProps> = ({
  resources,
  courses,
  lang = 'en',
  onOpenUploadModal,
  onOpenResourceViewer,
  onToggleFavorite,
  onDeleteResource,
  onQuickShare,
}) => {
  const isFa = lang === 'fa';

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedFolderFilter, setSelectedFolderFilter] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'title' | 'size'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Compute stats
  const totalFiles = resources.length;
  const totalStorageBytes = resources.reduce((acc, r) => acc + (r.fileSize || 0), 0);
  const totalStorageFormatted = formatBytes(totalStorageBytes);
  const favoriteCount = resources.filter((r) => r.isFavorite).length;

  // Extract distinct folders
  const allFolders = useMemo(() => {
    const set = new Set<string>();
    resources.forEach((r) => {
      if (r.folder) set.add(r.folder);
    });
    return Array.from(set);
  }, [resources]);

  // Filter and sort resources
  const filteredResources = useMemo(() => {
    return resources
      .filter((res) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = res.title.toLowerCase().includes(q);
          const matchFile = res.fileName.toLowerCase().includes(q);
          const matchCourse = res.courseCode.toLowerCase().includes(q) || res.courseName.toLowerCase().includes(q);
          const matchDesc = res.description.toLowerCase().includes(q);
          const matchTags = res.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchFile && !matchCourse && !matchDesc && !matchTags) return false;
        }

        // Course filter
        if (selectedCourseFilter !== 'all' && res.courseId !== selectedCourseFilter && res.courseCode !== selectedCourseFilter) {
          return false;
        }

        // Type filter
        if (selectedTypeFilter !== 'all') {
          if (selectedTypeFilter === 'pdf' && res.fileType !== 'pdf') return false;
          if (selectedTypeFilter === 'docs' && res.fileType !== 'docx') return false;
          if (selectedTypeFilter === 'slides' && res.fileType !== 'pptx') return false;
          if (selectedTypeFilter === 'sheets' && res.fileType !== 'xlsx') return false;
          if (selectedTypeFilter === 'images' && res.fileType !== 'image') return false;
        }

        // Folder filter
        if (selectedFolderFilter !== 'all' && res.folder !== selectedFolderFilter) {
          return false;
        }

        // Favorite filter
        if (onlyFavorites && !res.isFavorite) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'newest') return (b.uploadDate || '').localeCompare(a.uploadDate || '');
        if (sortOption === 'oldest') return (a.uploadDate || '').localeCompare(b.uploadDate || '');
        if (sortOption === 'title') return a.title.localeCompare(b.title);
        if (sortOption === 'size') return (b.fileSize || 0) - (a.fileSize || 0);
        return 0;
      });
  }, [resources, searchQuery, selectedCourseFilter, selectedTypeFilter, selectedFolderFilter, onlyFavorites, sortOption]);

  // Helper for file type icon
  const renderFileTypeIcon = (type: ResourceFileType) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'pptx':
        return <Presentation className="w-5 h-5 text-amber-500" />;
      case 'xlsx':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case 'image':
        return <Image className="w-5 h-5 text-purple-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-slate-500" />;
    }
  };

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60">
            <Globe className="w-3 h-3" />
            <span>{isFa ? 'عمومی' : 'Public'}</span>
          </span>
        );
      case 'link':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60">
            <Link className="w-3 h-3" />
            <span>{isFa ? 'با لینک' : 'Link'}</span>
          </span>
        );
      case 'private':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <Lock className="w-3 h-3" />
            <span>{isFa ? 'شخصی' : 'Private'}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isFa ? 'منابع درسی و جزوات' : 'Academic Resources'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isFa
              ? 'آرشیو سازمان‌یافته، مطالعه درون‌برنامه‌ای PDF و حاشیه‌نویسی جزوات درسی'
              : 'Organized academic vault, in-browser PDF reader, and collaborative annotations'}
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>{isFa ? 'بارگذاری منبع جدید' : 'Upload Resource'}</span>
        </button>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Files */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{isFa ? 'کل منابع' : 'Total Resources'}</span>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalFiles}</span>
            <span className="text-xs text-slate-400">{isFa ? 'فایل' : 'files'}</span>
          </div>
        </div>

        {/* Storage Used */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{isFa ? 'فضای مصرفی' : 'Storage Used'}</span>
            <HardDrive className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalStorageFormatted}</span>
            <span className="text-xs text-slate-400">/ 500 MB</span>
          </div>
        </div>

        {/* Favorite Resources */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{isFa ? 'علاقه‌مندی‌ها' : 'Favorites'}</span>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{favoriteCount}</span>
            <span className="text-xs text-slate-400">{isFa ? 'جزوه برگزیده' : 'starred'}</span>
          </div>
        </div>

        {/* Active Courses */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{isFa ? 'دروس متصل' : 'Linked Courses'}</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{courses.length}</span>
            <span className="text-xs text-slate-400">{isFa ? 'واحد دانشگاهی' : 'courses'}</span>
          </div>
        </div>
      </div>

      {/* 3. Search Bar, Filters & View Switcher */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs space-y-4">
        {/* Row 1: Search and Main Sort/View controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isFa
                  ? 'جستجو در عنوان جزوه، کد درس، نام استاد، برچسب‌ها...'
                  : 'Search by file name, course code, tags, notes...'
              }
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            )}
          </div>

          {/* Right: Sort and Grid/List switcher */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Favorites Toggle */}
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                onlyFavorites
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-700 dark:text-amber-300'
                  : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current' : ''}`} />
              <span>{isFa ? 'فقط ستاره‌دار' : 'Favorites'}</span>
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortOption}
              onChange={(e: any) => setSortOption(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="newest">{isFa ? 'جدیدترین' : 'Newest'}</option>
              <option value="oldest">{isFa ? 'قدیمی‌ترین' : 'Oldest'}</option>
              <option value="title">{isFa ? 'عنوان (الف-ی)' : 'Title A-Z'}</option>
              <option value="size">{isFa ? 'بزرگترین حجم' : 'File Size'}</option>
            </select>

            {/* Grid / List view toggle */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Course Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 font-semibold shrink-0 text-[11px] uppercase tracking-wider">
            {isFa ? 'درس:' : 'Course:'}
          </span>
          <button
            onClick={() => setSelectedCourseFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors ${
              selectedCourseFilter === 'all'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {isFa ? 'همه دروس' : 'All Courses'}
          </button>
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourseFilter(course.id)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors ${
                selectedCourseFilter === course.id
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {course.code}
            </button>
          ))}
        </div>

        {/* Row 3: File Type Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-slate-400 font-semibold shrink-0 text-[11px] uppercase tracking-wider">
            {isFa ? 'نوع فایل:' : 'Format:'}
          </span>
          {[
            { id: 'all', label: isFa ? 'همه فرمت‌ها' : 'All Formats' },
            { id: 'pdf', label: 'PDF' },
            { id: 'docs', label: 'Word (DOCX)' },
            { id: 'slides', label: 'Slides (PPTX)' },
            { id: 'sheets', label: 'Excel (XLSX)' },
            { id: 'images', label: isFa ? 'تصاویر' : 'Images' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedTypeFilter(type.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedTypeFilter === type.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Resources Cards Grid or List */}
      {filteredResources.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isFa ? 'منبعی با این مشخصات یافت نشد' : 'No matching resources found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {isFa
              ? 'می‌توانید فیلترها را ریست کنید یا با بارگذاری اسلایدها و جزوات جدید، آرشیو ترم را غنی کنید.'
              : 'Try clearing filters or upload new lecture slides and study guides.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCourseFilter('all');
              setSelectedTypeFilter('all');
              setOnlyFavorites(false);
            }}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-200"
          >
            {isFa ? 'پاک کردن فیلترها' : 'Reset all filters'}
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all hover:border-indigo-300 dark:hover:border-indigo-800 flex flex-col justify-between group"
            >
              <div>
                {/* Card Top: Format icon + Course tag + Favorite star */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700/60">
                      {renderFileTypeIcon(res.fileType)}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                        {res.courseCode}
                      </span>
                      {res.folder && (
                        <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                          {res.folder}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleFavorite(res.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        res.isFavorite
                          ? 'text-amber-500 hover:text-amber-600'
                          : 'text-slate-300 hover:text-amber-400 dark:text-slate-600'
                      }`}
                      title="Toggle Favorite"
                    >
                      <Star className={`w-4 h-4 ${res.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <h3
                  onClick={() => onOpenResourceViewer(res)}
                  className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors mb-2 leading-snug"
                >
                  {res.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {res.description}
                </p>

                {/* Tags */}
                {res.tags && res.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {res.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: Metadata + Action buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-600 dark:text-slate-400 text-[11px]">
                      {res.fileSizeFormatted}
                    </span>
                    {getVisibilityBadge(res.visibility)}
                  </div>
                  <span className="text-[10px] text-slate-400 block">{res.uploadDate}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onQuickShare(res)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-colors"
                    title="Share link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteResource(res.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenResourceViewer(res)}
                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 text-indigo-600 dark:text-indigo-400 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isFa ? 'مطالعه' : 'Read'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => onToggleFavorite(res.id)}
                  className={`p-1 rounded transition-colors shrink-0 ${
                    res.isFavorite ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
                  }`}
                >
                  <Star className={`w-4 h-4 ${res.isFavorite ? 'fill-current' : ''}`} />
                </button>

                <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {renderFileTypeIcon(res.fileType)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      onClick={() => onOpenResourceViewer(res)}
                      className="text-xs font-bold text-slate-900 dark:text-white hover:text-indigo-600 cursor-pointer truncate"
                    >
                      {res.title}
                    </h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 shrink-0">
                      {res.courseCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-md">
                    {res.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {getVisibilityBadge(res.visibility)}
                <span className="text-xs font-mono text-slate-500 hidden sm:block">
                  {res.fileSizeFormatted}
                </span>
                <span className="text-[11px] text-slate-400 hidden md:block">
                  {res.uploadDate}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onQuickShare(res)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600"
                    title="Share"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteResource(res.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onOpenResourceViewer(res)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    {isFa ? 'مطالعه' : 'Read'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
