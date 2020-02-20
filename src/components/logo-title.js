import PropTypes from 'prop-types';
import React from 'react';
import {Box, Flex, Heading} from '@chakra-ui/core';
import {ReactComponent as Logo} from '../assets/logo.svg';

export default function LogoTitle({logoProps, ...props}) {
  return (
    <Flex align="center" {...props}>
      <Box mr="4" as={Logo} w="12" h="12" {...logoProps} />
      <Heading fontSize="4xl" letterSpacing="tighter">
        Superteam
      </Heading>
    </Flex>
  );
}

LogoTitle.propTypes = {
  logoProps: PropTypes.object
};
