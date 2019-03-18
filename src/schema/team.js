import {Team} from '../db';
import {gql} from 'apollo-server-express';

export const typeDef = gql`
  extend type Query {
    team(id: ID!): Team
    teams: [Team]
  }

  type Team {
    id: ID
    name: String
    logo: String
    players: [Player]
  }
`;

export const resolvers = {
  Query: {
    team: (parent, args) => Team.findByPk(args.id),
    teams: () => Team.findAll()
  }
};
