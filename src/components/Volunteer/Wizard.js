import React, {
  useState, useReducer, useEffect, useMemo,
} from 'react';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import CognitoForm from '@codeday/topo/Molecule/CognitoForm';
import LinkedInTag from 'react-linkedin-insight';
import BackgroundPicker from './BackroundPicker';
import VolunteerRolePicker from './VolunteerRolePicker';
import ProgramsPicker from './ProgramsPicker';
import { isAllowedVolunteerType } from './wizardConfig';
import { useAfterMountEffect } from '../../utils/useAfterMountEffect';
import { useUtmSource } from '../../utils/useUtmSource';

export default function Wizard({ programs, defaultRoles, defaultPrograms }) {
  const [hasSelection, setHasSelection] = useState(false);
  const [backgrounds, setBackgrounds] = useState([]);
  const [roles, setRoles] = useState(defaultRoles || []);
  const [selectedPrograms, setPrograms] = useState(defaultPrograms || []);
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

  const pageRole = (
    <Box>
      <Heading as="h3" fontSize="xl" mb={2}>How are you interested in helping?</Heading>
      <Text mb={6}>
        This is not a final commitment, so choose as many as you'd like. We've filtered the volunteer opportunities
        to only ones you're eligible for.
      </Text>
      <VolunteerRolePicker
        onChange={selectAnd(setRoles)}
        backgrounds={backgrounds}
        only={roleOnly}
      />
    </Box>
  );

  const pageProgram = (
    <Box>
      <Heading as="h3" fontSize="xl" mb={2}>Choose which programs you'd like to help with:</Heading>
      <Text mb={6}>
        This is not a final commitment, so choose as many as you'd like.
      </Text>
      <ProgramsPicker onChange={selectAnd(setPrograms)} programs={programs} roles={roles} />
    </Box>
  );

  const pageForm = (
    <Box>
      <CognitoForm
        formId={98}
        prefill={{
          Backgrounds: backgrounds,
          Roles: roles,
          Programs: selectedPrograms,
          Referrer: utmSource,
        }}
        onSubmit={(e) => {
          global.analytics?.track('volunteer.submitted');
          const email = e?.entry?.Email;
          if (email) global.analytics?.identify(email);
        }}
      />
    </Box>
  );

  const pages = [
    pageBackground,
    ...(defaultRoles && defaultRoles.length > 0 ? [] : [pageRole]),
    ...(defaultPrograms && defaultPrograms.length > 0 ? [] : [pageProgram]),
    pageForm,
  ];
  const pageIds = [
    'background',
    ...(defaultRoles && defaultRoles.length > 0 ? [] : ['role']),
    ...(defaultPrograms && defaultPrograms.length > 0 ? [] : ['program']),
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
  }, [backgrounds, roles, selectedPrograms, hasStarted]);

  useAfterMountEffect(() => {
      global.analytics?.track('volunteer.partial', {
        volunteerPage: pageIds[page],
        backgrounds: backgrounds,
        roles: roles,
        selectedPrograms: selectedPrograms,
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
            variantColor="green"
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
