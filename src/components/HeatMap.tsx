import React, { useMemo } from "react";
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

function generateFakeData(): Record<string, number> {
  const end = endOfToday();
  const start = subDays(end, 180);
  const daysArr = eachDayOfInterval({ start, end });
  const data: Record<string, number> = {};
  daysArr.forEach((date) => {
    const key = format(date, "yyyy-MM-dd");
    data[key] = Math.floor(Math.random() * 21); // 0–20
  });
  return data;
}

export default function HeatMap({ walletAddress }: HeatMapProps) {
  const data = generateFakeData();
  const end = endOfToday();
  const start = subDays(end, 180);
  const allDays = eachDayOfInterval({ start, end });

  // Function to map 0–20 activity to a purple HSL scale: darkest = high activity
  const getColor = useMemo(() => {
    const minLight = 95;
    const maxLight = 30;
    return (level: number) => {
      const lightness = minLight - (level / 20) * (minLight - maxLight);
      return `hsl(270,50%,${lightness}%)`;
    };
  }, []);

  // Build weekly columns
  const columns: string[][] = [];
  let currentColumn: string[] = Array(7).fill("");
  allDays.forEach((d) => {
    const key = format(d, "yyyy-MM-dd");
    const dow = d.getDay();
    const idx = dow === 0 ? 6 : dow - 1;
    currentColumn[idx] = key;
    if (idx === 6) {
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
                      className="w-8 h-8 rounded-sm"
                      style={{ backgroundColor: getColor(data[key] ?? 0) }}
                      title={`${key} - ${data[key] ?? 0} activity`}
                    />
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
