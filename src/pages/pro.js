/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-extraneous-import */
import { useDimensions } from '@chakra-ui/hooks';
import { Fade } from '@chakra-ui/transition';
import { Center, Divider, Flex, Grid, Stack, StackDivider, VStack, Wrap, WrapItem } from '@chakra-ui/layout';
import { Text, Heading, Box, Button } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import TransportBus from '@codeday/topocons/Icon/TransportBus';
import FoodCookie from '@codeday/topocons/Icon/FoodCookie';
import Night from '@codeday/topocons/Icon/Night';
import UiArrowRight from '@codeday/topocons/Icon/UiArrowRight';
import Calendar from '@codeday/topocons/Icon/Calendar';
import Wifi from '@codeday/topocons/Icon/Wifi';
import Bell from '@codeday/topocons/Icon/Bell';
import PaymentCard from '@codeday/topocons/Icon/PaymentCard';
import { Icon } from '@chakra-ui/icon';
import { Img } from '@chakra-ui/react';
import Page from '../components/Page';

const TEXT_QUOTES = [
  {
    quote:
      "Well, I never thought I'd say this as a cowboy living in the Bahamas, but subscribing to CodeDay pro has been the most life-changing thing since discovering my horse can moonwalk. Now, instead of wrangling cattle, I'm wrangling code. Who knew coding could be more exciting than a good ol' fashioned rodeo? So, if you want to be a cool cowboy like me, mosey on over and subscribe to CodeDay pro. Just don't forget to bring your Stetson and spurs.",
    name: 'Deven Jadhav',
    title: 'Cowboy Coder',
    image: '/pro/deven.png',
  },
  {
    quote:
      "Ahoy there, ye scurvy dogs! As a moon-faring space pirate, I never thought I'd be a coding whiz. But then I discovered CodeDay Pro - and shiver me timbers, it's like having a parrot that does your coding for you!\n\nNo more boring seminars or awkward networking events. With CodeDay Pro, I can learn to code from the comfort of me own ship. So if you want to be a space pirate as savvy as me, subscribe to CodeDay Pro. Or don't. But let's just say I've got a few tricks up me peg leg. Arrrgh!",
    name: 'Sally Scurvy',
    title: 'Space Pirate',
    image: '/pro/neilarmstrong.jpg',
  },
  {
    quote:
      "As a savvy player in the world of defense contracting, I've found that the best way to stay ahead is to master the art of lobbying and bribery. Thanks to CodeDay Pro's enlightening curriculum, I've been able to do just that. Their resources have given me the tools I need to navigate the political landscape with ease and secure favorable outcomes. So to my fellow innovators - don't underestimate the power of CodeDay Pro. It's the best investment you'll ever make.",
    name: 'Maverick Steele',
    title: 'Defense Contractor',
    image: '/pro/maverick.jpg',
  },
];

export default function Pro() {
  return (
    <Page>
      <CodeDayProHero />
      <Center>
        <Divider mt="6" ml="2" mr="2" maxWidth="container.xl" />
      </Center>
      <CodeDayProFeatures />
      <Center>
        <Divider mt="6" ml="2" mr="2" maxWidth="container.xl" />
      </Center>
      <CodeDayProTestemonials />
      <Center>
        <Divider mt="6" ml="2" mr="2" maxWidth="container.xl" />
      </Center>
      <CodeDayProAllFeatures />
    </Page>
  );
}

function CodeDayProAllFeatures() {
  return (
    <Content mt={10} id="benifits">
      <Heading textAlign="center" mb="10" textDecor="underline" size="xl">All Features</Heading>
      <Wrap justify="center" align="center" spacing={10}>
        <Benifit
          title="Early Access"
          description="Pro members get early access to register for CodeDay events before they are opened to the general public."
          icon={Calendar}
        />
        <Benifit
          title="Priority Support"
          description="Pro members get early access to register for CodeDay events before they are opened to the general public."
          icon={Bell}
        />
        <Benifit
          title="Premium Dining"
          description="Pro members get early access to register for CodeDay events before they are opened to the general public."
          icon={FoodCookie}
        />
        <Benifit
          title="Special Discounts"
          description="Pro members get early access to register for CodeDay events before they are opened to the general public."
          icon={PaymentCard}
        />
        <Benifit
          title="Networking Opportunities"
          description="Pro members get early access to register for CodeDay events before they are opened to the general public."
          icon={Wifi}
        />
        <Benifit
          title="Secluded Sleeping Spaces"
          description="Pro members get early access to register for CodeDay events before they are opened to the general public."
          icon={Night}
        />
        <Benifit
          title="2-day Shipping"
          description="Pro members get unlimited FREE Two-Day Shipping!"
          icon={TransportBus}
        />
      </Wrap>
    </Content>
  );
}

function Benifit({ title, description, icon, ...props }) {
  return (
    <WrapItem flexBasis="280px" {...props}>
      <Stack direction="column" alignItems="center" p="5" borderRadius={10} bg="whiteAlpha.100">
        <Icon as={icon} boxSize={16} mb={4} />
        <Heading textAlign="center" size="md" mb={2}>
          {title}
        </Heading>
        <Text textAlign="center" flex={1}>
          {description}
        </Text>
      </Stack>
    </WrapItem>
  );
}

const DISPLAY_TIME = 10;
const TRANSITION_TIME = 1;
function CodeDayProTestemonials({ ...props }) {
  const [testemonyIndex, nextTestemony] = useReducer((previous) => (previous + 1) % TEXT_QUOTES.length, 0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    TEXT_QUOTES.forEach((quote) => {
      // eslint-disable-next-line no-undef
      const img = new Image();
      img.src = quote.image.fileName;
    });
  }, [typeof window]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let transitionTimeout;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      transitionTimeout = setTimeout(() => {
        transitionTimeout = null;
        nextTestemony();
        setIsTransitioning(false);
      }, TRANSITION_TIME * 1000);
    }, DISPLAY_TIME * 1000);
    return () => {
      clearInterval(interval);
      if (transitionTimeout) clearTimeout(transitionTimeout);
    };
  }, [typeof window, TRANSITION_TIME, DISPLAY_TIME]);
  return (
    <Content mt="8" minHeight="400" {...props}>
      <Heading mb="8">Hear from our members!</Heading>
      <Grid templateColumns={{ base: '1fr', lg: '45% 55%' }} alignItems="center" gap={8} position="relative">
        <Fade in={!isTransitioning} delay={TRANSITION_TIME / 2}>
          <Center>
            <Img src={TEXT_QUOTES[testemonyIndex].image} minH="350" maxHeight="450" objectFit="cover" />
          </Center>
        </Fade>
        <Fade in={!isTransitioning} delay={TRANSITION_TIME / 2}>
          <TextQuote testemony={TEXT_QUOTES[testemonyIndex]} />
        </Fade>
      </Grid>
    </Content>
  );
}

function TextQuote({ testemony, ...props }) {
  return (
    <Box {...props}>
      <Text
        whiteSpace="pre-line"
        fontSize={testemony.quote.length > 350 ? 'xl' : '2xl'}
        fontStyle="italic"
        borderLeftWidth={3}
        borderColor="red.600"
        pl={4}
        mb={4}
      >
        {testemony.quote}
      </Text>
      <Text ml={16} fontSize="xl">
        -{' '}
        <Box as="span" fontWeight="bold">
          {testemony.name}
        </Box>
        ,{' '}
        <Box as="span" fontStyle="italic">
          {testemony.title}
        </Box>
      </Text>
    </Box>
  );
}

function CodeDayProFeatures({ ...props }) {
  return (
    <Content {...props}>
      <Wrap justify="center" spacing={20} mt="12">
        <WrapItem>
          <Stack alignItems="center" minWidth="270px">
            <Icon as={TransportBus} boxSize={24} />
            <Text fontSize="4xl" textAlign="center">
              2-Day
              <br />
              Shipping
            </Text>
          </Stack>
        </WrapItem>
        <WrapItem>
          <Stack alignItems="center" minWidth="270px">
            <Icon as={FoodCookie} boxSize={24} />
            <Text fontSize="4xl" textAlign="center">
              Premium
              <br />
              Dining
            </Text>
          </Stack>
        </WrapItem>
        <WrapItem>
          <Stack alignItems="center" width="270px">
            <Icon as={Night} boxSize={24} />
            <Text fontSize="4xl" textAlign="center">
              Secluded Sleeping Spaces
            </Text>
          </Stack>
        </WrapItem>
      </Wrap>
      <Center>
        <Button rightIcon={<UiArrowRight />} bg="red.600" mt="10" as="a" href="#benifits">
          View All Features
        </Button>
      </Center>
    </Content>
  );
}

function CodeDayProHero() {
  const headerContainerRef = useRef();
  const dimensions = useDimensions(headerContainerRef, true);
  const wrapHero = dimensions?.contentBox?.width < 872;
  return (
    <Box bg="whiteAlpha.50" pt={10} pb={5} position="relative" mt="-12">
      <Content maxWidth="900px">
        <Stack
          ref={headerContainerRef}
          direction={wrapHero ? 'column' : 'row'}
          divider={<StackDivider />}
          as={Center}
          spacing={wrapHero ? '2' : '5'}
          flexWrap="wrap"
        >
          <Box float="left">
            <Center>
              <Heading whiteSpace="nowrap" textAlign="end" fontSize="6xl" fontWeight="bold">
                CodeDay{' '}
                <Box
                  as="span"
                  position="relative"
                  _before={{
                    content: "''",
                    position: 'absolute',
                    top: '85%',
                    width: '100%',
                    left: '0',
                    height: '6px',
                    borderRadius: '2px',
                    background: 'red.600',
                  }}
                >
                  Pro
                </Box>
              </Heading>
            </Center>
          </Box>
          <Text
            fontSize="3xl"
            noOfLines={4}
            minWidth={{ sm: '465px' }}
            flex="1"
            {...(wrapHero ? { textAlign: 'center' } : {})}
          >
            Elevate your CodeDay experience with{' '}
            <Box
              as="span"
              fontWeight="bold"
              display="inline"
              position="relative"
              _before={{
                content: "''",
                position: 'absolute',
                top: '84%',
                width: '100%',
                left: '0',
                height: '5px',
                borderRadius: '2px',
                background: 'red.600',
              }}
            >
              Pro
            </Box>
            . Exclusive perks, priority support, and early access await.
          </Text>
        </Stack>
      </Content>
    </Box>
  );
}
