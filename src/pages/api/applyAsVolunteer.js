import getConfig from 'next/config';
import { ServerClient } from 'postmark';
import Airtable from 'airtable'
import {
  renderBannedVolunteer,
  renderCodeDayExistingRegion,
  renderCodeDayOrganizeRegion,
  renderLabsMentor, renderUnknown
} from "../../utils/volunteerOnboardingEmails";



const { serverRuntimeConfig } = getConfig()
const postmark = new ServerClient(serverRuntimeConfig.postmark.serverToken)
const base = new Airtable({ apiKey: serverRuntimeConfig.airtable.token }).base(serverRuntimeConfig.airtable.base)

async function ApplyAsVolunteer(req, res) {
  const {email, firstName, lastName, linkedin, region, isOrganize, background} = JSON.parse(req.body)
  let banned = false;
  await base('Volunteers').select({
    maxRecords: 100,
    fields: ['Flags'],

    filterByFormula: `TRIM(LOWER({Email})) = "${email.toString().toLowerCase().trim()}"`
  }).eachPage((records, fetchNextPage) => {
    records.forEach((record) => {
      if((record.get('Flags') || []).includes('Banned')) banned = true
        fetchNextPage()
    })
  })
  await base('Volunteers').create([
    {
      fields: {
        Name: `${firstName} ${lastName}`,
        Email: email,
        LinkedIn: linkedin,
        "Location (Not Listed)": region,
        Type: background,
      }
    }
  ])
  let emailText;
  // if(background === 'industry') {
  // emailText = renderLabsMentor({firstName})
  // This is disabled for now as we want non-student volunteers to be manually reviewed + followed up with
  if(banned) {
    emailText = renderBannedVolunteer({firstName})
  } else if (background === 'student' && isOrganize) {
    emailText = renderCodeDayOrganizeRegion({firstName, region})
  } else if (background === 'student' && !isOrganize) {
    emailText = renderCodeDayExistingRegion({firstName, region})
  }

  if(emailText) {
    await postmark.sendEmail({
      MessageStream: 'outbound',
      To: email,
      From: 'volunteer@codeday.org',
      Subject: 'CodeDay: Volunteering Next Steps',
      Bcc: 'volunteer@codeday.org',
      TextBody: emailText
    })
  } else {
    await postmark.sendEmail({
      MessageStream: 'outbound',
      To: 'volunteer@codeday.org',
      From: 'volunteer@codeday.org',
      Subject: 'Volunteer form unhandled template',
      TextBody: renderUnknown({email, firstName, lastName, linkedin, region, isOrganize, background})
    })
  }
  return res.status(200).json()
}

export default ApplyAsVolunteer
