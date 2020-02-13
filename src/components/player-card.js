import PropTypes from 'prop-types';
import React from 'react';
import emojiFlags from 'emoji-flags';
import {
  AspectRatioBox,
  Box,
  Heading,
  Image,
  PseudoBox,
  Text,
  useColorMode
} from '@chakra-ui/core';

export default function PlayerCard(props) {
  const {colorMode} = useColorMode();
  const color = props.getPlayerColor(props.player.rating);
  const {emoji} = emojiFlags.countryCode(props.player.country.code);

  const bg = {
    light: 'gray.100',
    dark: 'gray.700'
  };

  const hoverBg = {
    light: 'gray.50',
    dark: 'gray.600'
  };

  const shouldHover = !props.isSelected && !props.isDisabled;
  return (
    <AspectRatioBox
      disabled={props.isDisabled}
      ratio={3 / 4}
      key={props.player.id}
      as="button"
      textAlign="left"
      outline="none"
      shadow="md"
      rounded="lg"
      overflow="hidden"
      role="group"
      transition="box-shadow 150ms"
      cursor={props.isDisabled && 'not-allowed'}
      onClick={() => props.onClick(props.player)}
      _hover={{shadow: shouldHover && 'xl'}}
      _disabled={{opacity: 0.5}}
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
          bg: shouldHover && hoverBg[colorMode]
        }}
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
            style={{mixBlendMode: 'luminosity'}}
          />
        )}
        <Box px="4" py="3" bg="inherit" position="relative">
          <Text fontWeight="bold" fontSize="xl">
            {props.isSelected ? '✅ Acquired' : '$400'}
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
          _groupHover={{color: shouldHover && hoverBg[colorMode]}}
        >
          <path d="M 0,48 Q 50,0 100,48 Z" />
        </PseudoBox>
        <Box p="5" pt="0" bg="inherit" textAlign="center" position="relative">
          <Heading mb="1" as="h3" fontSize="2xl">
            {props.player.ign}
          </Heading>
          <Heading isTruncated as="h5" fontWeight="normal" fontSize="md">
            {emoji} {props.player.name}
          </Heading>
        </Box>
      </PseudoBox>
    </AspectRatioBox>
  );
}

PlayerCard.propTypes = {
  player: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  getPlayerColor: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired
};
