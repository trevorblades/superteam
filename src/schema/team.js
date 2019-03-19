import {gql} from 'apollo-server-express';

export const typeDef = gql`
  type Team {
    id: ID
    name: String
    logo: String
    players: [Player]
  }
`;

export const resolvers = {
  Team: {
    players: parent => parent.getPlayers()
  }
};
