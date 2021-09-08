import React, { useState, useReducer } from 'react';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import CognitoForm from '@codeday/topo/Molecule/CognitoForm';
import BackgroundPicker from './BackroundPicker';
import VolunteerRolePicker from './VolunteerRolePicker';
import ProgramsPicker from './ProgramsPicker';

export default function Wizard({ programs }) {
  const [backgrounds, setBackgrounds] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedPrograms, setPrograms] = useState([]);
  const pages = [
    (
      <Box>
        <Heading as="h3" fontSize="2xl">What do you do for a living?</Heading>
        <Text mb={4}>
          If you're retired, choose what best desribes how you spent your career. Please do not choose "full-time"
          if you are a student.
        </Text>
        <BackgroundPicker onChange={setBackgrounds} />
      </Box>
    ),
    (
      <Box>
        <Heading as="h3" fontSize="2xl">How are you interested in helping?</Heading>
        <Text mb={4}>
          This is not a final commitment, so choose as many as you'd like. We've filtered the volunteer opportunities
          to only ones you're eligible for.
        </Text>
        <VolunteerRolePicker onChange={setRoles} backgrounds={backgrounds} />
      </Box>
    ),
    (
      <Box>
        <Heading as="h3" fontSize="2xl">Choose which programs you'd like to help with:</Heading>
        <Text mb={4}>
          This is not a final commitment, so choose as many as you'd like.
        </Text>
        <ProgramsPicker onChange={setPrograms} programs={programs} roles={roles} />
      </Box>
    ),
    (
      <Box>
        <CognitoForm
          formId={98}
          prefill={{
            Backgrounds: backgrounds,
            Roles: roles,
            Programs: selectedPrograms,
          }}
        />
      </Box>
    ),
  ];
  const [page, navigate] = useReducer((prev, action) => Math.max(0, (action === 'next' ? prev + 1 : prev - 1)), 0);
  const isFinalPage = page === pages.length - 1;
  let disabled = false;
  if (page === 0 && backgrounds.length === 0) disabled = true;
  if (page === 1 && roles.length === 0) disabled = true;
  if (page === 2 && selectedPrograms.length === 0) disabled = true;

  return (
    <Box>
      {pages[page]}
      {!isFinalPage && (
        <Box textAlign={{ base: 'center', md: 'right' }} mt={8}>
          <Button
            variantColor="green"
            onClick={() => { if (!disabled) navigate('next'); }}
            disabled={disabled}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}
