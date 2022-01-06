export const VOLUNTEER_BACKGROUNDS = {
  industrySde: 'Software/electrical engineer (full-time)',
  industryHr: 'HR professional (full-time)',
  industryOther: 'Another position in the tech industry (full-time)',
  studentSde: 'Student studying software/electrical engineering',
  studentOther: 'Another type of student',
  other: 'Other',
};

export const VOLUNTEER_BACKGROUND_GROUPS = [
  ['industrySde', 'industryHr', 'industryOther'],
  ['studentSde'],
  ['other'],
];

export const VOLUNTEER_ROLES = {
  mentor: {
    name: 'Mentor',
    description: 'Help students find their place in tech, from writing their first line of code, to shipping an'
                  + ' industry-ready PR, to the non-technical skills they need to succeed.',
    time: 'Varies.',
    allowed: ['industrySde', 'industryOther', 'studentSde'],
    color: 'blue',
  },

  judge: {
    name: 'Judge',
    description: 'Talk with students about their projects and decide on awards. (No tech experience required.)',
    time: '2-3 hours.',
    allowed: ['industrySde', 'industryHr', 'industryOther'],
    color: 'gray',
  },

  speaker: {
    name: 'Speaker',
    description: 'Give a talk about your passion in software engineering, design, project management, or careers.',
    time: 'One hour, plus time to create your presentation.',
    allowed: ['industrySde', 'industryHr', 'industryOther', 'studentSde'],
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
