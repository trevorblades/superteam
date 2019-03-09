import {AuthenticationError, UserInputError, gql} from 'apollo-server-express';
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
    percentile: Float
    team: Team
    statistics: [Statistic]
  }

  type Statistic {
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
    createdAt: String
    user: User
    players: [Player]
  }

  type Query {
    team(id: ID!): Team
    teams: [Team]
    player(id: ID!): Player
    players: [Player]
    entry(id: ID!): Entry
    entries: [Entry]
    standings: [Entry]
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
    entry: async (parent, args, {user}) => {
      if (!user) {
        throw new AuthenticationError('Unauthorized');
      }

      const [entry] = await user.getEntries({
        where: {
          id: args.id
        }
      });

      if (!entry) {
        throw new UserInputError('Entry not found');
      }

      return entry;
    },
    entries: (parent, args, {user}) => {
      if (!user) {
        throw new AuthenticationError('Unauthorized');
      }

      return user.getEntries({
        order: [['createdAt', 'desc']]
      });
    },
    standings: () =>
      Entry.findAll({
        order: [['currentRating', 'desc']],
        limit: 24
      })
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
