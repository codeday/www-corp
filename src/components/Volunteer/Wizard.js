import React, {
  useState, useReducer, useEffect
} from 'react';
import { Collapse } from '@chakra-ui/transition';
import { Box, Button, Text, Heading, HStack, VStack, TextInput, Divider, Checkbox } from '@codeday/topo/Atom';
import { CognitoForm, DataCollection } from '@codeday/topo/Molecule';
import LinkedInTag from 'react-linkedin-insight';
import BackgroundPicker from './BackroundPicker';
import { isAllowedVolunteerType } from './wizardConfig';
import { useAfterMountEffect } from '../../utils/useAfterMountEffect';
import { useUtmSource } from '../../utils/useUtmSource';


// https://stackoverflow.com/a/48981669
function groupBy(xs, f) {
  return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
}

export default function Wizard({ events }) {
  const regions = new Array(...new Set(events.filter(e => !e.dontAcceptVolunteers).map((e) => ({ name: e.region?.name || e.name, country: e.region?.countryName || 'Other' }))))
  const regionsByCountry = groupBy(regions, (r) => r.country);
  const [background, setBackground] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [isOrganize, setIsOrganize] = useState(false);
  const [commitmentLevel, setCommitmentLevel] = useState(0);
  const [hasSelection, setHasSelection] = useState(false);
  const utmSource = useUtmSource();


  const pageBackground = (
    <Box>
      <Heading as="h3" fontSize="xl" mb={2}>Are you a student, or an industry professional?</Heading>
      <HStack>
        <Button
          onClick={() => { setBackground('student'); setHasSelection(true) }}
          isActive={background === 'student'}
        >I am a student</Button>
        <Button
          onClick={() => { setBackground('industry'); setHasSelection(true) }}
          isActive={background === 'industry'}
        >I am an industry professional</Button>
      </HStack>
    </Box>
  );
  console.log(regionsByCountry)
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
      <Button mt={2} isActive={isOrganize} onClick={() => { setIsOrganize(true) }}>There isn't a CodeDay City in my area</Button>
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
                  <Checkbox onChange={(e) => setCommitmentLevel(e.target.checked? 2 : 1)}>
                    <b>
                    I understand that this is a serious commitment, requiring about the same amount of time and effort
                    as being the president of a large club at school
                    </b>
                  </Checkbox>
                </Text>
              <br/>
            </Collapse>
            <Collapse in={commitmentLevel >= 2} animateOpacity>
              <Text>
                <Checkbox onChange={(e) => setCommitmentLevel(e.target.checked? 3 : 2)}>
                  <b>
                    If accepted as a regional manager, I will be able to organize for at least a full year (3 events)
                  </b>
                  <br/>(in the event something unexpected comes up, we are willing to make exceptions to this)
                </Checkbox>
              </Text>
              <br/>
            </Collapse>
            <Collapse in={commitmentLevel >= 3} animateOpacity>
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
      console.log('started')
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

  // if (backgrounds.length > 0 && defaultRoles && defaultRoles.length > 0 && page > 0
  //     && defaultRoles.filter((r) => !isAllowedVolunteerType(r, backgrounds)).length > 0) {
  //   return (
  //     <Box borderWidth={1} p={6} rounded="md" shadow="sm">
  //       <Text>Sorry, you are not eligible for this volunteer role.</Text>
  //     </Box>
  //   );
  // }

  // if (backgrounds.length > 0 && roleOnly && page > 0
  //     && roleOnly.filter((r) => isAllowedVolunteerType(r, backgrounds)).length === 0) {
  //   return (
  //     <Box borderWidth={1} p={6} rounded="md" shadow="sm">
  //       <Text>Sorry, we have no matching volunteer roles.</Text>
  //     </Box>
  //   );
  // }

  return (
    <Box>
      {pages[page]}
      {!isFinalPage && (
        <Box textAlign={{ base: 'center', md: 'right' }} mt={8}>
          <Button
            colorScheme="green"
            onClick={() => { if (hasSelection) background === 'industry' && page === 0? navigate('last') : navigate('next'); }}
            disabled={!hasSelection}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}
