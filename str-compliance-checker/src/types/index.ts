export type PropertyType = 'single-family' | 'condo' | 'apartment' | 'multi-family' | 'other';
export type ZoningType = 'residential' | 'commercial' | 'mixed-use' | 'unknown';
export type OwnershipType = 'own' | 'rent';
export type Severity = 'pass' | 'warning' | 'fail' | 'info';
export type DataSource = 'live' | 'scraped' | 'seeded' | 'scrape_failed';

export interface Answers {
  isPrimaryResidence: boolean | null;
  ownershipType: OwnershipType | null;
  daysPerYear: number | null;
  isHosted: boolean | null;
  guestsAtOnce: number | null;
  hasPermit: boolean | null;
  propertyType: PropertyType | null;
  hasHOA: boolean | null;
  bedroomCount: number | null;
  zoningType: ZoningType | null;
  hasLiabilityInsurance: boolean | null;
  insuranceCoverage: number | null;
  isEntireUnit: boolean | null;
}

export interface Question {
  id: keyof Answers;
  text: string;
  subtext?: string;
  type: 'boolean' | 'number' | 'select';
  options?: { value: string; label: string }[];
  dependsOn?: { field: keyof Answers; value: unknown };
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface CityData {
  id: string;
  name: string;
  state: string;
  permitRequired: boolean;
  permitFee: string;
  permitRenewalFee?: string;
  permitLink: string;
  primaryResidenceRequired: boolean;
  hostedDayLimit: number | null;
  unhostedDayLimit: number | null;
  maxGuests: number | null;
  taxRate: number | null;
  taxNote: string;
  liabilityInsuranceRequired: boolean;
  liabilityInsuranceMin: number | null;
  maxBedrooms: number | null;
  requiresHostPresence: boolean | null;
  nonOwnerOccupiedAllowed: boolean;
  rentersAllowed: boolean;
  scrapeStatus: DataSource;
  scrapedAt: string | null;
  lastUpdated: string;
  regulationRules?: RegulationRule[];
}

export interface RegulationRule {
  id: string;
  city_id: string;
  category: string;
  title: string;
  rule_text: string;
  severity: string;
  source_url: string | null;
  last_verified: string | null;
  sort_order: number;
}

export interface ComplianceRule {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  recommendation?: string;
  officialLink?: string;
  category: string;
}

export interface ComplianceResult {
  cityId: string;
  cityName: string;
  overallStatus: 'compliant' | 'likely-compliant' | 'non-compliant' | 'needs-registration';
  score: number;
  rules: ComplianceRule[];
  registrationRequired: boolean;
  registrationFee: string;
  registrationLink: string;
  keyRequirements: Array<{ title: string; text: string; severity: string; category: string }>;
  taxes: string[];
  dataSource: DataSource;
  scrapedAt: string | null;
  lastUpdated: string;
}
