// components/SupportingLogicList.tsx
import React from "react";

interface SupportingLogicListProps {
  bullets: string[];
}

export default function SupportingLogicList({ bullets }: SupportingLogicListProps) {
  return (
    <div className="mt-6">
      <h4 className="text-cyan-400 text-md font-semibold mb-2">Supporting Logic</h4>
      <ul className="list-disc pl-6 text-sm text-white space-y-1">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}