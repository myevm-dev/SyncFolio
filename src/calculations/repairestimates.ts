export interface RehabCategory {
  key: string;
  label: string;
  estimatedTotal: string;
  costPerSqFt: string;
  avgCostPerSqFt: number | null;
}

export const rehabCategories: RehabCategory[] = [
  {
    key: "roof",
    label: "Roof Replacement",
    estimatedTotal: "$6,000–$8,000",
    costPerSqFt: "$5–$7 /sq ft roof area",
    avgCostPerSqFt: 6,
  },
  {
    key: "hvac",
    label: "Heating & Cooling",
    estimatedTotal: "$4,000–$6,000",
    costPerSqFt: "$3–$5",
    avgCostPerSqFt: 4,
  },
  {
    key: "electrical",
    label: "Full Rewire",
    estimatedTotal: "$3,000–$5,000",
    costPerSqFt: "$2.50–$4",
    avgCostPerSqFt: 3.25,
  },
  {
    key: "plumbing",
    label: "New Plumbing",
    estimatedTotal: "$4,000–$7,000",
    costPerSqFt: "$3–$6",
    avgCostPerSqFt: 4.5,
  },
  {
    key: "windowsDoors",
    label: "Windows & Doors",
    estimatedTotal: "$3,000–$5,000",
    costPerSqFt: "$2–$4",
    avgCostPerSqFt: 3,
  },
  {
    key: "drywallPaint",
    label: "Interior Walls & Paint",
    estimatedTotal: "$4,000–$6,000",
    costPerSqFt: "$3–$5",
    avgCostPerSqFt: 4,
  },
  {
    key: "floors",
    label: "Flooring",
    estimatedTotal: "$3,000–$5,000",
    costPerSqFt: "$2.50–$4.50",
    avgCostPerSqFt: 3.5,
  },
  {
    key: "kitchen",
    label: "Kitchen Renovation",
    estimatedTotal: "$4,000–$6,000",
    costPerSqFt: "$4–$6",
    avgCostPerSqFt: 5,
  },
  {
    key: "bathroom",
    label: "Bathroom Renovation",
    estimatedTotal: "$3,000–$5,000",
    costPerSqFt: "$3–$6",
    avgCostPerSqFt: 4.5,
  },
  {
    key: "exterior",
    label: "Siding, Porch, Stairs",
    estimatedTotal: "$2,000–$4,000",
    costPerSqFt: "$2–$5 (if siding area)",
    avgCostPerSqFt: 3.5,
  },
  {
    key: "foundation",
    label: "Foundation Repair",
    estimatedTotal: "$8,000–$25,000+",
    costPerSqFt: "$8–$15 (estimates vary wildly)",
    avgCostPerSqFt: 11.5,
  },
];

export const foundationDealBreakers: string[] = [
  "Horizontal cracks in walls",
  "Water intrusion in basement",
  "Sloping floors",
  "Doors/windows not closing properly",
  "Previous foundation repair attempts",
];

export function calculateRehabCost(
  selectedKeys: string[],
  sqft: number
): number {
  return selectedKeys.reduce((total, key) => {
    const category = rehabCategories.find((c) => c.key === key);
    if (!category || category.avgCostPerSqFt === null) return total;
    return total + category.avgCostPerSqFt * sqft;
  }, 0);
}