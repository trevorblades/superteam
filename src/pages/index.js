import Helmet from 'react-helmet';
import React, {Fragment} from 'react';
import {Box, Heading} from '@chakra-ui/core';
import {ReactComponent as Logo} from '../assets/logo.svg';

export default function Index() {
  return (
    <Fragment>
      <Helmet>
        <title>Superteam</title>
        <meta
          name="description"
          content="Build a team of current and future CS:GO superstars and earn points based on your team's weekly performance."
        />
      </Helmet>
      <Box as={Logo} w="16" h="16" />
      <Heading>Superteam</Heading>
    </Fragment>
  );
}
