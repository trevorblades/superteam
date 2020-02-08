import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import chroma from 'chroma-js';
import emojiFlags from 'emoji-flags';
import {
  AspectRatioBox,
  Box,
  Flex,
  Grid,
  Heading,
  Image,
  PseudoBox,
  useColorMode,
  useTheme
} from '@chakra-ui/core';
import {ReactComponent as Logo} from '../assets/logo.svg';
import {graphql} from 'gatsby';

export default function Index(props) {
  const {colors} = useTheme();
  const {colorMode} = useColorMode();

  const classes = chroma
    .scale([
      colors.gray[500],
      colors.green[500],
      colors.blue[500],
      colors.purple[500],
      colors.yellow[500]
    ])
    .classes([0, 0.1, 0.4, 0.7, 0.9, 1]);

  const players = props.data.allPlayer.nodes;
  const ratings = players.map(player => player.rating);
  const maxRating = Math.max(...ratings);
  const minRating = Math.min(...ratings);
  const ratingDelta = maxRating - minRating;

  return (
    <Fragment>
      <Helmet>
        <title>Superteam</title>
        <meta
          name="description"
          content="Build a team of current and future CS:GO superstars and earn points based on your team's weekly performance."
        />
      </Helmet>
      <Flex mx="auto" maxWidth="containers.xl" p="10" direction="column">
        <Flex align="center" mx="auto" mb="10">
          <Box mr="3" as={Logo} w="12" h="12" />
          <Heading fontSize="3xl">Superteam</Heading>
        </Flex>
        <Grid gap="6" templateColumns="repeat(auto-fit, minmax(250px, 1fr))">
          {players.map(player => {
            const score = (player.rating - minRating) / ratingDelta;
            const color = classes(score).hex();
            const {emoji} = emojiFlags.countryCode(player.country.code);

            const bg = {
              light: 'gray.50',
              dark: 'gray.700'
            };

            const hoverBg = {
              light: 'gray.100',
              dark: 'gray.600'
            };

            return (
              <AspectRatioBox
                ratio={3 / 4}
                key={player.id}
                shadow="md"
                cursor="pointer"
                rounded="lg"
                overflow="hidden"
                role="group"
                _hover={{
                  shadow: 'xl'
                }}
              >
                <PseudoBox
                  display="flex"
                  flexDirection="column"
                  bg={bg[colorMode]}
                  bgImg={`linear-gradient(${[color, 'transparent']})`}
                  bgPos="center"
                  bgSize="200%"
                  _groupHover={{
                    bg: hoverBg[colorMode]
                  }}
                >
                  {player.team && (
                    <Image
                      w="175%"
                      maxW="none"
                      src={player.team.logo}
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      opacity="0.5"
                      style={{mixBlendMode: 'luminosity'}}
                    />
                  )}
                  <Image
                    src={player.image}
                    h="full"
                    maxW="none"
                    position="absolute"
                    left="0"
                  />
                  <Box
                    w="full"
                    h="50%"
                    bgImg={`linear-gradient(${['transparent', color]})`}
                    position="absolute"
                    bottom="0"
                    style={{mixBlendMode: 'overlay'}}
                  />
                  <PseudoBox
                    as="svg"
                    mt="auto"
                    viewBox="0 0 100 48"
                    preserveAspectRatio="none"
                    w="full"
                    h="12"
                    position="relative"
                    fill="currentColor"
                    color={bg[colorMode]}
                    _groupHover={{
                      color: hoverBg[colorMode]
                    }}
                  >
                    <path d="M 0,48 Q 50,0 100,48 Z" />
                  </PseudoBox>
                  <Box
                    p="5"
                    pt="1"
                    bg="inherit"
                    textAlign="center"
                    position="relative"
                  >
                    <Heading mb="1" as="h3" fontSize="2xl">
                      {player.ign}
                    </Heading>
                    <Heading
                      isTruncated
                      as="h4"
                      fontWeight="normal"
                      fontSize="md"
                    >
                      {emoji} {player.name}
                    </Heading>
                  </Box>
                </PseudoBox>
              </AspectRatioBox>
            );
          })}
        </Grid>
      </Flex>
    </Fragment>
  );
}

Index.propTypes = {
  data: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  {
    allPlayer {
      nodes {
        id
        ign
        name
        image
        rating
        team {
          logo
        }
        country {
          code
        }
      }
    }
  }
`;
