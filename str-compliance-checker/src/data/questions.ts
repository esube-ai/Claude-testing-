import type { Question, CityData } from '../types';

export function getQuestionsForCity(city: CityData): Question[] {
  const questions: Question[] = [
    {
      id: 'isPrimaryResidence',
      text: 'Is this your primary residence?',
      subtext: 'Where you physically live for the majority of the year (typically 183+ days).',
      type: 'boolean',
    },
    {
      id: 'ownershipType',
      text: 'Do you own or rent this property?',
      type: 'select',
      options: [
        { value: 'own', label: 'I own the property' },
        { value: 'rent', label: 'I rent / lease the property' },
      ],
    },
    {
      id: 'propertyType',
      text: 'What type of property is this?',
      type: 'select',
      options: [
        { value: 'single-family', label: 'Single-family home' },
        { value: 'condo', label: 'Condominium / co-op' },
        { value: 'apartment', label: 'Apartment' },
        { value: 'multi-family', label: 'Multi-family (duplex, triplex…)' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      id: 'hasHOA',
      text: 'Is this property part of a Homeowners Association (HOA)?',
      subtext: 'HOAs often have their own rules that can override city permits.',
      type: 'boolean',
    },
    {
      id: 'bedroomCount',
      text: 'How many bedrooms does the rental have?',
      type: 'number', min: 0, max: 20, placeholder: 'e.g. 2',
    },
    {
      id: 'isEntireUnit',
      text: 'Are you renting out the entire unit?',
      subtext: 'Or just a private room within your home.',
      type: 'boolean',
    },
    {
      id: 'isHosted',
      text: 'Will you be present in the property during guest stays?',
      subtext: 'Hosted = you stay there too. Unhosted = guests have the place to themselves.',
      type: 'boolean',
    },
    {
      id: 'daysPerYear',
      text: 'How many days per year do you plan to rent?',
      subtext: 'Total estimated days across all bookings in one calendar year.',
      type: 'number', min: 1, max: 365, placeholder: 'e.g. 90',
    },
    {
      id: 'guestsAtOnce',
      text: 'Maximum number of guests at one time?',
      type: 'number', min: 1, max: 30, placeholder: 'e.g. 4',
    },
    {
      id: 'hasPermit',
      text: `Do you already have a valid ${city.name} STR permit or registration?`,
      type: 'boolean',
    },
  ];

  // Zoning only matters for Miami and Nashville
  if (city.id === 'miami' || city.id === 'nashville') {
    questions.push({
      id: 'zoningType',
      text: "What is your property's zoning designation?",
      subtext: `Critical in ${city.name} — look yours up on the city's zoning map.`,
      type: 'select',
      options: [
        { value: 'residential', label: 'Residential (R1, R2, RS, RM, AR2A…)' },
        { value: 'commercial', label: 'Commercial (C1, C2, BU, CA…)' },
        { value: 'mixed-use', label: 'Mixed-use / urban (MUN, MUL, DTC, CN…)' },
        { value: 'unknown', label: "I'm not sure" },
      ],
    });
  }

  // Insurance questions
  if (city.liabilityInsuranceRequired) {
    questions.push({
      id: 'hasLiabilityInsurance',
      text: 'Do you have liability insurance for this property?',
      subtext: `${city.name} requires a minimum of $${city.liabilityInsuranceMin?.toLocaleString()} in coverage.`,
      type: 'boolean',
    });
    questions.push({
      id: 'insuranceCoverage',
      text: 'What is your liability insurance coverage amount? ($)',
      subtext: `Minimum required: $${city.liabilityInsuranceMin?.toLocaleString()}`,
      type: 'number', min: 0, max: 10_000_000,
      placeholder: `e.g. ${city.liabilityInsuranceMin?.toLocaleString()}`,
      dependsOn: { field: 'hasLiabilityInsurance', value: true },
    });
  } else {
    questions.push({
      id: 'hasLiabilityInsurance',
      text: 'Do you have liability insurance for this rental?',
      subtext: 'Not legally required in this city, but strongly recommended.',
      type: 'boolean',
    });
  }

  return questions;
}
