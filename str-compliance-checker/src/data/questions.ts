import type { Question } from '../types';
import type { CityRegulation } from '../types';

export function getQuestionsForCity(city: CityRegulation): Question[] {
  const questions: Question[] = [
    {
      id: 'isPrimaryResidence',
      text: 'Is this your primary residence?',
      subtext: 'Where you live for the majority of the year (typically 183+ days).',
      type: 'boolean',
    },
    {
      id: 'ownershipType',
      text: 'Do you own or rent this property?',
      type: 'select',
      options: [
        { value: 'own', label: 'I own the property' },
        { value: 'rent', label: 'I rent/lease the property' },
      ],
    },
    {
      id: 'propertyType',
      text: 'What type of property is this?',
      type: 'select',
      options: [
        { value: 'single-family', label: 'Single-family home' },
        { value: 'condo', label: 'Condominium' },
        { value: 'apartment', label: 'Apartment' },
        { value: 'multi-family', label: 'Multi-family (duplex, triplex, etc.)' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      id: 'hasHOA',
      text: 'Is this property part of a Homeowners Association (HOA)?',
      subtext: 'HOAs may have their own rules prohibiting short-term rentals.',
      type: 'boolean',
    },
    {
      id: 'bedroomCount',
      text: 'How many bedrooms does the rental have?',
      type: 'number',
      min: 0,
      max: 20,
      placeholder: 'e.g. 2',
    },
    {
      id: 'isEntireUnit',
      text: 'Will you be renting out the entire unit?',
      subtext: 'Or just a private room within your home.',
      type: 'boolean',
    },
    {
      id: 'isHosted',
      text: 'Will you be present in the property during guest stays?',
      subtext: 'Hosted = you are present. Unhosted = guests have the place to themselves.',
      type: 'boolean',
    },
    {
      id: 'daysPerYear',
      text: 'How many days per year do you plan to rent?',
      subtext: 'Estimate the total days across all bookings per calendar year.',
      type: 'number',
      min: 1,
      max: 365,
      placeholder: 'e.g. 90',
    },
    {
      id: 'guestsAtOnce',
      text: 'What is the maximum number of guests at one time?',
      type: 'number',
      min: 1,
      max: 30,
      placeholder: 'e.g. 4',
    },
    {
      id: 'hasPermit',
      text: `Do you already have a valid ${city.name} short-term rental permit or registration?`,
      type: 'boolean',
    },
  ];

  // Add zoning question for Miami and Nashville (zoning is critical)
  if (city.id === 'miami' || city.id === 'nashville') {
    questions.push({
      id: 'zoningType',
      text: "What is your property's primary zoning designation?",
      subtext: `This is critical in ${city.name}. You can look this up on the city's zoning map.`,
      type: 'select',
      options: [
        { value: 'residential', label: 'Residential (R1, R2, RS, RM, etc.)' },
        { value: 'commercial', label: 'Commercial (C1, C2, BU, etc.)' },
        { value: 'mixed-use', label: 'Mixed-use (MU, MUN, MUL, DTC, etc.)' },
        { value: 'unknown', label: "I'm not sure" },
      ],
    });
  }

  // Insurance questions for cities that require it
  if (city.liabilityInsuranceRequired) {
    questions.push({
      id: 'hasLiabilityInsurance',
      text: 'Do you have liability insurance for this property?',
      subtext: `${city.name} requires a minimum of $${city.liabilityInsuranceMin?.toLocaleString()} in liability coverage.`,
      type: 'boolean',
    });
    questions.push({
      id: 'insuranceCoverage',
      text: 'What is your liability insurance coverage amount? (in USD)',
      subtext: `Minimum required: $${city.liabilityInsuranceMin?.toLocaleString()}`,
      type: 'number',
      min: 0,
      max: 10000000,
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
