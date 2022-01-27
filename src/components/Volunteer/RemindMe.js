import { useState } from 'react';
import Box, { Flex } from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Text from '@codeday/topo/Atom/Text';
import { useToasts } from '@codeday/topo/utils';
import { default as InputText }from '@codeday/topo/Atom/Input/Text';
import LinkedInTag from 'react-linkedin-insight';
import { useRouter } from 'next/router';
import { useAfterMountEffect } from '../../utils/useAfterMountEffect';

export default function RemindMe(props) {
  const { error, success } = useToasts();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { query } = useRouter();

  const [hasStarted, setHasStarted] = useState(false);
  useAfterMountEffect(() => {
    if (!hasStarted) {
      global.analytics?.track('volunteer.started', { style: 'remind-me' });
      LinkedInTag.init('1831116', null, false);
    }
    setHasStarted(true);
  }, [email, hasStarted]);

  if (submitted) {
    return (
      <Box {...props}><Text>Thanks, we've emailed you a reminder!</Text></Box>
    );
  }

  return (
    <Box {...props}>
      <Text>Don't want to fill this out on your phone? We can email you a link to sign up when you're back at your desk:</Text>
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
            global.analytics?.identify(email);
            global.analytics?.track('volunteer.remind-me');
            try {
              const resp = await fetch('https://hooks.zapier.com/hooks/catch/2757438/b9486tx', {
                method: 'POST',
                body: JSON.stringify({ email, referrer: query?.ref || '' }),
                headers: {},
              });
              setSubmitted(true);
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
