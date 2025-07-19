export const indianaBuyboxes = [
  {
    city: "fort wayne",
    county: "allen", // ✅ Fort Wayne is in Allen County
    propertyType: "single family",
    bedMin: 2,
    bathMin: 1,
    yearBuiltMin: 1950,
    sqftMin: 1000,
    arvPercentMax: 75,
    maxRehabCost: 75000,
    maxPrice: 225000,
    hoa: false,
  },
  {
    city: "indianapolis",
    county: "marion", // ✅ Indianapolis is in Marion County
    propertyType: "single familyduplex",
    bedMin: 1,
    bathMin: 1,
    yearBuiltMin: 1973, // ✅ corrected typo
    sqftMin: 700,
    sqftMax: 4000,
    arvPercentMax: 73.32,
    maxRehabCost: 75557.85,
    maxPrice: 300557.54,
    hoa: true,
  },
];
