import React, {
  useState, useReducer, useEffect
} from 'react';
import { Collapse } from '@chakra-ui/transition';
import { Box, Button, Text, Heading, HStack, VStack, TextInput, Divider, Checkbox } from '@codeday/topo/Atom';
import { CognitoForm, DataCollection } from '@codeday/topo/Molecule';
import { useToasts } from '@codeday/topo/utils';
import LinkedInTag from 'react-linkedin-insight';
import BackgroundPicker from './BackroundPicker';
import { isAllowedVolunteerType } from './wizardConfig';
import { useAfterMountEffect } from '../../utils/useAfterMountEffect';
import { useUtmSource } from '../../utils/useUtmSource';


// https://stackoverflow.com/a/48981669
function groupBy(xs, f) {
  return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
}

export default function Wizard({ events, formRef }) {
  const { error } = useToasts();
  const regions = new Array(...new Set(events.filter(e => !e.dontAcceptVolunteers).map((e) => ({ name: e.region?.name || e.name, country: e.region?.countryName || 'Other' }))))
  const regionsByCountry = groupBy(regions, (r) => r.country);
  const [background, setBackground] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [region, setRegion] = useState('');
  const [isOrganize, setIsOrganize] = useState(false);
  const [commitmentLevel, setCommitmentLevel] = useState(0);
  const [hasSelection, setHasSelection] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utmSource = useUtmSource();


  const pageBackground = (
    <Box>
      <Heading as="h3" fontSize="xl" mb={2}>Are you a student?</Heading>
      <HStack>
        <Button
          onClick={() => { setBackground('student'); setHasSelection(true) }}
          isActive={background === 'student'}
        >I am a student</Button>
        <Button
          onClick={() => { setBackground('industry'); setHasSelection(true) }}
          isActive={background === 'industry'}
        >I am not a student</Button>
      </HStack>
    </Box>
  );
  const pageRegion = (
    <Box>
      <Heading as="h3" fontSize="xl" mb={2}>Please select a CodeDay City:</Heading>
      {
        // force "Other" to end of list (kind of hacky)
        [...Object.keys(regionsByCountry).filter(k => k !== 'Other'), 'Other'].map((regionKey) => (
          <Box>
          <Heading as="h4" fontSize="lg" mb={1}>{regionKey}</Heading>
          { regionsByCountry[regionKey].map((r) => (
            <Box d="inline-block" m={2}>
              <Button isActive={region === r.name} onClick={() => { setRegion(r.name); setHasSelection(true); setIsOrganize(false); }}>{r.name}</Button>
            </Box>
          )) }
          </Box>
        ))
      }
      <Divider m={4} />
      {/* Clear region state in case they clicked some other region button before this */}
      <Button mt={2} isActive={isOrganize} onClick={() => { setIsOrganize(true); setRegion('') }}>There isn't a CodeDay City in my area</Button>
      <Collapse in={isOrganize} animateOpacity>
        <Divider m={4} />
        <Box>
          <Heading as="h3" fontSize="xl" mb={2}>Interested in becoming a CodeDay Organizer?</Heading>
          <Text>CodeDay events around the world are organized by students just like you!</Text>
          <Text>You'll manage a team, come up with cool ideas, and help hundreds of students in your community discover CS.</Text>
          <Text fontSize="sm">(No prior event organizing experience is required, CodeDay Staff will support + guide you every step of the way)</Text>
          <Box m={6}>
            <Collapse in={commitmentLevel >= 0} animateOpacity>
                <Text>
                  <Checkbox onChange={(e) => setCommitmentLevel(e.target.checked? 1 : 0)}><b>I am interested in organizing a CodeDay in my city</b></Checkbox>
                </Text>
              <br/>
            </Collapse>
            <Collapse in={commitmentLevel >= 1} animateOpacity>
              <Text>
                What city/region would you like to organize an event in?
                <TextInput value={region} onChange={(e) => { setRegion(e.target.value); setHasSelection(true) }} w="md" d="block"/>
              </Text>
              <br/>
            </Collapse>
          </Box>
        </Box>
      </Collapse>
    </Box>
  )
  const checkEmailCompletion = () => {
    const emailRe = new RegExp('.+@.+\..+')
    if(!hasSelection && firstName && lastName && emailRe.test(email)) setHasSelection(true)
  }
  const pageEmail = (
    <Box>
      <Heading as="h3" fontSize="xl" mb={2}>Let us know how to reach out:</Heading>
      <VStack w="md" mb={3}>
          <TextInput m={1} placeholder="First Name" value={firstName} onChange={e => { setFirstName(e.target.value); checkEmailCompletion() }}/>
          <TextInput m={1} placeholder="Last Name" value={lastName} onChange={e => { setLastName(e.target.value); checkEmailCompletion() }} />
          <TextInput m={1} placeholder="Email" value={email} onChange={e => { setEmail(e.target.value); checkEmailCompletion() }}/>
          { background === 'industry'? <TextInput m={1} placeholder="LinkedIn (optional, recommended)" value={linkedin} onChange={e => { setLinkedin(e.target.value) }} /> : undefined }
      </VStack>
      <DataCollection message="pii" />
    </Box>
  )

  const pageConfirmation = (
    <Box>
      <Heading as="h3" fontSize="xl" mb={2}>✅ Got it!</Heading>
      <Text>We'll be in touch over email in the next few days!</Text>
    </Box>
  )

  const pages = [
    pageBackground,
    pageRegion,
    pageEmail,
    pageConfirmation,
  ];
  const pageIds = [
    'background',
    'region',
    'email',
    'final'
  ];

  // 'last' should really be 'penultimate' but 'last' is shorter
  const [page, navigate] = useReducer((prev, action) => Math.max(0, (action === 'next' ? prev + 1 : prev - 1), (action === 'last' ? pages.length - 2 : 0)), 0);
  const isFinalPage = page === pages.length - 1;

  const [hasStarted, setHasStarted] = useState(false);
  useAfterMountEffect(() => {
    if (!hasStarted) {
      global.analytics?.track('volunteer.started', { style: 'full' });
      LinkedInTag.init('1831116', null, false);
    }
    setHasStarted(true);
  }, [background, hasStarted]);

  useAfterMountEffect(() => {
    if(isFinalPage) {
      global.analytics?.track('volunteer.submitted');
      if (email) global.analytics?.identify(email);
    } else {
      global.analytics?.track('volunteer.partial', {
        volunteerPage: pageIds[page],
        background: background,
      });
    }
  }, [page]);

  useEffect(() => setHasSelection(false), [page]);


  return (
    <Box>
      {pages[page]}
      {!isFinalPage && (
        <Box textAlign={{ base: 'center', md: 'right' }} mt={8}>
          <Button
            colorScheme="green"
            isLoading={isSubmitting}
            onClick={async () => {
              // I wish i could set behavior: 'smooth' here but for some reason
              // When i set that it stops working entirely??????????????????"??"
              // Apparently you can fix it by modifying chrome flags but i dont want
              // it to not work for people who are using the defaults
              formRef.current.scrollIntoView();
              if (hasSelection) {
                if(background === 'industry' && page === 0) {
                  // if industry, we want to skip region selection and get them in touch with
                  // labs team
                  navigate('last')
                } else if(page === pages.length - 2) {
                  // if submitting penultimate page, we now have all info
                  setIsSubmitting
                  try {
                    const resp = await fetch('api/applyAsVolunteer', {
                      method: 'POST',
                      body: JSON.stringify({ email, firstName, lastName, linkedin, region, isOrganize, background }),
                      headers: {},
                    });
                    navigate('next')
                  } catch (ex) {
                    error(ex.toString());
                  }
                  setIsSubmitting(false);
                } else {
                  navigate('next');
                }
            }}}
            disabled={!hasSelection || isSubmitting}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}
