import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@codeday/topo/Atom/Box';
import { CheckboxGroup } from '@chakra-ui/core';
import VolunteerRole from './VolunteerRole';
import { VOLUNTEER_ROLES, isAllowedVolunteerType } from './wizardConfig';

export default function VolunteerRolePicker({ backgrounds, only, onChange }) {
  return (
    <CheckboxGroup defaultValue={[]} onChange={onChange}>
      <Grid gap={8} templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}>
        {Object.keys(VOLUNTEER_ROLES).filter((type) => !only || only.includes(type)).map((type) => (
          <VolunteerRole
            type={type}
            disabled={!isAllowedVolunteerType(type, backgrounds)}
          />
        ))}
      </Grid>
    </CheckboxGroup>
  );
}
VolunteerRolePicker.propTypes = {
  backgrounds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};
