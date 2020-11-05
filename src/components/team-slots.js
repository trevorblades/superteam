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
  boxSize: 16,
  borderRadius: 'full',
  boxShadow: 'inner'
};

export default function TeamSlots({
  teamPlayers,
  getPlayerColor,
  onPlayerClick,
  maxTeamSize
}) {
  const bg = useColorModeValue('gray.200', 'gray.700');
  return (
    <Stack mt="auto" spacing="3" position="relative">
      {teamPlayers.map(player => {
        const color = getPlayerColor(player);
        return (
          <div key={player.id}>
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
          </div>
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
