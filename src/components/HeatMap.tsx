// src/components/HeatMap.tsx
import React from "react";
import {
  addDays,
  eachDayOfInterval,
  endOfToday,
  format,
  startOfToday,
  subDays,
} from "date-fns";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const generateDummyData = () => {
  const end = endOfToday();
  const start = subDays(end, 364); // Past year
  const days = eachDayOfInterval({ start, end });

  const activityData: Record<string, number> = {};
  days.forEach((date) => {
    const key = format(date, "yyyy-MM-dd");
    activityData[key] = Math.floor(Math.random() * 5); // 0-4 intensity
  });

  return activityData;
};

const activityLevels: Record<number, string> = {
  0: "bg-zinc-800",
  1: "bg-green-700",
  2: "bg-green-600",
  3: "bg-green-500",
  4: "bg-green-400",
};

export default function HeatMap() {
  const data = generateDummyData();
  const today = startOfToday();
  const startDate = subDays(today, 364);
  const allDays = eachDayOfInterval({ start: startDate, end: today });

  // Build columns grouped by weeks starting on Monday
  const weeks: Date[][] = [];
  let week: Date[] = [];

  allDays.forEach((day) => {
    const dayIndex = day.getDay(); // Sunday = 0 ... Saturday = 6
    const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Monday-first
    if (week.length === 0 && adjustedDayIndex !== 0) {
      for (let i = 0; i < adjustedDayIndex; i++) week.push(new Date(0)); // Empty for offset
    }
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length > 0) weeks.push(week);

  return (
    <div className="mt-10 w-full max-w-6xl mx-auto">
      <h2 className="text-lg font-semibold text-white mb-4 text-center">Activity</h2>
      <div className="overflow-x-auto">
        <div className="inline-flex">
          {/* Day Labels */}
          <div className="flex flex-col gap-[2px] justify-between text-xs text-gray-400 mr-1 mt-[1.5px]">
            {dayLabels.map((day) => (
              <div
                key={day}
                className="h-3 sm:h-4 flex items-center justify-end pr-1"
                style={{ minHeight: "1rem" }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div className="flex gap-[2px]">
            {weeks.map((week, i) => (
              <div key={i} className="flex flex-col gap-[2px]">
                {week.map((date, j) => {
                  const key = format(date, "yyyy-MM-dd");
                  const level = data[key] ?? 0;
                  return (
                    <div
                      key={`${key}-${j}`}
                      title={key}
                      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm ${
                        date.getFullYear() === 1970
                          ? "invisible"
                          : activityLevels[level]
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

