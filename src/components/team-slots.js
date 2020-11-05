import PropTypes from 'prop-types';
import React from 'react';
import {
  Box,
  Flex,
  Stack,
  Text,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/core';

const teamSlotProps = {
  size: 16,
  rounded: 'full',
  shadow: 'inner'
};

export default function TeamSlots({
  teamPlayers,
  getPlayerColor,
  onPlayerClick,
  maxTeamSize
}) {
  const bg = useColorModeValue('gray.700', 'gray.200');
  return (
    <Stack mt="auto" spacing="3" position="relative">
      {teamPlayers.map(player => {
        const color = getPlayerColor(player);
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
                onClick={() => onPlayerClick(player)}
              />
            </Tooltip>
          </Box>
        );
      })}
      {Array(maxTeamSize - teamPlayers.length)
        .fill(null)
        .map((item, index) => (
          <Flex
            {...teamSlotProps}
            key={index}
            bg={bg}
            color="gray.500"
            align="center"
            justify="center"
          >
            <Text fontSize="xl">{index + 1 + teamPlayers.length}</Text>
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
