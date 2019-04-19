import {gql} from 'apollo-server-express';

export const typeDef = gql`
  extend type Player {
    team: Team
  }

  type Team {
    id: ID
    name: String
    logo: String
  }
`;

export const resolvers = {
  Player: {
    team(parent) {
      return parent.getTeam();
    }
  }
};
