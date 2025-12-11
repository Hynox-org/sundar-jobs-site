import { BUSINESS_SECTORS } from './business-sectors';

export const JOB_CATEGORIES: string[] = [
  "Select a category", // Default option
  ...BUSINESS_SECTORS.map((sector: any) => sector.name)
];
