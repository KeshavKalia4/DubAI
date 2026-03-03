import { Organization } from '@/types';

export const organizations: Organization[] = [
  {
    id: 'uw-seattle',
    name: 'University of Washington',
    domains: ['uw.edu', 'washington.edu'],
    branding: {
      primaryColor: '#4b2e83',
      secondaryColor: '#b7a57a',
    },
    onboardingConfig: {
      majors: [
        'Informatics',
        'Computer Science',
        'Business Administration',
        'Engineering',
        'Psychology',
        'Biology',
        'Communications',
        'Design',
      ],
      campuses: ['Seattle', 'Bothell', 'Tacoma'],
      years: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'PhD'],
    },
  },
  {
    id: 'wsu-pullman',
    name: 'Washington State University',
    domains: ['wsu.edu'],
    branding: {
      primaryColor: '#981e32',
      secondaryColor: '#5e6a71',
    },
    onboardingConfig: {
      majors: [
        'Agriculture',
        'Veterinary Medicine',
        'Engineering',
        'Business',
        'Nursing',
      ],
      campuses: ['Pullman', 'Spokane', 'Tri-Cities', 'Vancouver', 'Everett'],
      years: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'],
    },
  },
];

export const getOrganizationByDomain = (email: string): Organization | undefined => {
  const domain = email.split('@')[1];
  return organizations.find((org) => org.domains.includes(domain));
};

export const getOrganizationById = (id: string): Organization | undefined => {
  return organizations.find((org) => org.id === id);
};
