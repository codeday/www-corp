import { useState } from 'react';
import Box, { Flex } from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Text from '@codeday/topo/Atom/Text';
import { useToasts } from '@codeday/topo/utils';
import { default as InputText }from '@codeday/topo/Atom/Input/Text';
import LinkedInTag from 'react-linkedin-insight';

export default function RemindMe(props) {
  const { error, success } = useToasts();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Box {...props}><Text>Thanks, we've emailed you a reminder!</Text></Box>
    );
  }

  return (
    <Box {...props}>
      <Text>Don't want to fill it out now? Enter your email and we'll remind you:</Text>
      <Flex>
        <InputText
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          placeholder="me@example.com"
          mr={2}
        />
        <Button
          variantColor="green"
          isDisabled={email.indexOf('@') < 0}
          isLoading={submitting}
          onClick={async () => {
            setSubmitting(true);
            try {
              const resp = await fetch('https://hooks.zapier.com/hooks/catch/2757438/b9486tx', {
                method: 'POST',
                body: JSON.stringify({ email }),
                headers: {},
              });
              setSubmitted(true);
              LinkedInTag.init('1831116', null, false);
            } catch (ex) {
              error(ex.toString());
            }
            setSubmitting(false);
          }}
        >
          Send
        </Button>
      </Flex>
    </Box>
  )
}