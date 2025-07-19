export const nevadaBuyboxes = [
  {
    city: "carson city",
    county: "carson city", // ✅ Carson City is an independent city and consolidated municipality
    propertyType: "single family",
    bedMin: 2,
    bathMin: 1,
    yearBuiltMin: 1950,
    sqftMin: 1000,
    arvPercentMax: 75,
    maxRehabCost: 75000,
    maxPrice: 533333.33,
    hoa: false,
  },
  {
    city: "las vegas",
    county: "clark", // ✅ Las Vegas is in Clark County
    propertyType: "single family, multifamily",
    bedMin: 1,
    bathMin: 1,
    yearBuiltMin: 1910,
    sqftMin: 700,
    sqftMax: 4000,
    arvPercentMax: 72.66,
    maxRehabCost: 75696.78,
    maxPrice: 313360.6,
    hoa: true,
  },
];
