// src/components/CountyDealflowTable.tsx
import React from "react";
import FlowboardTable, { LeaderData } from "./FlowboardTable";

interface CountyDealflowTableProps {
  fipsCode: string;
}

/* ------------------------------------------------------------------
   Temporary mock data
   ------------------------------------------------------------------*/
const mockData: LeaderData[] = [
  {
    id: "0x123...abcd",
    displayName: "agent-zero",
    avatar: window.multiavatar("agent-zero"),
    quantity: "4,200 FIPS",
    analyze: true,
  },
  {
    id: "0x456...efgh",
    displayName: "metro-max",
    avatar: window.multiavatar("metro-max"),
    quantity: "2,830 FIPS",
    analyze: false,
  },
  {
    id: "0x789...wxyz",
    displayName: "txwhale",
    avatar: window.multiavatar("txwhale"),
    quantity: "2,300 FIPS",
    analyze: true,
  },
];

/* ------------------------------------------------------------------*/

const CountyDealflowTable: React.FC<CountyDealflowTableProps> = ({ fipsCode }) => {
  return <FlowboardTable title={`(FIPS: ${fipsCode})`} data={mockData} />;
};

export default CountyDealflowTable;
