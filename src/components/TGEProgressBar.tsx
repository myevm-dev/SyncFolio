import React from "react";

interface TGEProgressBarProps {
  currentVolume: number;
}

const MAX_VOLUME = 50000000;

const TGEProgressBar: React.FC<TGEProgressBarProps> = ({ currentVolume }) => {
  const percentage = Math.min((currentVolume / MAX_VOLUME) * 100, 100);

  return (
    <div className="w-full max-w-xl mt-4">
      <div className="relative w-full h-5 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: "#ff00d4", // Hot pink
          }}
        />
      </div>
      <div className="text-xs text-right text-gray-400 pt-1">
        ${currentVolume.toLocaleString()} / $50,000,000
      </div>
    </div>
  );
};

export default TGEProgressBar;
