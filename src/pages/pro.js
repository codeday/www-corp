/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-extraneous-import */
import { useDisclosure } from '@chakra-ui/hooks';
import { Collapse, Fade } from '@chakra-ui/transition';
import { Center, Divider, Grid, Stack, VStack, Wrap, WrapItem } from '@chakra-ui/layout';
import { Text, Heading, Box, Button, CodeDay, TextInput } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import React, { useEffect, useMemo, useReducer, useState } from 'react';
import TransportBus from '@codeday/topocons/Icon/TransportBus';
import FoodCookie from '@codeday/topocons/Icon/FoodCookie';
import Night from '@codeday/topocons/Icon/Night';
import UiArrowRight from '@codeday/topocons/Icon/UiArrowRight';
import Calendar from '@codeday/topocons/Icon/Calendar';
import Wifi from '@codeday/topocons/Icon/Wifi';
import Bell from '@codeday/topocons/Icon/Bell';
import PaymentCard from '@codeday/topocons/Icon/PaymentCard';
import TransportPlane from '@codeday/topocons/Icon/TransportPlane';
import HeadMale from '@codeday/topocons/Icon/HeadMale';
import { Icon } from '@chakra-ui/icon';
import { Img, keyframes, useBreakpointValue } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { Global } from '@emotion/core';
import { motion } from 'framer-motion';
import Page from '../components/Page';
import { useToasts, apiFetch } from '@codeday/topo/utils';
import { SubscribeMutation } from './proSubscribe.gql';
const TEXT_QUOTES = [
  {
    quote:
      "Well, I never thought I'd say this as a cowboy living in the Bahamas, but subscribing to CodeDay Pro has been the most life-changing thing since discovering my horse can moonwalk. Now, instead of wrangling cattle, I'm wrangling code. Who knew coding could be more exciting than a good ol' fashioned rodeo? So, if you want to be a cool cowboy like me, mosey on over and subscribe to CodeDay Pro. Just don't forget to bring your Stetson and spurs.",
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
    <Page
      seo={
        <NextSeo
          noindex
          title="CodeDay ~ Pro"
          openGraph={{
            type: 'website',
            url: 'https://codeday.org/pro',
            title: 'CodeDay ~ Pro',
            description: 'CodeDay Pro: A better way to CodeDay.',
            images: [
              {
                url: '/pro/goldcard.png',
                width: 1943,
                height: 1069,
                alt: 'CodeDay Gold Card',
              },
            ],
          }}
        />
      }
    >
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
    <Content mt={10} id="benefits">
      <Heading textAlign="center" mb="10" textDecor="underline" size="xl">
        All Benefits
      </Heading>
      <Wrap justify="center" align="center" spacing={10}>
        <Benefit
          title="Early Access"
          description="Pro members get early access to register for CodeDay events before they are opened to the general public."
          icon={Calendar}
        />
        <Benefit
          title="Priority Support"
          description="Pro members receive priority support via email or chat for any questions or issues related to CodeDay events."
          icon={Bell}
        />
        <Benefit
          title="Premium Dining"
          description="Pro members get premium food options at a CodeDay including a 3 course menu and a fine dining experience."
          icon={FoodCookie}
        />
        <Benefit
          title="Special Discounts"
          description="Pro members get special discounts on CodeDay merchandise, tickets, and other related products and services."
          icon={PaymentCard}
        />
        <Benefit
          title="Networking Opportunities"
          description="Pro members get access to FREE high speed 6E plus pro max wifi along with FREE networking cables."
          icon={Wifi}
        />
        <Benefit
          title="Secluded Sleeping Spaces"
          description="Pro members get access to comfortable sleeping spaces with a fresh CodeMat®ess and Pillows of choice."
          icon={Night}
        />
        <Benefit
          title="2-day Shipping"
          description="Pro members get unlimited FREE Two-Day Shipping!"
          icon={TransportBus}
        />
        <Benefit
          title="Priority Boarding"
          description="Pro members get first class seating and can use the first boarding group."
          icon={TransportPlane}
        />
        <Benefit
          title="Concierge Access"
          description="Pro members get 24/3 access to a dedicated concierge."
          icon={HeadMale}
        />
      </Wrap>
    </Content>
  );
}

function Benefit({ title, description, icon, ...props }) {
  return (
    <WrapItem flexBasis="280px" {...props}>
      <Stack direction="column" alignItems="center" p="5" borderRadius={10} boxShadow="md" bg="whiteAlpha.100">
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

const DISPLAY_TIME = 20;
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
    <>
      <Global styles="html { scroll-behavior: smooth; }" />
      <Content {...props}>
        <Wrap justify="center" spacing={20} mt="12">
          <WrapItem>
            <Stack alignItems="center" minWidth="270px">
              <Icon as={TransportBus} boxSize={20} />
              <Text fontSize="3xl" textAlign="center">
                2-Day
                <br />
                Shipping
              </Text>
            </Stack>
          </WrapItem>
          <WrapItem>
            <Stack alignItems="center" minWidth="270px">
              <Icon as={FoodCookie} boxSize={20} />
              <Text fontSize="3xl" textAlign="center">
                Premium
                <br />
                Dining
              </Text>
            </Stack>
          </WrapItem>
          <WrapItem>
            <Stack alignItems="center" width="270px">
              <Icon as={Night} boxSize={20} />
              <Text fontSize="3xl" textAlign="center">
                Secluded Sleeping Spaces
              </Text>
            </Stack>
          </WrapItem>
        </Wrap>
        <Center>
          <Link href="#benefits">
            <Button rightIcon={<UiArrowRight />} bg="red.600" mt="10" as="a">
              View All Benefits
            </Button>
          </Link>
        </Center>
      </Content>
    </>
  );
}

function HorizontalCollapse({ getDisclosureProps, isOpen, onComplete = () => {}, children }) {
  const [hidden, setHidden] = useState(!isOpen);
  return (
    <motion.div
      {...getDisclosureProps()}
      hidden={hidden}
      initial={{ width: 0 }}
      onAnimationStart={() => setHidden(false)}
      onAnimationComplete={() => {
        setHidden(!isOpen);
        onComplete();
      }}
      animate={{ width: isOpen ? '366px' : 0 }}
      style={{
        margin: '0',
        padding: '0',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
      transition={{
        delay: 1,
        duration: 1.5,
        type: 'tween',
      }}
    >
      {children}
    </motion.div>
  );
}

const proKeyframes = keyframes`0%{background-position:4% 0%} 50%{background-position:97% 100%} 100%{background-position:4% 0%}`;
function CodeDayHeroText({ isOpen, ...props }) {
  const { isOpen: isEmailOpen, onOpen: onEmailOpen, getDisclosureProps } = useDisclosure();

  return (
    <Box>
      <Collapse
        transition={{ enter: { duration: 1.5, delay: 0.5 }, exit: { duration: 1.5, delay: 0 } }}
        in={isOpen}
        animateOpacity
      >
        <Box {...props} pe="5" ps="5">
          <Text fontSize="3xl" textAlign="center">
            Elevate your CodeDay experience with{' '}
            <Box
              as="span"
              fontWeight="bold"
              display="inline-block"
              position="relative"
              _before={{
                content: "''",
                position: 'absolute',
                top: '84%',
                width: '100%',
                left: '0',
                height: '5px',
                borderRadius: '2px',
                background: 'linear-gradient(225deg, #ffd700, #ff686b)',
                backgroundSize: '400% 400%',
                animation: `${proKeyframes} 15s ease infinite`,
              }}
            >
              Pro
            </Box>
            . Exclusive perks, priority support, and early access await.
          </Text>
        </Box>
        <Center pt="10">

            <MailingListSubscribe
              m={4}
              emailList="ade92300-cfe5-11ed-bd42-99743629f670"
            />
        </Center>
      </Collapse>
    </Box>
  );
}

function CodeDayProHero() {
  const VerticalOrHorizontalCollapse = useBreakpointValue({ base: true, md: false }, 'md');
  const [vertical, setVertical] = useState(VerticalOrHorizontalCollapse);
  const HVCollapse = useMemo(
    () =>
      ({ isOpen = true, getDisclosureProps, onComplete = () => {}, children }) =>
        vertical ? (
          <Collapse in={isOpen}>
            {onComplete()}
            {children}
          </Collapse>
        ) : (
          <HorizontalCollapse isOpen={isOpen} getDisclosureProps={getDisclosureProps} onComplete={onComplete}>
            {children}
          </HorizontalCollapse>
        ),
    [vertical],
  );

  useEffect(() => {
    // eslint-disable-next-line eqeqeq
    if (vertical != VerticalOrHorizontalCollapse) {
      setVertical(VerticalOrHorizontalCollapse);
    }
  }, [VerticalOrHorizontalCollapse]);

  const { isOpen, onOpen, getDisclosureProps } = useDisclosure();

  const { isOpen: isTextOpen, onOpen: onTextOpen } = useDisclosure();

  const borderKeyframes = keyframes`0% {background-position: 0% 50%;}100% {background-position: 200% 50%;}`;

  useEffect(() => {
    onOpen();
  }, []);

  return (
    <Content maxWidth="900px" display="flex" justifyContent="center" alignItems="center">
      <VStack alignItems="center" justifyContent="center">
        <Center
          position="relative"
          mt="-10"
          boxShadow="lg"
          background="gray.1100"
          borderRadius="2xl"
          width={{ base: 'auto', md: '550px' }}
          height="72"
          _after={{
            position: 'absolute',
            content: '""',
            top: '8%',
            left: '0',
            right: '0',
            zIndex: -1,
            height: '90%',
            width: '100%',
            filter: 'blur(20px)',
            background:
              'linear-gradient(67deg, rgba(255,104,107,1) 0%, rgba(255,120,92,1) 40%, rgba(255,215,0,1) 50%, rgba(255,120,92,1) 60%, rgba(255,104,107,1) 100%)',
            backgroundSize: '200% 200%',
            animation: `${borderKeyframes} 15s linear infinite`,
          }}
        >
          <Center
            alignSelf="stretch"
            width="100%"
            justifyContent="center"
            background="whiteAlpha.50"
            borderRadius="2xl"
          >
            <Wrap justify="center" align="center" padding={vertical ? '10' : '0'}>
              <Box>
                <Heading
                  whiteSpace="nowrap"
                  // textAlign="center"
                  fontSize="6xl"
                  fontWeight="bold"
                  lineHeight="0"
                  marginInlineEnd=".5rem"
                >
                  <CodeDay />
                </Heading>
              </Box>
              <HVCollapse getDisclosureProps={getDisclosureProps} isOpen={isOpen} onComplete={onTextOpen}>
                <Heading fontSize="6xl" fontWeight="bold" flex="1" textAlign="center" color="whiteAlpha.900">
                  {'CodeDay '}
                  <Box
                    as="span"
                    position="relative"
                    backgroundImage="radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 40%, transparent 80%), radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%);"
                    backgroundClip="text"
                    textColor="transparent"
                    _before={{
                      content: "''",
                      position: 'absolute',
                      top: '85%',
                      width: '100%',
                      left: '0',
                      height: '6px',
                      borderRadius: '2px',
                      background: '#ff686b',
                    }}
                  >
                    Pro
                  </Box>
                </Heading>
              </HVCollapse>
            </Wrap>
          </Center>
        </Center>
        <CodeDayHeroText isOpen={isTextOpen} mt="10" />
      </VStack>
    </Content>
  );
}

function MailingListSubscribe({
                                emailList,
                                textList,
                                fields,
                                variant = "solid",
                                colorScheme = "green",
                                ...props
                              }) {
  const { success, error } = useToasts();
  const [input, setInput] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Box {...props}>
      <Grid templateColumns={ {base: "1fr", md: '1fr 1fr'}}>
        <TextInput
          size="lg"
          placeholder={[
            ...(emailList ? ["email"] : []),
            ...(textList ? ["phone"] : []),
          ].join(" or ")}
          value={input || undefined}
          onChange={(e) => setInput(e.target.value)}
          borderTopRightRadius={{ base: undefined, md: 0 }}
          borderBottomRightRadius={{ base: undefined, md: 0 }}
          borderRightWidth={{ base: undefined, md: 0 }}
        />
        <Button
          variant={variant || "solid"}
          // colorScheme={colorScheme || "green"}
          isLoading={isSubmitting}
          onClick={() => {
            if(!input) {
              error('Email is required to join the waitlist')
              return
            }
            // TODO: Support for phone lists
            setIsSubmitting(true);
            submitEmail(emailList, input, fields)
              .then(() => {
                success(`Application received, we will be in touch soon!`);
                setInput("");
              })
              .catch(() => {
                error(
                  `Sorry, we couldn't complete your subscription, please try again.`
                );
              })
              .finally(() => {
                setIsSubmitting(false);
              });
          }}
          borderTopLeftRadius={{ base: undefined, md: 0 }}
          borderBottomLeftRadius={{ base: undefined, md: 0 }}
          mt={{ base: 2, md: 0 }}
          size="lg"
          color="black"
          backgroundImage="radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 40%, transparent 80%), radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%);"
          flexDir="column"
        >
            <Box>
              <Text color="black" as="a">
                Join Now!
              </Text>
            </Box>
            <Box lineHeight=".8">
              <Text fontSize="xs" color="black" as="a" lineHeight="0">
                for just $750/yr, billed bi-centennially
              </Text>
            </Box>
          </Button>
      </Grid>
    </Box>
  );
}


async function submitEmail(
  list,
  email,
  fields
) {
  const form = new FormData();
  return apiFetch(SubscribeMutation, { email: email, eventWhere: { id: 'clfwtpk17492668exgqb3ze434r' } })
}
