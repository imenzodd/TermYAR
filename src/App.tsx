import React, { useState, useEffect, useMemo } from 'react';
import {
  initialCourses,
  initialMarketItems,
  initialNeedRequests,
  initialProfile,
  initialTasks,
} from './data/initialData';
import {
  AcademicResource,
  Course,
  CourseSchedule,
  MarketItem,
  NeedRequest,
  ResourceNote,
  StudyLog,
  Task,
  TaskType,
  UserProfile,
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { MarketplaceView } from './components/MarketplaceView';
import { NeedRequestsView } from './components/NeedRequestsView';
import { WeeklyScheduleView } from './components/WeeklyScheduleView';
import { CoursesView } from './components/CoursesView';
import { TasksView } from './components/TasksView';
import { FocusTimerView } from './components/FocusTimerView';
import { FavoritesView } from './components/FavoritesView';
import { SettingsView } from './components/SettingsView';
import { AcademicResourcesView } from './components/AcademicResourcesView';
import { PdfViewerModal } from './components/PdfViewerModal';
import { UploadResourceModal } from './components/UploadResourceModal';
import { SemesterHealthScoreModal } from './components/SemesterHealthScoreModal';
import { SemesterHealthScoreCard } from './components/SemesterHealthScoreCard';
import { MonetizationPitchModal } from './components/MonetizationPitchModal';
import { NewTaskModal } from './components/NewTaskModal';
import { NewMarketItemModal } from './components/NewMarketItemModal';
import { NewNeedRequestModal } from './components/NewNeedRequestModal';
import { ProfileModal } from './components/ProfileModal';
import {
  loadAllResources,
  saveResourceToVault,
  deleteResourceFromVault,
  loadResourceNotes,
} from './utils/resourceStorage';
import { calculateSemesterHealthScore } from './utils/healthScoreCalculator';

export default function App() {
  // Language state (default 'en' matching the mockup screenshot, toggleable to 'fa')
  const [lang, setLang] = useState<'en' | 'fa'>(() => {
    return (localStorage.getItem('ty_lang') as 'en' | 'fa') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('ty_lang', lang);
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('ty_dark_mode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ty_dark_mode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ty_profile_v6');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  // Courses
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('ty_courses_v6');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  // Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('ty_tasks_v6');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  // Market Items
  const [marketItems, setMarketItems] = useState<MarketItem[]>(() => {
    const saved = localStorage.getItem('ty_market_v6');
    return saved ? JSON.parse(saved) : initialMarketItems;
  });

  // Need Requests
  const [needRequests, setNeedRequests] = useState<NeedRequest[]>(() => {
    const saved = localStorage.getItem('ty_needs_v6');
    return saved ? JSON.parse(saved) : initialNeedRequests;
  });

  // Study sessions
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>(() => {
    const saved = localStorage.getItem('ty_study_v6');
    return saved ? JSON.parse(saved) : [];
  });

  // Favorite Items (Marketplace items, courses, tasks)
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ty_favs_v6');
    return saved ? JSON.parse(saved) : ['m-1', 'c-1', 't-1'];
  });

  // Modals state
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskInitialType, setNewTaskInitialType] = useState<TaskType>('homework');
  const [isNewMarketModalOpen, setIsNewMarketModalOpen] = useState(false);
  const [isNewNeedModalOpen, setIsNewNeedModalOpen] = useState(false);
  const [isMonetizationModalOpen, setIsMonetizationModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem('ty_profile_v6', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ty_tasks_v6', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('ty_courses_v6', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('ty_market_v6', JSON.stringify(marketItems));
  }, [marketItems]);

  useEffect(() => {
    localStorage.setItem('ty_needs_v6', JSON.stringify(needRequests));
  }, [needRequests]);

  useEffect(() => {
    localStorage.setItem('ty_study_v6', JSON.stringify(studyLogs));
  }, [studyLogs]);

  // Academic Resources Vault & Notes state
  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [notes, setNotes] = useState<ResourceNote[]>([]);
  const [selectedViewerResource, setSelectedViewerResource] = useState<AcademicResource | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [weeklyGoalHours, setWeeklyGoalHours] = useState<number>(() => {
    const saved = localStorage.getItem('ty_goal_hours');
    return saved ? parseInt(saved, 10) : 15;
  });

  useEffect(() => {
    localStorage.setItem('ty_goal_hours', String(weeklyGoalHours));
  }, [weeklyGoalHours]);

  // Load vault resources and notes on mount
  useEffect(() => {
    loadAllResources().then(setResources);
    loadResourceNotes().then(setNotes);
  }, []);

  const handleRefreshNotes = () => {
    loadResourceNotes().then(setNotes);
  };

  const handleToggleFavoriteResource = async (id: string) => {
    setResources((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));
      const target = updated.find((r) => r.id === id);
      if (target) saveResourceToVault(target);
      return updated;
    });
  };

  const handleDeleteResource = async (id: string) => {
    await deleteResourceFromVault(id);
    setResources((prev) => prev.filter((r) => r.id !== id));
    if (selectedViewerResource?.id === id) {
      setSelectedViewerResource(null);
    }
  };

  const handleAddResource = async (newResource: AcademicResource) => {
    await saveResourceToVault(newResource);
    setResources((prev) => [newResource, ...prev.filter((r) => r.id !== newResource.id)]);
  };

  const handleUpdateResource = async (updatedResource: AcademicResource) => {
    await saveResourceToVault(updatedResource);
    setResources((prev) => prev.map((r) => (r.id === updatedResource.id ? updatedResource : r)));
    if (selectedViewerResource?.id === updatedResource.id) {
      setSelectedViewerResource(updatedResource);
    }
  };

  // Deterministic Semester Health Score calculation
  const healthData = useMemo(() => {
    return calculateSemesterHealthScore(tasks, courses, studyLogs, weeklyGoalHours, lang);
  }, [tasks, courses, studyLogs, weeklyGoalHours, lang]);

  // Favorite toggle handler
  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Reset to Mockup Demo Data
  const handleResetToSampleData = () => {
    setUser(initialProfile);
    setCourses(initialCourses);
    setTasks(initialTasks);
    setMarketItems(initialMarketItems);
    setNeedRequests(initialNeedRequests);
    setFavoriteIds(['m-1', 'c-1']);
  };

  // Clear all data (blank slate)
  const handleClearAllData = () => {
    setUser({
      name: '',
      studentId: '',
      university: '',
      major: '',
      dormitory: '',
      roomNumber: '',
      avatar: '👨‍🎓',
    });
    setCourses([]);
    setTasks([]);
    setMarketItems([]);
    setNeedRequests([]);
    setStudyLogs([]);
    setFavoriteIds([]);
  };

  // Handlers
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses((prev) => [...prev, newCourse]);
  };

  const handleUpdateCourseProgress = (courseId: string, progress: number) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, progress } : c))
    );
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  const handleAddScheduleSlot = (courseId: string, slot: CourseSchedule) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          return { ...c, schedule: [...c.schedule, slot] };
        }
        return c;
      })
    );
  };

  const handleAddMarketItem = (newItem: MarketItem) => {
    setMarketItems((prev) => [newItem, ...prev]);
  };

  const handleAddNeedRequest = (newNeed: NeedRequest) => {
    setNeedRequests((prev) => [newNeed, ...prev]);
  };

  const handleRespondToNeed = (requestId: string) => {
    setNeedRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, responsesCount: r.responsesCount + 1 } : r
      )
    );
  };

  const handleAddStudyLog = (log: StudyLog) => {
    setStudyLogs((prev) => [log, ...prev]);
  };

  const openNewTaskModal = (type: TaskType = 'homework') => {
    setNewTaskInitialType(type);
    setIsNewTaskModalOpen(true);
  };

  const pendingTasksCount = tasks.filter((t) => !t.done).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-row">
      {/* 1. Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openNeedsCount={needRequests.length}
        marketItemsCount={marketItems.length}
        pendingTasksCount={pendingTasksCount}
        user={user}
        lang={lang}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* 2. Main Content Flow (Header + Dynamic Dashboard) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          user={user}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          lang={lang}
          setLang={setLang}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onOpenNewTaskModal={() => openNewTaskModal('homework')}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              user={user}
              tasks={tasks}
              courses={courses}
              marketItems={marketItems}
              needRequests={needRequests}
              lang={lang}
              healthData={healthData}
              onOpenHealthModal={() => setIsHealthModalOpen(true)}
              onToggleTask={handleToggleTask}
              onNavigateTab={(tab) => {
                if (tab === 'health_score') {
                  setIsHealthModalOpen(true);
                  return;
                }
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenNewTaskModal={() => openNewTaskModal('homework')}
              onOpenNewMarketModal={() => setIsNewMarketModalOpen(true)}
              onOpenProfileModal={() => setIsProfileModalOpen(true)}
            />
          )}

          {activeTab === 'resources' && (
            <AcademicResourcesView
              resources={resources}
              courses={courses}
              lang={lang}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onOpenResourceViewer={(res) => setSelectedViewerResource(res)}
              onToggleFavorite={handleToggleFavoriteResource}
              onDeleteResource={handleDeleteResource}
              onQuickShare={(res) => setSelectedViewerResource(res)}
            />
          )}

          {activeTab === 'health_score' && (
            <div className="space-y-6">
              <SemesterHealthScoreCard
                healthData={healthData}
                lang={lang}
                onOpenAnalysisModal={() => setIsHealthModalOpen(true)}
                onNavigateTab={(tab: string) => setActiveTab(tab)}
              />
            </div>
          )}

          {activeTab === 'marketplace' && (
            <MarketplaceView
              items={marketItems}
              onOpenNewModal={() => setIsNewMarketModalOpen(true)}
              onOpenNeedRequestTab={() => setActiveTab('need_requests')}
              searchQuery={searchQuery}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeTab === 'favorites' && (
            <FavoritesView
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
              marketItems={marketItems}
              courses={courses}
              tasks={tasks}
              lang={lang}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              user={user}
              onSaveProfile={setUser}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              lang={lang}
              setLang={setLang}
              onResetToSampleData={handleResetToSampleData}
              onClearAllData={handleClearAllData}
            />
          )}

          {activeTab === 'need_requests' && (
            <NeedRequestsView
              requests={needRequests}
              onOpenNewNeedModal={() => setIsNewNeedModalOpen(true)}
              onRespondToNeed={handleRespondToNeed}
            />
          )}

          {activeTab === 'schedule' && (
            <WeeklyScheduleView
              courses={courses}
              onAddScheduleSlot={handleAddScheduleSlot}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesView
              courses={courses}
              onAddCourse={handleAddCourse}
              onUpdateCourseProgress={handleUpdateCourseProgress}
              onDeleteCourse={handleDeleteCourse}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onOpenNewTaskModal={openNewTaskModal}
              isExamOnly={false}
            />
          )}

          {activeTab === 'exams' && (
            <TasksView
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onOpenNewTaskModal={() => openNewTaskModal('exam')}
              isExamOnly={true}
            />
          )}

          {(activeTab === 'timer' || activeTab === 'statistics' || activeTab === 'reports') && (
            <FocusTimerView
              courses={courses}
              studyLogs={studyLogs}
              onAddStudyLog={handleAddStudyLog}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAddTask={handleAddTask}
        courses={courses}
        initialType={newTaskInitialType}
      />

      <NewMarketItemModal
        isOpen={isNewMarketModalOpen}
        onClose={() => setIsNewMarketModalOpen(false)}
        onAddItem={handleAddMarketItem}
        userDorm={user.dormitory || 'خوابگاه دانشجو'}
        userName={user.name || 'Alex Morgan'}
      />

      <NewNeedRequestModal
        isOpen={isNewNeedModalOpen}
        onClose={() => setIsNewNeedModalOpen(false)}
        onAddNeed={handleAddNeedRequest}
        userDorm={user.dormitory || 'خوابگاه دانشجو'}
        userName={user.name || 'Alex Morgan'}
      />

      <MonetizationPitchModal
        isOpen={isMonetizationModalOpen}
        onClose={() => setIsMonetizationModalOpen(false)}
        onGoToMarket={() => setActiveTab('marketplace')}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onSaveProfile={setUser}
      />

      {/* Module 1: PDF & Document Reader with Notes & Sharing */}
      <PdfViewerModal
        isOpen={!!selectedViewerResource}
        onClose={() => setSelectedViewerResource(null)}
        resource={selectedViewerResource}
        notes={notes}
        onRefreshNotes={handleRefreshNotes}
        onUpdateResource={handleUpdateResource}
        lang={lang}
      />

      {/* Module 1: Upload Academic Resource Modal */}
      <UploadResourceModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        courses={courses}
        userName={user.name || 'Alex Morgan'}
        onAddResource={handleAddResource}
        lang={lang}
      />

      {/* Module 2: Intelligent Semester Health Score Diagnostics Modal */}
      <SemesterHealthScoreModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
        healthData={healthData}
        lang={lang}
        onNavigateTab={(tab) => {
          setIsHealthModalOpen(false);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onUpdateGoalHours={(hours) => setWeeklyGoalHours(hours)}
      />
    </div>
  );
}
