import React from 'react';
import {DarkMode} from '@chakra-ui/core';

// eslint-disable-next-line react/prop-types
export const wrapRootElement = ({element}) => <DarkMode>{element}</DarkMode>;
