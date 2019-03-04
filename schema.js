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
    statistics: Statistics
  }

  type Statistics {
    rating: Float
    kills: Int
    deaths: Int
    kdRatio: Float
    headshots: Float
    damagePerRound: Float
    killsPerRound: Float
    assistsPerRound: Float
    deathsPerRound: Float
    grenadeDamagePerRound: Float
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
  Player: {
    team: parent => parent.getTeam(),
    statistics: parent => parent.getStatistics()
  },
  Query: {
    team: (parent, args) => Team.findByPk(args.id),
    teams: () => Team.findAll(),
    player: (parent, args) => Player.findByPk(args.id),
    players: () =>
      Player.findAll({
        order: [['rating', 'desc']]
      })
  }
};
