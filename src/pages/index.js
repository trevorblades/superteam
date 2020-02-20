import DownloadButton from '../components/download-button';
import Helmet from 'react-helmet';
import PlayerCard from '../components/player-card';
import PropTypes from 'prop-types';
import React, {Fragment, useCallback, useMemo, useState} from 'react';
import RegionSelect from '../components/region-select';
import TeamSlots from '../components/team-slots';
import chroma from 'chroma-js';
import {
  Box,
  DarkMode,
  Flex,
  Grid,
  Heading,
  Link,
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
  const [region, setRegion] = useState('');

  const players = props.data.allPlayer.nodes;
  const {continents} = props.data.countries;

  const validContinents = useMemo(() => {
    const countryCodes = players.map(player => player.country.code);
    return continents.filter(
      continent =>
        continent.countries.filter(country =>
          countryCodes.includes(country.code)
        ).length
    );
  }, [continents, players]);

  const isPlayerFromRegion = useCallback(
    player => {
      if (!region) {
        return true;
      }

      const {countries} = validContinents.find(
        continent => continent.code === region
      );

      for (const country of countries) {
        if (country.code === player.country.code) {
          return true;
        }
      }

      return false;
    },
    [region, validContinents]
  );

  const getPlayerById = useCallback(
    playerId => players.find(player => player.id === playerId),
    [players]
  );

  const ratings = useMemo(() => players.map(player => player.rating), [
    players
  ]);

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

  const teamPlayers = useMemo(() => team.map(getPlayerById), [
    team,
    getPlayerById
  ]);

  const budget = useMemo(
    () =>
      TOTAL_BUDGET -
      teamPlayers.reduce((acc, player) => acc + getPlayerCost(player), 0),
    [getPlayerCost, teamPlayers]
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
      {/* TODO: https://github.com/chakra-ui/chakra-ui/issues/349 */}
      <DarkMode>
        <Flex align="flex-start">
          <Flex
            p="3"
            h="100vh"
            position="sticky"
            zIndex="sticky"
            top="0"
            bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}
            display={['none', 'flex']}
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
              teamPlayers={teamPlayers}
              onPlayerClick={removePlayer}
              getPlayerColor={getPlayerColor}
              maxTeamSize={MAX_TEAM_SIZE}
            />
          </Flex>
          <Flex flexGrow="1" direction="column" minH="100vh">
            <Flex
              my={[4, 6, 8]}
              align="center"
              position="sticky"
              top="0"
              zIndex="sticky"
              as="nav"
              py="3"
              px={[6, 8, 10]}
              bg={colorMode === 'dark' ? 'gray.800' : 'white'}
            >
              {team.length === MAX_TEAM_SIZE ? (
                <DownloadButton teamPlayers={teamPlayers} />
              ) : (
                <Heading fontSize="2xl">
                  ${budget.toLocaleString()}{' '}
                  <Box
                    as="span"
                    display={{
                      xs: 'none',
                      md: 'initial'
                    }}
                  >
                    remaining
                  </Box>
                </Heading>
              )}
              <RegionSelect
                region={region}
                setRegion={setRegion}
                continents={validContinents}
              />
            </Flex>
            <Grid
              px={[6, 8, 10]}
              gap="6"
              templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
            >
              {players.filter(isPlayerFromRegion).map(player => {
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
            <Box mt="auto" as="footer" py={[4, 6, 8]} px={[6, 8, 10]}>
              <Text>
                &copy; {new Date().getFullYear()}{' '}
                <Link href="https://trevorblades.com">Trevor Blades</Link>
              </Text>
            </Box>
          </Flex>
        </Flex>
      </DarkMode>
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
