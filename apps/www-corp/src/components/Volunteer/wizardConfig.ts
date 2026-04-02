export const VOLUNTEER_BACKGROUNDS: Record<string, string> = {
  industrySde: 'Software/electrical engineer',
  industryHr: 'HR professional',
  industryOther: 'Another position in the tech industry',
  studentHs: 'High-School Student',
  studentCollege: 'College Student',
  other: 'Other'
};

export const VOLUNTEER_BACKGROUND_GROUPS: string[][] = [
  ['industrySde', 'industryHr', 'industryOther'],
  ['studentHs'],
  ['studentCollege','other'],
];

export interface VolunteerRole {
  name: string;
  description: string;
  time: string;
  allowed?: string[];
  color: string;
  requiresLocalEvent?: boolean;
}

export const VOLUNTEER_ROLES: Record<string, VolunteerRole> = {
  mentor: {
    name: 'Mentor',
    description: 'Help students find their place in tech, from writing their first line of code, to shipping an'
                  + ' industry-ready PR, to the non-technical skills they need to succeed.',
    time: 'Varies.',
    allowed: ['industrySde', 'industryOther'],
    color: 'blue',
  },

  'career advisor': {
    name: 'Career Advisor',
    description: 'Give feedback on student resumes and host practice interviews.',
    time: 'As little as an hour a month (at your own schedule).',
    allowed: ['industryHr'],
    color: 'purple',
  },

  'general volunteer': {
    name: 'General Volunteer',
    description: 'Help promote, organize event logistics, and run fun activities.',
    time: 'Varies.',
    color: 'red',
    allowed: ['studentHs', 'studentCollege', 'other'],
    requiresLocalEvent: true
  },
  'regional manager': {
    name: 'Organize a CodeDay',
    description: 'Be the Regional Manager for a CodeDay event. Manage a team of volunteers '
  } as VolunteerRole,
};

export function isAllowedVolunteerType(type: string, backgrounds: string[]): boolean {
  const config = VOLUNTEER_ROLES[type];
  if (!('allowed' in config)) return true;
  return config.allowed!.reduce((accum, e) => accum || backgrounds.includes(e), false);
}
