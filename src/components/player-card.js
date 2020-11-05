import PropTypes from 'prop-types';
import React from 'react';
import emojiFlags from 'emoji-flags';
import {
  AspectRatio,
  Box,
  Heading,
  Image,
  Text,
  useColorModeValue
} from '@chakra-ui/core';
import {transparentize} from 'polished';

export default function PlayerCard(props) {
  const bgColor = useColorModeValue('gray.200', 'gray.700');
  const bgHover = useColorModeValue('gray.300', 'gray.600');

  const color = props.getPlayerColor(props.player);
  const {emoji} = emojiFlags.countryCode(props.player.country.code);
  const transparent = transparentize(1, color);
  const colorProps = {
    bg: 'inherit',
    bgSize: '400%',
    bgImage: `linear-gradient(${[
      'to right',
      color,
      `${color} 25%`,
      `${transparent} 75%`,
      transparent
    ]})`,
    transition: 'background-position 700ms', // cost of a deagle
    style: {backgroundPosition: props.isSelected ? '0%' : '100%'}
  };

  return (
    <AspectRatio
      disabled={props.isDisabled}
      ratio={3 / 4}
      key={props.player.id}
      as="button"
      textAlign="left"
      outline="none"
      borderRadius="lg"
      overflow="hidden"
      role="group"
      onClick={() => props.onClick(props.player)}
      _disabled={{
        opacity: 0.4,
        cursor: 'not-allowed'
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        bgColor={bgColor}
        bgImg={`linear-gradient(${[color, 'transparent']})`}
        bgPos="center"
        bgSize="200%"
        _groupHover={{bgColor: bgHover}}
      >
        {props.player.team && (
          <Image
            w="175%"
            maxW="none"
            src={props.player.team.logo}
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            opacity="0.5"
            pointerEvents="none"
            css={{mixBlendMode: 'luminosity'}}
          />
        )}
        <Box {...colorProps} w="full" px="4" py="3" position="relative">
          <Text fontWeight="bold" fontSize="xl">
            {props.isSelected
              ? '✅ Acquired'
              : '$' + props.cost.toLocaleString()}
          </Text>
        </Box>
        <Image
          src={props.player.image}
          h="full"
          maxW="none"
          position="absolute"
          left="0"
          pointerEvents="none"
        />
        <Box
          w="full"
          h="50%"
          bgImg={`linear-gradient(${[transparent, color]})`}
          position="absolute"
          bottom="0"
          css={{mixBlendMode: 'overlay'}}
        />
        <Box
          {...colorProps}
          mt="auto"
          h="12"
          w="full"
          css={{
            maskImage:
              'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 48" preserveAspectRatio="none"><path d="M 0,48 Q 50,0 100,48 Z"></path></svg>\')',
            maskSize: '100%',
            maskRepeat: 'no-repeat'
          }}
        />
        <Box
          {...colorProps}
          w="full"
          p="5"
          pt="0"
          textAlign="center"
          position="relative"
        >
          <Heading mb="1" as="h3" lineHeight="tall" fontSize="2xl">
            {props.player.ign}
          </Heading>
          <Heading isTruncated as="h5" fontWeight="normal" size="sm">
            {emoji} {props.player.name}
          </Heading>
        </Box>
      </Box>
    </AspectRatio>
  );
}

PlayerCard.propTypes = {
  cost: PropTypes.number.isRequired,
  player: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  getPlayerColor: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired
};
