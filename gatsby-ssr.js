import React from 'react';
import {DarkMode} from '@chakra-ui/core';

// see https://github.com/chakra-ui/chakra-ui/issues/349
// eslint-disable-next-line react/prop-types
export const wrapRootElement = ({element}) => <DarkMode>{element}</DarkMode>;
