import { getDb } from './index.js';

interface SeedCity {
  id: string; name: string; state: string; aliases: string[]; counties: string[];
  permit_required: boolean; permit_fee: string; permit_renewal_fee?: string; permit_link: string;
  primary_residence_required: boolean; hosted_day_limit: number | null; unhosted_day_limit: number | null;
  max_guests: number | null; allowed_zones: string[]; prohibited_zones: string[];
  tax_rate: number | null; tax_note: string; liability_insurance_required: boolean;
  liability_insurance_min: number | null; max_bedrooms: number | null;
  requires_host_presence: boolean | null; non_owner_occupied_allowed: boolean;
  non_owner_occupied_zones: string[]; renters_allowed: boolean; last_updated: string;
}

interface SeedRule {
  id: string; city_id: string; category: string; title: string; rule_text: string;
  severity: 'required' | 'conditional' | 'info' | 'prohibited';
  source_url?: string; last_verified: string; sort_order: number;
}

const CITIES: SeedCity[] = [
  {
    id: 'nyc', name: 'New York City', state: 'NY',
    aliases: ['new york', 'new york city', 'nyc', 'manhattan', 'brooklyn', 'queens', 'bronx', 'staten island'],
    counties: ['new york county', 'kings county', 'queens county', 'bronx county', 'richmond county'],
    permit_required: true,
    permit_fee: '$145 one-time registration fee',
    permit_link: 'https://www.nyc.gov/site/specialenforcement/short-term-rentals/registration.page',
    primary_residence_required: true, hosted_day_limit: null, unhosted_day_limit: 0,
    max_guests: 2, allowed_zones: [], prohibited_zones: [],
    tax_rate: null, tax_note: 'Hotel Room Occupancy Tax applies; Airbnb/VRBO collect and remit automatically in NYC',
    liability_insurance_required: false, liability_insurance_min: null, max_bedrooms: null,
    requires_host_presence: true, non_owner_occupied_allowed: false, non_owner_occupied_zones: [],
    renters_allowed: true, last_updated: '2024-09-05',
  },
  {
    id: 'los-angeles', name: 'Los Angeles', state: 'CA',
    aliases: ['los angeles', 'la', 'l.a.'],
    counties: ['los angeles county'],
    permit_required: true,
    permit_fee: '$199/year (Home-Sharing permit)',
    permit_link: 'https://planning.lacity.gov/plans-policies/home-sharing',
    primary_residence_required: true, hosted_day_limit: null, unhosted_day_limit: 120,
    max_guests: null, allowed_zones: [], prohibited_zones: [],
    tax_rate: 14, tax_note: '14% Transient Occupancy Tax (TOT) on stays ≤30 days — must collect from guests and remit to city',
    liability_insurance_required: false, liability_insurance_min: null, max_bedrooms: null,
    requires_host_presence: null, non_owner_occupied_allowed: false, non_owner_occupied_zones: [],
    renters_allowed: false, last_updated: '2025-01-01',
  },
  {
    id: 'chicago', name: 'Chicago', state: 'IL',
    aliases: ['chicago'],
    counties: ['cook county'],
    permit_required: true,
    permit_fee: '$125/year (primary residence); higher for non-primary',
    permit_renewal_fee: '$25/year renewal (primary residence)',
    permit_link: 'https://www.chicago.gov/city/en/depts/bacp/provdrs/special_inspections/svcs/short-term-residential-rentals.html',
    primary_residence_required: false, hosted_day_limit: null, unhosted_day_limit: null,
    max_guests: null, allowed_zones: [], prohibited_zones: [],
    tax_rate: 4.5, tax_note: '4.5% Chicago Shared Housing Tax + 6% Cook County Hotel Tax; platforms collect and remit',
    liability_insurance_required: false, liability_insurance_min: null, max_bedrooms: null,
    requires_host_presence: null, non_owner_occupied_allowed: true, non_owner_occupied_zones: [],
    renters_allowed: true, last_updated: '2025-06-01',
  },
  {
    id: 'miami', name: 'Miami', state: 'FL',
    aliases: ['miami', 'miami-dade', 'miami beach', 'hialeah', 'coral gables'],
    counties: ['miami-dade county'],
    permit_required: true,
    permit_fee: 'Florida DBPR license ($50–$150) + local municipality license fee',
    permit_link: 'https://www.myfloridalicense.com/DBPR/hotels-restaurants/vacation-rentals/',
    primary_residence_required: false, hosted_day_limit: null, unhosted_day_limit: null,
    max_guests: null, allowed_zones: ['commercial', 'mixed-use', 'tourist'],
    prohibited_zones: ['R1', 'R2', 'R3', 'RS', 'RPS', 'most residential zones'],
    tax_rate: 13, tax_note: '6% FL state sales tax + 7% Miami-Dade County tourist development tax = 13% total',
    liability_insurance_required: false, liability_insurance_min: null, max_bedrooms: null,
    requires_host_presence: null, non_owner_occupied_allowed: true, non_owner_occupied_zones: ['commercial', 'mixed-use', 'tourist'],
    renters_allowed: false, last_updated: '2025-01-01',
  },
  {
    id: 'san-francisco', name: 'San Francisco', state: 'CA',
    aliases: ['san francisco', 'sf', 's.f.'],
    counties: ['san francisco county'],
    permit_required: true,
    permit_fee: '$250 one-time registration',
    permit_link: 'https://shorttermrentals.sfgov.org/',
    primary_residence_required: true, hosted_day_limit: null, unhosted_day_limit: 90,
    max_guests: null, allowed_zones: [], prohibited_zones: [],
    tax_rate: 14, tax_note: '14% San Francisco Hotel Tax — must collect from guests and remit to SF Tax Collector',
    liability_insurance_required: false, liability_insurance_min: null, max_bedrooms: null,
    requires_host_presence: null, non_owner_occupied_allowed: false, non_owner_occupied_zones: [],
    renters_allowed: true, last_updated: '2025-01-01',
  },
  {
    id: 'seattle', name: 'Seattle', state: 'WA',
    aliases: ['seattle'],
    counties: ['king county'],
    permit_required: true,
    permit_fee: '$75/year per unit (operator\'s license)',
    permit_link: 'https://www.seattle.gov/license-and-tax-administration/business-license-tax/short-term-rentals',
    primary_residence_required: true, hosted_day_limit: null, unhosted_day_limit: null,
    max_guests: null, allowed_zones: [], prohibited_zones: [],
    tax_rate: null, tax_note: 'WA state sales tax (~10.25%) + city B&O tax; platforms typically collect',
    liability_insurance_required: false, liability_insurance_min: null, max_bedrooms: null,
    requires_host_presence: null, non_owner_occupied_allowed: true, non_owner_occupied_zones: [],
    renters_allowed: false, last_updated: '2025-01-01',
  },
  {
    id: 'austin', name: 'Austin', state: 'TX',
    aliases: ['austin', 'austin tx'],
    counties: ['travis county', 'williamson county'],
    permit_required: true,
    permit_fee: '$779.14 first-time; $437 annual renewal',
    permit_link: 'https://austintexas.gov/department/short-term-rentals',
    primary_residence_required: false, hosted_day_limit: null, unhosted_day_limit: null,
    max_guests: null, allowed_zones: [], prohibited_zones: [],
    tax_rate: 15, tax_note: '6% TX state hotel occupancy tax + ~9% Austin local hotel tax = ~15% total',
    liability_insurance_required: false, liability_insurance_min: null, max_bedrooms: null,
    requires_host_presence: null, non_owner_occupied_allowed: true, non_owner_occupied_zones: [],
    renters_allowed: false, last_updated: '2025-01-01',
  },
  {
    id: 'denver', name: 'Denver', state: 'CO',
    aliases: ['denver'],
    counties: ['denver county'],
    permit_required: true,
    permit_fee: '$25/year STR license + $50 business license',
    permit_link: 'https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Denver-Community-Planning-and-Development/Permits-and-Licenses/Short-Term-Rentals',
    primary_residence_required: true, hosted_day_limit: null, unhosted_day_limit: null,
    max_guests: null, allowed_zones: [], prohibited_zones: [],
    tax_rate: 10.75, tax_note: '10.75% Denver Lodger\'s Tax (4% city + 6.75% combined state/county) — Lodger\'s Tax ID required',
    liability_insurance_required: false, liability_insurance_min: null, max_bedrooms: null,
    requires_host_presence: null, non_owner_occupied_allowed: false, non_owner_occupied_zones: [],
    renters_allowed: false, last_updated: '2025-06-01',
  },
  {
    id: 'houston', name: 'Houston', state: 'TX',
    aliases: ['houston', 'houston tx'],
    counties: ['harris county'],
    permit_required: true,
    permit_fee: '$275/year + $33.10 administrative fee',
    permit_link: 'https://www.houstontx.gov/housing/short-term-rental.html',
    primary_residence_required: false, hosted_day_limit: null, unhosted_day_limit: null,
    max_guests: null, allowed_zones: [], prohibited_zones: [],
    tax_rate: 15, tax_note: '6% TX state + ~9% local hotel occupancy tax; platforms typically collect',
    liability_insurance_required: false, liability_insurance_min: null, max_bedrooms: null,
    requires_host_presence: null, non_owner_occupied_allowed: true, non_owner_occupied_zones: [],
    renters_allowed: false, last_updated: '2026-01-01',
  },
  {
    id: 'nashville', name: 'Nashville', state: 'TN',
    aliases: ['nashville', 'nashville tn', 'davidson county'],
    counties: ['davidson county'],
    permit_required: true,
    permit_fee: '$313/year (both owner-occupied and non-owner-occupied)',
    permit_link: 'https://www.nashville.gov/departments/codes/short-term-rentals',
    primary_residence_required: false, hosted_day_limit: null, unhosted_day_limit: null,
    max_guests: null, allowed_zones: [],
    prohibited_zones: ['AR2A', 'R', 'RS', 'RM'],
    tax_rate: 15.25, tax_note: '7% TN state sales tax + 8.25% Nashville local hotel occupancy tax = 15.25% total',
    liability_insurance_required: true, liability_insurance_min: 1000000, max_bedrooms: 4,
    requires_host_presence: null, non_owner_occupied_allowed: true,
    non_owner_occupied_zones: ['MUN', 'MUL', 'MUG', 'MUI', 'OG', 'OR20', 'OR40', 'ORI', 'CN', 'CL', 'CS', 'CA', 'CF', 'DTC'],
    renters_allowed: false, last_updated: '2026-01-01',
  },
  {
    id: 'new-orleans', name: 'New Orleans', state: 'LA',
    aliases: ['new orleans', 'nola', 'new orleans la'],
    counties: ['orleans parish'],
    permit_required: true,
    permit_fee: '$50–$500 depending on permit type and property size',
    permit_link: 'https://nola.gov/short-term-rental-administration/',
    primary_residence_required: false, hosted_day_limit: null, unhosted_day_limit: null,
    max_guests: null, allowed_zones: ['residential', 'commercial', 'mixed-use'], prohibited_zones: [],
    tax_rate: 15.75, tax_note: '4.45% LA state + 5% Orleans Parish hotel/motel tax + 6.3% city misc taxes = ~15.75%',
    liability_insurance_required: false, liability_insurance_min: null, max_bedrooms: null,
    requires_host_presence: null, non_owner_occupied_allowed: true, non_owner_occupied_zones: [],
    renters_allowed: false, last_updated: '2025-01-01',
  },
  {
    id: 'washington-dc', name: 'Washington DC', state: 'DC',
    aliases: ['washington dc', 'washington d.c.', 'dc', 'district of columbia'],
    counties: ['district of columbia'],
    permit_required: true,
    permit_fee: '$70/year license fee',
    permit_link: 'https://dlcp.dc.gov/page/short-term-rentals',
    primary_residence_required: true, hosted_day_limit: null, unhosted_day_limit: null,
    max_guests: null, allowed_zones: [], prohibited_zones: [],
    tax_rate: 14.95, tax_note: '14.95% DC sales tax on transient accommodations; platforms collect and remit',
    liability_insurance_required: true, liability_insurance_min: 250000, max_bedrooms: null,
    requires_host_presence: null, non_owner_occupied_allowed: false, non_owner_occupied_zones: [],
    renters_allowed: true, last_updated: '2026-03-13',
  },
];

const RULES: SeedRule[] = [
  // NYC
  { id: 'primary-residence', city_id: 'nyc', category: 'eligibility', title: 'Primary Residence Required', rule_text: 'You must be a permanent resident of New York State and occupy the property as your primary residence.', severity: 'required', source_url: 'https://www.nyc.gov/site/specialenforcement/short-term-rentals/registration.page', last_verified: '2024-09-05', sort_order: 1 },
  { id: 'host-presence', city_id: 'nyc', category: 'operations', title: 'Host Must Be Present', rule_text: 'You must be physically present in the dwelling during all guest stays (unhosted rentals under 30 days are prohibited).', severity: 'required', source_url: 'https://www.nyc.gov/site/specialenforcement/short-term-rentals/registration.page', last_verified: '2024-09-05', sort_order: 2 },
  { id: 'max-guests', city_id: 'nyc', category: 'operations', title: 'Maximum 2 Guests', rule_text: 'No more than 2 guests are permitted at any one time.', severity: 'required', source_url: 'https://www.nyc.gov/site/specialenforcement/short-term-rentals/registration.page', last_verified: '2024-09-05', sort_order: 3 },
  { id: 'no-door-locks', city_id: 'nyc', category: 'property', title: 'No Bedroom Door Locks', rule_text: 'Bedroom doors in the rental space cannot have locks.', severity: 'required', last_verified: '2024-09-05', sort_order: 4 },
  { id: 'registration', city_id: 'nyc', category: 'permit', title: 'OSE Registration Required', rule_text: 'Register with NYC Mayor\'s Office of Special Enforcement before listing. $145 one-time fee. Registration number must appear on all listings.', severity: 'required', source_url: 'https://www.nyc.gov/site/specialenforcement/short-term-rentals/registration.page', last_verified: '2024-09-05', sort_order: 5 },
  { id: 'renter-eligible', city_id: 'nyc', category: 'eligibility', title: 'Renters May Apply', rule_text: 'Tenants (renters) may register, but must comply with lease terms and building rules.', severity: 'conditional', last_verified: '2024-09-05', sort_order: 6 },

  // LA
  { id: 'primary-residence', city_id: 'los-angeles', category: 'eligibility', title: 'Primary Residence Only', rule_text: 'Must be your primary residence — where you live for at least 183 days per calendar year.', severity: 'required', source_url: 'https://planning.lacity.gov/plans-policies/home-sharing', last_verified: '2025-01-01', sort_order: 1 },
  { id: 'unhosted-cap', city_id: 'los-angeles', category: 'operations', title: '120-Day Unhosted Cap', rule_text: 'Unhosted rentals (host not present) capped at 120 days per calendar year. Hosted rentals have no annual cap.', severity: 'required', source_url: 'https://planning.lacity.gov/plans-policies/home-sharing', last_verified: '2025-01-01', sort_order: 2 },
  { id: 'permit', city_id: 'los-angeles', category: 'permit', title: 'Home-Sharing Permit Required', rule_text: '$199/year Home-Sharing permit required before listing. Permit number must appear on all platforms.', severity: 'required', source_url: 'https://planning.lacity.gov/plans-policies/home-sharing', last_verified: '2025-01-01', sort_order: 3 },
  { id: 'tot-tax', city_id: 'los-angeles', category: 'tax', title: '14% Transient Occupancy Tax', rule_text: 'Must collect 14% TOT from guests on stays ≤30 days and remit to the city.', severity: 'required', last_verified: '2025-01-01', sort_order: 4 },
  { id: 'owner-only', city_id: 'los-angeles', category: 'eligibility', title: 'Owner-Occupied Only', rule_text: 'Renters and non-owner-occupied properties are not eligible for a Home-Sharing permit.', severity: 'required', last_verified: '2025-01-01', sort_order: 5 },

  // Chicago
  { id: 'registration', city_id: 'chicago', category: 'permit', title: 'License Required for All STRs', rule_text: 'All properties rented for 1–31 days must have a valid license. Primary residence: $125/year ($25 renewal). Non-primary: separate non-owner-occupied license.', severity: 'required', source_url: 'https://www.chicago.gov/city/en/depts/bacp/provdrs/special_inspections/svcs/short-term-residential-rentals.html', last_verified: '2025-06-01', sort_order: 1 },
  { id: 'listing-number', city_id: 'chicago', category: 'operations', title: 'Registration Number on Listings', rule_text: 'Registration number must appear on all listing platform postings.', severity: 'required', last_verified: '2025-06-01', sort_order: 2 },
  { id: 'non-primary', city_id: 'chicago', category: 'eligibility', title: 'Non-Primary Residences Allowed', rule_text: 'Non-owner-occupied STRs are permitted with a separate license. Building-wide density limits may apply.', severity: 'info', last_verified: '2025-06-01', sort_order: 3 },
  { id: 'guest-registry', city_id: 'chicago', category: 'operations', title: 'Guest Registry Required', rule_text: 'Hosts must maintain a guest registry for all stays.', severity: 'required', last_verified: '2025-06-01', sort_order: 4 },

  // Miami
  { id: 'residential-ban', city_id: 'miami', category: 'zoning', title: 'Banned in Most Residential Zones', rule_text: 'Short-term rentals are prohibited in R1, R2, R3, RS, RPS, and most residential zoning districts. Only permitted in commercial, mixed-use, and tourist zones.', severity: 'prohibited', source_url: 'https://www.miamidade.gov/business/vacation-rentals.asp', last_verified: '2025-01-01', sort_order: 1 },
  { id: 'state-license', city_id: 'miami', category: 'permit', title: 'Florida DBPR License Required', rule_text: 'Statewide Florida Division of Hotels and Restaurants vacation rental license required before any local license.', severity: 'required', source_url: 'https://www.myfloridalicense.com/DBPR/hotels-restaurants/vacation-rentals/', last_verified: '2025-01-01', sort_order: 2 },
  { id: 'local-license', city_id: 'miami', category: 'permit', title: 'Local Municipality License Required', rule_text: 'In addition to the state license, a local city/county business license is required (City of Miami or Miami Beach).', severity: 'required', last_verified: '2025-01-01', sort_order: 3 },
  { id: 'miami-beach', city_id: 'miami', category: 'operations', title: 'Miami Beach Has Stricter Rules', rule_text: 'Miami Beach has additional restrictions including 75-decibel noise ordinances, strict fines, and de-listing enforcement.', severity: 'info', last_verified: '2025-01-01', sort_order: 4 },

  // SF
  { id: 'primary-residence', city_id: 'san-francisco', category: 'eligibility', title: 'Primary Residence Only', rule_text: 'Must be your primary residence — where you live for the majority of the year.', severity: 'required', source_url: 'https://shorttermrentals.sfgov.org/', last_verified: '2025-01-01', sort_order: 1 },
  { id: 'unhosted-cap', city_id: 'san-francisco', category: 'operations', title: '90-Day Unhosted Cap', rule_text: 'Unhosted rentals capped at 90 days per year. Hosted rentals have no annual cap.', severity: 'required', source_url: 'https://shorttermrentals.sfgov.org/', last_verified: '2025-01-01', sort_order: 2 },
  { id: 'registration', city_id: 'san-francisco', category: 'permit', title: 'SF Office of STR Registration', rule_text: '$250 one-time registration with SF Office of Short-Term Rentals. Number required on all listings. Platforms must verify before publishing.', severity: 'required', source_url: 'https://shorttermrentals.sfgov.org/', last_verified: '2025-01-01', sort_order: 3 },
  { id: 'hotel-tax', city_id: 'san-francisco', category: 'tax', title: '14% Hotel Tax', rule_text: 'Must collect and remit 14% SF Hotel Tax from all guests.', severity: 'required', last_verified: '2025-01-01', sort_order: 4 },
  { id: 'renter-eligible', city_id: 'san-francisco', category: 'eligibility', title: 'Renters May Apply', rule_text: 'Tenants may apply with landlord knowledge; lease must not explicitly prohibit subletting.', severity: 'conditional', last_verified: '2025-01-01', sort_order: 5 },

  // Seattle
  { id: 'operators-license', city_id: 'seattle', category: 'permit', title: 'Operator\'s License Required', rule_text: '$75/year operator\'s license per unit. Business license tax certificate also required.', severity: 'required', source_url: 'https://www.seattle.gov/license-and-tax-administration/business-license-tax/short-term-rentals', last_verified: '2025-01-01', sort_order: 1 },
  { id: 'max-units', city_id: 'seattle', category: 'eligibility', title: 'Maximum 2 STR Units', rule_text: 'Operators may hold licenses for at most 2 units. At least one must be the operator\'s primary residence.', severity: 'required', last_verified: '2025-01-01', sort_order: 2 },
  { id: 'primary-for-one', city_id: 'seattle', category: 'eligibility', title: 'One Unit Must Be Primary Residence', rule_text: 'If operating 2 units, at least one must be the operator\'s primary residence. The second must be their secondary residence.', severity: 'required', last_verified: '2025-01-01', sort_order: 3 },
  { id: 'safety', city_id: 'seattle', category: 'property', title: 'Safety Equipment Required', rule_text: 'Smoke detectors, CO detectors, and basic housing maintenance requirements must be met.', severity: 'required', last_verified: '2025-01-01', sort_order: 4 },

  // Austin
  { id: 'type1-license', city_id: 'austin', category: 'permit', title: 'Type 1 License (Owner-Occupied)', rule_text: 'For primary residence: $779.14 first-time, $437 annual renewal. License number required on all listings.', severity: 'required', source_url: 'https://austintexas.gov/department/short-term-rentals', last_verified: '2025-01-01', sort_order: 1 },
  { id: 'type2-license', city_id: 'austin', category: 'permit', title: 'Type 2 License (Non-Owner-Occupied)', rule_text: 'For non-primary properties: $779.14 first-time, $437 renewal. Restricted to max 3% of units per block face.', severity: 'conditional', source_url: 'https://austintexas.gov/department/short-term-rentals', last_verified: '2025-01-01', sort_order: 2 },
  { id: 'platform-verify', city_id: 'austin', category: 'operations', title: 'Platforms Must Verify License', rule_text: 'Airbnb, VRBO, and other platforms are required to verify a valid license number before publishing a listing.', severity: 'info', last_verified: '2025-01-01', sort_order: 3 },

  // Denver
  { id: 'primary-only', city_id: 'denver', category: 'eligibility', title: 'Primary Residence Only', rule_text: 'Must be your primary residence — property where you live 180+ days per year. One STR license per resident.', severity: 'required', source_url: 'https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Denver-Community-Planning-and-Development/Permits-and-Licenses/Short-Term-Rentals', last_verified: '2025-06-01', sort_order: 1 },
  { id: 'str-license', city_id: 'denver', category: 'permit', title: 'STR License + Business License', rule_text: 'Denver STR license ($25/year) AND Denver business license ($50) both required.', severity: 'required', last_verified: '2025-06-01', sort_order: 2 },
  { id: 'lodgers-tax', city_id: 'denver', category: 'tax', title: 'Lodger\'s Tax ID Required', rule_text: 'Must register for a Lodger\'s Tax ID with Denver Treasury and collect/remit 10.75% Lodger\'s Tax.', severity: 'required', last_verified: '2025-06-01', sort_order: 3 },

  // Houston
  { id: 'registration', city_id: 'houston', category: 'permit', title: 'Registration Required (Jan 2026)', rule_text: 'Houston STR registration required as of January 1, 2026. $275/year + $33.10 administrative fee. Number required on all listings.', severity: 'required', source_url: 'https://www.houstontx.gov/housing/short-term-rental.html', last_verified: '2026-01-01', sort_order: 1 },
  { id: 'non-primary', city_id: 'houston', category: 'eligibility', title: 'Non-Primary Residences Allowed', rule_text: 'Non-primary-residence properties may be registered as STRs.', severity: 'info', last_verified: '2026-01-01', sort_order: 2 },
  { id: 'emergency-contact', city_id: 'houston', category: 'operations', title: 'Local Emergency Contact Required', rule_text: 'Hosts must maintain a local emergency contact on file with the city.', severity: 'required', last_verified: '2026-01-01', sort_order: 3 },

  // Nashville
  { id: 'permit', city_id: 'nashville', category: 'permit', title: 'STRP Permit Required', rule_text: 'Short-Term Rental Property permit required: $313/year. Valid 365 days; annual renewal required.', severity: 'required', source_url: 'https://www.nashville.gov/departments/codes/short-term-rentals', last_verified: '2026-01-01', sort_order: 1 },
  { id: 'insurance', city_id: 'nashville', category: 'insurance', title: '$1M Liability Insurance Required', rule_text: '$1,000,000 minimum liability insurance coverage required to obtain permit. Proof must be submitted with application.', severity: 'required', source_url: 'https://www.nashville.gov/departments/codes/short-term-rentals', last_verified: '2026-01-01', sort_order: 2 },
  { id: 'max-bedrooms', city_id: 'nashville', category: 'property', title: 'Maximum 4 Bedrooms', rule_text: 'Properties with more than 4 bedrooms cannot be permitted as STRs.', severity: 'required', last_verified: '2026-01-01', sort_order: 3 },
  { id: 'owner-occupied', city_id: 'nashville', category: 'eligibility', title: 'Owner-Occupied: Must Be Natural Person', rule_text: 'Owner-occupied permits require the host to permanently reside at the property. LLCs, corporations, and trusts are ineligible.', severity: 'required', last_verified: '2026-01-01', sort_order: 4 },
  { id: 'non-owner-zoning', city_id: 'nashville', category: 'zoning', title: 'Non-Owner-Occupied: Restricted Zones', rule_text: 'Non-owner-occupied permits only issued in MUN, MUL, MUG, MUI, CN, CL, CS, CA, CF, DTC zones. Prohibited in AR2A, R, RS, RM zones.', severity: 'conditional', source_url: 'https://www.nashville.gov/departments/codes/short-term-rentals/permit-types', last_verified: '2026-01-01', sort_order: 5 },
  { id: 'neighbor-notice', city_id: 'nashville', category: 'operations', title: 'Neighbor Notification Required', rule_text: 'Non-owner-occupied applicants must provide documented notice to adjacent property owners before permit is issued.', severity: 'conditional', last_verified: '2026-01-01', sort_order: 6 },
  { id: 'floor-plan', city_id: 'nashville', category: 'property', title: 'Floor Plan Required', rule_text: 'A detailed floor plan identifying sleeping rooms, smoke detectors, and CO detectors must be submitted with the permit application.', severity: 'required', last_verified: '2026-01-01', sort_order: 7 },

  // New Orleans
  { id: 'permit', city_id: 'new-orleans', category: 'permit', title: 'STR Permit Required', rule_text: 'Short-term rental permit required from the New Orleans Short Term Rental Administration. Fees range $50–$500 based on type and size.', severity: 'required', source_url: 'https://nola.gov/short-term-rental-administration/', last_verified: '2025-01-01', sort_order: 1 },
  { id: 'homestead', city_id: 'new-orleans', category: 'eligibility', title: 'Homestead Exemption for Residential', rule_text: 'Homestead exemption required for owner-occupied/residential STR (NSTR) permits — limited to host\'s homestead property.', severity: 'required', last_verified: '2025-01-01', sort_order: 2 },
  { id: 'lottery', city_id: 'new-orleans', category: 'zoning', title: 'Block-Level Permit Lottery', rule_text: 'Some residential blocks have lottery-based permit caps. Even in eligible zones, your block may be at its limit.', severity: 'info', last_verified: '2025-01-01', sort_order: 3 },
  { id: 'inspection', city_id: 'new-orleans', category: 'property', title: 'Annual Inspection May Be Required', rule_text: 'Properties may be subject to annual inspections by the city.', severity: 'info', last_verified: '2025-01-01', sort_order: 4 },

  // DC
  { id: 'primary-residence', city_id: 'washington-dc', category: 'eligibility', title: 'Primary Residence Only', rule_text: 'Property must be your principal place of residence. Non-primary properties are not eligible.', severity: 'required', source_url: 'https://dlcp.dc.gov/page/short-term-rentals', last_verified: '2026-03-13', sort_order: 1 },
  { id: 'dlcp-license', city_id: 'washington-dc', category: 'permit', title: 'DLCP License Required', rule_text: 'License required through DC Department of Licensing and Consumer Protection. $70/year fee.', severity: 'required', source_url: 'https://dlcp.dc.gov/page/short-term-rentals', last_verified: '2026-03-13', sort_order: 2 },
  { id: 'insurance', city_id: 'washington-dc', category: 'insurance', title: '$250,000 Liability Insurance Required', rule_text: 'Minimum $250,000 liability insurance coverage required to obtain a license.', severity: 'required', source_url: 'https://dlcp.dc.gov/page/short-term-rentals', last_verified: '2026-03-13', sort_order: 3 },
  { id: 'max-stay', city_id: 'washington-dc', category: 'operations', title: 'Max 30 Consecutive Nights', rule_text: 'Each guest stay must not exceed 30 consecutive nights.', severity: 'required', last_verified: '2026-03-13', sort_order: 4 },
  { id: 'renters-2026', city_id: 'washington-dc', category: 'eligibility', title: 'Renters Now Eligible (2026 Law)', rule_text: 'As of 2026, renters may operate STRs at their primary residence unless unit is rent-stabilized or lease prohibits it.', severity: 'conditional', source_url: 'https://www.congressheightsontherise.com/blog/about-the-short-term-rental-regulation-amendment-act-of-2026', last_verified: '2026-03-13', sort_order: 5 },
];

export function seedDatabase(): void {
  const db = getDb();

  const upsertCity = db.prepare(`
    INSERT INTO cities (
      id, name, state, aliases, counties, permit_required, permit_fee, permit_renewal_fee,
      permit_link, primary_residence_required, hosted_day_limit, unhosted_day_limit,
      max_guests, allowed_zones, prohibited_zones, tax_rate, tax_note,
      liability_insurance_required, liability_insurance_min, max_bedrooms,
      requires_host_presence, non_owner_occupied_allowed, non_owner_occupied_zones,
      renters_allowed, last_updated, scrape_status
    ) VALUES (
      @id, @name, @state, @aliases, @counties, @permit_required, @permit_fee, @permit_renewal_fee,
      @permit_link, @primary_residence_required, @hosted_day_limit, @unhosted_day_limit,
      @max_guests, @allowed_zones, @prohibited_zones, @tax_rate, @tax_note,
      @liability_insurance_required, @liability_insurance_min, @max_bedrooms,
      @requires_host_presence, @non_owner_occupied_allowed, @non_owner_occupied_zones,
      @renters_allowed, @last_updated, 'seeded'
    )
    ON CONFLICT(id) DO UPDATE SET
      permit_fee = excluded.permit_fee,
      last_updated = excluded.last_updated
    WHERE cities.scrape_status = 'seeded'
  `);

  const upsertRule = db.prepare(`
    INSERT OR REPLACE INTO regulation_rules
      (id, city_id, category, title, rule_text, severity, source_url, last_verified, sort_order)
    VALUES
      (@id, @city_id, @category, @title, @rule_text, @severity, @source_url, @last_verified, @sort_order)
  `);

  const seedAll = db.transaction(() => {
    for (const city of CITIES) {
      upsertCity.run({
        ...city,
        aliases: JSON.stringify(city.aliases),
        counties: JSON.stringify(city.counties),
        allowed_zones: JSON.stringify(city.allowed_zones),
        prohibited_zones: JSON.stringify(city.prohibited_zones),
        non_owner_occupied_zones: JSON.stringify(city.non_owner_occupied_zones),
        permit_required: city.permit_required ? 1 : 0,
        primary_residence_required: city.primary_residence_required ? 1 : 0,
        liability_insurance_required: city.liability_insurance_required ? 1 : 0,
        non_owner_occupied_allowed: city.non_owner_occupied_allowed ? 1 : 0,
        renters_allowed: city.renters_allowed ? 1 : 0,
        requires_host_presence: city.requires_host_presence === null ? null : city.requires_host_presence ? 1 : 0,
        permit_renewal_fee: city.permit_renewal_fee ?? null,
      });
    }
    for (const rule of RULES) {
      upsertRule.run({ ...rule, source_url: rule.source_url ?? null });
    }
  });

  seedAll();
  console.log(`✓ Seeded ${CITIES.length} cities and ${RULES.length} regulation rules`);
}

// Run directly: tsx server/db/seed.ts
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase();
  process.exit(0);
}
