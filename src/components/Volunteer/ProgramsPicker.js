import React from 'react';
import PropTypes from 'prop-types';
import { Grid, CheckboxGroup } from '@codeday/topo/Atom';
import ProgramInfoCheck from './ProgramInfoCheck';

export default function ProgramsPicker({ programs, roles, onChange }) {
  return (
    <CheckboxGroup defaultValue={[]} onChange={onChange}>
      <Grid gap={8} templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}>
        {programs.map((program) => (
          <ProgramInfoCheck
            program={program}
            disabled={!program.volunteerPositions?.reduce((accum, pos) => roles.includes(pos) || accum, false)}
          />
        ))}
      </Grid>
    </CheckboxGroup>
  );
}
ProgramsPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  programs: PropTypes.arrayOf(PropTypes.object).isRequired,
};
