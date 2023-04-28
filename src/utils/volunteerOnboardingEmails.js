
export function renderLabsMentor({firstName}) {
  return `Hi ${firstName},
Thank you for your interest in volunteering for CodeDay!

We currently have a need for the following positions:
* Mentor (recommended for current/former software engineers or product managers)
Provide mentorship once a week for 10-12 weeks as students create a project or make their first pull requests to popular open-source software. This program is very structured and does not require much prep-work.


* Career Advisor (recommended for current/former HR or hiring managers)
Provide resume feedback or host practice interviews with a few students each month.


Can you please schedule a 15-min onboarding call using the following link: https://www.codeday.org/m/codeday-labs/onboarding


If you have any questions, feel free to reach out!


Best,
Charlie Liu (he/him)
Program Manager, Volunteers`
}

export function renderCodeDayExistingRegion({firstName, region}) {
  return `Hi ${firstName},

Thanks for your interest in volunteering for CodeDay ${region}! To continue with the application process, please complete these steps:

1.) Join the CodeDay Discord (https://discord.gg/codeday), which we use for all staff communication. If you haven't used Discord before, create a new account and check out this guide: https://support.discord.com/hc/en-us/articles/360045138571-Beginner-s-Guide-to-Discord

2.) Send a brief intro about yourself in the #introductions channel! (Make sure to include that you want to volunteer for CodeDay ${region}, so we can match you with the correct team.)

It's up to the ${region} team if they want to select you as a volunteer, so please be sure to put thought into your introduction.  


If you have any questions, feel free to reach out!

Best,
Charlie Liu (he/him)
Program Manager, Volunteers`
}

export function renderCodeDayOrganizeRegion({firstName, region}) {
  return `Hi ${firstName},
Thanks for your interest in organizing a new CodeDay in ${region}! To continue with the application process, please answer these 3 short questions:
- Can you tell us more about yourself?
- How did you hear about CodeDay?
- Why do you want to organize a new CodeDay?

Please keep your answers brief - we are expecting no more than a few sentences per question. If you have any questions for us, feel free to reach out!

Best,
Charlie Liu (he/him)
Program Manager, Volunteers`
}

export function renderBannedVolunteer({ firstName }) {
  return `Hi ${firstName},
  You have been banned from volunteering for CodeDay.`
}


export function renderUnknown({email, firstName, lastName, linkedin, region, isOrganize, background}) {
  return `There is no template on file to automatically follow-up with the following volunteer. Please reach out manually.
NOTE: This email does not have reply-to set, replying to this email will NOT contact the volunteer.

Raw data:
First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
LinkedIn: ${linkedin}
Region: ${region}
Is Organize? ${isOrganize}
Background: ${background}`
}
