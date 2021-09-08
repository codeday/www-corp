import React, { useState } from 'react';
import Box from '@codeday/topo/Atom/Box';
import Text from '@codeday/topo/Atom/Text';
import Divider from '@codeday/topo/Atom/Divider';
import { Radio, RadioGroup } from '@chakra-ui/core';
import { VOLUNTEER_BACKGROUNDS, VOLUNTEER_BACKGROUND_GROUPS } from './wizardConfig';

export default function BackgroundPicker({ onChange }) {
  const [background, setBackground] = useState(null);
  return (
    <Box fontSize="lg">
      <RadioGroup
        onChange={(e) => { setBackground(e.target.value); onChange([e.target.value]); }}
        value={background}
        name="wizard-background"
      >
        {VOLUNTEER_BACKGROUND_GROUPS.map((types, i) => (
          <Box>
            {i !== 0 && (
              <Divider />
            )}
            {types.map((type) => (
              <Box mb={1} mt={1}>
                <Radio
                  name="wizard-background"
                  value={type}
                >
                  <Text mb={0} fontSize="lg">{VOLUNTEER_BACKGROUNDS[type]}</Text>
                </Radio>
              </Box>
            ))}
          </Box>
        ))}
      </RadioGroup>
    </Box>
  );
}
