import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Fragment, useCallback, useMemo, useState} from 'react';
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
  Text,
  Tooltip,
  useColorMode,
  useTheme
} from '@chakra-ui/core';
import {ReactComponent as Logo} from '../assets/logo.svg';
import {graphql} from 'gatsby';

const teamSlotProps = {
  size: 16,
  rounded: 'full',
  shadow: 'lg'
};

export default function Index(props) {
  const {colors} = useTheme();
  const {colorMode} = useColorMode();
  const [team, setTeam] = useState([]);
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
  const playerById = useMemo(
    () =>
      players.reduce(
        (acc, player) => ({
          ...acc,
          [player.id]: player
        }),
        {}
      ),
    [players]
  );

  const ratings = useMemo(() => players.map(player => player.rating), [
    players
  ]);

  const countryCodes = useMemo(
    () => players.map(player => player.country.code),
    [players]
  );

  const classes = useMemo(() => {
    const scale = [
      colors.gray[500],
      colors.green[500],
      colors.blue[500],
      colors.purple[500],
      colors.yellow[500]
    ];

    const intervals = Array.from(Array(scale.length + 1).keys()).map(
      (num, index, array) => num / (array.length - 1)
    );

    return chroma.scale(scale).classes(intervals);
  }, [colors]);

  const maxRating = Math.max(...ratings);
  const minRating = Math.min(...ratings);
  const ratingDelta = maxRating - minRating;

  const getPlayerColor = useCallback(
    rating => {
      const score = (rating - minRating) / ratingDelta;
      return classes(score).hex();
    },
    [classes, minRating, ratingDelta]
  );

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
        <Flex align="center" mx="auto" mt="2" mb="8">
          <Box mr="5" as={Logo} w="16" h="16" />
          <Heading fontSize="5xl">Superteam</Heading>
        </Flex>
        <Flex
          position="sticky"
          top="0"
          zIndex="1"
          as="nav"
          py="2"
          mb="8"
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
        >
          <Stack isInline spacing="4" mx="auto">
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
        </Flex>
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
              const color = getPlayerColor(player.rating);
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
                  as="button"
                  textAlign="left"
                  outline="none"
                  shadow="md"
                  rounded="lg"
                  overflow="hidden"
                  role="group"
                  transition="box-shadow 150ms"
                  onClick={() =>
                    setTeam(prevTeam =>
                      prevTeam.includes(player.id)
                        ? prevTeam.filter(playerId => playerId !== player.id)
                        : [...prevTeam, player.id]
                    )
                  }
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
                        pointerEvents="none"
                        style={{mixBlendMode: 'luminosity'}}
                      />
                    )}
                    <Box px="4" py="3" bg="inherit" position="relative">
                      <Text fontWeight="bold" fontSize="xl">
                        {team.includes(player.id) ? '✅ Acquired' : '$400'}
                      </Text>
                    </Box>
                    <Image
                      src={player.image}
                      h="full"
                      maxW="none"
                      position="absolute"
                      left="0"
                      pointerEvents="none"
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
        <Stack
          spacing="4"
          mx="auto"
          position="fixed"
          left="4"
          top="50%"
          transform="translateY(-50%)"
        >
          {team.map(playerId => {
            const player = playerById[playerId];
            const color = getPlayerColor(player.rating);
            return (
              <Box key={playerId}>
                <Tooltip label={player.ign}>
                  <Box
                    {...teamSlotProps}
                    display="block"
                    outline="none"
                    as="button"
                    bg={color}
                    bgImage={`url(${player.image})`}
                    backgroundSize="200%"
                    bgPos="center top"
                    onClick={() =>
                      setTeam(prevTeam =>
                        prevTeam.filter(playerId => playerId !== player.id)
                      )
                    }
                  />
                </Tooltip>
              </Box>
            );
          })}
          {Array(5 - team.length)
            .fill(null)
            .map((item, index) => (
              <Box {...teamSlotProps} key={index} bg="gray.600" />
            ))}
        </Stack>
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
