import type { CityRow, RuleRow } from '../db/index.js';
import { rowToCity } from '../db/index.js';

export interface Answers {
  isPrimaryResidence: boolean | null;
  ownershipType: 'own' | 'rent' | null;
  daysPerYear: number | null;
  isHosted: boolean | null;
  guestsAtOnce: number | null;
  hasPermit: boolean | null;
  propertyType: string | null;
  hasHOA: boolean | null;
  bedroomCount: number | null;
  zoningType: 'residential' | 'commercial' | 'mixed-use' | 'unknown' | null;
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
  dataSource: 'live' | 'scraped' | 'seeded' | 'scrape_failed';
  scrapedAt: string | null;
  lastUpdated: string;
}

function rule(
  id: string, title: string, description: string, severity: Severity,
  category: string, recommendation?: string, officialLink?: string
): ComplianceRule {
  return { id, title, description, severity, recommendation, officialLink, category };
}

export function runComplianceEngine(
  cityRow: CityRow,
  ruleRows: RuleRow[],
  answers: Answers
): ComplianceResult {
  const city = rowToCity(cityRow);
  const rules: ComplianceRule[] = [];
  let failCount = 0;
  let warnCount = 0;

  // ── Primary Residence ──────────────────────────────────────────────────────
  if (city.primaryResidenceRequired) {
    if (answers.isPrimaryResidence === false) {
      rules.push(rule('primary-residence', 'Primary Residence Required',
        `${city.name} requires that the property you rent be your primary residence.`,
        'fail', 'eligibility',
        'You cannot legally operate a short-term rental at a non-primary-residence address under current regulations.',
        city.permitLink));
      failCount++;
    } else if (answers.isPrimaryResidence === true) {
      rules.push(rule('primary-residence', 'Primary Residence ✓',
        `Your property qualifies as a primary residence — meeting ${city.name}'s key eligibility requirement.`,
        'pass', 'eligibility'));
    }
  } else if (answers.isPrimaryResidence === false && !city.nonOwnerOccupiedAllowed) {
    rules.push(rule('primary-residence', 'Non-Primary Residence Not Eligible',
      `${city.name} does not permit STRs at non-primary residences.`,
      'fail', 'eligibility', undefined, city.permitLink));
    failCount++;
  } else if (answers.isPrimaryResidence === false && city.nonOwnerOccupiedAllowed) {
    const zoneNote = city.nonOwnerOccupiedZones.length > 0
      ? `Only in zones: ${city.nonOwnerOccupiedZones.slice(0, 6).join(', ')}${city.nonOwnerOccupiedZones.length > 6 ? '…' : ''}.`
      : undefined;
    rules.push(rule('primary-residence', 'Non-Primary Residence Allowed',
      `${city.name} allows non-primary-residence STRs, but additional zone and license restrictions apply.`,
      'info', 'eligibility', zoneNote, city.permitLink));
  }

  // ── Ownership / Renters ────────────────────────────────────────────────────
  if (answers.ownershipType === 'rent') {
    if (!city.rentersAllowed) {
      rules.push(rule('renters', 'Renters Not Eligible',
        `${city.name} requires property ownership to operate a short-term rental.`,
        'fail', 'eligibility',
        'The property owner would need to obtain the permit. You may not list as a renter.',
        city.permitLink));
      failCount++;
    } else {
      rules.push(rule('renters', 'Renters May Qualify',
        `${city.name} allows renters to operate STRs at their primary residence.`,
        'warning', 'eligibility',
        'Review your lease agreement for any subletting restrictions before listing.'));
      warnCount++;
    }
  }

  // ── Host Presence ──────────────────────────────────────────────────────────
  if (city.requiresHostPresence === true) {
    if (answers.isHosted === false) {
      rules.push(rule('host-presence', 'Host Must Be Present (Unhosted Banned)',
        `${city.name} requires the host to be physically present during all guest stays. Unhosted rentals under 30 days are prohibited.`,
        'fail', 'operations',
        'You must be present in the dwelling during all guest stays to comply.',
        city.permitLink));
      failCount++;
    } else if (answers.isHosted === true) {
      rules.push(rule('host-presence', 'Hosted Rental ✓',
        'You plan to be present during guest stays, satisfying the host-presence requirement.',
        'pass', 'operations'));
    }
  }

  // ── Day Limits ─────────────────────────────────────────────────────────────
  if (city.id === 'nyc' && answers.isHosted === false) {
    rules.push(rule('unhosted-ban', 'Unhosted Rentals Prohibited',
      'NYC Local Law 18 prohibits unhosted rentals of less than 30 days.',
      'fail', 'operations',
      'You must be present during all guest stays.', city.permitLink));
    failCount++;
  } else if (answers.daysPerYear !== null) {
    const limit = answers.isHosted ? city.hostedDayLimit : city.unhostedDayLimit;
    if (limit !== null) {
      if (answers.daysPerYear > limit) {
        rules.push(rule('day-limit', 'Annual Day Limit Exceeded',
          `You plan ${answers.daysPerYear} days/year; ${city.name} caps ${answers.isHosted ? 'hosted' : 'unhosted'} rentals at ${limit} days/year.`,
          'fail', 'operations',
          `Reduce rental days to ${limit} or fewer per calendar year.`, city.permitLink));
        failCount++;
      } else {
        rules.push(rule('day-limit', `Within ${limit}-Day Annual Limit ✓`,
          `${answers.daysPerYear} days/year is within ${city.name}'s ${limit}-day cap for ${answers.isHosted ? 'hosted' : 'unhosted'} rentals.`,
          'pass', 'operations'));
      }
    }
  }

  // ── Max Guests ─────────────────────────────────────────────────────────────
  if (city.maxGuests !== null && answers.guestsAtOnce !== null) {
    if (answers.guestsAtOnce > city.maxGuests) {
      rules.push(rule('max-guests', 'Guest Limit Exceeded',
        `${answers.guestsAtOnce} guests exceeds ${city.name}'s maximum of ${city.maxGuests} simultaneous guests.`,
        'fail', 'operations',
        `Limit simultaneous guests to ${city.maxGuests}.`, city.permitLink));
      failCount++;
    } else {
      rules.push(rule('max-guests', `Guest Count Within Limit ✓`,
        `${answers.guestsAtOnce} guests is within ${city.name}'s ${city.maxGuests}-guest limit.`,
        'pass', 'operations'));
    }
  }

  // ── Bedrooms ───────────────────────────────────────────────────────────────
  if (city.maxBedrooms !== null && answers.bedroomCount !== null) {
    if (answers.bedroomCount > city.maxBedrooms) {
      rules.push(rule('bedrooms', 'Bedroom Limit Exceeded',
        `${answers.bedroomCount} bedrooms exceeds ${city.name}'s maximum of ${city.maxBedrooms} sleeping rooms per STR permit.`,
        'fail', 'property',
        `Only properties with ${city.maxBedrooms} or fewer bedrooms can be permitted.`, city.permitLink));
      failCount++;
    } else {
      rules.push(rule('bedrooms', 'Bedroom Count Compliant ✓',
        `${answers.bedroomCount} bedroom(s) is within the ${city.maxBedrooms}-bedroom limit.`,
        'pass', 'property'));
    }
  }

  // ── Insurance ──────────────────────────────────────────────────────────────
  if (city.liabilityInsuranceRequired) {
    if (answers.hasLiabilityInsurance === false) {
      rules.push(rule('insurance', 'Liability Insurance Required',
        `${city.name} requires at least $${city.liabilityInsuranceMin?.toLocaleString()} in liability insurance to obtain a permit.`,
        'fail', 'insurance',
        `Obtain a policy with a minimum of $${city.liabilityInsuranceMin?.toLocaleString()} before applying.`,
        city.permitLink));
      failCount++;
    } else if (
      answers.hasLiabilityInsurance === true &&
      city.liabilityInsuranceMin !== null &&
      answers.insuranceCoverage !== null &&
      answers.insuranceCoverage < city.liabilityInsuranceMin
    ) {
      rules.push(rule('insurance-amount', 'Insurance Coverage Too Low',
        `Your $${answers.insuranceCoverage.toLocaleString()} coverage is below the required $${city.liabilityInsuranceMin.toLocaleString()}.`,
        'fail', 'insurance',
        `Increase coverage to at least $${city.liabilityInsuranceMin.toLocaleString()}.`, city.permitLink));
      failCount++;
    } else if (answers.hasLiabilityInsurance === true) {
      rules.push(rule('insurance', 'Liability Insurance ✓',
        'Your insurance meets the required coverage.', 'pass', 'insurance'));
    }
  } else if (answers.hasLiabilityInsurance === false) {
    rules.push(rule('insurance-rec', 'Consider Liability Insurance',
      `Not legally required in ${city.name}, but strongly recommended for all STR hosts.`,
      'warning', 'insurance',
      'Airbnb AirCover provides $1M protection. A standalone vacation rental policy offers additional coverage.'));
    warnCount++;
  }

  // ── Permit ─────────────────────────────────────────────────────────────────
  if (city.permitRequired) {
    if (answers.hasPermit === false) {
      rules.push(rule('permit', 'Permit/Registration Not Yet Obtained',
        `You need a ${city.name} STR permit before listing. Cost: ${city.permitFee}.`,
        'warning', 'permit',
        'Apply at the link below before activating any listing.', city.permitLink));
      warnCount++;
    } else if (answers.hasPermit === true) {
      rules.push(rule('permit', 'Permit/Registration in Hand ✓',
        `You have a valid ${city.name} STR permit — a core legal requirement.`, 'pass', 'permit'));
    }
  }

  // ── Miami Zoning ───────────────────────────────────────────────────────────
  if (city.id === 'miami') {
    if (answers.zoningType === 'residential') {
      rules.push(rule('zoning', 'Residential Zone — STRs Prohibited',
        'Short-term rentals are banned in Miami-Dade residential zones (R1, R2, R3, RS, RPS).',
        'fail', 'zoning',
        'STRs are only permitted in commercial, mixed-use, and tourist-zoned properties. Check your zoning at miamidade.gov.',
        city.permitLink));
      failCount++;
    } else if (answers.zoningType === 'commercial' || answers.zoningType === 'mixed-use') {
      rules.push(rule('zoning', 'Zone May Permit STRs',
        'Commercial/mixed-use zones can permit short-term rentals in Miami.',
        'info', 'zoning',
        'Confirm your exact zoning code and obtain both the state DBPR license and local municipality license.',
        city.permitLink));
    } else {
      rules.push(rule('zoning', 'Verify Your Zoning Code',
        'Miami STRs are heavily restricted by zone. Most residential zones are prohibited.',
        'warning', 'zoning',
        'Look up your exact zoning designation at the Miami-Dade Zoning portal before proceeding.'));
      warnCount++;
    }
  }

  // ── Nashville Non-Owner Zoning ─────────────────────────────────────────────
  if (city.id === 'nashville' && answers.isPrimaryResidence === false) {
    if (answers.zoningType === 'residential') {
      rules.push(rule('zoning', 'Residential Zone — Non-Owner STR Prohibited',
        'Non-owner-occupied STR permits are NOT allowed in AR2A, R, RS, or RM zones in Nashville.',
        'fail', 'zoning',
        'Check your zone at maps.nashville.gov. Non-owner permits require MUN, MUL, MUG, DTC, or commercial zoning.',
        city.permitLink));
      failCount++;
    } else if (answers.zoningType === 'commercial' || answers.zoningType === 'mixed-use') {
      rules.push(rule('zoning', 'Zone Eligible for Non-Owner STR',
        'Your commercial/mixed-use zone may qualify for a non-owner-occupied Nashville permit.',
        'pass', 'zoning'));
    }
  }

  // ── HOA Warning ────────────────────────────────────────────────────────────
  if (answers.hasHOA === true) {
    rules.push(rule('hoa', 'HOA Rules May Override City Permit',
      'Your property is in an HOA. Many HOAs prohibit or restrict STRs independent of city regulations.',
      'warning', 'property',
      'Review CC&Rs and contact your HOA board before listing. An HOA ban is enforceable even with a valid city permit.'));
    warnCount++;
  }

  // ── DC Max Stay ────────────────────────────────────────────────────────────
  if (city.id === 'washington-dc' && answers.daysPerYear !== null) {
    rules.push(rule('dc-max-stay', 'Max 30 Consecutive Nights per Stay',
      'Each individual guest stay must not exceed 30 consecutive nights.',
      'info', 'operations',
      'Structure bookings to ensure no single stay exceeds 30 nights.'));
  }

  // ── Seattle 2-Unit Limit ───────────────────────────────────────────────────
  if (city.id === 'seattle') {
    rules.push(rule('seattle-unit-limit', 'Maximum 2 STR Units per Operator',
      'Seattle allows at most 2 licensed STR units; at least one must be the operator\'s primary residence.',
      'info', 'eligibility',
      'If operating a second unit, it must be your secondary residence. LLCs cannot hold a primary-residence operator\'s license.'));
  }

  // ── Tax Info ───────────────────────────────────────────────────────────────
  if (city.taxRate !== null) {
    rules.push(rule('tax', `${city.taxRate}% Occupancy Tax`,
      city.taxNote, 'info', 'tax',
      'Verify that your booking platform collects and remits this tax automatically in your city. If not, you must remit directly.'));
  }

  // ── NYC Door Locks ─────────────────────────────────────────────────────────
  if (city.id === 'nyc') {
    rules.push(rule('nyc-door-locks', 'No Locks on Bedroom Doors',
      'NYC Local Law 18 prohibits locks on bedroom doors in registered STRs.',
      'info', 'property',
      'Remove any locks from bedroom doors in the rented space before hosting.', city.permitLink));
  }

  // ── Overall Status ─────────────────────────────────────────────────────────
  const passCount = rules.filter(r => r.severity === 'pass').length;
  const total = passCount + failCount + warnCount;
  const score = total === 0 ? 50 : Math.round(((passCount + warnCount * 0.5) / total) * 100);

  const overallStatus: ComplianceResult['overallStatus'] =
    failCount > 0 ? 'non-compliant' :
    warnCount > 0 || answers.hasPermit === false ? 'needs-registration' :
    passCount > 0 ? 'compliant' : 'likely-compliant';

  return {
    cityId: city.id,
    cityName: city.name,
    overallStatus,
    score,
    rules,
    registrationRequired: city.permitRequired,
    registrationFee: city.permitFee,
    registrationLink: city.permitLink,
    keyRequirements: ruleRows
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(r => ({ title: r.title, text: r.rule_text, severity: r.severity, category: r.category })),
    taxes: city.taxNote ? [city.taxNote] : [],
    dataSource: (cityRow.scrape_status as ComplianceResult['dataSource']) ?? 'seeded',
    scrapedAt: cityRow.scraped_at,
    lastUpdated: cityRow.last_updated,
  };
}
