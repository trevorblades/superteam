import {gql} from 'apollo-server-express';

export const typeDef = gql`
  type Selection {
    id: ID
    createdAt: String
    deletedAt: String
    player: Player
  }
`;

export const resolvers = {
  Selection: {
    player: parent => parent.getPlayer()
  }
};
