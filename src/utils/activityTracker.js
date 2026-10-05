// Central Activity & Solved Questions Tracker with Supabase Cloud Sync
import { syncSolvedQuestionsToDB, fetchUserProgressFromSupabase } from './supabaseClient';

const ACTIVITY_STORAGE_KEY = 'user_daily_activity';
const SOLVED_STORAGE_KEY = 'solved_questions';

const formatDateKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Default seed data for realistic initial calendar view if user has fresh storage
const getSeedActivity = () => {
  const today = new Date();
  const activity = {};
  
  const sampleOffsets = [
    { offset: 0, count: 2 },
    { offset: 1, count: 3 },
    { offset: 2, count: 1 },
    { offset: 4, count: 4 },
    { offset: 5, count: 2 },
    { offset: 8, count: 1 },
    { offset: 9, count: 3 },
    { offset: 12, count: 2 },
    { offset: 15, count: 1 },
    { offset: 18, count: 4 },
    { offset: 22, count: 2 },
    { offset: 25, count: 3 },
    { offset: 28, count: 1 },
  ];

  sampleOffsets.forEach(({ offset, count }) => {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    activity[formatDateKey(d)] = count;
  });

  return activity;
};

export const getActivityMap = () => {
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (!raw) {
      const initial = getSeedActivity();
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading activity map:', err);
    return getSeedActivity();
  }
};

export const recordActivity = (count = 1, date = new Date()) => {
  try {
    const map = getActivityMap();
    const dateKey = formatDateKey(date);
    map[dateKey] = (map[dateKey] || 0) + count;
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent('activity-updated', { detail: { dateKey, count: map[dateKey] } }));
    
    // Auto-sync to Supabase if user is logged in
    triggerSupabaseProgressSync();
    return map;
  } catch (err) {
    console.error('Error recording activity:', err);
  }
};

export const getSolvedQuestions = () => {
  try {
    const raw = localStorage.getItem(SOLVED_STORAGE_KEY);
    if (!raw) {
      const defaultSolved = ['algo-1'];
      localStorage.setItem(SOLVED_STORAGE_KEY, JSON.stringify(defaultSolved));
      return new Set(defaultSolved);
    }
    return new Set(JSON.parse(raw));
  } catch (err) {
    console.error('Error reading solved questions:', err);
    return new Set(['algo-1']);
  }
};

const triggerSupabaseProgressSync = async () => {
  try {
    const authUserStr = localStorage.getItem('user');
    if (!authUserStr) return;
    const authUser = JSON.parse(authUserStr);
    if (!authUser?.id) return;

    const solvedArr = Array.from(getSolvedQuestions());
    const interviewsTaken = Number(localStorage.getItem('interviewsTaken') || 0);
    const avgScore = Number(localStorage.getItem('avgScore') || 0);
    const codingAccuracy = Number(localStorage.getItem('codingAccuracy') || 0);
    const activityMap = getActivityMap();

    await syncSolvedQuestionsToDB(authUser.id, {
      solved_questions: solvedArr,
      total_solved: solvedArr.length,
      interviews_taken: interviewsTaken,
      avg_score: avgScore,
      coding_accuracy: codingAccuracy,
      activity_map: activityMap
    });
  } catch (err) {
    console.warn('Auto Supabase sync notice:', err.message);
  }
};

export const recordSolvedQuestion = (questionId) => {
  try {
    const solvedSet = getSolvedQuestions();
    if (!solvedSet.has(questionId)) {
      solvedSet.add(questionId);
      const solvedList = Array.from(solvedSet);
      localStorage.setItem(SOLVED_STORAGE_KEY, JSON.stringify(solvedList));
      recordActivity(1);
      window.dispatchEvent(new CustomEvent('solved-questions-updated', { detail: { questionId, solved: true } }));
      
      triggerSupabaseProgressSync();
    }
  } catch (err) {
    console.error('Error saving solved question:', err);
  }
};

export const unrecordSolvedQuestion = (questionId) => {
  try {
    const solvedSet = getSolvedQuestions();
    if (solvedSet.has(questionId)) {
      solvedSet.delete(questionId);
      const solvedList = Array.from(solvedSet);
      localStorage.setItem(SOLVED_STORAGE_KEY, JSON.stringify(solvedList));
      window.dispatchEvent(new CustomEvent('solved-questions-updated', { detail: { questionId, solved: false } }));
      
      triggerSupabaseProgressSync();
    }
  } catch (err) {
    console.error('Error removing solved question:', err);
  }
};

// Sync and merge progress from Supabase Cloud on login or profile load
export const syncFromSupabaseCloud = async (userId) => {
  try {
    if (!userId) return;
    const cloudProgress = await fetchUserProgressFromSupabase(userId);
    if (!cloudProgress) return;

    // Merge solved questions
    if (Array.isArray(cloudProgress.solved_questions) && cloudProgress.solved_questions.length > 0) {
      const localSolved = getSolvedQuestions();
      cloudProgress.solved_questions.forEach(q => localSolved.add(q));
      localStorage.setItem(SOLVED_STORAGE_KEY, JSON.stringify(Array.from(localSolved)));
    }

    // Merge stats
    if (cloudProgress.interviews_taken !== undefined && cloudProgress.interviews_taken > 0) {
      const currentInterviews = Number(localStorage.getItem('interviewsTaken') || 0);
      if (cloudProgress.interviews_taken > currentInterviews) {
        localStorage.setItem('interviewsTaken', cloudProgress.interviews_taken);
        localStorage.setItem('avgScore', cloudProgress.avg_score || 0);
        localStorage.setItem('codingAccuracy', cloudProgress.coding_accuracy || 0);
      }
    }

    // Merge activity
    if (cloudProgress.activity_map && Object.keys(cloudProgress.activity_map).length > 0) {
      const currentActivity = getActivityMap();
      const merged = { ...cloudProgress.activity_map, ...currentActivity };
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(merged));
    }

    window.dispatchEvent(new CustomEvent('solved-questions-updated', { detail: { synced: true } }));
  } catch (err) {
    console.warn('Sync from Supabase cloud note:', err.message);
  }
};

export const calculateStreak = (activityMap = null) => {
  const map = activityMap || getActivityMap();
  const today = new Date();
  const todayKey = formatDateKey(today);
  
  let streak = 0;
  let checkDate = new Date(today);
  
  if (!map[todayKey]) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const key = formatDateKey(checkDate);
    if (map[key] && map[key] > 0) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    currentStreak: streak,
    hasActivityToday: Boolean(map[todayKey] && map[todayKey] > 0)
  };
};

export const getMonthCalendar = (year, month, activityMap = null) => {
  const map = activityMap || getActivityMap();
  const targetDate = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = targetDate.getDay();
  
  const todayKey = formatDateKey(new Date());
  
  const days = [];
  
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const prevDayNum = prevMonthDays - i;
    const prevDate = new Date(year, month - 1, prevDayNum);
    const dateKey = formatDateKey(prevDate);
    days.push({
      dayNumber: prevDayNum,
      dateStr: dateKey,
      count: map[dateKey] || 0,
      isCurrentMonth: false,
      isToday: dateKey === todayKey
    });
  }

  let monthlyTotal = 0;
  for (let d = 1; d <= totalDays; d++) {
    const currentDate = new Date(year, month, d);
    const dateKey = formatDateKey(currentDate);
    const count = map[dateKey] || 0;
    monthlyTotal += count;
    days.push({
      dayNumber: d,
      dateStr: dateKey,
      count,
      isCurrentMonth: true,
      isToday: dateKey === todayKey
    });
  }

  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let n = 1; n <= remainingCells; n++) {
    const nextDate = new Date(year, month + 1, n);
    const dateKey = formatDateKey(nextDate);
    days.push({
      dayNumber: n,
      dateStr: dateKey,
      count: map[dateKey] || 0,
      isCurrentMonth: false,
      isToday: dateKey === todayKey
    });
  }

  return {
    days,
    monthlyTotal,
    monthName: targetDate.toLocaleString('default', { month: 'long' }),
    year
  };
};
