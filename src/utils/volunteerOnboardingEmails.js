
export function renderLabsMentor({firstName}) {
  return `Hi ${firstName},

Thank you for volunteering for CodeDay! We currently have these open roles:

* Mentor (for current/former SWEs or PMs)
Provide once-a-week mentorship for 2-3 months as students create a project or contribute to open-source software. This program is very structured and does not require much preparation on your part.

* Career Advisor (for current/former HR or hiring managers)
Provide resume feedback, or host practice interviews, for a few students each month.

If interested, please schedule a 15 minute onboarding call via this link: https://codeday.org/m/codeday-labs/onboarding

If you have any questions, feel free to reach out at anytime!

Best,
CodeDay Team`
}

export function renderCodeDayExistingRegion({firstName, region}) {
  return `Hi ${firstName},

Thanks for your interest in volunteering for CodeDay ${region}! To continue with the application process, please complete these steps:

1) Join the CodeDay Discord (https://discord.gg/codeday), which we use for all staff communication. If you haven't used Discord before, create a new account and check out this guide: https://support.discord.com/hc/en-us/articles/360045138571-Beginner-s-Guide-to-Discord

2) Send a brief intro about yourself in the #introductions channel! Please mention that you are applying for CodeDay ${region}, so we can match you with the correct team.

It is up to the ${region} team if they want to select you as a volunteer, so make sure to be thoughtful with your intro.

If you have any questions, feel free to reach out!

Best,
CodeDay Team`
}

export function renderCodeDayOrganizeRegion({firstName, region}) {
  return `Hi ${firstName},

Thanks for your interest in organizing a new CodeDay in ${region}! To continue with the application process, please answer these 3 short questions:

- Can you tell us more about yourself?
- How did you hear about CodeDay?
- Why do you want to organize a new CodeDay?

Please keep your answers brief - we are expecting no more than a few sentences per question. If you have any questions for us, feel free to reach out!

Best,
CodeDay Team`
}

export function renderBannedVolunteer({ firstName }) {
  return `Hi ${firstName},

At this moment, we are not interested in offering volunteering opportunities to you. We have previously determined that you are not aligned with our mission or values, but you may contact team@codeday.org for further details if necessary.

Decisions regarding your eligibility to volunteer for CodeDay will likely stand for at least 1 year.

Sincerely,
CodeDay Team`
}

export function renderUnknown({email, firstName, lastName, linkedin, region, isOrganize, background}) {
  return `There is no template on file to automatically follow-up with the following volunteer. Please reach out manually.

NOTE: This email does not have reply-to set, so replying to this email will NOT contact the volunteer.

[Raw Data]
First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
LinkedIn: ${linkedin}
Region: ${region}
Is Organize? ${isOrganize}
Background: ${background}`
}
