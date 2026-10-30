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
