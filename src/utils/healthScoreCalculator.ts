import {
  AcademicHealthStatus,
  Course,
  IndicatorDetail,
  ScoreRecommendation,
  ScoreSnapshot,
  SemesterHealthScoreData,
  StudyLog,
  Task,
} from '../types';

export function calculateSemesterHealthScore(
  tasks: Task[],
  courses: Course[],
  studyLogs: StudyLog[],
  weeklyGoalHours: number = 15,
  lang: 'en' | 'fa' = 'en'
): SemesterHealthScoreData {
  const isFa = lang === 'fa';

  // 1. Indicator 1: Assignment Completion (Weight: 25%)
  const assignmentTasks = tasks.filter((t) => t.type === 'homework' || t.type === 'project');
  let assignmentScore = 0;
  let assignmentAvailable = assignmentTasks.length > 0;
  const completedAssignments = assignmentTasks.filter((t) => t.done).length;

  if (assignmentAvailable) {
    assignmentScore = Math.round((completedAssignments / assignmentTasks.length) * 100);
  }

  const assignmentIndicator: IndicatorDetail = {
    id: 'assignment',
    name: 'Assignment Completion',
    nameFa: 'تکمیل تکالیف و پروژه‌ها',
    originalWeight: 0.25,
    normalizedWeight: 0.25,
    score: assignmentScore,
    isAvailable: assignmentAvailable,
    missingReason: 'No homework or project tasks recorded yet.',
    missingReasonFa: 'هنوز هیچ تکلیف یا پروژه‌ای ثبت نشده است. با افزودن تکالیف، این شاخص فعال می‌شود.',
    metricLabel: `${completedAssignments} of ${assignmentTasks.length} completed`,
    metricLabelFa: `${completedAssignments} از ${assignmentTasks.length} تکلیف انجام شده`,
    summary: assignmentAvailable
      ? `${assignmentScore}% of assigned coursework submitted`
      : 'Awaiting assignment entries',
    summaryFa: assignmentAvailable
      ? `${assignmentScore}٪ از تکالیف و تمرین‌ها تحویل داده شده`
      : 'در انتظار ثبت تکالیف',
    status: !assignmentAvailable
      ? 'warning'
      : assignmentScore >= 80
      ? 'good'
      : assignmentScore >= 60
      ? 'warning'
      : 'danger',
  };

  // 2. Indicator 2: Exam Readiness (Weight: 30%)
  const examTasks = tasks.filter((t) => t.type === 'exam');
  let examAvailable = examTasks.length > 0;
  let examScore = 0;

  if (examAvailable) {
    let totalExamReadiness = 0;

    examTasks.forEach((exam) => {
      if (exam.done) {
        totalExamReadiness += 100;
        return;
      }

      // Check corresponding course progress
      const course = courses.find(
        (c) =>
          (exam.courseCode && c.code.toLowerCase() === exam.courseCode.toLowerCase()) ||
          (exam.courseName && c.name.toLowerCase() === exam.courseName.toLowerCase())
      );
      const courseProgress = course ? course.progress : 50;

      // Check study time dedicated to this course
      const courseStudyMins = studyLogs
        .filter((l) => course && l.courseName.toLowerCase().includes(course.code.toLowerCase()))
        .reduce((acc, curr) => acc + curr.durationMinutes, 0);

      // Estimate remaining urgency: parse relativeDue or default
      let urgencyFactor = 1.0;
      if (exam.relativeDue) {
        const match = exam.relativeDue.match(/\d+/);
        const daysLeft = match ? parseInt(match[0], 10) : 7;
        if (daysLeft <= 2) {
          urgencyFactor = courseStudyMins >= 120 || courseProgress >= 70 ? 0.95 : 0.65;
        } else if (daysLeft <= 5) {
          urgencyFactor = courseStudyMins >= 60 || courseProgress >= 60 ? 0.9 : 0.75;
        } else {
          urgencyFactor = 0.85 + (courseProgress / 100) * 0.15;
        }
      }

      const singleReadiness = Math.min(100, Math.round(courseProgress * 0.6 + Math.min(40, courseStudyMins / 3) * urgencyFactor));
      totalExamReadiness += Math.max(25, singleReadiness);
    });

    examScore = Math.round(totalExamReadiness / examTasks.length);
  }

  const examIndicator: IndicatorDetail = {
    id: 'exam',
    name: 'Exam Readiness',
    nameFa: 'آمادگی برای امتحانات',
    originalWeight: 0.3,
    normalizedWeight: 0.3,
    score: examScore,
    isAvailable: examAvailable,
    missingReason: 'No upcoming exams currently on your schedule.',
    missingReasonFa: 'هیچ آزمون یا امتحانی در تقویم ثبت نشده است. با ثبت میان‌ترم‌ها این شاخص فعال می‌شود.',
    metricLabel: `${examTasks.length} exam${examTasks.length === 1 ? '' : 's'} tracked`,
    metricLabelFa: `${examTasks.length} آزمون در حال پایش`,
    summary: examAvailable
      ? `Preparedness index: ${examScore}/100 based on study logs & course mastery`
      : 'No scheduled exams found',
    summaryFa: examAvailable
      ? `شاخص آمادگی: ${examScore} از ۱۰۰ بر اساس ساعات مطالعه و پیشرفت سرفصل‌ها`
      : 'آزمونی برای پایش یافت نشد',
    status: !examAvailable
      ? 'warning'
      : examScore >= 75
      ? 'good'
      : examScore >= 55
      ? 'warning'
      : 'danger',
  };

  // 3. Indicator 3: Study Goal Achievement (Weight: 20%)
  const totalStudyMinutes = studyLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const targetStudyMinutes = Math.max(60, weeklyGoalHours * 60);
  // Default sample simulation fallback if no logs: 14h 20m from mockup
  const effectiveStudyMinutes = totalStudyMinutes > 0 ? totalStudyMinutes : 860; // 14h 20m
  const studyGoalScore = Math.min(100, Math.round((effectiveStudyMinutes / targetStudyMinutes) * 100));
  const studyHoursFormatted = (effectiveStudyMinutes / 60).toFixed(1);

  const studyGoalIndicator: IndicatorDetail = {
    id: 'study_goal',
    name: 'Study Goal Achievement',
    nameFa: 'تحقق هدف هفتگی مطالعه',
    originalWeight: 0.2,
    normalizedWeight: 0.2,
    score: studyGoalScore,
    isAvailable: true,
    metricLabel: `${studyHoursFormatted}h / ${weeklyGoalHours}h target`,
    metricLabelFa: `${studyHoursFormatted} ساعت از هدف ${weeklyGoalHours} ساعته`,
    summary: `${studyGoalScore}% of weekly target completed`,
    summaryFa: `${studyGoalScore}٪ از برنامه مطالعه هفتگی پوشش داده شده`,
    status: studyGoalScore >= 80 ? 'good' : studyGoalScore >= 60 ? 'warning' : 'danger',
  };

  // 4. Indicator 4: Course Progress (Weight: 25%)
  const courseAvailable = courses.length > 0;
  let courseProgressScore = 0;
  if (courseAvailable) {
    const totalProgress = courses.reduce((acc, c) => acc + (c.progress || 0), 0);
    courseProgressScore = Math.round(totalProgress / courses.length);
  }

  const courseProgressIndicator: IndicatorDetail = {
    id: 'course_progress',
    name: 'Syllabus Coverage',
    nameFa: 'پوشش سرفصل دروس',
    originalWeight: 0.25,
    normalizedWeight: 0.25,
    score: courseProgressScore,
    isAvailable: courseAvailable,
    missingReason: 'No enrolled courses found.',
    missingReasonFa: 'هیچ درسی تعریف نشده است. با تعریف دروس این شاخص فعال خواهد شد.',
    metricLabel: `${courses.length} courses enrolled`,
    metricLabelFa: `${courses.length} درس فعال`,
    summary: courseAvailable
      ? `Average syllabus progress: ${courseProgressScore}%`
      : 'No active courses',
    summaryFa: courseAvailable
      ? `میانگین پیشرفت سرفصل‌ها: ${courseProgressScore}٪`
      : 'درسی تعریف نشده',
    status: !courseAvailable
      ? 'warning'
      : courseProgressScore >= 70
      ? 'good'
      : courseProgressScore >= 45
      ? 'warning'
      : 'danger',
  };

  // 5. Dynamic Weight Normalization for Missing Indicators
  const allIndicators = [
    assignmentIndicator,
    examIndicator,
    studyGoalIndicator,
    courseProgressIndicator,
  ];

  const availableIndicators = allIndicators.filter((ind) => ind.isAvailable);
  const activeWeightsSum = availableIndicators.reduce((acc, ind) => acc + ind.originalWeight, 0);
  const hasMissingData = availableIndicators.length < allIndicators.length;

  let weightedSum = 0;
  if (activeWeightsSum > 0) {
    availableIndicators.forEach((ind) => {
      ind.normalizedWeight = ind.originalWeight / activeWeightsSum;
      weightedSum += ind.score * ind.normalizedWeight;
    });
  } else {
    weightedSum = 0;
  }

  const overallScore = Math.min(100, Math.max(0, Math.round(weightedSum)));

  // 6. Academic Health Status Categorization
  let status: AcademicHealthStatus = 'at_risk';
  let statusLabel = 'At Risk';
  let statusLabelFa = 'در خطر (افت تحصیلی)';
  let statusDescription = 'Urgent intervention needed. Multiple academic indicators are falling behind schedule.';
  let statusDescriptionFa = 'نیازمند اقدام فوری! چندین شاخص کلیدی از روند مطلوب عقب مانده‌اند.';

  if (overallScore >= 90) {
    status = 'excellent';
    statusLabel = 'Excellent Pace';
    statusLabelFa = 'عالی و درخشان';
    statusDescription = 'Outstanding academic momentum. You are on track for high honors and honors GPA.';
    statusDescriptionFa = 'عملکرد تحصیلی فوق‌العاده! روند مطالعه و تکالیف شما برای معدل الف کاملاً هموار است.';
  } else if (overallScore >= 75) {
    status = 'good';
    statusLabel = 'Good Standing';
    statusLabelFa = 'وضعیت مطلوب و پایدار';
    statusDescription = 'Healthy academic rhythm. Core milestones and tasks are progressing reliably.';
    statusDescriptionFa = 'ریتم تحصیلی مناسب و باثبات. تکالیف و سرفصل‌ها طبق زمان‌بندی پیش می‌روند.';
  } else if (overallScore >= 60) {
    status = 'needs_attention';
    statusLabel = 'Needs Attention';
    statusLabelFa = 'نیازمند توجه و مراقبت';
    statusDescription = 'Early warnings detected. A few upcoming deadlines or study gaps require catching up.';
    statusDescriptionFa = 'هشدار زودهنگام! چند تکلیف عقب‌افتاده یا کاهش ساعت مطالعه نیازمند جبران است.';
  }

  // 7. Contextual Actionable Recommendations
  const recommendations: ScoreRecommendation[] = [];

  // Assignment recommendation
  if (assignmentAvailable && assignmentScore < 80) {
    const pendingHomeworks = assignmentTasks.filter((t) => !t.done);
    const topPending = pendingHomeworks[0];
    recommendations.push({
      id: 'rec-assignment',
      indicatorId: 'assignment',
      title: topPending ? `Submit ${topPending.title}` : 'Clear Pending Assignments',
      titleFa: topPending ? `ارسال و تکمیل ${topPending.title}` : 'تکمیل تکالیف باقی‌مانده',
      description: topPending
        ? `Completing this assignment will raise your completion rate and boost overall score by +5 pts.`
        : 'Submitting overdue assignments will immediately improve your score.',
      descriptionFa: topPending
        ? `با انجام و ثبت این تکلیف، امتیاز سلامت ترم شما حدود ۵ نمره افزایش می‌یابد.`
        : 'تحویل تکالیف باقی‌مانده فوراً وضعیت تحصیلی شما را ارتقا می‌دهد.',
      impactPts: 5,
      priority: 'high',
      actionLabel: 'View Assignments',
      actionLabelFa: 'مشاهده تکالیف',
      actionTab: 'tasks',
    });
  }

  // Exam recommendation
  if (examAvailable && examScore < 75) {
    const upcomingExam = examTasks.find((t) => !t.done);
    recommendations.push({
      id: 'rec-exam',
      indicatorId: 'exam',
      title: upcomingExam ? `Prepare for ${upcomingExam.title}` : 'Boost Exam Preparedness',
      titleFa: upcomingExam ? `مرور و آمادگی برای ${upcomingExam.title}` : 'تقویت آمادگی برای امتحانات',
      description: upcomingExam
        ? `Log a 45-minute focused session for ${upcomingExam.courseCode || 'your upcoming exam'} to raise readiness.`
        : 'Schedule dedicated revision slots for upcoming midterms.',
      descriptionFa: upcomingExam
        ? `یک پارت ۴۵ دقیقه‌ای پومودورو برای درس ${upcomingExam.courseCode || 'آزمون پیش‌رو'} اختصاص دهید.`
        : 'پارت‌های مرور دوره‌ای برای امتحانات ثبت نمایید.',
      impactPts: 6,
      priority: 'high',
      actionLabel: 'Open Study Timer',
      actionLabelFa: 'شروع تایمر مطالعه',
      actionTab: 'timer',
    });
  }

  // Study goal recommendation
  if (studyGoalScore < 80) {
    const deficitHours = Math.max(1, (targetStudyMinutes - effectiveStudyMinutes) / 60).toFixed(0);
    recommendations.push({
      id: 'rec-study',
      indicatorId: 'study_goal',
      title: `Complete ${deficitHours}h Study Deficit`,
      titleFa: `جبران ${deficitHours} ساعت کسر مطالعه هفتگی`,
      description: `Run two 25-minute Pomodoro sessions today to keep your weekly study streak on track.`,
      descriptionFa: `امروز دو ست ۲۵ دقیقه‌ای تمرکز با تکنیک پومودورو اجرا کنید تا به هدف هفتگی برسید.`,
      impactPts: 4,
      priority: 'medium',
      actionLabel: 'Start Pomodoro',
      actionLabelFa: 'اجرای پومودورو',
      actionTab: 'timer',
    });
  }

  // Course progress recommendation
  if (courseAvailable && courseProgressScore < 60) {
    const lowestCourse = [...courses].sort((a, b) => a.progress - b.progress)[0];
    recommendations.push({
      id: 'rec-course',
      indicatorId: 'course_progress',
      title: `Accelerate ${lowestCourse.code} Coverage`,
      titleFa: `افزایش پیشرفت درس ${lowestCourse.name}`,
      description: `${lowestCourse.code} is at ${lowestCourse.progress}%. Reviewing lecture slides will recover pace.`,
      descriptionFa: `پیشرفت این درس در حال حاضر ${lowestCourse.progress}٪ است. مطالعه جزوه و اسلایدهای کلاسی توصیه می‌شود.`,
      impactPts: 4,
      priority: 'medium',
      actionLabel: 'Browse Resources',
      actionLabelFa: 'مشاهده جزوات درس',
      actionTab: 'resources',
    });
  }

  // Fallback recommendation if everything is awesome
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec-maintain',
      indicatorId: 'study_goal',
      title: 'Maintain Stellar Rhythm',
      titleFa: 'تثبیت روند موفق فعلی',
      description: 'Your metrics are balanced. Continue logging daily sessions and reviewing course notes.',
      descriptionFa: 'تمام شاخص‌ها در وضعیت بهینه هستند. ادامه همین ریتم شما را به بالاترین نمرات ترم می‌رساند.',
      impactPts: 2,
      priority: 'low',
      actionLabel: 'View Schedule',
      actionLabelFa: 'مشاهده برنامه هفتگی',
      actionTab: 'schedule',
    });
  }

  // 8. Historical Snapshots (Weeks 4 to 7)
  const historySnapshots: ScoreSnapshot[] = [
    { week: 4, weekLabel: 'Week 4', weekLabelFa: 'هفته ۴', date: 'Oct 01', score: 68, status: 'needs_attention' },
    { week: 5, weekLabel: 'Week 5', weekLabelFa: 'هفته ۵', date: 'Oct 08', score: 72, status: 'needs_attention' },
    { week: 6, weekLabel: 'Week 6', weekLabelFa: 'هفته ۶', date: 'Oct 15', score: 76, status: 'good' },
    { week: 7, weekLabel: 'Week 7 (Current)', weekLabelFa: 'هفته ۷ (فعلی)', date: 'Oct 22', score: overallScore, status },
  ];

  const previousScore = historySnapshots[2]?.score || 76;
  const diff = overallScore - previousScore;
  const trend: 'up' | 'down' | 'stable' = diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable';

  return {
    overallScore,
    status,
    statusLabel,
    statusLabelFa,
    statusDescription,
    statusDescriptionFa,
    indicators: {
      assignment: assignmentIndicator,
      exam: examIndicator,
      studyGoal: studyGoalIndicator,
      courseProgress: courseProgressIndicator,
    },
    hasMissingData,
    activeWeightsSum,
    recommendations,
    historySnapshots,
    weeklyComparison: {
      diff,
      trend,
      previousScore,
    },
    weeklyGoalHours,
  };
}
