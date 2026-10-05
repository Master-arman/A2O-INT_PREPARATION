import { useState, useEffect } from 'react';
import { CalendarDays, Flame, ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { getActivityMap, calculateStreak, getMonthCalendar } from '../utils/activityTracker';

const ActivityHeatmap = ({ compact = false }) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [activityMap, setActivityMap] = useState(() => getActivityMap());
  const [hoveredDay, setHoveredDay] = useState(null);

  useEffect(() => {
    const handleUpdate = () => {
      setActivityMap(getActivityMap());
    };

    window.addEventListener('activity-updated', handleUpdate);
    window.addEventListener('solved-questions-updated', handleUpdate);

    return () => {
      window.removeEventListener('activity-updated', handleUpdate);
      window.removeEventListener('solved-questions-updated', handleUpdate);
    };
  }, []);

  const streakInfo = calculateStreak(activityMap);
  const calendarData = getMonthCalendar(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    activityMap
  );

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
  };

  const getIntensityClass = (count, isCurrentMonth) => {
    if (!isCurrentMonth) {
      return count > 0 
        ? 'bg-[#452b0d]/50 opacity-40' 
        : 'bg-[#1e1e1e] opacity-30';
    }
    if (count === 0) return 'bg-[#333333] hover:border-neutral-500';
    if (count === 1) return 'bg-[#78350f] hover:brightness-110';
    if (count === 2) return 'bg-[#b45309] hover:brightness-110';
    if (count >= 3 && count < 5) return 'bg-[#f59e0b] hover:brightness-110';
    return 'bg-[#ffa116] shadow-sm shadow-[#ffa116]/40 hover:brightness-125';
  };

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="relative rounded-xl border border-[#383838] bg-[#242424] p-4 text-neutral-200 shadow-sm transition-all hover:border-[#4a4a4a]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[#ffa116]" />
          <h2 className="text-sm font-semibold text-white">Activity</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="rounded p-1 text-[#8a8a8a] transition-colors hover:bg-[#333333] hover:text-white"
            title="Previous Month"
            aria-label="Previous Month"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={resetToToday}
            className="rounded px-1.5 py-0.5 text-[11px] font-medium text-[#8a8a8a] transition-colors hover:bg-[#333333] hover:text-[#ffa116]"
            title="Current Month"
          >
            {calendarData.monthName.slice(0, 3)} {calendarData.year}
          </button>
          <button
            onClick={nextMonth}
            className="rounded p-1 text-[#8a8a8a] transition-colors hover:bg-[#333333] hover:text-white"
            title="Next Month"
            aria-label="Next Month"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between text-xs text-[#8a8a8a]">
        <span>{calendarData.monthName} {calendarData.year}</span>
        <span className="text-[11px] font-medium text-[#ffa116]">
          {calendarData.monthlyTotal} solved
        </span>
      </div>

      {/* Weekday Labels */}
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-[#6e6e6e]">
        {weekdays.map((day, idx) => (
          <div key={idx} className="h-4 leading-4">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="mt-1 grid grid-cols-7 gap-1.5">
        {calendarData.days.map((day, index) => {
          const isSelected = hoveredDay?.dateStr === day.dateStr;
          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              className={`group relative aspect-square cursor-pointer rounded-sm border transition-all duration-150 ${
                day.isToday ? 'ring-1 ring-[#ffa116]/80' : 'border-transparent'
              } ${getIntensityClass(day.count, day.isCurrentMonth)}`}
            >
              {/* Day number on hover or subtle display */}
              <span className="sr-only">
                {day.dateStr}: {day.count} questions solved
              </span>
            </div>
          );
        })}
      </div>

      {/* Hover Info Tooltip Bar */}
      <div className="mt-3 min-h-[22px] flex items-center justify-between rounded-md bg-[#1a1a1a] px-2.5 py-1 text-[11px] border border-white/5">
        {hoveredDay ? (
          <div className="flex w-full items-center justify-between">
            <span className="text-neutral-400 font-mono text-[10px]">
              {hoveredDay.dateStr}
            </span>
            <span className="font-semibold text-[#ffa116]">
              {hoveredDay.count === 0
                ? 'No questions solved'
                : `${hoveredDay.count} ${hoveredDay.count === 1 ? 'question' : 'questions'} solved`}
            </span>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between text-[#8a8a8a]">
            <span>Hover day for details</span>
            <span className="text-[#ffa116] font-medium">{calendarData.monthlyTotal} this month</span>
          </div>
        )}
      </div>

      {/* Footer / Streak & Legend */}
      <div className="mt-3 flex items-center justify-between border-t border-[#333333] pt-2.5 text-xs text-[#8a8a8a]">
        <div className="flex items-center gap-1.5">
          <Flame className={`h-4 w-4 ${streakInfo.currentStreak > 0 ? 'text-[#ffa116] animate-pulse' : 'text-[#8a8a8a]'}`} />
          <span className={`font-semibold ${streakInfo.currentStreak > 0 ? 'text-white' : 'text-[#8a8a8a]'}`}>
            {streakInfo.currentStreak} day streak
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 text-[10px] text-[#6e6e6e]">
          <span>Less</span>
          <span className="h-2.5 w-2.5 rounded-[2px] bg-[#333333]" />
          <span className="h-2.5 w-2.5 rounded-[2px] bg-[#78350f]" />
          <span className="h-2.5 w-2.5 rounded-[2px] bg-[#b45309]" />
          <span className="h-2.5 w-2.5 rounded-[2px] bg-[#ffa116]" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
