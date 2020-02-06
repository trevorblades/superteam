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
  useTheme
} from '@chakra-ui/core';
import {ReactComponent as Logo} from '../assets/logo.svg';
import {graphql} from 'gatsby';

export default function Index(props) {
  const {colors} = useTheme();
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
      <Flex p="10" direction="column">
        <Flex align="center" mx="auto" mb="10">
          <Box mr="3" as={Logo} w="16" h="16" />
          <Heading as="h1" fontSize="4xl">
            Superteam
          </Heading>
        </Flex>
        <Grid
          gap="6"
          templateColumns={[
            '1fr',
            'repeat(2, 1fr)',
            'repeat(3, 1fr)',
            'repeat(4, 1fr)',
            'repeat(5, 1fr)'
          ]}
        >
          {players.map(player => {
            const score = (player.rating - minRating) / ratingDelta;
            const color = classes(score).hex();
            const {emoji} = emojiFlags.countryCode(player.country.code);
            return (
              <AspectRatioBox
                ratio={3 / 4}
                key={player.id}
                bgImg={`linear-gradient(${[color, 'white']})`}
                bgPos="center"
                bgSize="200%"
                rounded="lg"
                overflow="hidden"
              >
                <Flex direction="column">
                  {player.team && (
                    <Image
                      w="200%"
                      maxW="none"
                      src={player.team.logo}
                      position="absolute"
                      top="50%"
                      left="-50%"
                      transform="translateY(-50%)"
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
                  <Box
                    p="4"
                    mt="auto"
                    bg="white"
                    color="gray.800"
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
                </Flex>
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
