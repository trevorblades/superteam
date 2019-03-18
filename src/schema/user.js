import {gql} from 'apollo-server-express';

export const typeDef = gql`
  type User {
    username: String
    displayName: String
    profileImage: String
  }
`;
