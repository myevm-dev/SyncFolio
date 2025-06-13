export interface BuyBox {
  cities?: string[]; // Submitted by users
  city?: string;     // Used when saving one per city
  county?: string;
  propertyType: string;
  bedMin?: number;
  bathMin?: number;
  yearBuiltMin?: number;
  sqftMin?: number;
  sqftMax?: number;
  arvPercentMax?: number;
  maxRehabCost?: number;
  maxPrice?: number;
  hoa?: boolean;
  foundation?: string;
}
