export const VOLUNTEER_BACKGROUNDS = {
  industrySde: 'Full-time software/electrical engineer',
  industryHr: 'Full-time HR professional',
  industryDesign: 'Full-time artist/designer',
  industryPm: 'Full-time project manager',
  industryOther: 'Executive, sales, marketing, or other full-time position',
  studentSde: 'Student studying software/electrical engineering',
  studentOther: 'Another type of student',
  other: 'Other community member',
};

export const VOLUNTEER_BACKGROUND_GROUPS = [
  ['industrySde', 'industryHr', 'industryDesign', 'industryPm', 'industryOther'],
  ['studentSde', 'studentOther'],
  ['other'],
];

export const VOLUNTEER_ROLES = {
  mentor: {
    name: 'Mentor',
    description: 'Help students find their place in tech, from writing their first line of code, to shipping an'
                  + ' industry-ready PR, to the non-technical skills they need to succeed.',
    time: 'Varies.',
    allowed: ['industrySde', 'industryDesign', 'industryPm', 'studentSde'],
    color: 'blue',
  },

  judge: {
    name: 'Judge',
    description: 'Talk with students about their projects and decide on awards. (No tech experience required.)',
    time: '2-3 hours.',
    allowed: ['industrySde', 'industryHr', 'industryDesign', 'industryPm', 'industryOther'],
    color: 'gray',
  },

  speaker: {
    name: 'Speaker',
    description: 'Give a talk about your passion in software engineering, design, project management, or careers.',
    time: 'One hour, plus time to create your presentation.',
    allowed: ['industrySde', 'industryHr', 'industryDesign', 'industryPm', 'studentSde'],
    color: 'orange',
  },

  'career advisor': {
    name: 'Career Advisor',
    description: 'Give feedback on student resumes and host practice interviews.',
    time: 'As little as an hour a month (at your own schedule).',
    allowed: ['industrySde', 'industryHr'],
    color: 'purple',
  },

  'general volunteer': {
    name: 'General Volunteer',
    description: 'Help promote, organize event logistics, and run fun activities.',
    time: 'Varies.',
    color: 'red',
  },
};

export function isAllowedVolunteerType(type, backgrounds) {
  const config = VOLUNTEER_ROLES[type];
  if (!('allowed' in config)) return true;
  return config.allowed.reduce((accum, e) => accum || backgrounds.includes(e), false);
}
