import React from "react";
import {
  eachDayOfInterval,
  endOfToday,
  format,
  subDays,
  startOfWeek,
  addDays
} from "date-fns";

interface HeatMapProps {
  walletAddress: string;
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const levels = [
  "bg-zinc-800", // 0
  "bg-green-900", // 1
  "bg-green-800", // 2
  "bg-green-600", // 3
  "bg-green-400"  // 4
];

function generateFakeData(): Record<string, number> {
  const end = endOfToday();
  const start = subDays(end, 180);
  const days = eachDayOfInterval({ start, end });
  const data: Record<string, number> = {};
  days.forEach((date) => {
    const key = format(date, "yyyy-MM-dd");
    data[key] = Math.floor(Math.random() * 5);
  });
  return data;
}

export default function HeatMap({ walletAddress }: HeatMapProps) {
  const data = generateFakeData();
  const end = endOfToday();
  const start = subDays(end, 180);
  const allDays = eachDayOfInterval({ start, end });

  const columns: string[][] = [];
  let currentColumn: string[] = Array(7).fill("");
  allDays.forEach((d) => {
    const key = format(d, "yyyy-MM-dd");
    const dayOfWeek = d.getDay();
    const index = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    currentColumn[index] = key;
    if (index === 6) {
      columns.push(currentColumn);
      currentColumn = Array(7).fill("");
    }
  });

  return (
    <div className="w-full max-w-[1920px] mx-auto mt-12">
      <h2 className="text-center text-lg font-bold mb-4">Activity</h2>
      <div className="overflow-x-auto">
        <div className="flex flex-col items-center w-full">
          <div className="ml-8 mb-1 flex gap-[6px] text-xs text-gray-400">
            <div className="w-8"></div>
            {columns.map((_, i) => {
              const date = addDays(startOfWeek(start), i * 7);
              return (
                <span key={i} className="w-8 text-center">
                  {i % 4 === 0 ? format(date, "MMM") : ""}
                </span>
              );
            })}
          </div>
          <div className="flex gap-[6px]">
            <div className="flex flex-col justify-between text-xs text-gray-400 pr-2">
              {days.map((day) => (
                <span key={day} className="h-8 text-right">
                  {day}
                </span>
              ))}
            </div>
            <div className="flex gap-[6px]">
              {columns.map((week, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-[6px]">
                  {week.map((key, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-sm ${levels[data[key] ?? 0]}`}
                      title={`${key} - ${data[key] ?? 0} activity`}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
