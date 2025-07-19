import React from "react";

interface Props {
  pendingTotal: string;
  onClick?: () => void;
}

const ProfileStatCard: React.FC<Props> = ({ pendingTotal, onClick }) => {
  return (
    <div
      className={`bg-black rounded-xl p-6 shadow-md border border-neutral-700 text-center max-w-6xl mx-auto mb-8 transition duration-200 ${
        onClick ? "cursor-pointer hover:border-blue-500" : ""
      }`}
      onClick={onClick}
    >
      <p className="text-3xl font-extrabold mb-2 truncate max-w-[40vw] sm:max-w-none bg-gradient-to-r from-[#B18CFF] via-[#A675FF] to-[#00E0FF] bg-clip-text text-transparent">
        Total User Volume
      </p>


      <p className="text-3xl font-bold text-white">$0</p>
      <p className="text-sm text-zinc-400 mt-1">

        <span className="text-md text-cyan-500 font-semibold">{pendingTotal} *pending</span>
      </p>
    </div>
  );
};

export default ProfileStatCard;
