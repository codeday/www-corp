import React, {
  useState, useReducer, useEffect
} from 'react';
import { Box, Button, Text, Heading } from '@codeday/topo/Atom';
import { CognitoForm } from '@codeday/topo/Molecule';
import LinkedInTag from 'react-linkedin-insight';
import BackgroundPicker from './BackroundPicker';
import { isAllowedVolunteerType } from './wizardConfig';
import { useAfterMountEffect } from '../../utils/useAfterMountEffect';
import { useUtmSource } from '../../utils/useUtmSource';

export default function Wizard({ programs, defaultRoles, defaultPrograms, after }) {
  const [hasSelection, setHasSelection] = useState(false);
  const [backgrounds, setBackgrounds] = useState([]);
  const utmSource = useUtmSource();

  const selectAnd = (fn) => (vals) => {
    setHasSelection(Boolean(vals && vals.length > 0));
    fn(vals);
  };

  const roleOnly = defaultPrograms && defaultPrograms.length > 0
    ? programs.filter((p) => defaultPrograms.includes(p.webname)).map((p) => p.volunteerPositions).flat()
    : undefined;

  const pageBackground = (
    <Box>
      <Heading as="h3" fontSize="xl" mb={2}>What do you do for a living?</Heading>
      <Text mb={6}>
        If you're retired, choose how you spent your career. Do not choose "full-time" if you are a student.
      </Text>
      <BackgroundPicker onChange={selectAnd(setBackgrounds)} />
    </Box>
  );

  const pageForm = (
    <Box>
      <CognitoForm
        formId={98}
        prefill={{
          Backgrounds: backgrounds,
          Roles: defaultRoles,
          Programs: defaultPrograms,
          Referrer: utmSource,
        }}
        onSubmit={(e) => {
          global.analytics?.track('volunteer.submitted');
          const email = e?.entry?.Email;
          if (email) global.analytics?.identify(email);
          if (after) window.location = after;
        }}
      />
    </Box>
  );

  const pages = [
    pageBackground,
    pageForm,
  ];
  const pageIds = [
    'background',
    'form',
  ];

  const [page, navigate] = useReducer((prev, action) => Math.max(0, (action === 'next' ? prev + 1 : prev - 1)), 0);
  const isFinalPage = page === pages.length - 1;

  const [hasStarted, setHasStarted] = useState(false);
  useAfterMountEffect(() => {
    if (!hasStarted) {
      global.analytics?.track('volunteer.started', { style: 'full' });
      LinkedInTag.init('1831116', null, false);
    }
    setHasStarted(true);
  }, [backgrounds, hasStarted]);

  useAfterMountEffect(() => {
      global.analytics?.track('volunteer.partial', {
        volunteerPage: pageIds[page],
        backgrounds: backgrounds,
      });
  }, [page]);

  useEffect(() => setHasSelection(false), [page]);

  if (backgrounds.length > 0 && defaultRoles && defaultRoles.length > 0 && page > 0
      && defaultRoles.filter((r) => !isAllowedVolunteerType(r, backgrounds)).length > 0) {
    return (
      <Box borderWidth={1} p={6} rounded="md" shadow="sm">
        <Text>Sorry, you are not eligible for this volunteer role.</Text>
      </Box>
    );
  }

  if (backgrounds.length > 0 && roleOnly && page > 0
      && roleOnly.filter((r) => isAllowedVolunteerType(r, backgrounds)).length === 0) {
    return (
      <Box borderWidth={1} p={6} rounded="md" shadow="sm">
        <Text>Sorry, we have no matching volunteer roles.</Text>
      </Box>
    );
  }

  return (
    <Box>
      {pages[page]}
      {!isFinalPage && (
        <Box textAlign={{ base: 'center', md: 'right' }} mt={8}>
          <Button
            colorScheme="green"
            onClick={() => { if (hasSelection) navigate('next'); }}
            disabled={!hasSelection}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}
