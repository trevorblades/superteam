import {gql} from 'apollo-server-express';

export const typeDef = gql`
  type User {
    name: String
    image: String
  }
`;
