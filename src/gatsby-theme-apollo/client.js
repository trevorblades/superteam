import ApolloClient from 'apollo-boost';
import fetch from 'isomorphic-fetch';
import {userFromToken} from '../utils';

const client = new ApolloClient({
  fetch,
  uri: `${process.env.GATSBY_API_URL}/graphql`,
  request(operation) {
    const token = localStorage.getItem('token');
    if (token) {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  },
  clientState: {
    resolvers: {
      Query: {
        user() {
          const token = localStorage.getItem('token');
          return userFromToken(token);
        }
      }
    }
  }
});

export default client;
