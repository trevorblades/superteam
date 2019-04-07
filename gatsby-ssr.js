import React from 'react';
import client from './src/utils/client';
import {ApolloProvider} from 'react-apollo';

// eslint-disable-next-line react/prop-types
export const wrapRootElement = ({element}) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
);
