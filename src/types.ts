export type Priority = 'low' | 'medium' | 'high' | 'normal';
export type TaskType = 'homework' | 'project' | 'exam' | 'study';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  courseName?: string;
  courseCode?: string;
  date: string; // YYYY-MM-DD or Jalali
  time?: string; // e.g. "1:30 PM" or "13:30"
  priority: Priority;
  done: boolean;
  notes?: string;
  relativeDue?: string; // e.g. "In 2 days"
}

export interface CourseSchedule {
  day: number; // 0: Mon/Sat, etc.
  dayName?: string; // "Mon", "Tue", ...
  startTime: string; // 10:00
  endTime: string; // 11:30
  room: string;
  status?: 'done' | 'upcoming';
}

export interface Course {
  id: string;
  name: string;
  code: string; // CS201
  professor: string;
  credits: number; // 3 credits
  units: number;
  color: string;
  iconName?: string; // 'code' | 'bar-chart' | 'calculator' | 'atom' | 'feather'
  progress: number; // 0 to 100
  currentGrade?: number;
  schedule: CourseSchedule[];
}

export interface StudyLog {
  id: string;
  durationMinutes: number;
  courseName: string;
  timestamp: number;
  date: string;
}

export type MarketCategory = 
  | 'dorm_essentials'   // لوازم خوابگاهی (قابلمه، اتو، کتری، پلوپز...)
  | 'engineering_tools'  // ابزار مهندسی و معماری (ماشین حساب، تخته رسم، راپید...)
  | 'books_notes'        // کتاب، جزوه و حل‌المسائل
  | 'electronics'        // دیجیتال و لوازم جانبی (کابل، مانیتور، شارژر...)
  | 'lab_medical';       // پزشکی و آزمایشگاه (روپوش، گوشی، عینک...)

export type DealType = 'rent' | 'sell' | 'both';

export interface MarketItem {
  id: string;
  title: string;
  category: MarketCategory;
  dealType: DealType;
  rentPriceDaily?: number; // تومان روزانه
  rentPriceWeekly?: number; // تومان هفتگی
  sellPrice?: number; // تومان برای خرید دائمی
  deposit?: number; // ودیعه ضمانت امانت
  dormLocation: string; // مثلاً: خوابگاه کوی چمران - بلوک ۳
  condition: 'در حد نو' | 'تمیز و سالم' | 'کارکرده';
  description: string;
  image: string;
  ownerName: string;
  ownerDorm: string;
  ownerMajor: string;
  contactTelegram?: string;
  contactPhone?: string;
  status: 'available' | 'rented' | 'reserved';
  createdAt: string;
  views: number;
}

export interface NeedRequest {
  id: string;
  title: string;
  category: MarketCategory;
  campusDorm: string;
  budgetOffer: string; // مثلا: ۳۰ هزار تومن روزانه یا امانت با شیرینی!
  timeNeeded: string; // مثلا: فردا صبح تا ظهر
  studentName: string;
  studentMajor: string;
  contactTelegram?: string;
  contactPhone?: string;
  responsesCount: number;
  createdAt: string;
  status: 'open' | 'fulfilled';
}

export interface UserProfile {
  name: string;
  studentId: string;
  university: string;
  major: string;
  dormitory: string;
  roomNumber: string;
  avatar: string;
}

// ==========================================
// MODULE 1: Academic Resources & Notes Library
// ==========================================

export type ResourceFileType = 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'image' | 'other';
export type ResourceVisibility = 'private' | 'link' | 'public';

export interface ResourceNote {
  id: string;
  resourceId: string;
  pageNumber: number;
  content: string;
  author: string;
  createdAt: string;
  color?: 'yellow' | 'green' | 'blue' | 'pink' | 'purple';
}

export interface AcademicResource {
  id: string;
  title: string;
  fileName: string;
  fileType: ResourceFileType;
  mimeType: string;
  fileSize: number; // in bytes
  fileSizeFormatted: string; // e.g. "2.4 MB"
  uploadDate: string; // YYYY-MM-DD
  courseId: string;
  courseCode: string;
  courseName: string;
  description: string;
  tags: string[];
  folder?: string;
  ownerName: string;
  isFavorite: boolean;
  visibility: ResourceVisibility;
  shareToken: string;
  downloadAllowed: boolean;
  pageCount?: number;
  // File payload: stored as base64 data URL or blob URL
  fileDataUrl?: string;
  // Text preview or mock page content for rich in-app rendering
  samplePages?: { pageNumber: number; title: string; text: string; diagramType?: string }[];
}

export interface ResourceFolder {
  id: string;
  name: string;
  nameFa: string;
  courseId?: string;
  color: string;
}

// ==========================================
// MODULE 2: Intelligent Semester Health Score
// ==========================================

export type AcademicHealthStatus = 'excellent' | 'good' | 'needs_attention' | 'at_risk';

export interface IndicatorDetail {
  id: 'assignment' | 'exam' | 'study_goal' | 'course_progress';
  name: string;
  nameFa: string;
  originalWeight: number; // e.g. 0.25 (25%)
  normalizedWeight: number; // adjusted if other metrics missing
  score: number; // 0 - 100
  isAvailable: boolean;
  missingReason?: string;
  missingReasonFa?: string;
  metricLabel: string;
  metricLabelFa: string;
  summary: string;
  summaryFa: string;
  status: 'good' | 'warning' | 'danger';
}

export interface ScoreRecommendation {
  id: string;
  indicatorId: 'assignment' | 'exam' | 'study_goal' | 'course_progress';
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  impactPts: number;
  priority: 'high' | 'medium' | 'low';
  actionLabel: string;
  actionLabelFa: string;
  actionTab?: string;
}

export interface ScoreSnapshot {
  week: number;
  weekLabel: string;
  weekLabelFa: string;
  date: string;
  score: number;
  status: AcademicHealthStatus;
}

export interface SemesterHealthScoreData {
  overallScore: number; // 0 - 100
  status: AcademicHealthStatus;
  statusLabel: string;
  statusLabelFa: string;
  statusDescription: string;
  statusDescriptionFa: string;
  indicators: {
    assignment: IndicatorDetail;
    exam: IndicatorDetail;
    studyGoal: IndicatorDetail;
    courseProgress: IndicatorDetail;
  };
  hasMissingData: boolean;
  activeWeightsSum: number; // e.g. 1.0 or 0.75
  recommendations: ScoreRecommendation[];
  historySnapshots: ScoreSnapshot[];
  weeklyComparison: {
    diff: number; // e.g. +5 or -3
    trend: 'up' | 'down' | 'stable';
    previousScore: number;
  };
  weeklyGoalHours: number;
}
