import type { Answers, CityRegulation, ComplianceResult, ComplianceRule, Severity } from '../types';

function rule(
  id: string,
  title: string,
  description: string,
  severity: Severity,
  recommendation?: string,
  officialLink?: string
): ComplianceRule {
  return { id, title, description, severity, recommendation, officialLink };
}

export function checkCompliance(city: CityRegulation, answers: Answers): ComplianceResult {
  const rules: ComplianceRule[] = [];
  let failCount = 0;
  let warnCount = 0;

  // ── Primary Residence ──────────────────────────────────────────────────────
  if (city.primaryResidenceRequired) {
    if (answers.isPrimaryResidence === false) {
      rules.push(rule(
        'primary-residence',
        'Primary Residence Required',
        `${city.name} requires that the property you rent be your primary residence.`,
        'fail',
        'You may not legally operate a short-term rental at this address under current regulations.',
        city.permitLink
      ));
      failCount++;
    } else if (answers.isPrimaryResidence === true) {
      rules.push(rule(
        'primary-residence',
        'Primary Residence',
        `Your property qualifies as a primary residence — a key requirement in ${city.name}.`,
        'pass'
      ));
    }
  } else if (city.nonOwnerOccupiedAllowed && answers.isPrimaryResidence === false) {
    rules.push(rule(
      'primary-residence',
      'Non-Primary Residence Allowed',
      `${city.name} allows non-primary-residence STRs, but additional restrictions may apply.`,
      'info',
      city.nonOwnerOccupiedZones.length > 0
        ? `Non-owner-occupied permits are only issued in specific zones: ${city.nonOwnerOccupiedZones.join(', ')}.`
        : undefined,
      city.permitLink
    ));
  }

  // ── Renters ────────────────────────────────────────────────────────────────
  if (answers.ownershipType === 'rent') {
    if (!city.rentersAllowed) {
      rules.push(rule(
        'renters',
        'Renters Not Eligible',
        `${city.name} requires that you own the property to operate a short-term rental.`,
        'fail',
        'Contact your landlord or property owner; they would need to obtain the permit.',
        city.permitLink
      ));
      failCount++;
    } else {
      rules.push(rule(
        'renters',
        'Renters May Qualify',
        `${city.name} allows renters to operate STRs at their primary residence.`,
        'warning',
        'Check your lease agreement for any restrictions on subletting before listing.',
      ));
      warnCount++;
    }
  }

  // ── Host Presence / Hosted vs Unhosted ────────────────────────────────────
  if (city.requiresHostPresence === true && answers.isHosted === false) {
    rules.push(rule(
      'host-presence',
      'Host Must Be Present',
      `${city.name} requires the host to be present during all guest stays (no unhosted rentals).`,
      'fail',
      'You must be present in the dwelling during all guest stays to comply with Local Law 18.',
      city.permitLink
    ));
    failCount++;
  } else if (city.requiresHostPresence === true && answers.isHosted === true) {
    rules.push(rule(
      'host-presence',
      'Hosted Rental — Compliant',
      'You plan to be present during guest stays, meeting the host-presence requirement.',
      'pass'
    ));
  }

  // ── Annual Day Limit ───────────────────────────────────────────────────────
  const dayLimit = answers.isHosted ? city.hostedDayLimit : city.unhostedDayLimit;
  if (answers.daysPerYear !== null && dayLimit !== null) {
    if (answers.daysPerYear > dayLimit) {
      rules.push(rule(
        'day-limit',
        'Annual Day Limit Exceeded',
        `You plan to rent ${answers.daysPerYear} days/year, but ${city.name} allows a maximum of ${dayLimit} days for ${answers.isHosted ? 'hosted' : 'unhosted'} rentals.`,
        'fail',
        `Reduce your rental days to ${dayLimit} or fewer per calendar year to stay compliant.`,
        city.permitLink
      ));
      failCount++;
    } else if (dayLimit !== null) {
      rules.push(rule(
        'day-limit',
        'Within Annual Day Limit',
        `${answers.daysPerYear} days/year is within the ${dayLimit}-day limit for ${answers.isHosted ? 'hosted' : 'unhosted'} rentals.`,
        'pass'
      ));
    }
  } else if (city.id === 'nyc' && answers.isHosted === false && (answers.daysPerYear ?? 0) > 0) {
    rules.push(rule(
      'nyc-unhosted-ban',
      'Unhosted Rentals Effectively Banned',
      'NYC Local Law 18 does not permit unhosted rentals of less than 30 days.',
      'fail',
      'You must be physically present in the dwelling during all guest stays.',
      city.permitLink
    ));
    failCount++;
  }

  // ── Max Guests ─────────────────────────────────────────────────────────────
  if (city.maxGuests !== null && answers.guestsAtOnce !== null) {
    if (answers.guestsAtOnce > city.maxGuests) {
      rules.push(rule(
        'max-guests',
        'Guest Limit Exceeded',
        `You plan to accommodate ${answers.guestsAtOnce} guests at once, but ${city.name} allows a maximum of ${city.maxGuests}.`,
        'fail',
        `Limit simultaneous guests to ${city.maxGuests}.`,
        city.permitLink
      ));
      failCount++;
    } else {
      rules.push(rule(
        'max-guests',
        'Guest Count Compliant',
        `${answers.guestsAtOnce} guests is within ${city.name}'s ${city.maxGuests}-guest limit.`,
        'pass'
      ));
    }
  }

  // ── Bedroom Count ──────────────────────────────────────────────────────────
  if (city.maxBedrooms !== null && answers.bedroomCount !== null) {
    if (answers.bedroomCount > city.maxBedrooms) {
      rules.push(rule(
        'bedrooms',
        'Bedroom Limit Exceeded',
        `Your property has ${answers.bedroomCount} bedrooms; ${city.name} permits a maximum of ${city.maxBedrooms} sleeping rooms per STR permit.`,
        'fail',
        `Only properties with ${city.maxBedrooms} or fewer bedrooms can obtain an STR permit.`,
        city.permitLink
      ));
      failCount++;
    } else {
      rules.push(rule(
        'bedrooms',
        'Bedroom Count Within Limit',
        `${answers.bedroomCount} bedroom(s) is within the ${city.maxBedrooms}-bedroom limit.`,
        'pass'
      ));
    }
  }

  // ── Liability Insurance ────────────────────────────────────────────────────
  if (city.liabilityInsuranceRequired) {
    if (answers.hasLiabilityInsurance === false) {
      rules.push(rule(
        'insurance',
        'Liability Insurance Required',
        `${city.name} requires liability insurance coverage of at least $${city.liabilityInsuranceMin?.toLocaleString()} to obtain a permit.`,
        'fail',
        `Obtain a liability insurance policy with a minimum of $${city.liabilityInsuranceMin?.toLocaleString()} coverage before applying for a permit.`,
        city.permitLink
      ));
      failCount++;
    } else if (
      answers.hasLiabilityInsurance === true &&
      city.liabilityInsuranceMin !== null &&
      answers.insuranceCoverage !== null &&
      answers.insuranceCoverage < city.liabilityInsuranceMin
    ) {
      rules.push(rule(
        'insurance-amount',
        'Insurance Coverage Insufficient',
        `Your coverage of $${answers.insuranceCoverage.toLocaleString()} is below the required minimum of $${city.liabilityInsuranceMin.toLocaleString()}.`,
        'fail',
        `Increase your liability insurance to at least $${city.liabilityInsuranceMin.toLocaleString()}.`,
        city.permitLink
      ));
      failCount++;
    } else if (answers.hasLiabilityInsurance === true) {
      rules.push(rule(
        'insurance',
        'Liability Insurance Confirmed',
        `You have liability insurance — meeting ${city.name}'s coverage requirement.`,
        'pass'
      ));
    }
  } else if (answers.hasLiabilityInsurance === false) {
    rules.push(rule(
      'insurance-recommendation',
      'Liability Insurance Recommended',
      `${city.name} does not legally require liability insurance, but it is strongly recommended for all STR hosts.`,
      'warning',
      'Airbnb AirCover provides $1M liability coverage. Consider a separate landlord or vacation rental policy.',
    ));
    warnCount++;
  }

  // ── Permit/Registration ────────────────────────────────────────────────────
  if (city.permitRequired) {
    if (answers.hasPermit === false) {
      rules.push(rule(
        'permit',
        'Registration/Permit Needed',
        `${city.name} requires a permit/registration before you can legally list your property (${city.permitFee}).`,
        'warning',
        `Apply for your STR permit at the link below before listing on any platform.`,
        city.permitLink
      ));
      warnCount++;
    } else if (answers.hasPermit === true) {
      rules.push(rule(
        'permit',
        'Permit/Registration in Hand',
        `You have a valid permit — a core requirement in ${city.name}.`,
        'pass'
      ));
    }
  }

  // ── Zoning ─────────────────────────────────────────────────────────────────
  if (city.id === 'miami') {
    if (answers.zoningType === 'residential') {
      rules.push(rule(
        'zoning-miami',
        'Residential Zoning — STRs Banned',
        'Short-term rentals are prohibited in Miami-Dade residential zones (R1, R2, R3, RS, RPS).',
        'fail',
        'STRs are only allowed in commercial, mixed-use, and tourist-zoned areas. Check your specific zoning designation at miamidade.gov.',
        city.permitLink
      ));
      failCount++;
    } else if (answers.zoningType === 'commercial' || answers.zoningType === 'mixed-use') {
      rules.push(rule(
        'zoning-miami',
        'Zoning May Allow STRs',
        'Commercial and mixed-use zones may permit short-term rentals in Miami.',
        'info',
        'Verify your specific zoning code at miamidade.gov and obtain all required local and state licenses.',
        city.permitLink
      ));
    } else {
      rules.push(rule(
        'zoning-miami',
        'Verify Zoning Code',
        'STRs in Miami are restricted by zoning. Most residential zones are prohibited.',
        'warning',
        'Check your property\'s exact zoning designation at the Miami-Dade Zoning portal before proceeding.',
        city.permitLink
      ));
      warnCount++;
    }
  } else if (city.id === 'nashville' && answers.isPrimaryResidence === false) {
    if (answers.zoningType === 'residential') {
      rules.push(rule(
        'zoning-nashville',
        'Non-Owner-Occupied STR May Be Prohibited',
        'Non-owner-occupied STR permits are NOT allowed in AR2A, R, RS, and RM zones in Nashville.',
        'warning',
        'Verify your zoning code at maps.nashville.gov. Non-owner permits require MUN, MUL, MUG, DTC, CN, or similar commercial/mixed zones.',
        city.permitLink
      ));
      warnCount++;
    }
  }

  // ── HOA Warning ────────────────────────────────────────────────────────────
  if (answers.hasHOA === true) {
    rules.push(rule(
      'hoa',
      'HOA May Restrict STRs',
      'Your property is in an HOA. Many HOAs prohibit or restrict short-term rentals regardless of city law.',
      'warning',
      'Review your HOA CC&Rs and contact your HOA board before listing. City regulations do not override HOA rules.',
    ));
    warnCount++;
  }

  // ── Tax Reminder ───────────────────────────────────────────────────────────
  if (city.taxRate !== null) {
    rules.push(rule(
      'tax',
      `Tax Obligation: ${city.taxRate}%`,
      city.taxNote,
      'info',
      'Most major platforms (Airbnb, VRBO) collect and remit occupancy taxes automatically in major cities. Verify this for your city and platform.',
    ));
  }

  // ── NYC Bedroom Door Lock Warning ──────────────────────────────────────────
  if (city.id === 'nyc') {
    rules.push(rule(
      'nyc-door-locks',
      'No Locks on Bedroom Doors',
      'NYC Local Law 18 prohibits locks on bedroom doors in registered short-term rentals.',
      'info',
      'Remove any locks from bedroom doors in the rented space before hosting guests.',
      city.permitLink
    ));
  }

  // ── Seattle: Max 2 Units ───────────────────────────────────────────────────
  if (city.id === 'seattle') {
    rules.push(rule(
      'seattle-units',
      'Maximum 2 STR Units',
      'Seattle allows a maximum of 2 short-term rental units per operator; at least one must be your primary residence.',
      'info',
      'If operating a second unit, it must be your secondary residence. LLCs and corporations may not hold operator licenses for the primary residence unit.',
      city.permitLink
    ));
  }

  // ── Determine overall status ───────────────────────────────────────────────
  let overallStatus: ComplianceResult['overallStatus'];
  const passCount = rules.filter(r => r.severity === 'pass').length;
  const totalScorable = passCount + failCount + warnCount;
  const score = totalScorable === 0 ? 50 : Math.round(((passCount + warnCount * 0.5) / totalScorable) * 100);

  if (failCount > 0) {
    overallStatus = 'non-compliant';
  } else if (warnCount > 0 || answers.hasPermit === false) {
    overallStatus = 'needs-registration';
  } else if (passCount > 0) {
    overallStatus = 'compliant';
  } else {
    overallStatus = 'likely-compliant';
  }

  return {
    cityId: city.id,
    cityName: city.name,
    overallStatus,
    score,
    rules,
    registrationRequired: city.permitRequired,
    registrationFee: city.permitFee,
    registrationLink: city.permitLink,
    keyRequirements: city.keyRules,
    taxes: city.taxNote ? [city.taxNote] : [],
  };
}
