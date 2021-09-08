import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box, { Grid } from '@codeday/topo/Atom/Box';
// eslint-disable-next-line import/no-named-default
import { default as Checkbox } from '@codeday/topo/Atom/Input/Checkbox';
import Text from '@codeday/topo/Atom/Text';
import { VOLUNTEER_ROLES } from './wizardConfig';

export default function VolunteerRole({ type, disabled }) {
  const [isSelected, setIsSelected] = useState(false);
  const config = VOLUNTEER_ROLES[type];

  return (
    <Box
      cursor={disabled ? 'cursor' : undefined}
      borderWidth={1}
      borderColor={isSelected ? undefined : 'transparent'}
      shadow={isSelected ? 'md' : undefined}
      p={4}
      pb={2}
    >
      <Checkbox
        alignItems="top"
        value={type}
        isDisabled={disabled}
        variantColor="green"
        onChange={(e) => {
          setIsSelected(e.target.checked);
        }}
      >
        <Box pl={2} mt={-1} color={disabled ? 'text.currentLight' : undefined}>
          <Text fontSize="lg" bold>{config.name}</Text>
          <Text>{config.description}</Text>
          {config.time && <Text><Text as="span" bold>Time commitment:</Text> {config.time}</Text>}
        </Box>
      </Checkbox>
    </Box>
  );
}
VolunteerRole.propTypes = {
  type: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};
VolunteerRole.defaultProps = {
  disabled: false,
};
