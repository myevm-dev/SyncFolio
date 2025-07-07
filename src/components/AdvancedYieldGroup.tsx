// src/components/AdvancedYieldGroup.tsx
import React from "react";
import StakingCard from "./StakingCard";

const AdvancedYieldGroup = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
      <StakingCard />
      <StakingCard />
      <StakingCard />
    </div>
  );
};

export default AdvancedYieldGroup;
