import ApolloClient from 'apollo-client';
import fetch from 'isomorphic-fetch';
import userFromStorage from './user-from-storage';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';

const httpLink = createHttpLink({
  uri: `${process.env.GATSBY_API_URL}/graphql`
});

const authLink = setContext((_, {headers}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return headers;
  }

  return {
    headers: {
      ...headers,
      authorization: `bearer ${token}`
    }
  };
});

export default new ApolloClient({
  fetch,
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
  resolvers: {
    Query: {
      user: userFromStorage,
      selectedPlayers: []
    }
  }
});
