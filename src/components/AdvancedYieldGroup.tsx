import React from "react";
import StakingCard from "./StakingCard";

const AdvancedYieldGroup = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center w-full">
      <StakingCard />
      <StakingCard />
      <StakingCard />
    </div>
  );
};

export default AdvancedYieldGroup;
