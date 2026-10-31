import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  Printer,
  Share2,
  BookOpen,
  MessageSquare,
  Plus,
  Trash2,
  Lock,
  Globe,
  Link,
  Check,
  Copy,
  Tag,
  Folder,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { AcademicResource, ResourceNote, ResourceVisibility } from '../types';
import { deleteNoteFromVault, saveNoteToVault } from '../utils/resourceStorage';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: AcademicResource | null;
  notes: ResourceNote[];
  onRefreshNotes: () => void;
  onUpdateResource: (updated: AcademicResource) => void;
  lang?: 'en' | 'fa';
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  resource,
  notes,
  onRefreshNotes,
  onUpdateResource,
  lang = 'en',
}) => {
  if (!isOpen || !resource) return null;

  const isFa = lang === 'fa';
  const totalPages = resource.pageCount || (resource.samplePages ? resource.samplePages.length : 1);

  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100); // 75, 100, 125, 150
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'notes' | 'share' | 'outline'>('notes');

  // New Note Form State
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteColor, setNewNoteColor] = useState<'yellow' | 'green' | 'blue' | 'pink' | 'purple'>('yellow');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Share State
  const [shareVisibility, setShareVisibility] = useState<ResourceVisibility>(resource.visibility || 'private');
  const [downloadAllowed, setDownloadAllowed] = useState<boolean>(resource.downloadAllowed ?? true);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
    setZoomLevel(100);
    setShareVisibility(resource.visibility || 'private');
    setDownloadAllowed(resource.downloadAllowed ?? true);
  }, [resource.id]);

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(200, prev + 25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(50, prev - 25));
  const handleZoomReset = () => setZoomLevel(100);

  // Page handlers
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  const handleJumpToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // Download handler
  const handleDownload = () => {
    if (!downloadAllowed && shareVisibility !== 'private') {
      alert(isFa ? 'امکان دانلود توسط مالک منبع محدود شده است.' : 'Downloading has been restricted by the owner.');
      return;
    }

    if (resource.fileDataUrl) {
      const a = document.createElement('a');
      a.href = resource.fileDataUrl;
      a.download = resource.fileName;
      a.click();
    } else {
      // Generate clean text/markdown download for sample files
      const blobContent = `# ${resource.title}\nCourse: ${resource.courseCode} - ${resource.courseName}\nUploaded: ${resource.uploadDate}\n\n${
        resource.samplePages?.map((p) => `--- Page ${p.pageNumber}: ${p.title} ---\n${p.text}\n`).join('\n') || resource.description
      }`;
      const blob = new Blob([blobContent], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resource.fileName.replace(/\.[^/.]+$/, '') + '.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Add Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    setIsSubmittingNote(true);

    const newNote: ResourceNote = {
      id: `note-${Date.now()}`,
      resourceId: resource.id,
      pageNumber: currentPage,
      content: newNoteContent.trim(),
      author: 'Alex Morgan',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      color: newNoteColor,
    };

    await saveNoteToVault(newNote);
    onRefreshNotes();
    setNewNoteContent('');
    setIsSubmittingNote(false);
  };

  // Delete Note
  const handleDeleteNote = async (noteId: string) => {
    await deleteNoteFromVault(noteId);
    onRefreshNotes();
  };

  // Update Share Settings
  const handleSaveShareSettings = () => {
    const updated: AcademicResource = {
      ...resource,
      visibility: shareVisibility,
      downloadAllowed,
    };
    onUpdateResource(updated);
  };

  // Copy share URL
  const shareUrl = `${window.location.origin}/#share=${resource.shareToken}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Revoke Link
  const handleRevokeShare = () => {
    const updated: AcademicResource = {
      ...resource,
      visibility: 'private',
      shareToken: `token_${Math.random().toString(36).substring(2, 9)}`,
    };
    setShareVisibility('private');
    onUpdateResource(updated);
  };

  // Current page data
  const pageData = resource.samplePages?.find((p) => p.pageNumber === currentPage);
  const pageNotes = notes.filter((n) => n.resourceId === resource.id && n.pageNumber === currentPage);
  const allResourceNotes = notes.filter((n) => n.resourceId === resource.id);

  // Note color mapping
  const getColorStyles = (color?: string) => {
    switch (color) {
      case 'yellow':
        return 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200';
      case 'green':
        return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200';
      case 'blue':
        return 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200';
      case 'pink':
        return 'bg-pink-50 dark:bg-pink-950/40 border-pink-300 dark:border-pink-800 text-pink-900 dark:text-pink-200';
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-200';
      default:
        return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl w-full h-[96vh] flex flex-col overflow-hidden">
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          {/* Document metadata info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white truncate max-w-sm sm:max-w-md">
                  {resource.title}
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                  {resource.courseCode}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {resource.fileName} • {resource.fileSizeFormatted}
              </p>
            </div>
          </div>

          {/* Center: Page Navigation Controls */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="p-1 rounded hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 text-xs">
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => handleJumpToPage(parseInt(e.target.value, 10))}
                className="w-10 text-center bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-xs text-white"
              />
              <span className="text-slate-400">/ {totalPages}</span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="p-1 rounded hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Tools: Zoom, Print, Download, Notes Drawer, Close */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 border border-slate-700/80 rounded-xl px-2 py-1 text-xs">
              <button onClick={handleZoomOut} className="p-1 rounded hover:bg-slate-700 text-slate-300" title="Zoom Out">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleZoomReset} className="px-1.5 py-0.5 text-[11px] font-mono text-slate-300 hover:text-white" title="Reset 100%">
                {zoomLevel}%
              </button>
              <button onClick={handleZoomIn} className="p-1 rounded hover:bg-slate-700 text-slate-300" title="Zoom In">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownload}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
              title="Download File"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors hidden sm:flex"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Notes & Share Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                sidebarOpen
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{isFa ? 'یادداشت‌ها و اشتراک' : 'Notes & Share'}</span>
              {allResourceNotes.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-indigo-700 text-[10px] font-bold flex items-center justify-center">
                  {allResourceNotes.length}
                </span>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body: Document Viewer Canvas + Collapsible Notes/Share Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas Viewport */}
          <div className="flex-1 overflow-auto bg-slate-950 p-6 flex flex-col items-center justify-start relative">
            {/* If native file data URL is present and is image */}
            {resource.fileType === 'image' && resource.fileDataUrl ? (
              <div
                className="transition-transform duration-200 shadow-2xl rounded-2xl overflow-hidden bg-white"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              >
                <img src={resource.fileDataUrl} alt={resource.title} className="max-w-3xl w-full object-contain" />
              </div>
            ) : resource.fileDataUrl && resource.fileType === 'pdf' ? (
              /* Embedded PDF iframe */
              <div
                className="w-full max-w-4xl h-full shadow-2xl rounded-2xl overflow-hidden bg-white border border-slate-800"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              >
                <iframe src={resource.fileDataUrl} title={resource.title} className="w-full h-full border-0" />
              </div>
            ) : (
              /* Rich Styled Slide / Document Page Renderer */
              <div
                className="w-full max-w-3xl transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              >
                <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 min-h-[640px] flex flex-col justify-between relative">
                  {/* Slide Header */}
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
                          {resource.courseCode} • {resource.courseName}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {resource.folder || 'Lecture Material'}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-400">
                        {isFa ? `صفحه ${currentPage} از ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                      </span>
                    </div>

                    {/* Page Content */}
                    <div className="space-y-6">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                        {pageData?.title || `${resource.title} — Page ${currentPage}`}
                      </h2>

                      {/* Main Text Content */}
                      <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 font-sans">
                        {pageData?.text || resource.description}
                      </div>

                      {/* Visual Diagram Box for technical lectures */}
                      {pageData?.diagramType && (
                        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                          <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block">
                            {isFa ? 'نمودار و دیاگرام مفهومی' : 'Conceptual Architecture Diagram'}
                          </span>
                          <div className="p-4 bg-white rounded-xl border border-indigo-200/60 font-mono text-xs text-indigo-700 flex items-center justify-center text-center">
                            {pageData.diagramType === 'tree' && (
                              <div className="space-y-1">
                                <div>[ Root: 50 ]</div>
                                <div>/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \</div>
                                <div>[ L: 25 ] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ R: 75 ]</div>
                              </div>
                            )}
                            {pageData.diagramType === 'bst' && (
                              <div>LeftSubtree(k) &lt; Node(k) &lt; RightSubtree(k) • O(log N) Search</div>
                            )}
                            {pageData.diagramType === 'avl' && (
                              <div>BalanceFactor(node) = Height(Left) - Height(Right) ∈ &#123;-1, 0, 1&#125;</div>
                            )}
                            {pageData.diagramType === 'graph' && (
                              <div>Adjacency Matrix: O(V²) &nbsp;|&nbsp; Adjacency List: O(V + E)</div>
                            )}
                            {pageData.diagramType === 'dijkstra' && (
                              <div>PriorityQueue(dist, vertex) • Relaxation: if d[u] + w(u,v) &lt; d[v] update</div>
                            )}
                            {pageData.diagramType === 'summary' && (
                              <div>Formula & Midterm Synthesis Sheet • TermYar Academic Engine</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Slide Footer */}
                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>{resource.ownerName} • TermYar Academic Vault</span>
                    <span className="font-semibold text-slate-500">
                      {currentPage} / {totalPages}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Notes & Annotations / Share Settings */}
          {sidebarOpen && (
            <div className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
              {/* Sidebar Tabs */}
              <div className="flex border-b border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setActiveSidebarTab('notes')}
                  className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 ${
                    activeSidebarTab === 'notes'
                      ? 'border-b-2 border-indigo-500 text-indigo-400 font-bold bg-slate-800/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isFa ? 'یادداشت‌ها' : 'Notes'}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                    {pageNotes.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveSidebarTab('share')}
                  className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 ${
                    activeSidebarTab === 'share'
                      ? 'border-b-2 border-indigo-500 text-indigo-400 font-bold bg-slate-800/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isFa ? 'اشتراک‌گذاری' : 'Share'}</span>
                </button>
                <button
                  onClick={() => setActiveSidebarTab('outline')}
                  className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 ${
                    activeSidebarTab === 'outline'
                      ? 'border-b-2 border-indigo-500 text-indigo-400 font-bold bg-slate-800/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isFa ? 'صفحات' : 'Outline'}</span>
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeSidebarTab === 'notes' && (
                  <>
                    {/* Add note on this page form */}
                    <form onSubmit={handleAddNote} className="space-y-3 bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">
                          {isFa ? `ثبت یادداشت برای صفحه ${currentPage}` : `Add note for page ${currentPage}`}
                        </span>
                        {/* Highlight Color Picker */}
                        <div className="flex items-center gap-1">
                          {(['yellow', 'green', 'blue', 'pink', 'purple'] as const).map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setNewNoteColor(color)}
                              className={`w-4 h-4 rounded-full transition-transform ${
                                color === 'yellow'
                                  ? 'bg-amber-400'
                                  : color === 'green'
                                  ? 'bg-emerald-400'
                                  : color === 'blue'
                                  ? 'bg-indigo-400'
                                  : color === 'pink'
                                  ? 'bg-pink-400'
                                  : 'bg-purple-400'
                              } ${newNoteColor === color ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                            />
                          ))}
                        </div>
                      </div>

                      <textarea
                        rows={3}
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        placeholder={
                          isFa
                            ? 'نکته استاد، یادداشت امتحانی یا حاشیه‌نویسی...'
                            : 'Write a lecture comment, exam tip or highlight note...'
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                      />

                      <button
                        type="submit"
                        disabled={!newNoteContent.trim() || isSubmittingNote}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isFa ? 'افزودن یادداشت' : 'Save Annotation'}</span>
                      </button>
                    </form>

                    {/* Notes List */}
                    <div className="space-y-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        {isFa ? 'تمام یادداشت‌های این سند' : 'All Notes in Document'} ({allResourceNotes.length})
                      </span>

                      {allResourceNotes.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-xs">
                          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p>{isFa ? 'هنوز یادداشتی ثبت نشده است.' : 'No notes added to this document yet.'}</p>
                        </div>
                      ) : (
                        allResourceNotes.map((note) => {
                          const isCurrent = note.pageNumber === currentPage;
                          return (
                            <div
                              key={note.id}
                              className={`p-3 rounded-2xl border transition-all ${
                                isCurrent
                                  ? 'bg-slate-800 border-indigo-500/60 shadow-sm'
                                  : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <button
                                  onClick={() => setCurrentPage(note.pageNumber)}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500 hover:text-white transition-colors"
                                >
                                  {isFa ? `صفحه ${note.pageNumber}` : `Page ${note.pageNumber}`}
                                </button>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-slate-400">{note.createdAt}</span>
                                  <button
                                    onClick={() => handleDeleteNote(note.id)}
                                    className="text-slate-500 hover:text-rose-400 transition-colors"
                                    title="Delete Note"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                                {note.content}
                              </p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </>
                )}

                {activeSidebarTab === 'share' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-white block">
                        {isFa ? 'تنظیمات دسترسی و اشتراک‌گذاری' : 'Access & Sharing Controls'}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        {isFa
                          ? 'سطح دسترسی این جزوه را مشخص کنید تا هم‌دانشگاهی‌های شما بهره‌مند شوند.'
                          : 'Control who can view and download this academic material.'}
                      </p>
                    </div>

                    {/* Visibility Options */}
                    <div className="space-y-2">
                      <label
                        onClick={() => setShareVisibility('private')}
                        className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-colors ${
                          shareVisibility === 'private'
                            ? 'bg-slate-800 border-indigo-500'
                            : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {isFa ? 'شخصی (فقط من)' : 'Private (Only Me)'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {isFa ? 'فقط در حساب کاربری شما قابل مشاهده است.' : 'Only visible to your TermYar account.'}
                          </span>
                        </div>
                      </label>

                      <label
                        onClick={() => setShareVisibility('link')}
                        className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-colors ${
                          shareVisibility === 'link'
                            ? 'bg-slate-800 border-indigo-500'
                            : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        <Link className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {isFa ? 'اشتراک با لینک اختصاصی' : 'Share via Secure Link'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {isFa ? 'هر کسی توکن لینک را داشته باشد می‌تواند جزوه را ببیند.' : 'Anyone with the secret link token can read.'}
                          </span>
                        </div>
                      </label>

                      <label
                        onClick={() => setShareVisibility('public')}
                        className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-colors ${
                          shareVisibility === 'public'
                            ? 'bg-slate-800 border-indigo-500'
                            : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        <Globe className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {isFa ? 'عمومی در کتابخانه دانشگاه' : 'Public in University Library'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {isFa ? 'قابل جستجو برای تمام دانشجویان در تب بازارچه و منابع.' : 'Listed in public university notes library.'}
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Download Permission Toggle */}
                    <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {isFa ? 'اجازه دانلود فایل' : 'Allow File Download'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isFa ? 'بینندگان می‌توانند نسخه اصلی را ذخیره کنند' : 'Viewers can download source file'}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={downloadAllowed}
                        onChange={(e) => setDownloadAllowed(e.target.checked)}
                        className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                      />
                    </div>

                    {/* Share Link Box */}
                    {shareVisibility !== 'private' && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-300 block">
                          {isFa ? 'لینک اشتراک‌گذاری' : 'Shareable Link'}
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-[11px] font-mono text-slate-300 truncate"
                          />
                          <button
                            onClick={handleCopyLink}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copySuccess ? (isFa ? 'کپی شد' : 'Copied') : (isFa ? 'کپی' : 'Copy')}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={handleSaveShareSettings}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
                      >
                        {isFa ? 'ذخیره تنظیمات دسترسی' : 'Save Access Rules'}
                      </button>

                      {shareVisibility !== 'private' && (
                        <button
                          onClick={handleRevokeShare}
                          className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold transition-colors"
                          title="Revoke and make private"
                        >
                          {isFa ? 'ابطال لینک' : 'Revoke'}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {activeSidebarTab === 'outline' && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      {isFa ? 'فهرست صفحات سند' : 'Document Outline'}
                    </span>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      const pageTitle = resource.samplePages?.find((p) => p.pageNumber === pageNum)?.title || `Page ${pageNum}`;
                      const isCurrent = currentPage === pageNum;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-colors flex items-center justify-between ${
                            isCurrent
                              ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                              : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="truncate max-w-[200px]">
                            <span className="font-mono text-indigo-400 mr-2">#{pageNum}</span>
                            <span>{pageTitle}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
