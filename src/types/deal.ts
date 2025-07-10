// src/types/deal.ts
import { DealInput } from "./DealInput"; // adjust path if different

export interface Deal extends DealInput {
  id: string;
  createdAt?: any;
}
