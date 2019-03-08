import {AuthenticationError, gql} from 'apollo-server-express';
import {Entry, Player, Team} from './db';
import {Op} from 'sequelize';
import {sumRating} from './utils';

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

  type User {
    username: String
    displayName: String
    profileImage: String
  }

  type Entry {
    id: ID
    name: String
    initialRating: Float
    currentRating: Float
    user: User
    players: [Player]
  }

  type Query {
    team(id: ID!): Team
    teams: [Team]
    player(id: ID!): Player
    players: [Player]
    entries: [Entry]
  }

  type Mutation {
    createEntry(name: String!, playerIds: [String]!): Entry
  }
`;

export const resolvers = {
  Player: {
    team: parent => parent.getTeam(),
    statistics: parent => parent.getStatistics()
  },
  Entry: {
    players: parent => parent.getPlayers()
  },
  Query: {
    team: (parent, args) => Team.findByPk(args.id),
    teams: () => Team.findAll(),
    player: (parent, args) => Player.findByPk(args.id),
    players: () =>
      Player.findAll({
        order: [['rating', 'desc']]
      }),
    entries: (parent, args, {user}) => {
      if (!user) {
        throw new AuthenticationError('Unauthorized');
      }

      return user.getEntries({
        order: [['createdAt', 'desc']]
      });
    }
  },
  Mutation: {
    async createEntry(parent, args, {user}) {
      if (!user) {
        throw new AuthenticationError('Unauthorized');
      }

      const players = await Player.findAll({
        where: {
          id: {
            [Op.in]: args.playerIds
          }
        }
      });

      const totalRating = players.reduce(sumRating, 0);
      const averageRating = totalRating / players.length;
      const initialRating = averageRating.toPrecision(3);
      const entry = await Entry.create({
        name: args.name,
        initialRating,
        currentRating: initialRating,
        userId: user.id
      });

      await entry.setPlayers(players);
      return entry;
    }
  }
};
