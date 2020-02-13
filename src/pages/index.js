import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Fragment, useMemo, useState} from 'react';
import chroma from 'chroma-js';
import emojiFlags from 'emoji-flags';
import {
  AspectRatioBox,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  PseudoBox,
  Stack,
  useColorMode,
  useTheme
} from '@chakra-ui/core';
import {ReactComponent as Logo} from '../assets/logo.svg';
import {graphql} from 'gatsby';

export default function Index(props) {
  const {colors} = useTheme();
  const {colorMode} = useColorMode();
  const [region, setRegion] = useState(null);

  const {continents} = props.data.countries;
  const countriesByContinent = useMemo(
    () =>
      continents.reduce(
        (acc, continent) => ({
          ...acc,
          [continent.code]: continent.countries.map(country => country.code)
        }),
        {}
      ),
    [continents]
  );

  const players = props.data.allPlayer.nodes;
  const ratings = useMemo(() => players.map(player => player.rating), [
    players
  ]);

  const countryCodes = useMemo(
    () => players.map(player => player.country.code),
    [players]
  );

  const classes = chroma
    .scale([
      colors.gray[500],
      colors.green[500],
      colors.blue[500],
      colors.purple[500],
      colors.yellow[500]
    ])
    .classes([0, 0.1, 0.4, 0.7, 0.9, 1]);

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
          <Box mr="3" as={Logo} w="10" h="10" />
          <Heading fontSize="3xl">Superteam</Heading>
        </Flex>
        <Stack isInline spacing="4" as="nav" mb="8" mx="auto">
          <Button
            variantColor={region ? undefined : 'blue'}
            variant={region ? 'ghost' : 'solid'}
            onClick={() => setRegion(null)}
          >
            All regions
          </Button>
          {continents
            .filter(
              continent =>
                continent.countries.filter(country =>
                  countryCodes.includes(country.code)
                ).length
            )
            .map(continent => {
              const isSelected = continent.code === region;
              return (
                <Button
                  variantColor={isSelected ? 'blue' : undefined}
                  variant={isSelected ? 'solid' : 'ghost'}
                  key={continent.code}
                  onClick={() => setRegion(continent.code)}
                >
                  {continent.name}
                </Button>
              );
            })}
        </Stack>
        <Grid
          gap="6"
          templateColumns={[
            '1fr',
            'repeat(2, 1fr)',
            'repeat(3, 1fr)',
            'repeat(4, 1fr)'
          ]}
        >
          {players
            .filter(player =>
              region
                ? countriesByContinent[region].includes(player.country.code)
                : true
            )
            .map(player => {
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
                  transition="box-shadow 150ms"
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
                    transition="background-color 150ms"
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
                    <Box p="4" bg="inherit" position="relative">
                      <Heading as="h4" fontSize="lg">
                        $400
                        {/* ✅ Acquired */}
                      </Heading>
                    </Box>
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
                      transition="color 150ms"
                      _groupHover={{color: hoverBg[colorMode]}}
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
                        as="h5"
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
    countries {
      continents {
        code
        name
        countries {
          code
        }
      }
    }
  }
`;
