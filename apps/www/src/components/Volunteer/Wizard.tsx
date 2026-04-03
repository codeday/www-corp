import React, { useState, useReducer, useEffect, RefObject } from 'react';
import { Collapse } from '@chakra-ui/transition';
import { usePostHog } from '@posthog/react';
import {
  Box,
  Button,
  Text,
  Heading,
  HStack,
  VStack,
  TextInput,
  Divider,
  Checkbox,
  Radio,
  Link,
} from '@codeday/topo/Atom';
import { DataCollection } from '@codeday/topo/Molecule';
import { useToasts } from '@codeday/topo/utils';
import { useAfterMountEffect } from '../../utils/useAfterMountEffect';
import { useMarketing } from '../../providers';
import { debug } from '@codeday/utils';

const DEBUG = debug(['www', 'components', 'Volunteer', 'Wizard']);

// https://stackoverflow.com/a/48981669
function groupBy(xs: any[], f: (x: any) => string): Record<string, any[]> {
  return xs.reduce((r: any, v: any, i: number, a: any[], k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
}

const emailRe = new RegExp('.+@.+\\..+');

interface WizardProps {
  events: any[];
  formRef: RefObject<HTMLDivElement>;
  startBackground?: string;
  startRegion?: string;
  startPage?: number;
  startSelection?: boolean;
  after?: string;
}

export default function Wizard({
  events,
  formRef,
  startBackground = '',
  startRegion = '',
  startPage = 0,
  startSelection = false,
  after,
}: WizardProps) {
  const posthog = usePostHog();
  const { error } = useToasts();
  const regions = new Array(
    ...new Set(
      events
        .filter((e) => !e.dontAcceptVolunteers)
        .map((e) =>
          JSON.stringify({
            name: e.region?.name || e.name,
            webname: e.contentfulWebname,
            country: e.region?.countryName || 'Other',
            aliases: e.region?.aliases || [],
          }),
        ),
    ),
  ).map((e) => JSON.parse(e)); // json -> string -> json for deduplication
  const regionsByCountry = groupBy(regions, (r) => r.country);

  useEffect(() => {
    DEBUG('regions', regions);
    DEBUG('regionsByCountry', regionsByCountry);
  }, [regions, regionsByCountry]);

  let resolvedStartRegion = startRegion;
  if (resolvedStartRegion) {
    const webnamesToRegion: Record<string, string> = {};
    regions.forEach((r) => {
      webnamesToRegion[r.webname] = r.name;
      r.aliases.forEach((alias: string) => {
        webnamesToRegion[alias] = r.name;
      });
    });
    resolvedStartRegion = webnamesToRegion[resolvedStartRegion] || '';
  }
  let resolvedStartPage = startPage;
  let resolvedStartBackground = startBackground;
  let resolvedStartSelection = startSelection;
  if (startRegion && !resolvedStartRegion) {
    resolvedStartPage = 0;
    resolvedStartBackground = '';
    resolvedStartSelection = false;
  }

  const [background, setBackground] = useState(resolvedStartBackground);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const { linkedInConversion } = useMarketing();
  const [region, setRegion] = useState(resolvedStartRegion);
  const [isOrganize, setIsOrganize] = useState(false);
  const [commitmentLevel, setCommitmentLevel] = useState(0);
  const [hasSelection, setHasSelection] = useState(resolvedStartSelection);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | false>(false);

  useEffect(() => {
    posthog?.group('background', background);
  }, [background]);

  const pageBackground = (
    <Box>
      <Heading as="h3" fontSize="xl" mb={2}>
        Are you a student?
      </Heading>
      <HStack>
        <Button
          size="lg"
          mr={4}
          onClick={() => {
            setBackground('student');
            navigate('next');
          }}
          isActive={background === 'student'}
        >
          I am a student
        </Button>
        <Button
          size="lg"
          onClick={() => {
            setBackground('industry');
            navigate('last');
          }}
          isActive={background === 'industry'}
        >
          I am not a student
        </Button>
      </HStack>
    </Box>
  );
  const pageRegion = (
    <Box>
      <Heading as="h3" fontSize="xl" mb={2}>
        Please select a CodeDay City:
      </Heading>
      {
        // force "Other" to end of list (kind of hacky)
        [
          ...Object.keys(regionsByCountry).filter((k) => k !== 'Other'),
          Object.keys(regionsByCountry).includes('Other') ? 'Other' : undefined,
        ].map((regionKey) => (
          <Box>
            {/* Capitalize first letter of region (this is mostly to fix "the United States" looking weird) */}
            <Heading as="h4" fontSize="lg" mb={1}>
              {regionKey?.charAt(0).toUpperCase()}
              {regionKey?.substring(1)}
            </Heading>
            {regionsByCountry[regionKey!]?.map((r) => (
              <Box display="inline-block" m={2}>
                <Radio
                  isChecked={region === r.name}
                  onClick={() => {
                    setRegion(r.name);
                    setHasSelection(true);
                    setIsOrganize(false);
                  }}
                >
                  {r.name}
                </Radio>
              </Box>
            ))}
          </Box>
        ))
      }
      <Divider m={4} />
      {/* Clear region state in case they clicked some other region button before this */}
      <Button
        mt={2}
        isActive={isOrganize}
        onClick={() => {
          setIsOrganize(true);
          setRegion('');
        }}
      >
        There isn't a CodeDay City in my area
      </Button>
      <Collapse in={isOrganize} animateOpacity>
        <Divider m={4} />
        <Box>
          <Heading as="h3" fontSize="xl" mb={2}>
            Interested in becoming a CodeDay Organizer?
          </Heading>
          <Text>CodeDay events around the world are organized by students just like you!</Text>
          <Text>
            You'll manage a team, come up with cool ideas, and help hundreds of students in your community discover CS.
          </Text>
          <Text fontSize="sm">
            (No prior event organizing experience is required, CodeDay Staff will support + guide you every step of the
            way)
          </Text>
          <Box m={6}>
            <Collapse in={commitmentLevel >= 0} animateOpacity>
              <Text>
                <Checkbox onChange={(e: any) => setCommitmentLevel(e.target.checked ? 1 : 0)}>
                  <b>I am interested in organizing a CodeDay in my city</b>
                </Checkbox>
              </Text>
              <br />
            </Collapse>
            <Collapse in={commitmentLevel >= 1} animateOpacity>
              <Text>
                What city/region would you like to organize an event in?
                <TextInput
                  value={region}
                  onChange={(e: any) => {
                    setRegion(e.target.value);
                    setHasSelection(true);
                  }}
                  w="md"
                  display="block"
                />
              </Text>
              <br />
            </Collapse>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
  useEffect(() => {
    if (firstName && lastName && emailRe.test(email) && (background === 'industry' ? linkedin : true))
      setHasSelection(true);
    else setHasSelection(false);
  }, [firstName, lastName, email, linkedin]);
  const pageEmail = (
    <Box>
      <Heading as="h3" fontSize="xl" mb={2}>
        {/*special logic if the only page user sees is contact info*/}
        {resolvedStartPage === 2
          ? background === 'industry'
            ? 'Apply to volunteer for CodeDay Labs'
            : `Apply to volunteer for CodeDay ${region}`
          : 'Let us know how to reach out:'}
      </Heading>
      <VStack w="md" mb={3}>
        <TextInput
          m={1}
          placeholder="First Name"
          value={firstName}
          onChange={(e: any) => setFirstName(e.target.value)}
        />
        <TextInput m={1} placeholder="Last Name" value={lastName} onChange={(e: any) => setLastName(e.target.value)} />
        <TextInput m={1} placeholder="Email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
        {background === 'industry' ? (
          <TextInput
            m={1}
            placeholder="LinkedIn"
            value={linkedin}
            onChange={(e: any) => {
              setLinkedin(e.target.value);
            }}
          />
        ) : undefined}
      </VStack>
      <DataCollection message="pii" />
    </Box>
  );

  const pageConfirmation = submitError ? (
    <Box>
      <Heading as="h3" fontSize="xl" mb={2}>
        ☹️ An Error Ocurred
      </Heading>
      <Text>
        Please email <Link href="mailto:volunteer@codeday.org">volunteer@codeday.org</Link> with your application, as
        well as the following error code:
      </Text>
      <Text>{submitError}</Text>
    </Box>
  ) : (
    <Box>
      <Heading as="h3" fontSize="xl" mb={2}>
        ✅ Got it!
      </Heading>
      <Text>We'll be in touch over email in the next few days!</Text>
    </Box>
  );

  const pages = [pageBackground, pageRegion, pageEmail, pageConfirmation];
  const pageIds = ['background', 'region', 'email', 'final'];

  // 'last' should really be 'penultimate' but 'last' is shorter
  const [page, navigate] = useReducer(
    (prev: number, action: string) =>
      Math.max(0, action === 'next' ? prev + 1 : prev - 1, action === 'last' ? pages.length - 2 : 0),
    resolvedStartPage,
  );
  const isFinalPage = page === pages.length - 1;

  const [hasStarted, setHasStarted] = useState(false);
  useAfterMountEffect(() => {
    if (!hasStarted) {
      posthog?.capture('volunteer.started', { style: 'full' });
    }
    setHasStarted(true);
  }, [background, hasStarted]);

  useAfterMountEffect(() => {
    if (isFinalPage) {
      posthog?.capture('volunteer.submitted');
      linkedInConversion('volunteer.submitted');
      if (email) posthog?.identify(posthog?.get_distinct_id(), { email });
    } else {
      posthog?.capture('volunteer.partial', {
        volunteerPage: pageIds[page],
        background: background,
      });
    }
  }, [page]);

  useEffect(() => setHasSelection(false), [page]);

  async function onClickNext() {
    // I wish i could set behavior: 'smooth' here but for some reason
    // When i set that it stops working entirely??????????????????"??"
    // Apparently you can fix it by modifying chrome flags but i dont want
    // it to not work for people who are using the defaults
    formRef.current!.scrollIntoView();
    if (hasSelection) {
      if (background === 'industry' && page === 0) {
        // if industry, we want to skip region selection and get them in touch with
        // labs team
        navigate('last');
      } else if (page === pages.length - 2) {
        // if submitting penultimate page, we now have all info
        setIsSubmitting(true);
        try {
          const resp = await fetch('/api/applyAsVolunteer', {
            method: 'POST',
            body: JSON.stringify({ email, firstName, lastName, linkedin, region, isOrganize, background }),
            headers: {},
          });
          if (!resp.ok) {
            DEBUG(resp);
            setSubmitError(`${resp.status}: ${resp.statusText}`);
          } else {
            if (after) window.location.href = after;
            // Do not redirect if there is an error, as otherwise no indication would be shown to the user that their application was not recieved
          }
          navigate('next');
        } catch (ex: any) {
          error(ex.toString());
        }
        setIsSubmitting(false);
      } else {
        navigate('next');
      }
    }
  }
  return (
    <Box>
      {pages[page]}
      {!isFinalPage && page !== 0 && (
        <Box textAlign={{ base: 'center', md: 'right' }} mt={8}>
          <Button
            colorScheme="green"
            isLoading={isSubmitting}
            onClick={onClickNext}
            isDisabled={!hasSelection || isSubmitting}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}
