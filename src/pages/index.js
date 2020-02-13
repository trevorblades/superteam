import Helmet from 'react-helmet';
import PlayerCard from '../components/player-card';
import PropTypes from 'prop-types';
import React, {Fragment, useCallback, useMemo, useState} from 'react';
import chroma from 'chroma-js';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Stack,
  Text,
  Tooltip,
  useColorMode,
  useTheme
} from '@chakra-ui/core';
import {ReactComponent as Logo} from '../assets/logo.svg';
import {graphql} from 'gatsby';

const MAX_TEAM_SIZE = 5;

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

  function togglePlayer(id) {
    setTeam(prevTeam =>
      prevTeam.includes(id)
        ? prevTeam.filter(playerId => playerId !== id)
        : [...prevTeam, id]
    );
  }

  return (
    <Fragment>
      <Helmet>
        <title>Superteam</title>
        <meta
          name="description"
          content="Build a team of current and future CS:GO superstars and earn points based on your team's weekly performance."
        />
      </Helmet>
      <Flex mx="auto" maxWidth="containers.xl" px="10" direction="column">
        <Flex align="center" mx="auto" mt="12" mb="8">
          <Box mr="5" as={Logo} w="16" h="16" />
          <Heading fontSize="5xl">Superteam</Heading>
        </Flex>
        <Flex
          position="sticky"
          top="0"
          zIndex="sticky"
          as="nav"
          py="2"
          mb="10"
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
              const isSelected = team.includes(player.id);
              return (
                <PlayerCard
                  key={player.id}
                  getPlayerColor={getPlayerColor}
                  player={player}
                  isSelected={isSelected}
                  isDisabled={team.length === MAX_TEAM_SIZE && !isSelected}
                  onClick={togglePlayer}
                />
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
          zIndex="overlay"
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
          {Array(MAX_TEAM_SIZE - team.length)
            .fill(null)
            .map((item, index) => (
              <Flex
                {...teamSlotProps}
                key={index}
                bg="gray.500"
                color="gray.600"
                align="center"
                justify="center"
              >
                <Text fontSize="xl">{index + 1 + team.length}</Text>
              </Flex>
            ))}
        </Stack>
        <Box as="footer" py="10">
          <Text>&copy; {new Date().getFullYear()} Trevor Blades</Text>
        </Box>
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
