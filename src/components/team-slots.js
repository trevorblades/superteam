import PropTypes from 'prop-types';
import React from 'react';
import {Box, Flex, Stack, Text, Tooltip, useColorMode} from '@chakra-ui/core';

const teamSlotProps = {
  size: 16,
  rounded: 'full',
  shadow: 'inner'
};

export default function TeamSlots(props) {
  const {colorMode} = useColorMode();

  const teamSize = props.teamPlayers.length;
  const bg = {
    dark: 'gray.700',
    light: 'gray.200'
  };

  return (
    <Stack mt="auto" spacing="3" position="relative">
      {props.teamPlayers.map(player => {
        const color = props.getPlayerColor(player);
        return (
          <Box key={player.id}>
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
                onClick={() => props.onPlayerClick(player)}
              />
            </Tooltip>
          </Box>
        );
      })}
      {Array(props.maxTeamSize - teamSize)
        .fill(null)
        .map((item, index) => (
          <Flex
            {...teamSlotProps}
            key={index}
            bg={bg[colorMode]}
            color="gray.500"
            align="center"
            justify="center"
          >
            <Text fontSize="xl">{index + 1 + teamSize}</Text>
          </Flex>
        ))}
    </Stack>
  );
}

TeamSlots.propTypes = {
  teamPlayers: PropTypes.array.isRequired,
  onPlayerClick: PropTypes.func.isRequired,
  maxTeamSize: PropTypes.number.isRequired,
  getPlayerColor: PropTypes.func.isRequired
};
