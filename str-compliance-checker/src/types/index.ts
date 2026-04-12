export type PropertyType = 'single-family' | 'condo' | 'apartment' | 'multi-family' | 'other';
export type ZoningType = 'residential' | 'commercial' | 'mixed-use' | 'unknown';
export type OwnershipType = 'own' | 'rent';

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

export type Severity = 'pass' | 'warning' | 'fail' | 'info';

export interface ComplianceRule {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  recommendation?: string;
  officialLink?: string;
}

export interface ComplianceResult {
  cityId: string;
  cityName: string;
  overallStatus: 'compliant' | 'likely-compliant' | 'non-compliant' | 'needs-registration';
  score: number; // 0-100
  rules: ComplianceRule[];
  registrationRequired: boolean;
  registrationFee?: string;
  registrationLink?: string;
  keyRequirements: string[];
  taxes: string[];
}

export interface CityRegulation {
  id: string;
  name: string;
  state: string;
  aliases: string[];          // alternate city name spellings
  counties: string[];         // county names that map to this city
  permitRequired: boolean;
  permitFee: string;
  permitRenewalFee?: string;
  permitLink: string;
  primaryResidenceRequired: boolean;
  ownerOccupiedOnly: boolean;  // false = non-owner-occupied also allowed
  hostedDayLimit: number | null;   // null = unlimited
  unhostedDayLimit: number | null; // null = unlimited or not applicable
  maxGuests: number | null;
  allowedZones: ZoningType[];    // empty = all zones
  prohibitedZones: string[];     // specific zone codes banned
  taxRate: number | null;        // percentage
  taxNote: string;
  liabilityInsuranceRequired: boolean;
  liabilityInsuranceMin: number | null; // in dollars
  maxBedrooms: number | null;
  requiresHostPresence: boolean | null; // null = depends on type
  nonOwnerOccupiedAllowed: boolean;
  nonOwnerOccupiedZones: string[];
  rentersAllowed: boolean;
  keyRules: string[];
  lastUpdated: string;
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
