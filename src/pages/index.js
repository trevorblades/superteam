import Helmet from 'react-helmet';
import PlayerCard from '../components/player-card';
import PropTypes from 'prop-types';
import React, {Fragment, useCallback, useMemo, useState} from 'react';
import TeamSlots from '../components/team-slots';
import chroma from 'chroma-js';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Link,
  Stack,
  Text,
  useColorMode,
  useTheme
} from '@chakra-ui/core';
import {ReactComponent as Logo} from '../assets/logo.svg';
import {graphql} from 'gatsby';

const MAX_TEAM_SIZE = 5;
const TOTAL_BUDGET = 16000;
const AVG_PLAYER_COST = TOTAL_BUDGET / MAX_TEAM_SIZE;

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

  const getPlayerScore = useCallback(
    player => (player.rating - minRating) / ratingDelta,
    [minRating, ratingDelta]
  );

  const getPlayerCost = useCallback(
    player => {
      const baseCost = player.rating * AVG_PLAYER_COST;
      const score = getPlayerScore(player);
      const modifier = 4 / 3 - score / 3; // magic ✨
      return Math.round(baseCost / modifier);
    },
    [getPlayerScore]
  );

  const budget = useMemo(
    () =>
      TOTAL_BUDGET -
      team.reduce(
        (acc, playerId) => acc + getPlayerCost(playerById[playerId]),
        0
      ),
    [getPlayerCost, playerById, team]
  );

  const getPlayerColor = useCallback(
    player => {
      const score = getPlayerScore(player);
      return classes(score).hex();
    },
    [classes, getPlayerScore]
  );

  function togglePlayer({id}) {
    setTeam(prevTeam =>
      prevTeam.includes(id)
        ? prevTeam.filter(playerId => playerId !== id)
        : [...prevTeam, id]
    );
  }

  function removePlayer(player) {
    setTeam(prevTeam => prevTeam.filter(playerId => playerId !== player.id));
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
      <Flex align="flex-start">
        <Flex
          p="3"
          h="100vh"
          position="sticky"
          zIndex="sticky"
          top="0"
          bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}
        >
          <Flex
            align="center"
            position="absolute"
            top="5"
            left="5"
            transform="rotate(90deg) translateY(-100%)"
            transformOrigin="top left"
          >
            <Box mr="4" as={Logo} w="12" h="12" transform="rotate(-90deg)" />
            <Heading fontSize="4xl" letterSpacing="tighter">
              Superteam
            </Heading>
          </Flex>
          <TeamSlots
            team={team}
            onPlayerClick={removePlayer}
            getPlayerColor={getPlayerColor}
            playerById={playerById}
            maxTeamSize={MAX_TEAM_SIZE}
          />
        </Flex>
        <Flex flexGrow="1" direction="column" minH="100vh">
          <Flex
            my="8"
            align="center"
            position="sticky"
            top="0"
            zIndex="sticky"
            as="nav"
            py="3"
            px="10"
            bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          >
            <Heading fontSize="2xl">
              ${budget.toLocaleString()} remaining
            </Heading>
            <Stack isInline spacing="4" ml="auto">
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
            px="10"
            gap="6"
            templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
          >
            {players
              .filter(player =>
                region
                  ? countriesByContinent[region].includes(player.country.code)
                  : true
              )
              .map(player => {
                const isSelected = team.includes(player.id);
                const cost = getPlayerCost(player);
                return (
                  <PlayerCard
                    key={player.id}
                    getPlayerColor={getPlayerColor}
                    player={player}
                    isSelected={isSelected}
                    isDisabled={
                      (team.length === MAX_TEAM_SIZE || cost > budget) &&
                      !isSelected
                    }
                    onClick={togglePlayer}
                    cost={cost}
                  />
                );
              })}
          </Grid>
          <Box mt="auto" as="footer" py="8" px="10">
            <Text>
              &copy; {new Date().getFullYear()}{' '}
              <Link href="https://trevorblades.com">Trevor Blades</Link>
            </Text>
          </Box>
        </Flex>
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
