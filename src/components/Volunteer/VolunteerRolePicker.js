import React from 'react';
import PropTypes from 'prop-types';
import { Grid, CheckboxGroup } from '@codeday/topo/Atom';
import VolunteerRole from './VolunteerRole';
import { VOLUNTEER_ROLES, isAllowedVolunteerType } from './wizardConfig';

export default function VolunteerRolePicker({ backgrounds, only, onChange }) {
  const allowedRolesOnly = Object.keys(VOLUNTEER_ROLES)
    .filter((type) => !only || only.includes(type));
  const allowedRolesFilter = allowedRolesOnly.filter((type) => isAllowedVolunteerType(type, backgrounds));

  return (
    <CheckboxGroup defaultValue={[]} onChange={onChange}>
      <Grid gap={8} templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}>
        {(allowedRolesFilter.length > 0 ? allowedRolesFilter : allowedRolesOnly).map((type) => (
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
