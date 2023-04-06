import React, { useState } from 'react';
import { Box, Text, Divider, Radio, RadioGroup } from '@codeday/topo/Atom';
import { VOLUNTEER_BACKGROUNDS, VOLUNTEER_BACKGROUND_GROUPS } from './wizardConfig';

export default function BackgroundPicker({ onChange }) {
  const [background, setBackground] = useState(null);
  return (
    <Box fontSize="lg">
      <RadioGroup
        onChange={(e) => { setBackground(e); onChange([e]); }}
        value={background}
        name="wizard-background"
      >
        {VOLUNTEER_BACKGROUND_GROUPS.map((types, i) => (
          <Box key={i}>
            {types.map((type) => (
              <Box mb={1} mt={1} key={type}>
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
