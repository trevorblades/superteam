import {Player, Team} from './db';
import {gql} from 'apollo-server';

export const typeDefs = gql`
  type Player {
    id: ID
    name: String
    ign: String
    country: String
    image: String
    rating: Float
    team: Team
  }

  type Team {
    id: ID
    name: String
    logo: String
    players: [Player]
  }

  type Query {
    team(id: ID!): Team
    teams: [Team]
    player(id: ID!): Player
    players: [Player]
  }
`;

export const resolvers = {
  Query: {
    team: (parent, args) => Team.findByPk(args.id),
    teams: () => Team.findAll(),
    player: (parent, args) => Player.findByPk(args.id),
    players: () => Player.findAll()
  }
};
