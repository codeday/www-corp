import React, { useState } from 'react';
import fetch from 'node-fetch';
import isEmail from 'sane-email-validation';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import Button from '@codeday/topo/Atom/Button';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import { default as Input } from '@codeday/topo/Atom/Input/Text';
import Page from '../components/Page';

export default function Donate() {
  const [error, setError] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [amount, setAmount] = useState(25);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  if (checkEmail) {
    return (
      <Page title="Donate" slug="/donate">
        <Content maxWidth="containers.md">
          <Heading as="h2" fontSize="5xl" mt={-2} mb={2}>Payment Link Emailed</Heading>
          <Text>
            Recently scammers have been using our donation form to test stolen credit cards. To prevent costly
            chargebacks, we have emailed you a link to complete your donation.
          </Text>
        </Content>
      </Page>
    );
  }

  return (
    <Page title="Donate" slug="/donate">
      <Content maxWidth="containers.md">
        <Heading as="h2" fontSize="5xl" mt={-2} mb={2}>Make a Donation</Heading>
        <Text mb={8}>
          CodeDay is a 501(c)(3) non-profit. Your donation supports our work providing welcoming and diverse
          opportunities for under-served students to explore a future in tech and beyond.
        </Text>
        {error && (
          <Box p={4} bg="red.50" borderColor="red.800" borderWidth={2} color="red.900">
            {error}
          </Box>
        )}
        <Grid templateColumns="1fr minmax(0, 100%)" gap={8}>
          <Text bold>Name</Text>
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Text bold>Email</Text>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Text bold>Amount ($ USD)</Text>
          <Input
            placeholder="Amount"
            value={amount}
            onChange={(e) => {
              setAmount(Number.parseInt(e.target.value, 10) || '');
            }}
          />
        </Grid>
        <Box textAlign="center">
          <Button
            onClick={async () => {
              if (isSubmitting || !name || !email || !amount || !isEmail(email)) return;
              setIsSubmitting(true);
              try {
                const result = await fetch('/api/donate', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ name, email, amount }),
                });
                const { url, ok, error: err } = await result.json();
                if (err) setError(err);
                else if (url) window.location = url;
                else if (ok) setCheckEmail(true);
                else setError('An unknown error ocurred.');
              } catch (err) {}
              setIsSubmitting(false);
            }}
            mt={4}
            mb={4}
            variantColor={name && email && amount && isEmail(email) ? 'green' : 'gray'}
            isLoading={isSubmitting}
            disabled={isSubmitting || !name || !email || !amount || !isEmail(email)}
          >
            Continue to Payment
          </Button>
          <Text>
            You will be taken to our payment processor, Stripe, to complete your donation by card or ACH transfer.
          </Text>
          <Text>
            To pay by check, make payable to &ldquo;Student Research and Development&rdquo; and mail to:<br />
            340 S Lemon Ave, #7763, Walnut CA 91789.
          </Text>
        </Box>
      </Content>
    </Page>
  );
}
